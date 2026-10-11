import { useState, type ReactNode } from 'react';
import { Plus, Minus } from 'lucide-react';

interface Item { title: string; content: ReactNode; }

export function Accordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-4 text-left text-xs uppercase tracking-wide2 text-ink transition hover:text-ink/70"
            >
              <span>{it.title}</span>
              {isOpen ? <Minus size={14} /> : <Plus size={14} />}
            </button>
            {isOpen && (
              <div className="pb-5 text-sm leading-relaxed text-ash">{it.content}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
