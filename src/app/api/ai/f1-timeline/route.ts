import { NextRequest, NextResponse } from 'next/server';
import { generateWithAI, AI_PROMPTS } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();
    const result = await generateWithAI(AI_PROMPTS.timeline, `Tema: ${topic}`);

    try {
      const jsonMatch = result.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) return NextResponse.json(JSON.parse(jsonMatch[0]));
    } catch {}

    return NextResponse.json({ raw: result.text });
  } catch (err) {
    console.error('[AI Timeline]', err);
    return NextResponse.json({ error: 'Erro ao gerar timeline' }, { status: 500 });
  }
}
