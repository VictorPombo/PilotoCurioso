import { NextRequest, NextResponse } from 'next/server';

/**
 * Rate limiter in-memory simples.
 * Em serverless (Vercel), cada cold start reseta o Map, 
 * mas previne burst abuse dentro de uma mesma instância.
 */
const requestMap = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60_000; // 1 minuto
const MAX_REQUESTS = 10;  // 10 requests por minuto por IP

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

/**
 * Verifica rate limit para a request.
 * Retorna null se OK, ou NextResponse 429 se excedeu.
 */
export function checkRateLimit(req: NextRequest): NextResponse | null {
  const ip = getClientIp(req);
  const now = Date.now();

  const entry = requestMap.get(ip);

  if (!entry || now > entry.resetAt) {
    requestMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return null;
  }

  entry.count++;

  if (entry.count > MAX_REQUESTS) {
    return NextResponse.json(
      { error: 'Limite de requests excedido. Tente novamente em 1 minuto.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((entry.resetAt - now) / 1000)),
        },
      }
    );
  }

  return null;
}

// Limpar entradas expiradas a cada 5 minutos (evita memory leak)
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of requestMap) {
    if (now > entry.resetAt) requestMap.delete(ip);
  }
}, 5 * 60_000);
