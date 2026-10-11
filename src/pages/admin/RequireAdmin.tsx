import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

/**
 * ⚠️  Route guard only. This is NOT security. It hides the admin UI from
 * curious users, but any real authorization must be enforced server-side
 * (Supabase RLS) — the browser is untrusted by definition.
 */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const loc = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: loc.pathname }} replace />;
  }
  return <>{children}</>;
}
