import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url  = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Supabase is OPTIONAL. If env vars are missing, the app runs in local demo
 * mode backed by localStorage. Never import the service-role key here.
 */
export const supabaseEnabled: boolean = Boolean(url && anon);

export const supabase: SupabaseClient | null = supabaseEnabled
  ? createClient(url as string, anon as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;
