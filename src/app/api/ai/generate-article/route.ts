import { NextRequest } from 'next/server';
import { generateWithAI, AGENT_PROMPTS } from '@/lib/gemini';
import { requireAuth } from '@/lib/api-auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { markdownToHtml, isMarkdown } from '@/utils/markdown';

function sendSSE(controller: ReadableStreamDefaultController, encoder: TextEncoder, data: Record<string, unknown>) {
  controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
}

/** Strip markdown code blocks and extract clean JSON */
function extractJSON(text: string): Record<string, unknown> | null {
  // Remove markdown code blocks: ```json ... ``` or ``` ... ```
  let cleaned = text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();

  // Try to find a JSON object
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      // Try fixing common issues: trailing commas, etc.
      const fixed = jsonMatch[0]
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']');
      try {
        return JSON.parse(fixed);
      } catch {
        return null;
      }
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const rateLimited = checkRateLimit(req);
  if (rateLimited) return rateLimited;
  const authError = await requireAuth(req);
  if (authError) return authError;

  const { topics, category } = await req.json();

  if (!topics) {
    return new Response(JSON.stringify({ error: 'Tópicos são obrigatórios' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const userInput = `Tópicos: ${topics}\nCategoria: ${category || 'geral'}`;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // ========== STEP 1: REDATOR ==========
        sendSSE(controller, encoder, {
          step: 1, total: 3, percent: 10,
          label: '✍️ Redator criando matéria...',
        });

        const draft = await generateWithAI(
          AGENT_PROMPTS.writer,
          userInput,
          { model: 'flash', temperature: 0.8 }
        );

        // Parse draft to pass structured data to editor
        const draftParsed = extractJSON(draft.text);

        sendSSE(controller, encoder, {
          step: 1, total: 3, percent: 35,
          label: `✍️ Rascunho pronto! (${draft.model})`,
        });

        // ========== STEP 2: EDITOR ==========
        sendSSE(controller, encoder, {
          step: 2, total: 3, percent: 40,
          label: '📝 Editor revisando qualidade...',
        });

        const editorInput = draftParsed
          ? JSON.stringify(draftParsed)
          : draft.text;

        const edited = await generateWithAI(
          AGENT_PROMPTS.editor,
          editorInput,
          { model: 'flash', temperature: 0.4 }
        );

        const editedParsed = extractJSON(edited.text);

        sendSSE(controller, encoder, {
          step: 2, total: 3, percent: 65,
          label: `📝 Revisão completa! (${edited.model})`,
        });

        // ========== STEP 3: SEO OPTIMIZER ==========
        sendSSE(controller, encoder, {
          step: 3, total: 3, percent: 70,
          label: '🔍 Otimizando SEO e tags...',
        });

        const seoInput = editedParsed
          ? JSON.stringify(editedParsed)
          : edited.text;

        const optimized = await generateWithAI(
          AGENT_PROMPTS.seoOptimizer,
          seoInput,
          { model: 'flash', temperature: 0.3 }
        );

        const optimizedParsed = extractJSON(optimized.text);

        sendSSE(controller, encoder, {
          step: 3, total: 3, percent: 90,
          label: `🔍 SEO otimizado! (${optimized.model})`,
        });

        // ========== BUILD FINAL RESULT ==========
        // Use the best available parsed result, with fallbacks
        const result = optimizedParsed || editedParsed || draftParsed || {
          title: 'Matéria Gerada',
          brief: '',
          body: optimized.text || edited.text || draft.text,
        };

        // Sanitizar markdown no body (IA às vezes retorna ** em vez de <strong>)
        if (result.body && typeof result.body === 'string') {
          if (isMarkdown(result.body)) {
            result.body = markdownToHtml(result.body);
          } else {
            // Limpar markdown residual misturado com HTML
            result.body = result.body
              .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
              .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
          }
        }

        // ========== DONE ==========
        sendSSE(controller, encoder, {
          step: 3, total: 3, percent: 100,
          label: '✅ Matéria finalizada!',
          result,
          meta: {
            tokensUsed: draft.tokensOutput + edited.tokensOutput + optimized.tokensOutput,
            modelsUsed: [draft.model, edited.model, optimized.model],
            pipeline: ['redator', 'editor', 'seo'],
          },
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        console.error('[AI Pipeline]', errorMessage);
        sendSSE(controller, encoder, {
          error: `Erro na IA: ${errorMessage}`,
          percent: 0,
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
