import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Collection } from '@/types';
import { repository } from '@/lib/repository';
import { Img } from '@/components/ui/Image';
import { useSeo } from '@/hooks/useSeo';

export default function Collections() {
  useSeo({
    title: 'Coleções',
    description: 'Quatro volumes da VANTA STUDIO. Demonstração de portfólio.',
    path: '/colecoes',
  });
  const [collections, setCollections] = useState<Collection[] | null>(null);

  useEffect(() => {
    let alive = true;
    repository.listCollections()
      .then((c) => { if (alive) setCollections(c); })
      .catch(() => { if (alive) setCollections([]); });
    return () => { alive = false; };
  }, []);

  return (
    <div className="mx-auto max-w-screen2xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <header className="mb-14 border-b border-line pb-8">
        <p className="text-[10px] uppercase tracking-ultra text-ash">Coleções</p>
        <h1 className="mt-3 font-display text-5xl sm:text-6xl lg:text-7xl">Volumes</h1>
        <p className="mt-4 max-w-xl text-sm text-ash">
          Quatro estudos de silhueta, uma única linguagem de matéria.
        </p>
      </header>
      <div className="grid gap-10 md:grid-cols-2 lg:gap-14">
        {(collections ?? []).map((c, i) => (
          <Link key={c.id} to={`/colecoes/${c.slug}`} className="group block">
            <div className="overflow-hidden">
              <Img src={c.image} alt={c.name} ratio="landscape"
                className="transition-transform duration-[1000ms] group-hover:scale-105" />
            </div>
            <div className="mt-6">
              <p className="text-[10px] uppercase tracking-ultra text-ash">Volume {i + 1}</p>
              <h2 className="mt-2 font-display text-3xl leading-tight lg:text-4xl">{c.name}</h2>
              <p className="mt-3 max-w-md text-sm text-ash">{c.tagline}</p>
              <p className="mt-4 max-w-lg text-sm text-ink/70">{c.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
