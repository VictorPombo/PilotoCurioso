import { NextRequest, NextResponse } from 'next/server';
import { generateWithAI, AI_PROMPTS } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { title, body } = await req.json();
    const userInput = `Título: ${title}\n\nCorpo:\n${body}`;
    const result = await generateWithAI(AI_PROMPTS.viralScore, userInput);

    try {
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) return NextResponse.json(JSON.parse(jsonMatch[0]));
    } catch {}

    return NextResponse.json({ raw: result.text });
  } catch (err) {
    console.error('[AI Viral Score]', err);
    return NextResponse.json({ error: 'Erro ao analisar score de viralização' }, { status: 500 });
  }
}
