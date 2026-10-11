import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { to: string; label: string };
  children?: ReactNode;
}

export function EmptyState({
  eyebrow = 'Nada por aqui', title, description, action, children,
}: Props) {
  return (
    <div className="border border-line bg-bone/40 px-6 py-20 text-center">
      <p className="text-[10px] uppercase tracking-ultra text-ash">{eyebrow}</p>
      <h2 className="mx-auto mt-4 max-w-md font-display text-3xl leading-tight">{title}</h2>
      {description && (
        <p className="mx-auto mt-3 max-w-md text-sm text-ash">{description}</p>
      )}
      {children && <div className="mt-8">{children}</div>}
      {action && (
        <Link
          to={action.to}
          className="mt-8 inline-flex h-11 items-center border border-ink px-6 text-xs uppercase tracking-wide2 text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
