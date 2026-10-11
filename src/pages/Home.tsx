import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Collection, Product } from '@/types';
import { repository } from '@/lib/repository';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductSkeletonGrid } from '@/components/ui/Skeleton';
import { Img } from '@/components/ui/Image';
import { useSeo } from '@/hooks/useSeo';
import { useReveal } from '@/hooks/useReveal';
import { cx } from '@/lib/format';

export default function Home() {
  useSeo({
    title: 'VANTA STUDIO — Vestuário Editorial (Demo)',
    description: 'Projeto fictício de portfólio. Vestuário contemporâneo de silhueta editorial — Volume I, Monochrome.',
    path: '/',
  });

  const [products, setProducts] = useState<Product[] | null>(null);
  const [collections, setCollections] = useState<Collection[] | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([repository.listProducts(), repository.listCollections()])
      .then(([p, c]) => { if (alive) { setProducts(p); setCollections(c); } })
      .catch(() => { if (alive) { setProducts([]); setCollections([]); } });
    return () => { alive = false; };
  }, []);

  const featured = (products ?? []).filter((p) => p.featured).slice(0, 8);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-paper">
        <div className="absolute inset-0">
          <Img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80"
            alt="Editorial de outono — modelo em sobreposição de alfaiataria"
            ratio="fill" className="opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/40" />
        </div>
        <div className="relative mx-auto flex min-h-[82vh] max-w-screen2xl flex-col justify-end px-5 pb-14 pt-28 sm:px-8 lg:min-h-[92vh] lg:px-12 lg:pb-24">
          <p className="mb-5 animate-fadeUp text-[10px] uppercase tracking-ultra text-paper/70">
            Outono / Inverno — Volume I
          </p>
          <h1 className="max-w-4xl animate-fadeUp font-display text-5xl leading-[0.95] tracking-tight text-paper sm:text-7xl lg:text-9xl">
            A silhueta<br /><em className="italic">em silêncio.</em>
          </h1>
          <p className="mt-6 max-w-md animate-fadeUp text-sm leading-relaxed text-paper/75">
            Alfaiataria construída para durar mais de uma estação. Peças em
            paleta reduzida, peso e caimento estudados.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link to="/loja" className="group inline-flex h-12 items-center gap-3 bg-paper px-8 text-xs uppercase tracking-wide2 text-ink transition-colors hover:bg-bone">
              Explorar a coleção
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/sobre" className="inline-flex h-12 items-center border border-paper/40 px-8 text-xs uppercase tracking-wide2 text-paper transition-colors hover:bg-paper/10">
              Nossa história
            </Link>
          </div>
        </div>
      </section>

      <Section>
        <SectionHead eyebrow="Coleções" title="Quatro volumes, uma linguagem." action={{ to: '/loja', label: 'Ver tudo' }} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {!collections
            ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[3/4] animate-pulse bg-line" />)
            : collections.map((c, i) => (
                <Reveal key={c.id} delay={i * 80}>
                  <Link to={`/colecoes/${c.slug}`} className="group block">
                    <div className="overflow-hidden">
                      <Img src={c.image} alt={c.name} ratio="portrait"
                        className="transition-transform duration-[900ms] group-hover:scale-105" />
                    </div>
                    <div className="mt-4">
                      <p className="text-[10px] uppercase tracking-ultra text-ash">Volume {i + 1}</p>
                      <h3 className="mt-1 font-display text-2xl leading-tight">{c.name}</h3>
                      <p className="mt-1 text-sm text-ash">{c.tagline}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
        </div>
      </Section>

      <Section>
        <SectionHead eyebrow="Destaques" title="Peças selecionadas" action={{ to: '/loja', label: 'Ver a loja' }} />
        {!products ? <ProductSkeletonGrid count={8} /> : <ProductGrid products={featured} />}
      </Section>

      <section className="border-y border-line bg-bone">
        <div className="mx-auto grid max-w-screen2xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-32">
          <Reveal>
            <div className="overflow-hidden">
              <Img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=80"
                alt="Ateliê — detalhe de costura e tecido natural" ratio="portrait" />
            </div>
          </Reveal>
          <Reveal delay={120} className="flex flex-col justify-center">
            <p className="text-[10px] uppercase tracking-ultra text-ash">Manifesto</p>
            <h2 className="mt-5 font-display text-4xl leading-[1.05] lg:text-6xl">
              Menos peças.<br /><em className="italic">Mais intenção.</em>
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-ink/80">
              Cada peça da VANTA nasce de um exercício de subtração. Removemos o
              excesso até restar apenas o essencial: matéria, corte e tempo.
            </p>
            <Link to="/sobre" className="mt-10 inline-flex w-fit items-center gap-3 border-b border-ink pb-1 text-xs uppercase tracking-wide2 text-ink transition-colors hover:text-ash">
              Ler o manifesto <ArrowRight size={13} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-screen2xl px-5 py-24 text-center sm:px-8 lg:px-12 lg:py-36">
          <Reveal>
            <p className="text-[10px] uppercase tracking-ultra text-paper/50">Campanha</p>
            <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">
              Vista o que <em className="italic">permanece.</em>
            </h2>
            <Link to="/loja" className="mt-10 inline-flex h-12 items-center gap-3 bg-paper px-8 text-xs uppercase tracking-wide2 text-ink transition-colors hover:bg-bone">
              Descobrir agora <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Section({ children }: { children: ReactNode }) {
  return <section className="mx-auto max-w-screen2xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">{children}</section>;
}

function SectionHead({ eyebrow, title, action }: {
  eyebrow: string; title: string; action?: { to: string; label: string };
}) {
  return (
    <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:mb-16">
      <div>
        <p className="text-[10px] uppercase tracking-ultra text-ash">{eyebrow}</p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">{title}</h2>
      </div>
      {action && (
        <Link to={action.to} className="group inline-flex w-fit items-center gap-2 text-xs uppercase tracking-wide2 text-ink transition-colors hover:text-ash">
          {action.label} <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

function Reveal({ children, delay = 0, className }: {
  children: ReactNode; delay?: number; className?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={cx(
        'transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
        className,
      )}>
      {children}
    </div>
  );
}
