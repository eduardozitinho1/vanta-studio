import { describe, it, expect } from 'vitest';
import { cartReducer, cartSubtotal, cartCount, shippingFor } from '@/lib/cart';
import type { CartLine } from '@/types';

const line = (id: string, price: number, qty = 1, size = 'M' as const): CartLine => ({
  productId: id, slug: id, name: id, price, image: '', size, quantity: qty,
});

describe('cartReducer', () => {
  it('adds new line', () => {
    const s = cartReducer({ lines: [] }, { type: 'add', line: line('a', 100) });
    expect(s.lines).toHaveLength(1);
    expect(s.lines[0]?.quantity).toBe(1);
  });

  it('merges duplicates by product+size', () => {
    let s = { lines: [line('a', 100)] };
    s = cartReducer(s, { type: 'add', line: line('a', 100, 2) });
    expect(s.lines[0]?.quantity).toBe(3);
  });

  it('treats different sizes as different lines', () => {
    let s = { lines: [line('a', 100, 1, 'M')] };
    s = cartReducer(s, { type: 'add', line: line('a', 100, 1, 'L') });
    expect(s.lines).toHaveLength(2);
  });

  it('removes line when qty set to 0', () => {
    const s = cartReducer({ lines: [line('a', 100, 3)] }, {
      type: 'setQty', productId: 'a', size: 'M', quantity: 0,
    });
    expect(s.lines).toHaveLength(0);
  });
});

describe('subtotal / count / shipping', () => {
  it('computes subtotal', () => {
    expect(cartSubtotal([line('a', 100, 2), line('b', 50, 1)])).toBe(250);
  });
  it('counts items', () => {
    expect(cartCount([line('a', 100, 2), line('b', 50, 3)])).toBe(5);
  });
  it('free shipping above threshold', () => {
    expect(shippingFor(800)).toBe(0);
    expect(shippingFor(799.99)).toBe(29.9);
  });
});
