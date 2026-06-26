import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Sem proteção de auth por enquanto — todas as rotas são públicas
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
