import {
  forwardRef, useId,
  type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '@/lib/format';

interface BaseFieldProps {
  label: string;
  error?: string;
  hint?: string;
}

const fieldCls =
  'w-full border bg-paper px-3.5 py-3 text-sm text-ink placeholder:text-smoke ' +
  'transition-colors focus:outline-none focus:border-ink disabled:opacity-50';

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseFieldProps {}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className, id, ...rest }, ref,
) {
  const auto = useId();
  const fieldId = id ?? auto;
  const describedBy = error ? `${fieldId}-err` : hint ? `${fieldId}-hint` : undefined;
  return (
    <div className="w-full">
      <label htmlFor={fieldId} className="mb-1.5 block text-[11px] uppercase tracking-wide2 text-ash">
        {label}
      </label>
      <input
        ref={ref} id={fieldId}
        aria-invalid={Boolean(error)} aria-describedby={describedBy}
        className={cx(fieldCls, error ? 'border-red-500' : 'border-line', className)}
        {...rest}
      />
      {hint && !error && <p id={`${fieldId}-hint`} className="mt-1 text-xs text-ash">{hint}</p>}
      {error && <p id={`${fieldId}-err`} className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
});

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseFieldProps {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, className, id, ...rest }, ref,
) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <div className="w-full">
      <label htmlFor={fieldId} className="mb-1.5 block text-[11px] uppercase tracking-wide2 text-ash">
        {label}
      </label>
      <textarea
        ref={ref} id={fieldId}
        aria-invalid={Boolean(error)}
        className={cx(fieldCls, 'min-h-[120px] resize-y',
          error ? 'border-red-500' : 'border-line', className)}
        {...rest}
      />
      {hint && !error && <p className="mt-1 text-xs text-ash">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
});

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, BaseFieldProps {
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, className, id, children, ...rest }, ref,
) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <div className="w-full">
      <label htmlFor={fieldId} className="mb-1.5 block text-[11px] uppercase tracking-wide2 text-ash">
        {label}
      </label>
      <select
        ref={ref} id={fieldId}
        aria-invalid={Boolean(error)}
        className={cx(fieldCls, 'appearance-none',
          error ? 'border-red-500' : 'border-line', className)}
        {...rest}
      >
        {children}
      </select>
      {hint && !error && <p className="mt-1 text-xs text-ash">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
});
