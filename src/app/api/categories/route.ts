import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth';

/** GET: List categories */
export async function GET() {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** POST: Create category (admin only) */
export async function POST(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const sb = getServiceClient();

    const { data, error } = await sb
      .from('categories')
      .insert({
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        color: body.color || '#E8002D',
        icon: body.icon || null,
        display_order: body.display_order || 0,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erro ao criar editoria' }, { status: 500 });
  }
}
