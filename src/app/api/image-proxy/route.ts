import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy de imagens externas.
 * Uso: /api/image-proxy?url=https://exemplo.com/foto.jpg
 * 
 * Isso resolve o problema de hot-linking onde sites externos bloqueiam
 * a exibição direta das imagens em outros domínios.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    const decoded = decodeURIComponent(url);
    
    const response = await fetch(decoded, {
      headers: {
        // Simular um navegador normal para evitar bloqueios
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': decoded,
      },
      signal: AbortSignal.timeout(8000), // timeout de 8s
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400', // cache de 24h
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to proxy image' }, { status: 500 });
  }
}
