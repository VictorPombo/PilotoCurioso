import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth';
import { estimateReadingTime } from '@/lib/slugify';

/** GET: Get single article by ID */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from('articles')
    .select('*, category:categories(*)')
    .eq('id', params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Matéria não encontrada' }, { status: 404 });
  }

  return NextResponse.json(data);
}

/** PUT: Update article (admin only) */
export async function PUT(
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

    const allowedFields = [
      'title', 'slug', 'brief', 'body', 'cover_image', 'cover_image_alt',
      'category_id', 'is_sponsored', 'sponsor_name', 'status', 'scheduled_at',
      'seo_title', 'seo_description', 'og_image', 'tags', 'ia_generated',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) update[field] = body[field];
    }

    // Auto-calculate reading time
    if (body.body) update.reading_time = estimateReadingTime(body.body);

    // Set published_at when publishing
    if (body.status === 'published') {
      update.published_at = new Date().toISOString();
    }

    const { data, error } = await sb
      .from('articles')
      .update(update)
      .eq('id', params.id)
      .select('*, category:categories(*)')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
  }
}

/** DELETE: Archive article (admin only) */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.cookies.get('auth_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const sb = getServiceClient();
  const { error } = await sb
    .from('articles')
    .update({ status: 'archived', updated_at: new Date().toISOString() })
    .eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
