import { useEffect } from 'react';
import { applySeo } from '@/lib/seo';

interface Args {
  title: string;
  description?: string;
  image?: string;
  path?: string;
  type?: 'website' | 'product' | 'article';
  noindex?: boolean;
}

export function useSeo(args: Args): void {
  const { title, description, image, path, type, noindex } = args;
  useEffect(() => {
    applySeo({ title, description, image, path, type, noindex });
  }, [title, description, image, path, type, noindex]);
}
