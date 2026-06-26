import { NextRequest, NextResponse } from 'next/server';
import { generateWithAI, AI_PROMPTS } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { topic, article_body } = await req.json();
    const userInput = `Tema: ${topic || ''}\nConteúdo: ${article_body || ''}`;
    const result = await generateWithAI(AI_PROMPTS.sponsorable, userInput);

    try {
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) return NextResponse.json(JSON.parse(jsonMatch[0]));
    } catch {}

    return NextResponse.json({ raw: result.text });
  } catch (err) {
    console.error('[AI Sponsorable]', err);
    return NextResponse.json({ error: 'Erro ao analisar patrocínio' }, { status: 500 });
  }
}
