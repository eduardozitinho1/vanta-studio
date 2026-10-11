import { useEffect, useState } from 'react';
import type { Collection } from '@/types';
import { repository } from '@/lib/repository';
import { useToast } from '@/context/ToastContext';
import { useSeo } from '@/hooks/useSeo';

export default function AdminCollections() {
  useSeo({ title: 'Coleções', noindex: true });
  const { push } = useToast();
  const [collections, setCollections] = useState<Collection[] | null>(null);

  useEffect(() => {
    repository.listCollections()
      .then(setCollections)
      .catch(() => push('error', 'Falha ao carregar coleções.'));
  }, [push]);

  return (
    <div>
      <header className="mb-8 border-b border-line pb-6">
        <p className="text-[10px] uppercase tracking-ultra text-ash">Catálogo</p>
        <h1 className="mt-2 font-display text-4xl">Coleções</h1>
        <p className="mt-2 text-sm text-ash">Coleções são editáveis via SQL/arquivo de seed nesta demonstração.</p>
      </header>
      {!collections ? (
        <div className="space-y-3">{[0,1,2].map((i) => <div key={i} className="h-16 animate-pulse bg-line" />)}</div>
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {collections.map((c) => (
            <li key={c.id} className="grid grid-cols-1 gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-wide2 text-ash">/{c.slug} · {c.tagline}</p>
              </div>
              <span className="text-xs text-ash">id: {c.id}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
