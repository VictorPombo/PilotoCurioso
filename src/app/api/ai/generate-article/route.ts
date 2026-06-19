import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { generateWithAI, AI_PROMPTS } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

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
    console.error('[AI Generate]', err);
    return NextResponse.json({ error: 'Erro ao gerar matéria' }, { status: 500 });
  }
}
