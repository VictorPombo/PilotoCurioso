import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { generateWithAI, AI_PROMPTS } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

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
    return NextResponse.json({ error: 'Erro' }, { status: 500 });
  }
}
