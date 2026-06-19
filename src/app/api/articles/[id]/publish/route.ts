import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth';

/** POST: Publish or schedule an article */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.cookies.get('auth_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const sb = getServiceClient();

    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (body.scheduled_at) {
      // Schedule for later
      update.status = 'scheduled';
      update.scheduled_at = body.scheduled_at;
    } else {
      // Publish now
      update.status = 'published';
      update.published_at = new Date().toISOString();
    }

    const { data, error } = await sb
      .from('articles')
      .update(update)
      .eq('id', params.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Erro ao publicar' }, { status: 500 });
  }
}
