import { NextRequest, NextResponse } from 'next/server';
import { generateWithAI, AI_PROMPTS } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { context } = await req.json();
    const userInput = context || 'Analise pilotos em ascensão nas categorias de base (F4, F-Regional, Kart) em 2026.';
    const result = await generateWithAI(AI_PROMPTS.emergingDrivers, userInput);

    try {
      const jsonMatch = result.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) return NextResponse.json(JSON.parse(jsonMatch[0]));
    } catch {}

    return NextResponse.json({ raw: result.text });
  } catch (err) {
    console.error('[AI Emerging Drivers]', err);
    return NextResponse.json({ error: 'Erro ao buscar pilotos emergentes' }, { status: 500 });
  }
}
