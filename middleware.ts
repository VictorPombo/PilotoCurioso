import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login page é sempre pública
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Verificar auth para todas as rotas /admin/*
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const secret = getSecret();
  if (!secret) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    // Token inválido ou expirado
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.set('auth_token', '', { maxAge: 0, path: '/' });
    return response;
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
