import { NextRequest, NextResponse } from 'next/server';
import { generateWithAI, AI_PROMPTS } from '@/lib/gemini';
import { requireAuth } from '@/lib/api-auth';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const rateLimited = checkRateLimit(req);
  if (rateLimited) return rateLimited;
  const authError = await requireAuth(req);
  if (authError) return authError;

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
