import { NextRequest, NextResponse } from 'next/server';
import { generateWithAI, AI_PROMPTS } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { topics, category } = await req.json();
    if (!topics) {
      return NextResponse.json({ error: 'Tópicos são obrigatórios' }, { status: 400 });
    }

    const userInput = `Tópicos: ${topics}\nCategoria: ${category || 'geral'}`;
    const result = await generateWithAI(AI_PROMPTS.generateArticle, userInput);

    // Parse JSON response
    try {
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json(parsed);
      }
    } catch {
      // If JSON parse fails, return raw text
    }

    return NextResponse.json({
      title: 'Matéria Gerada',
      brief: '',
      body: result.text,
      seo_title: '',
      seo_description: '',
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('[AI Generate]', errorMessage);
    return NextResponse.json({ error: `Erro na IA: ${errorMessage}` }, { status: 500 });
  }
}
