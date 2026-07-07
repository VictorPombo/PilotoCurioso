import { SignJWT, jwtVerify } from 'jose';
import type { JWTPayload } from 'jose';

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET não configurada. Defina nas variáveis de ambiente.');
  }
  return new TextEncoder().encode(secret);
};

export interface AdminPayload extends JWTPayload {
  email: string;
  role: 'admin';
}

/** Sign a JWT for the admin user */
export async function signToken(email: string): Promise<string> {
  return new SignJWT({ email, role: 'admin' } as AdminPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
}

/** Verify and decode a JWT. Returns payload or null if invalid. */
export async function verifyToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as AdminPayload;
  } catch {
    return null;
  }
}

/** Extract JWT from request cookies */
export function extractTokenFromCookies(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|;\s*)auth_token=([^;]*)/);
  return match ? match[1] : null;
}

/** Validate admin password against env hash */
export async function validatePassword(password: string): Promise<boolean> {
  const storedHash = process.env.ADMIN_PASSWORD_HASH;
  if (!storedHash) return false;

  // Simple SHA-256 comparison (same as Driver News approach)
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex === storedHash;
}
