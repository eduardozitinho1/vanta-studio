import type { ReactNode } from 'react';
import type { OrderStatus } from '@/types';
import { cx } from '@/lib/format';

type Tone = 'neutral' | 'dark' | 'success' | 'warn' | 'danger' | 'info';

const tones: Record<Tone, string> = {
  neutral: 'border-line bg-paper text-ash',
  dark: 'border-ink bg-ink text-paper',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  warn: 'border-amber-200 bg-amber-50 text-amber-800',
  danger: 'border-red-200 bg-red-50 text-red-800',
  info: 'border-blue-200 bg-blue-50 text-blue-800',
};

export function Badge({ children, tone = 'neutral' }: {
  children: ReactNode; tone?: Tone;
}) {
  return (
    <span className={cx(
      'inline-flex items-center gap-1 border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide2',
      tones[tone],
    )}>
      {children}
    </span>
  );
}

const statusTone: Record<OrderStatus, Tone> = {
  pending: 'warn', paid: 'info', shipped: 'info',
  delivered: 'success', cancelled: 'danger',
};

const statusLabel: Record<OrderStatus, string> = {
  pending: 'Pendente', paid: 'Pago', shipped: 'Enviado',
  delivered: 'Entregue', cancelled: 'Cancelado',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge tone={statusTone[status]}>{statusLabel[status]}</Badge>;
}
