const SITE_URL = (import.meta.env.VITE_SITE_URL ?? '').replace(/\/$/, '');

interface SeoArgs {
  title: string;
  description?: string;
  image?: string;
  path?: string;
  type?: 'website' | 'product' | 'article';
  noindex?: boolean;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export function applySeo({
  title, description, image, path, type = 'website', noindex = false,
}: SeoArgs): void {
  const fullTitle = title.includes('VANTA') ? title : `${title} — VANTA STUDIO`;
  document.title = fullTitle;

  if (description) {
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:description', description);
    upsertMeta('name', 'twitter:description', description);
  }
  upsertMeta('property', 'og:title', fullTitle);
  upsertMeta('property', 'og:type', type);
  upsertMeta('property', 'og:site_name', 'VANTA STUDIO');
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', fullTitle);

  if (image) {
    upsertMeta('property', 'og:image', image);
    upsertMeta('name', 'twitter:image', image);
  }
  upsertMeta('name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow');

  if (SITE_URL && path) {
    const url = `${SITE_URL}${path}`;
    upsertMeta('property', 'og:url', url);
    upsertLink('canonical', url);
  }
}
