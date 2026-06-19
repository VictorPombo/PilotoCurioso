import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

/** POST: Subscribe to newsletter */
export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 });
    }

    const sb = getServiceClient();
    const { error } = await sb
      .from('newsletter_subscribers')
      .upsert(
        { email: email.toLowerCase().trim(), name: name || null },
        { onConflict: 'email' }
      );

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erro ao inscrever' }, { status: 500 });
  }
}
