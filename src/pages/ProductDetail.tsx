import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Minus, Plus, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import type { Product, Size } from '@/types';
import { repository } from '@/lib/repository';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useSeo } from '@/hooks/useSeo';
import { formatBRL, cx } from '@/lib/format';
import { Img } from '@/components/ui/Image';
import { Button } from '@/components/ui/Button';
import { Accordion } from '@/components/ui/Accordion';
import { ProductGrid } from '@/components/product/ProductGrid';
import { productJsonLd } from '@/lib/structuredData';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [related, setRelated] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState<Size | null>(null);
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const { push } = useToast();

  useEffect(() => {
    let alive = true;
    setProduct(undefined); setActiveImage(0); setSize(null); setQty(1);
    (async () => {
      const all = await repository.listProducts();
      const found = all.find((p) => p.slug === slug) ?? null;
      if (!alive) return;
      setProduct(found);
      if (found) {
        setRelated(all.filter((p) =>
          p.id !== found.id && (p.category === found.category ||
            p.collectionIds.some((c) => found.collectionIds.includes(c)))).slice(0, 4));
      }
    })().catch(() => { if (alive) setProduct(null); });
    return () => { alive = false; };
  }, [slug]);

  useSeo({
    title: product ? product.name : 'Produto',
    description: product?.description,
    image: product?.images[0],
    path: product ? `/produto/${product.slug}` : undefined,
    type: 'product',
  });

  useEffect(() => {
    if (!product) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = productJsonLd(product);
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [product]);

  const soldOut = useMemo(() => (product ? product.stock <= 0 : false), [product]);

  if (product === undefined) {
    return (
      <div className="mx-auto max-w-screen2xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-[4/5] animate-pulse bg-line" />
          <div className="space-y-5">
            <div className="h-3 w-20 animate-pulse bg-line" />
            <div className="h-10 w-3/4 animate-pulse bg-line" />
            <div className="h-6 w-32 animate-pulse bg-line" />
            <div className="h-14 w-full animate-pulse bg-line" />
          </div>
        </div>
      </div>
    );
  }
  if (product === null) {
    return (
      <div className="mx-auto max-w-screen2xl px-5 py-32 text-center sm:px-8">
        <p className="text-[10px] uppercase tracking-ultra text-ash">Produto não encontrado</p>
        <h1 className="mt-4 font-display text-4xl">Esta peça saiu do catálogo.</h1>
        <Link to="/loja" className="mt-8 inline-flex h-11 items-center border border-ink px-6 text-xs uppercase tracking-wide2">
          Voltar à loja
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    if (!size) { push('error', 'Selecione um tamanho antes de adicionar.'); return; }
    add(product, size, qty);
    push('success', `${product.name} (${size}) adicionado ao carrinho.`);
  };

  return (
    <div className="mx-auto max-w-screen2xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <nav className="mb-8 text-[10px] uppercase tracking-wide2 text-ash" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-ink">Início</Link>
        <span className="mx-2">/</span>
        <Link to="/loja" className="hover:text-ink">Loja</Link>
        <span className="mx-2">/</span>
        <span className="text-ink/80">{product.name}</span>
      </nav>
      <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div className="flex flex-col-reverse gap-4 sm:flex-row">
          <div className="flex gap-3 sm:flex-col">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImage(i)}
                aria-label={`Ver imagem ${i + 1}`} aria-pressed={i === activeImage}
                className={cx('w-16 shrink-0 overflow-hidden border transition sm:w-20',
                  i === activeImage ? 'border-ink' : 'border-transparent hover:border-line')}>
                <Img src={img} alt="" ratio="square" />
              </button>
            ))}
          </div>
          <div className="flex-1">
            <Img src={product.images[activeImage] ?? product.images[0] ?? ''}
              alt={`${product.name} — imagem ${activeImage + 1}`} ratio="portrait" />
          </div>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-[10px] uppercase tracking-ultra text-ash">{product.category}</p>
          <h1 className="mt-3 font-display text-4xl leading-[1.05] sm:text-5xl">{product.name}</h1>
          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-xl text-ink">{formatBRL(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-smoke line-through">{formatBRL(product.compareAtPrice)}</span>
            )}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-ink/80">{product.description}</p>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-ultra text-ash">Tamanho</span>
              {size && <span className="text-[11px] text-ash">Selecionado: {size}</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} aria-pressed={size === s}
                  className={cx('h-11 min-w-[3rem] border px-4 text-xs uppercase tracking-wide2 transition',
                    size === s ? 'border-ink bg-ink text-paper' : 'border-line text-ink hover:border-ink')}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <div className="flex h-14 items-center border border-line">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuir quantidade"
                className="grid h-full w-12 place-items-center text-ink transition hover:bg-bone">
                <Minus size={14} />
              </button>
              <span className="w-12 text-center text-sm tabular-nums">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Aumentar quantidade"
                className="grid h-full w-12 place-items-center text-ink transition hover:bg-bone">
                <Plus size={14} />
              </button>
            </div>
            <Button size="lg" onClick={handleAdd} disabled={soldOut} className="flex-1">
              {soldOut ? 'Esgotado' : 'Adicionar ao carrinho'}
            </Button>
          </div>

          <p className="mt-4 text-xs text-ash">
            {soldOut ? 'Esta peça está fora de estoque.'
              : product.stock < 10 ? `Últimas ${product.stock} unidades em estoque.`
              : 'Disponível em estoque.'}
          </p>

          <div className="mt-8 grid gap-3 border-y border-line py-6 text-xs text-ash sm:grid-cols-3">
            <span className="flex items-center gap-2"><Truck size={14} /> Frete grátis acima de R$ 800</span>
            <span className="flex items-center gap-2"><RotateCcw size={14} /> 30 dias para troca</span>
            <span className="flex items-center gap-2"><ShieldCheck size={14} /> Compra simulada</span>
          </div>

          <div className="mt-8">
            <Accordion items={[
              { title: 'Detalhes da peça', content: (
                <ul className="list-disc space-y-1 pl-4">
                  {product.details.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              )},
              { title: 'Envio & devoluções', content: (
                <p>Enviamos para todo o Brasil em até 5 dias úteis (simulado). Trocas em até 30 dias.</p>
              )},
              { title: 'Sobre esta demonstração', content: (
                <p>Este site é um projeto fictício de portfólio. Nenhum pedido real é processado.</p>
              )},
            ]} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24 border-t border-line pt-16">
          <div className="mb-10">
            <p className="text-[10px] uppercase tracking-ultra text-ash">Você também pode gostar</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">Peças relacionadas</h2>
          </div>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
