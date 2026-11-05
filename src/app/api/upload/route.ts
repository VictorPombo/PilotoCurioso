import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { requireAuth } from '@/lib/api-auth';

export async function POST(req: NextRequest) {
  const authError = await requireAuth(req);
  if (authError) return authError;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'images';
    const folder = (formData.get('folder') as string) || 'covers';

    if (!file) {
      return NextResponse.json({ error: 'Arquivo não enviado.' }, { status: 400 });
    }

    const sb = getServiceClient();

    // Garante que o bucket exista e seja público
    const { data: buckets } = await sb.storage.listBuckets();
    if (buckets && !buckets.some((b) => b.name === bucket)) {
      await sb.storage.createBucket(bucket, { public: true });
    }

    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await sb.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: { publicUrl } } = sb.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return NextResponse.json({ publicUrl });
  } catch (err: any) {
    console.error('[Upload API Error]', err);
    return NextResponse.json(
      { error: err?.message || 'Erro interno no servidor de upload.' },
      { status: 500 }
    );
  }
}

