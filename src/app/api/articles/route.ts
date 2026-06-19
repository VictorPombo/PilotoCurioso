import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth';
import { slugify, estimateReadingTime } from '@/lib/slugify';

/** GET: List articles with optional filters */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const status = searchParams.get('status');
  const category = searchParams.get('category');
  const search = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '50');

  const sb = getServiceClient();
  let query = sb
    .from('articles')
    .select('*, category:categories(*)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (status) query = query.eq('status', status);
  if (category) query = query.eq('category_id', category);
  if (search) query = query.ilike('title', `%${search}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

/** POST: Create new article (admin only) */
export async function POST(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const sb = getServiceClient();

    const slug = body.slug || slugify(body.title);
    const readingTime = body.body ? estimateReadingTime(body.body) : 0;

    const article = {
      title: body.title,
      slug,
      brief: body.brief || null,
      body: body.body || null,
      cover_image: body.cover_image || null,
      cover_image_alt: body.cover_image_alt || null,
      category_id: body.category_id || null,
      is_sponsored: body.is_sponsored || false,
      sponsor_name: body.sponsor_name || null,
      status: body.status || 'draft',
      scheduled_at: body.scheduled_at || null,
      published_at: body.status === 'published' ? new Date().toISOString() : null,
      seo_title: body.seo_title || null,
      seo_description: body.seo_description || null,
      og_image: body.og_image || null,
      tags: body.tags || null,
      reading_time: readingTime,
      ia_generated: body.ia_generated || false,
    };

    const { data, error } = await sb.from('articles').insert(article).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erro ao criar matéria' }, { status: 500 });
  }
}
