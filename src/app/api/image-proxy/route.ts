import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

let cachedPlaceholder: Buffer | null = null;

function getPlaceholderBuffer(): Buffer | null {
  if (cachedPlaceholder) return cachedPlaceholder;
  try {
    const p = path.join(process.cwd(), 'public', 'images', 'news-placeholder.png');
    if (fs.existsSync(p)) {
      cachedPlaceholder = fs.readFileSync(p);
      return cachedPlaceholder;
    }
  } catch {
    // fallback
  }
  return null;
}

function servePlaceholder(request: NextRequest) {
  const buf = getPlaceholderBuffer();
  if (buf) {
    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  }
  return NextResponse.redirect(new URL('/images/news-placeholder.png', request.url), 307);
}

function cleanTargetUrl(rawUrl: string): string {
  let cleaned = rawUrl.trim();
  try {
    const decoded = decodeURIComponent(cleaned);
    // Se for URL de resultado do Google Images, extrai a imagem real (imgurl)
    if (decoded.includes('google.com/imgres') || decoded.includes('imgurl=')) {
      const match = decoded.match(/[?&]imgurl=([^&]+)/i);
      if (match && match[1]) {
        return decodeURIComponent(match[1]);
      }
    }
    return decoded;
  } catch {
    return cleaned;
  }
}

/**
 * Proxy de imagens externas com fallback garantido.
 * - Extrai URL real de buscas do Google Images automaticamente
 * - Trata bloqueios (403, 404, CORS) servindo o placeholder oficial
 * - Nunca retorna JSON ou HTML quebrado para tags <img>
 */
export async function GET(request: NextRequest) {
  const urlParam = request.nextUrl.searchParams.get('url');

  if (!urlParam) {
    return servePlaceholder(request);
  }

  const targetUrl = cleanTargetUrl(urlParam);

  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    return servePlaceholder(request);
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept':
          'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': targetUrl,
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return servePlaceholder(request);
    }

    const contentType = response.headers.get('content-type') || '';
    // Se o site externo retornar HTML (como tela de bloqueio ou erro 200), serve o placeholder
    if (!contentType.toLowerCase().startsWith('image/')) {
      return servePlaceholder(request);
    }

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch {
    return servePlaceholder(request);
  }
}
