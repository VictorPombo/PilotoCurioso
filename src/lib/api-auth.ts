import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, type AdminPayload } from './auth';

/**
 * Verifica auth JWT no cookie. Retorna payload se autenticado, ou null.
 */
async function getAuthPayload(req: NextRequest): Promise<AdminPayload | null> {
  const token = req.cookies.get('auth_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Verifica auth JWT. Retorna NextResponse de erro se não autenticado, ou null se OK.
 * 
 * Uso:
 * ```ts
 * const authError = await requireAuth(req);
 * if (authError) return authError;
 * ```
 */
export async function requireAuth(req: NextRequest): Promise<NextResponse | null> {
  const payload = await getAuthPayload(req);
  
  if (!payload) {
    return NextResponse.json(
      { error: 'Não autorizado. Faça login no painel admin.' },
      { status: 401 }
    );
  }

  return null; // Autenticado — seguir em frente
}

/**
 * Verifica se a request é de um admin autenticado (sem bloquear).
 * Útil para rotas que funcionam tanto para público quanto para admin.
 */
export async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const payload = await getAuthPayload(req);
  return payload !== null;
}
