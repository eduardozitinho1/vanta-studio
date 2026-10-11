import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cx } from '@/lib/format';

type Variant = 'primary' | 'outline' | 'ghost' | 'danger' | 'paper';
type Size = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  full?: boolean;
}

const base =
  'inline-flex items-center justify-center gap-2 font-medium uppercase tracking-wide2 ' +
  'transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'focus-visible:ring-ink focus-visible:ring-offset-paper';

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-paper hover:bg-ink-700',
  paper:   'bg-paper text-ink hover:bg-bone',
  outline: 'border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper',
  ghost:   'text-ink hover:bg-ink/5',
  danger:  'bg-red-700 text-white hover:bg-red-800 focus-visible:ring-red-700',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-[11px]',
  md: 'h-11 px-6 text-xs',
  lg: 'h-14 px-10 text-xs',
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', size = 'md', full, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(base, variants[variant], sizes[size], full && 'w-full', className)}
      {...rest}
    />
  );
});
