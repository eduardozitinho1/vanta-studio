import { useEffect, useState, type ImgHTMLAttributes } from 'react';
import { cx } from '@/lib/format';

type Ratio = 'portrait' | 'square' | 'landscape' | 'wide' | 'fill';

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src: string;
  alt: string;
  ratio?: Ratio;
}

const ratios: Record<Ratio, string> = {
  portrait: 'aspect-[4/5]',
  square: 'aspect-square',
  landscape: 'aspect-[4/3]',
  wide: 'aspect-[16/9]',
  fill: 'h-full w-full',
};

export function Img({ src, alt, ratio = 'portrait', className, ...rest }: Props) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => { setStatus('loading'); }, [src]);

  return (
    <div className={cx(
      'relative overflow-hidden bg-bone',
      ratios[ratio],
      ratio === 'fill' && 'absolute inset-0',
    )}>
      {status === 'loading' && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="h-full w-full animate-shimmer bg-gradient-to-r from-bone via-line to-bone" />
        </div>
      )}
      {status === 'error' ? (
        <div className="absolute inset-0 grid place-items-center bg-bone px-4 text-center">
          <span className="text-[10px] uppercase tracking-ultra text-ash">{alt}</span>
        </div>
      ) : (
        <img
          src={src} alt={alt} loading="lazy" decoding="async"
          onLoad={() => setStatus('ready')}
          onError={() => setStatus('error')}
          className={cx(
            'h-full w-full object-cover transition-opacity duration-700',
            status === 'ready' ? 'opacity-100' : 'opacity-0',
            className,
          )}
          {...rest}
        />
      )}
    </div>
  );
}
