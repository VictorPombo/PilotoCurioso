import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/** Client público (respeita RLS) */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Client admin (bypassa RLS) — usar APENAS em API routes server-side */
export function getServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY não configurada');
  return createClient(supabaseUrl, serviceKey);
}
