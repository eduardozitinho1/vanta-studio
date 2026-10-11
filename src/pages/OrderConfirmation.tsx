import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import type { Order } from '@/types';
import { repository } from '@/lib/repository';
import { formatBRL, formatDateTime } from '@/lib/format';
import { Img } from '@/components/ui/Image';
import { useSeo } from '@/hooks/useSeo';

const PM: Record<Order['paymentMethod'], string> = {
  pix: 'PIX', card: 'Cartão (simulado)', boleto: 'Boleto (simulado)',
};

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  useSeo({ title: 'Pedido confirmado', noindex: true });

  useEffect(() => {
    let alive = true;
    repository.findOrder(id ?? '')
      .then((o) => { if (alive) setOrder(o); })
      .catch(() => { if (alive) setOrder(null); });
    return () => { alive = false; };
  }, [id]);

  if (order === undefined) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
        <div className="mx-auto h-4 w-24 animate-pulse bg-line" />
        <div className="mx-auto mt-4 h-10 w-2/3 animate-pulse bg-line" />
      </div>
    );
  }
  if (order === null) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
        <p className="text-[10px] uppercase tracking-ultra text-ash">Pedido não encontrado</p>
        <h1 className="mt-4 font-display text-4xl">Não encontramos este pedido.</h1>
        <Link to="/loja" className="mt-8 inline-flex h-11 items-center border border-ink px-6 text-xs uppercase tracking-wide2">
          Ver o catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 size={32} className="text-emerald-600" aria-hidden />
        <p className="mt-4 text-[10px] uppercase tracking-ultra text-ash">Pedido confirmado</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">
          Obrigado, {order.customer.name.split(' ')[0]}.
        </h1>
        <p className="mt-4 max-w-lg text-sm text-ash">
          Este é um pedido simulado. Nenhum valor foi cobrado e nenhum produto
          será enviado. Guarde o número abaixo para referência.
        </p>
        <p className="mt-6 inline-flex items-center gap-2 border border-line bg-bone/50 px-4 py-2 text-xs uppercase tracking-wide2">
          <span className="text-ash">Pedido</span>
          <span className="font-medium">{order.number}</span>
        </p>
      </div>

      <section className="mt-16 border border-line bg-bone/40 p-6 sm:p-8">
        <h2 className="font-display text-2xl">Resumo</h2>
        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[10px] uppercase tracking-wide2 text-ash">Data</dt>
            <dd className="mt-1">{formatDateTime(order.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wide2 text-ash">Pagamento</dt>
            <dd className="mt-1">{PM[order.paymentMethod]}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-[10px] uppercase tracking-wide2 text-ash">Entrega</dt>
            <dd className="mt-1">
              {order.shipping.street}, {order.shipping.number}
              {order.shipping.complement ? ` — ${order.shipping.complement}` : ''}<br />
              {order.shipping.city} / {order.shipping.state} · {order.shipping.cep}
            </dd>
          </div>
        </dl>
        <ul className="mt-8 space-y-4 border-t border-line pt-6">
          {order.items.map((l) => (
            <li key={`${l.productId}-${l.size}`} className="flex items-start gap-4">
              <div className="w-16 shrink-0"><Img src={l.image} alt={l.name} ratio="portrait" /></div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{l.name}</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-wide2 text-ash">{l.size} · {l.quantity} un</p>
              </div>
              <p className="shrink-0 text-sm">{formatBRL(l.price * l.quantity)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-3 border-t border-line pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-ash">Subtotal</dt><dd>{formatBRL(order.subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-ash">Frete</dt><dd>{order.shippingCost === 0 ? 'Grátis' : formatBRL(order.shippingCost)}</dd></div>
          <div className="flex justify-between border-t border-line pt-3 text-base">
            <dt className="font-medium">Total</dt><dd className="font-medium">{formatBRL(order.total)}</dd>
          </div>
        </dl>
      </section>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link to="/loja" className="inline-flex h-11 items-center bg-ink px-6 text-xs uppercase tracking-wide2 text-paper transition hover:bg-ink-700">
          Continuar navegando
        </Link>
        <Link to="/" className="text-[11px] uppercase tracking-wide2 text-ash underline decoration-line underline-offset-4 hover:text-ink">
          Voltar à página inicial
        </Link>
      </div>
    </div>
  );
}
