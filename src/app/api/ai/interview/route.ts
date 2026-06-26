import { NextRequest, NextResponse } from 'next/server';
import { generateWithAI, AI_PROMPTS } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { subject, context } = await req.json();
    const userInput = `Entrevistado: ${subject || 'piloto'}\nContexto: ${context || ''}`;
    const result = await generateWithAI(AI_PROMPTS.interview, userInput);

    try {
      const jsonMatch = result.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) return NextResponse.json(JSON.parse(jsonMatch[0]));
    } catch {}

    return NextResponse.json({ raw: result.text });
  } catch (err) {
    console.error('[AI Interview]', err);
    return NextResponse.json({ error: 'Erro ao gerar perguntas' }, { status: 500 });
  }
}
