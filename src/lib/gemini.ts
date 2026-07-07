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
      'Chave Gemini não encontrada. Configure GEMINI_API_KEY nas variáveis de ambiente.'
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

        const isAuthError = errorMsg.includes('Invalid API key') ||
                           errorMsg.includes('API_KEY_INVALID') ||
                           errorMsg.includes('PERMISSION_DENIED');
        if (isAuthError) {
          throw new Error(
            'Chave Gemini inválida. Verifique a env var GEMINI_API_KEY no Vercel. ' +
            'Gere uma nova em https://aistudio.google.com/apikey'
          );
        }

        const isRetryable = errorMsg.includes('503') || errorMsg.includes('UNAVAILABLE') ||
                           errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED');
        if (!isRetryable) throw lastError;

        console.warn(`[Gemini] ${modelName} falhou (${attempt + 1}/${maxRetries + 1}): ${errorMsg}`);
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
- Tom: informativo, envolvente, com personalidade
- Parágrafos curtos (2-3 frases máximo)
- Alterne entre dados técnicos e narrativa emocional
- Abra com um hook irresistível

ESTRUTURA OBRIGATÓRIA:
- Título chamativo (max 65 chars para SEO)
- Brief/resumo (meta description, 120-155 chars)
- Corpo em HTML com <h2>, <h3>, <p>, <strong>, <em>
- Mínimo 6 parágrafos bem desenvolvidos
- Feche com uma conclusão que provoque reflexão

NUNCA: invente dados, use clichês ou linguagem genérica de IA.

Formato de resposta (JSON puro, sem markdown, sem code blocks):
{
  "title": "...",
  "brief": "...",
  "body": "<h2>...</h2><p>...</p>..."
}`,

  editor: `Você é um EDITOR-CHEFE de um portal jornalístico de F1 chamado "Piloto Curioso".
Revise e eleve a qualidade do texto recebido.

REVISE: fluidez, tom, clareza, força do hook, conclusão.
MELHORE: verbos de ação, transições, <strong> em pontos-chave.

Retorne JSON revisado (JSON puro, sem markdown, sem code blocks):
{
  "title": "...",
  "brief": "...",
  "body": "<h2>...</h2><p>...</p>..."
}`,

  seoOptimizer: `Você é um especialista em SEO e Google Discover para o portal "Piloto Curioso".
Otimize a matéria para máximo alcance orgânico.

OTIMIZE: title (max 65 chars), brief (120-155 chars), seo_title, seo_description, tags (5-8).
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

/** All AI prompts used by various API routes */
export const AI_PROMPTS = {
  generateArticle: AGENT_PROMPTS.writer,

  opportunities: `Você é um analista de conteúdo especializado em F1 para o portal "Piloto Curioso".
Analise as informações fornecidas e sugira 5-8 temas com alta chance de tráfego orgânico.

Formato OBRIGATÓRIO: JSON array de objetos contendo EXATAMENTE estas chaves em inglês:
- "title": (string) Título sugerido
- "reason": (string) Por que é uma oportunidade (trending, SEO gap, evento próximo)
- "difficulty": (string) "Fácil", "Médio" ou "Difícil"
- "potential": (string) "Alto", "Médio" ou "Baixo"`,

  sponsorable: `Você é um consultor de monetização para o portal jornalístico "Piloto Curioso".
Analise o tema/matéria e identifique oportunidades de monetização via matéria patrocinada.

Responda:
- Esta matéria pode gerar venda? (sim/não e porquê)
- Alvos de prospecção
- Pitch sugerido (1-2 frases)
- Valor estimado do mercado

Formato: JSON.`,

  interview: `Você é um jornalista sênior de F1 preparando uma entrevista para o portal "Piloto Curioso".
Gere 20 perguntas inteligentes, divididas em:
- Técnicas (5)
- Carreira (5)
- Bastidores (5)
- Polêmicas/Curiosas (5)

Formato: JSON array com { "category", "question", "follow_up_tip" }.`,

  repurpose: `Você é um estrategista de conteúdo para o portal "Piloto Curioso".
A partir de uma matéria publicada, gere 5 versões:

Formato OBRIGATÓRIO: JSON contendo EXATAMENTE estas chaves em inglês. O valor de CADA chave DEVE ser apenas uma STRING com o texto final (nunca retorne sub-objetos ou JSON aninhado):
- "youtube": (string) ROTEIRO YOUTUBE (3-5 min) em texto corrido
- "reels": (string) ROTEIRO REELS (30-60s) em texto corrido
- "carrossel": (string) CARROSSEL INSTAGRAM (8-10 slides) em texto corrido
- "linkedin": (string) POST LINKEDIN (com hashtags) em texto corrido
- "twitter": (string) THREAD X/TWITTER (5-8 tweets) em texto corrido`,

  viralScore: `Você é um analista de conteúdo viral especializado em F1.
Analise o título e corpo da matéria e forneça scores:

- viral_score: 0-100
- seo_score: 0-100
- share_score: 0-100
- reading_time: minutos estimados
- ctr_estimate: porcentagem estimada
- suggestions: array de melhorias

Formato: JSON.`,

  timeline: `Você é um historiador da F1 para o portal "Piloto Curioso".
Sobre o tema fornecido, crie uma timeline detalhada com marcos importantes.

Formato: JSON array com { "year", "event", "significance" }.`,

  emergingDrivers: `Você é um scout de talentos do automobilismo para o portal "Piloto Curioso".
Identifique pilotos em ascensão em categorias de base.

Formato OBRIGATÓRIO: JSON array de objetos contendo EXATAMENTE estas chaves em inglês:
- "name": (string) Nome do piloto
- "age": (number) Idade
- "category": (string) Categoria atual
- "highlight": (string) Destaque e histórico
- "sponsor_potential": (string) Potencial de matéria patrocinada
- "urgency": (string) APENAS UMA PALAVRA: "Alta", "Média" ou "Baixa"`,

  curiosityBank: `Você é um gerador de curiosidades sobre F1 para o portal "Piloto Curioso".
Gere 10 curiosidades INÉDITAS e surpreendentes. Devem ser verificáveis.

Formato: JSON array com { "title", "description", "category" }.`,
} as const;
