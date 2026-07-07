import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { generateWithAI } from '@/lib/gemini';
import { getServiceClient } from '@/lib/supabase';
import { markdownToHtml, isMarkdown } from '@/utils/markdown';

const REFINE_PROMPT = `Você é um editor-chefe sênior de jornalismo digital especializado em F1 e automobilismo.

TAREFA: Você recebe uma matéria já escrita pelo jornalista. Faça APENAS ajustes pontuais para melhorar:
- SEO (título, meta description, heading structure, palavras-chave)
- Clareza e fluidez do texto
- Correção gramatical
- Estrutura de parágrafos

REGRAS CRÍTICAS:
1. MANTENHA o estilo e tom original do autor
2. NÃO reescreva o texto inteiro — faça ajustes cirúrgicos
3. Se o texto já está bom, mude o mínimo possível
4. SEMPRE retorne HTML válido (NÃO markdown)
5. Considere as sugestões anteriores já aplicadas (contexto abaixo)

RETORNE um JSON com:
{
  "title": "título otimizado",
  "brief": "meta description otimizada (máx 160 chars)",
  "body": "<p>corpo em HTML com ajustes...</p>",
  "seo_title": "título SEO (máx 60 chars)",
  "seo_description": "meta description SEO",
  "tags": ["tag1", "tag2"],
  "changes_summary": ["Mudança 1", "Mudança 2", "Mudança 3"],
  "seo_score": 85
}`;

const SCORE_PROMPT = `Você é um analista de conteúdo digital especializado em SEO e viralização para portais de F1.

TAREFA: Analise a matéria abaixo e dê scores detalhados.
Considere o histórico de análises anteriores para mostrar evolução.

RETORNE um JSON com:
{
  "viral_score": 0-100,
  "seo_score": 0-100,
  "engagement_score": 0-100,
  "readability_score": 0-100,
  "overall_score": 0-100,
  "strengths": ["Ponto forte 1", "Ponto forte 2"],
  "improvements": ["Sugestão 1", "Sugestão 2", "Sugestão 3"],
  "keyword_analysis": {
    "primary": "palavra-chave principal",
    "secondary": ["secundária 1", "secundária 2"],
    "density": "X%"
  }
}`;

export async function POST(req: NextRequest) {
  const rateLimited = checkRateLimit(req);
  if (rateLimited) return rateLimited;
  const authError = await requireAuth(req);
  if (authError) return authError;

  try {
    const { article_id, title, body, brief, action } = await req.json();

    if (!article_id || !title || !body) {
      return NextResponse.json(
        { error: 'article_id, title e body são obrigatórios.' },
        { status: 400 }
      );
    }

    const sb = getServiceClient();

    // Buscar histórico das últimas 5 interações para manter contexto
    const { data: history } = await sb
      .from('article_ai_history')
      .select('action, ai_response, scores, created_at')
      .eq('article_id', article_id)
      .order('created_at', { ascending: false })
      .limit(5);

    const historyContext = history && history.length > 0
      ? `\n\nHISTÓRICO DE INTERAÇÕES ANTERIORES (mais recente primeiro):\n${history.map((h, i) => {
          const resp = h.ai_response || {};
          const scores = h.scores || {};
          return `[${i + 1}] Ação: ${h.action} | Score: ${scores.overall_score || 'N/A'} | Mudanças: ${(resp.changes_summary || []).join(', ') || 'N/A'}`;
        }).join('\n')}`
      : '';

    const userInput = `MATÉRIA ATUAL:
Título: ${title}
Resumo: ${brief || ''}

Corpo:
${body}${historyContext}`;

    const prompt = action === 'score' ? SCORE_PROMPT : REFINE_PROMPT;
    
    const result = await generateWithAI(prompt, userInput, {
      model: 'flash',
      temperature: action === 'score' ? 0.3 : 0.4,
    });

    // Parsear resposta JSON
    let parsed = null;
    try {
      const cleaned = result.text
        .replace(/```(?:json)?\s*/gi, '')
        .replace(/```/g, '')
        .trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      }
    } catch {
      // Se não conseguir parsear, retornar texto cru
    }

    if (!parsed) {
      return NextResponse.json(
        { error: 'IA retornou resposta inválida. Tente novamente.' },
        { status: 500 }
      );
    }

    // Sanitizar markdown no body (se veio da IA)
    if (parsed.body && isMarkdown(parsed.body)) {
      parsed.body = markdownToHtml(parsed.body);
    } else if (parsed.body) {
      parsed.body = parsed.body
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
    }

    // Salvar no histórico
    const scores = action === 'score' 
      ? {
          viral_score: parsed.viral_score,
          seo_score: parsed.seo_score,
          engagement_score: parsed.engagement_score,
          overall_score: parsed.overall_score,
        }
      : { seo_score: parsed.seo_score };

    await sb.from('article_ai_history').insert({
      article_id,
      action: action || 'refine',
      input_snapshot: { title, brief: brief || '', body_length: body.length },
      ai_response: parsed,
      scores,
      model_used: result.model,
      tokens_used: result.tokensInput + result.tokensOutput,
    });

    return NextResponse.json({
      ...parsed,
      model_used: result.model,
      tokens_used: result.tokensInput + result.tokensOutput,
    });
  } catch (err) {
    console.error('[AI Refine Article]', err);
    return NextResponse.json(
      { error: 'Erro ao processar com IA.' },
      { status: 500 }
    );
  }
}
