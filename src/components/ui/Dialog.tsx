import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Dialog({ open, onClose, title, children, footer }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="presentation">
      <div className="absolute inset-0 animate-fadeIn bg-ink/50" onClick={onClose} aria-hidden />
      <div
        role="dialog" aria-modal="true" aria-label={title}
        className="relative w-full max-w-lg animate-slideDown border border-line bg-paper shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-2xl">{title}</h2>
          <button onClick={onClose} aria-label="Fechar" className="text-ash transition hover:text-ink">
            <X size={18} />
          </button>
        </header>
        <div className="px-6 py-5 text-sm text-ink/85">{children}</div>
        {footer && (
          <footer className="flex justify-end gap-3 border-t border-line px-6 py-4">{footer}</footer>
        )}
      </div>
    </div>
  );
}
