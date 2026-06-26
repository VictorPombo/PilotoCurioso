import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const getSecret = () =>
  new TextEncoder().encode(
    process.env.JWT_SECRET || 'piloto-curioso-secret-change-in-prod'
  );

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Never intercept API routes
  if (pathname.startsWith('/api/')) return NextResponse.next();

  // Protect /admin routes (except login page)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(token, getSecret());
      return NextResponse.next();
    } catch {
      // Token expirado ou inválido — limpar cookie e redirecionar
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('auth_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
