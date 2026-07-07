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
    const { category, used_titles } = await req.json();
    const usedList = (used_titles || []).join('\n- ');
    const userInput = `Categoria: ${category || 'curiosidades gerais'}\n\nIdeias já usadas (NÃO repetir):\n- ${usedList || 'nenhuma'}`;
    const result = await generateWithAI(AI_PROMPTS.curiosityBank, userInput);

    try {
      const jsonMatch = result.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) return NextResponse.json(JSON.parse(jsonMatch[0]));
    } catch {}

    return NextResponse.json({ raw: result.text });
  } catch (err) {
    console.error('[AI Curiosity Bank]', err);
    return NextResponse.json({ error: 'Erro ao gerar curiosidades' }, { status: 500 });
  }
}
