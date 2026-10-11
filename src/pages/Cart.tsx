import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { repository } from '@/lib/repository';
import { formatBRL } from '@/lib/format';
import { DEMO_FREE_SHIPPING_THRESHOLD } from '@/lib/cart';
import { Img } from '@/components/ui/Image';
import { EmptyState } from '@/components/ui/EmptyState';
import { useSeo } from '@/hooks/useSeo';

export default function Cart() {
  useSeo({ title: 'Carrinho', path: '/carrinho', noindex: true });
  const { lines, subtotal, shipping, total, setQty, remove } = useCart();
  const { push } = useToast();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!lines.length) return;
    let alive = true;
    (async () => {
      try {
        const products = await repository.listProducts();
        const map = new Map<string, Product>(products.map((p) => [p.id, p]));
        for (const l of lines) {
          const p = map.get(l.productId);
          if (!p) { remove(l.productId, l.size); push('error', `${l.name} saiu do catálogo.`); continue; }
          if (p.stock < l.quantity) {
            const next = Math.max(0, Math.min(p.stock, l.quantity));
            if (next === 0) { remove(l.productId, l.size); push('error', `${l.name} está esgotado.`); }
            else { setQty(l.productId, l.size, next); push('info', `Estoque de ${l.name} ajustado para ${next}.`); }
          }
        }
      } catch { /* allow cart to still render */ }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToCheckout = async () => {
    setChecking(true);
    try {
      const products = await repository.listProducts();
      const map = new Map(products.map((p) => [p.id, p]));
      for (const l of lines) {
        const p = map.get(l.productId);
        if (!p || p.stock < l.quantity) {
          push('error', `${l.name} não está mais disponível na quantidade desejada.`);
          setChecking(false);
          return;
        }
      }
      navigate('/checkout');
    } catch {
      push('error', 'Não foi possível validar o carrinho. Tente novamente.');
      setChecking(false);
    }
  };

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-screen2xl px-5 py-20 sm:px-8 lg:px-12">
        <EmptyState eyebrow="Carrinho" title="Seu carrinho está vazio."
          description="Explore o catálogo e adicione as peças que fizerem sentido."
          action={{ to: '/loja', label: 'Ver o catálogo' }} />
      </div>
    );
  }

  const remaining = Math.max(0, DEMO_FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, Math.round((subtotal / DEMO_FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className="mx-auto max-w-screen2xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <header className="mb-10 border-b border-line pb-8">
        <p className="text-[10px] uppercase tracking-ultra text-ash">Sacola</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl">Seu carrinho</h1>
      </header>

      <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <ul className="divide-y divide-line">
          {lines.map((l) => (
            <li key={`${l.productId}-${l.size}`} className="grid grid-cols-[110px_1fr] gap-4 py-6 sm:grid-cols-[140px_1fr] sm:gap-6">
              <Link to={`/produto/${l.slug}`} className="block">
                <Img src={l.image} alt={l.name} ratio="portrait" />
              </Link>
              <div className="flex flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link to={`/produto/${l.slug}`} className="font-medium text-ink transition hover:text-ash">
                      {l.name}
                    </Link>
                    <p className="mt-1 text-[11px] uppercase tracking-wide2 text-ash">Tamanho {l.size}</p>
                  </div>
                  <p className="shrink-0 text-sm text-ink">{formatBRL(l.price * l.quantity)}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="flex h-10 items-center border border-line">
                    <button onClick={() => setQty(l.productId, l.size, l.quantity - 1)}
                      aria-label="Diminuir quantidade" className="grid h-full w-9 place-items-center text-ink transition hover:bg-bone">
                      <Minus size={12} />
                    </button>
                    <span className="w-10 text-center text-xs tabular-nums">{l.quantity}</span>
                    <button onClick={() => setQty(l.productId, l.size, l.quantity + 1)}
                      aria-label="Aumentar quantidade" className="grid h-full w-9 place-items-center text-ink transition hover:bg-bone">
                      <Plus size={12} />
                    </button>
                  </div>
                  <button onClick={() => { remove(l.productId, l.size); push('info', `${l.name} removido do carrinho.`); }}
                    aria-label={`Remover ${l.name}`}
                    className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide2 text-ash transition hover:text-ink">
                    <Trash2 size={12} /> Remover
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-line bg-bone/40 p-6 sm:p-8">
            <h2 className="font-display text-2xl">Resumo</h2>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-ash">Subtotal</dt><dd>{formatBRL(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-ash">Frete</dt><dd>{shipping === 0 ? 'Grátis' : formatBRL(shipping)}</dd></div>
              <div className="flex justify-between border-t border-line pt-3 text-base">
                <dt className="font-medium">Total</dt><dd className="font-medium">{formatBRL(total)}</dd>
              </div>
            </dl>
            {remaining > 0 && (
              <div className="mt-6">
                <p className="text-[10px] uppercase tracking-wide2 text-ash">
                  Faltam {formatBRL(remaining)} para frete grátis
                </p>
                <div className="mt-2 h-1 w-full bg-line">
                  <div className="h-full bg-ink transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
            <button onClick={goToCheckout} disabled={checking}
              className="mt-8 flex h-14 w-full items-center justify-center gap-3 bg-ink text-xs uppercase tracking-wide2 text-paper transition hover:bg-ink-700 disabled:cursor-not-allowed disabled:opacity-50">
              {checking ? 'Validando…' : 'Ir para o checkout'}
              {!checking && <ArrowRight size={14} />}
            </button>
            <Link to="/loja" className="mt-4 block text-center text-[11px] uppercase tracking-wide2 text-ash underline decoration-line underline-offset-4 hover:text-ink">
              Continuar comprando
            </Link>
            <p className="mt-6 text-[10px] uppercase tracking-wide2 text-ash">
              Demonstração — nenhuma cobrança real é feita.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
