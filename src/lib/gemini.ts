import { GoogleGenAI } from '@google/genai';

/** Model fallback chain: if primary fails, try next */
const MODEL_CHAIN = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
] as const;

const MODELS = {
  pro: 'gemini-2.5-pro',
  flash: 'gemini-2.5-flash',
} as const;

/** Get API key from any of the supported env var names */
function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY
    || process.env.GOOGLE_GENERATIVE_AI_API_KEY
    || process.env.GOOGLE_API_KEY;

  if (!key) {
    throw new Error(
      'Chave Gemini não encontrada. Configure GEMINI_API_KEY ou GOOGLE_GENERATIVE_AI_API_KEY nas variáveis de ambiente.'
    );
  }

  return key;
}

function getClient() {
  return new GoogleGenAI({ apiKey: getApiKey() });
}

/** Try generation with automatic retry and model fallback */
export async function generateWithAI(
  systemPrompt: string,
  userInput: string,
  options?: { model?: keyof typeof MODELS; temperature?: number; maxRetries?: number }
) {
  const ai = getClient();
  const preferredModel = MODELS[options?.model ?? 'flash'];
  const maxRetries = options?.maxRetries ?? 2;

  // Build fallback chain starting with preferred model
  const modelsToTry = [preferredModel, ...MODEL_CHAIN.filter(m => m !== preferredModel)];

  let lastError: Error | null = null;

  for (const modelName of modelsToTry) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[Gemini] Tentando ${modelName} (tentativa ${attempt + 1})`);

        const result = await ai.models.generateContent({
          model: modelName,
          config: {
            systemInstruction: systemPrompt,
            temperature: options?.temperature ?? 0.7,
          },
          contents: userInput,
        });

        console.log(`[Gemini] Sucesso com ${modelName}`);

        return {
          text: result.text ?? '',
          model: modelName,
          tokensInput: result.usageMetadata?.promptTokenCount || 0,
          tokensOutput: result.usageMetadata?.candidatesTokenCount || 0,
        };
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        const errorMsg = lastError.message;

        // Non-retryable errors: throw immediately
        const isAuthError = errorMsg.includes('Invalid API key') ||
                           errorMsg.includes('API_KEY_INVALID') ||
                           errorMsg.includes('PERMISSION_DENIED');

        if (isAuthError) {
          throw new Error(
            `Chave Gemini inválida. Verifique a env var GEMINI_API_KEY no Vercel. ` +
            `Dica: gere uma nova chave em https://aistudio.google.com/apikey`
          );
        }

        // Only retry on 503 (overloaded) or 429 (rate limit)
        const isRetryable = errorMsg.includes('503') || errorMsg.includes('UNAVAILABLE') ||
                           errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED');

        if (!isRetryable) {
          throw lastError;
        }

        console.warn(`[Gemini] ${modelName} falhou (${attempt + 1}/${maxRetries + 1}): ${errorMsg}`);

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }
    console.warn(`[Gemini] ${modelName} esgotou tentativas, tentando próximo modelo...`);
  }

  throw lastError || new Error('Todos os modelos falharam. Tente novamente em alguns minutos.');
}

/** Multi-agent prompts for professional article generation */
export const AGENT_PROMPTS = {
  writer: `Você é um jornalista investigativo SENIOR especializado em Fórmula 1, com 15 anos de experiência no paddock.
Trabalha para o portal "Piloto Curioso".

Sua missão: receber tópicos crus e transformar em uma matéria de altíssima qualidade.

ESTILO:
- Tom: informativo, envolvente, com personalidade — como se contasse a história para um amigo que ama F1
- Use analogias e metáforas quando fizer sentido
- Parágrafos curtos (2-3 frases máximo)
- Alterne entre dados técnicos e narrativa emocional
- Abra com um hook irresistível que prenda a atenção

ESTRUTURA OBRIGATÓRIA:
- Título chamativo (max 65 chars para SEO)
- Brief/resumo (meta description, 120-155 chars)
- Corpo em HTML com <h2>, <h3>, <p>, <strong>, <em>
- Mínimo 6 parágrafos bem desenvolvidos
- Use dados, números e contexto histórico
- Feche com uma conclusão que provoque reflexão ou curiosidade

NUNCA:
- Invente informações ou dados
- Use clichês como "o tempo dirá" ou "só o tempo dirá"
- Escreva parágrafos longos demais
- Use linguagem genérica de IA

Formato de resposta (JSON puro, sem markdown, sem code blocks):
{
  "title": "...",
  "brief": "...",
  "body": "<h2>...</h2><p>...</p>..."
}`,

  editor: `Você é um EDITOR-CHEFE de um portal jornalístico de F1 chamado "Piloto Curioso".
Sua função: revisar e elevar a qualidade do texto recebido.

REVISE:
- Fluidez e ritmo do texto
- Tom consistente (informativo mas envolvente)
- Clareza: elimine redundâncias e frases vazias
- Força do hook
- Conclusão memorável

MELHORE:
- Substitua verbos fracos por verbos de ação
- Adicione transições entre parágrafos
- Reforce pontos-chave com <strong>

Retorne o JSON revisado (JSON puro, sem markdown, sem code blocks):
{
  "title": "...",
  "brief": "...",
  "body": "<h2>...</h2><p>...</p>..."
}`,

  seoOptimizer: `Você é um especialista em SEO e Google Discover para o portal "Piloto Curioso".
Otimize a matéria para máximo alcance orgânico.

OTIMIZE:
- title: chamativo, max 65 chars
- brief: meta description, 120-155 chars
- seo_title: variação otimizada do title
- seo_description: variação da brief
- tags: array com 5-8 tags relevantes

NÃO altere o body.

Retorne JSON completo (JSON puro, sem markdown, sem code blocks):
{
  "title": "...",
  "brief": "...",
  "body": "(manter original)",
  "seo_title": "...",
  "seo_description": "...",
  "tags": ["tag1", "tag2", ...]
}`,
} as const;

/** Legacy prompts kept for other tools */
export const AI_PROMPTS = {
  generateArticle: AGENT_PROMPTS.writer,
} as const;
