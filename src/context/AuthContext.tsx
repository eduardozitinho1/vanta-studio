import {
  createContext, useCallback, useContext, useMemo, useState, type ReactNode,
} from 'react';
import { sessionStore } from '@/lib/storage';
import { supabase, supabaseEnabled } from '@/lib/supabase';

/**
 * ⚠️  DEMO AUTHENTICATION — NOT SECURITY.
 *
 * In local demo mode this accepts one demo credential so the admin UI is
 * walkable in a portfolio demo. It does NOT protect data.
 * In Supabase mode, real authorization MUST be enforced by RLS policies.
 * No default admin password is committed to a production deployment.
 */

const DEMO_EMAIL = 'admin@vanta.studio';
const DEMO_PASSWORD = 'vanta-demo';

export const DEMO_CREDENTIALS = {
  email: DEMO_EMAIL, password: DEMO_PASSWORD,
} as const;

interface Ctx {
  isAuthenticated: boolean;
  email: string | null;
  mode: 'demo' | 'supabase';
  signIn: (email: string, password: string) =>
    Promise<{ ok: true } | { ok: false; error: string }>;
  signOut: () => Promise<void>;
}

const AuthCtx = createContext<Ctx | null>(null);
const KEY = 'admin:session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const mode: 'demo' | 'supabase' = supabaseEnabled ? 'supabase' : 'demo';
  const [email, setEmail] = useState<string | null>(() => sessionStore.get(KEY));

  const signIn = useCallback<Ctx['signIn']>(async (e, p) => {
    if (mode === 'supabase' && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: e, password: p,
        });
        if (error) return { ok: false, error: error.message };
        const mail = data.user?.email ?? null;
        setEmail(mail);
        if (mail) sessionStore.set(KEY, mail);
        return { ok: true };
      } catch (err) {
        return {
          ok: false,
          error: err instanceof Error ? err.message : 'Falha de rede ao autenticar.',
        };
      }
    }
    if (e.trim().toLowerCase() === DEMO_EMAIL && p === DEMO_PASSWORD) {
      sessionStore.set(KEY, DEMO_EMAIL);
      setEmail(DEMO_EMAIL);
      return { ok: true };
    }
    return { ok: false, error: 'Credenciais inválidas (modo demo).' };
  }, [mode]);

  const signOut = useCallback(async () => {
    if (mode === 'supabase' && supabase) {
      try { await supabase.auth.signOut(); } catch { /* ignore */ }
    }
    sessionStore.remove(KEY);
    setEmail(null);
  }, [mode]);

  const value = useMemo<Ctx>(() => ({
    isAuthenticated: Boolean(email), email, mode, signIn, signOut,
  }), [email, mode, signIn, signOut]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(): Ctx {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
