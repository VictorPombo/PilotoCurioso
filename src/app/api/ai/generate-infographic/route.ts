import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { generateWithAI } from '@/lib/gemini';
import { getServiceClient } from '@/lib/supabase';
import { GoogleGenAI } from '@google/genai';

const DESCRIBE_PROMPT = `Você é um diretor de arte especializado em infográficos para portais de notícias de F1.

TAREFA: A partir da matéria abaixo, crie um prompt descritivo em INGLÊS para gerar uma imagem/infográfico.

REGRAS:
1. O prompt deve ser descritivo e visual
2. Inclua cores, composição, elementos gráficos
3. Mencione o estilo: moderno, flat design, data visualization
4. NÃO inclua texto/palavras no prompt (modelos de imagem não são bons com texto)
5. Foque em elementos visuais que representem o conteúdo

ESTILO SOLICITADO: {style}

RETORNE APENAS o prompt em inglês, sem explicações.`;

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY
    || process.env.GOOGLE_GENERATIVE_AI_API_KEY
    || process.env.GOOGLE_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY não configurada.');
  return key;
}

export async function POST(req: NextRequest) {
  const rateLimited = checkRateLimit(req);
  if (rateLimited) return rateLimited;
  const authError = await requireAuth(req);
  if (authError) return authError;

  try {
    const { article_id, title, body, style = 'infographic' } = await req.json();

    if (!article_id || !title) {
      return NextResponse.json(
        { error: 'article_id e title são obrigatórios.' },
        { status: 400 }
      );
    }

    const sb = getServiceClient();

    // Buscar contexto do histórico anterior (se já gerou infográfico antes)
    const { data: history } = await sb
      .from('article_ai_history')
      .select('ai_response')
      .eq('article_id', article_id)
      .eq('action', 'infographic')
      .order('created_at', { ascending: false })
      .limit(2);

    const previousContext = history && history.length > 0
      ? `\nINFOGRÁFICOS JÁ GERADOS (ajuste o estilo para complementar, não repetir):\n${history.map((h, i) => `[${i + 1}] ${h.ai_response?.image_prompt || 'N/A'}`).join('\n')}`
      : '';

    // Etapa 1: Gerar prompt descritivo via Gemini Flash
    const promptResult = await generateWithAI(
      DESCRIBE_PROMPT.replace('{style}', style),
      `Título: ${title}\nCorpo (resumo): ${(body || '').slice(0, 1000)}${previousContext}`,
      { model: 'flash', temperature: 0.7 }
    );

    const imagePrompt = promptResult.text.trim();

    // Etapa 2: Gerar imagem via Gemini Imagen
    const ai = new GoogleGenAI({ apiKey: getApiKey() });

    let imageUrl: string | null = null;

    try {
      const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: imagePrompt,
        config: {
          numberOfImages: 1,
          aspectRatio: '1:1',
        },
      });

      if (response.generatedImages && response.generatedImages.length > 0) {
        const imageData = response.generatedImages[0].image;
        if (imageData?.imageBytes) {
          // Upload para Supabase Storage
          const fileName = `infographic_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.png`;
          const filePath = `infographics/${fileName}`;

          const buffer = Buffer.from(imageData.imageBytes, 'base64');

          const { error: uploadError } = await sb.storage
            .from('images')
            .upload(filePath, buffer, {
              contentType: 'image/png',
              upsert: false,
            });

          if (uploadError) {
            console.error('[Infographic Upload]', uploadError);
          } else {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            imageUrl = `${supabaseUrl}/storage/v1/object/public/images/${filePath}`;
          }
        }
      }
    } catch (imagenError: any) {
      console.error('[Imagen]', imagenError.message);
      // Imagen pode não estar disponível — retornar o prompt para uso manual
    }

    // Salvar no histórico
    const totalTokens = promptResult.tokensInput + promptResult.tokensOutput;
    await sb.from('article_ai_history').insert({
      article_id,
      action: 'infographic',
      input_snapshot: { title, style, body_length: (body || '').length },
      ai_response: {
        image_prompt: imagePrompt,
        image_url: imageUrl,
        style,
      },
      model_used: promptResult.model,
      tokens_used: totalTokens,
    });

    return NextResponse.json({
      image_url: imageUrl,
      image_prompt: imagePrompt,
      style,
      model_used: promptResult.model,
      tokens_used: totalTokens,
      generated: imageUrl !== null,
    });
  } catch (err) {
    console.error('[AI Generate Infographic]', err);
    return NextResponse.json(
      { error: 'Erro ao gerar infográfico.' },
      { status: 500 }
    );
  }
}
