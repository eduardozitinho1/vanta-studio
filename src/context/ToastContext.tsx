import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
  type ReactNode,
} from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';
import { cx } from '@/lib/format';

type Kind = 'success' | 'error' | 'info';
interface Toast { id: string; kind: Kind; message: string; }
interface Ctx { push: (kind: Kind, message: string) => void; }

const ToastCtx = createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((kind: Kind, message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, kind, message }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const value = useMemo<Ctx>(() => ({ push }), [push]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div
        role="region"
        aria-label="Notificações"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:left-auto sm:right-6 sm:items-end"
      >
        {toasts.map((t) => <Item key={t.id} toast={t} onDismiss={dismiss} />)}
      </div>
    </ToastCtx.Provider>
  );
}

function Item({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const id = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(id);
  }, [toast.id, onDismiss]);

  const Icon = toast.kind === 'success' ? Check
    : toast.kind === 'error' ? AlertCircle : Info;

  return (
    <div
      role="status"
      className={cx(
        'pointer-events-auto flex w-full max-w-sm items-start gap-3 border px-4 py-3 text-sm shadow-sm animate-slideDown',
        toast.kind === 'error' ? 'border-red-200 bg-red-50 text-red-900'
        : toast.kind === 'success' ? 'border-ink/15 bg-ink text-paper'
        : 'border-line bg-paper text-ink',
      )}
    >
      <Icon size={16} className="mt-0.5 shrink-0" aria-hidden />
      <span className="flex-1 leading-snug">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Fechar notificação"
        className="opacity-60 transition hover:opacity-100"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function useToast(): Ctx {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
