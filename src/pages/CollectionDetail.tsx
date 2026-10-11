import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Collection, Product } from '@/types';
import { repository } from '@/lib/repository';
import { Img } from '@/components/ui/Image';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductSkeletonGrid } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useSeo } from '@/hooks/useSeo';

export default function CollectionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [collection, setCollection] = useState<Collection | null | undefined>(undefined);
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    let alive = true;
    setCollection(undefined); setProducts(null);
    (async () => {
      const c = await repository.findCollection(slug ?? '');
      if (!alive) return;
      setCollection(c);
      if (c) {
        const all = await repository.listProducts();
        if (alive) setProducts(all.filter((p) => p.collectionIds.includes(c.id)));
      } else {
        setProducts([]);
      }
    })().catch(() => { if (alive) { setCollection(null); setProducts([]); } });
    return () => { alive = false; };
  }, [slug]);

  useSeo({
    title: collection ? collection.name : 'Coleção',
    description: collection?.description,
    image: collection?.image,
    path: collection ? `/colecoes/${collection.slug}` : undefined,
  });

  if (collection === undefined) {
    return (
      <div className="mx-auto max-w-screen2xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="mb-12 aspect-[16/9] w-full animate-pulse bg-line" />
        <ProductSkeletonGrid count={8} />
      </div>
    );
  }
  if (collection === null) {
    return (
      <div className="mx-auto max-w-screen2xl px-5 py-32 text-center sm:px-8">
        <p className="text-[10px] uppercase tracking-ultra text-ash">Coleção não encontrada</p>
        <h1 className="mt-4 font-display text-4xl">Este volume não existe.</h1>
        <Link to="/colecoes" className="mt-8 inline-flex h-11 items-center border border-ink px-6 text-xs uppercase tracking-wide2">
          Ver todas as coleções
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen2xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <header className="mb-12 grid gap-8 border-b border-line pb-12 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-16">
        <div className="overflow-hidden">
          <Img src={collection.image} alt={collection.name} ratio="portrait" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-ultra text-ash">Coleção</p>
          <h1 className="mt-3 font-display text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
            {collection.name}
          </h1>
          <p className="mt-5 max-w-xl text-sm uppercase tracking-wide2 text-ash">{collection.tagline}</p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/80">{collection.description}</p>
        </div>
      </header>

      {!products ? (
        <ProductSkeletonGrid count={6} />
      ) : products.length === 0 ? (
        <EmptyState
          eyebrow="Coleção vazia"
          title="Ainda não há peças neste volume."
          description="Novas peças chegam em breve. Enquanto isso, explore o catálogo completo."
          action={{ to: '/loja', label: 'Ver catálogo' }}
        />
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
