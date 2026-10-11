import {
  createContext, useCallback, useContext, useEffect, useMemo, useReducer,
  type ReactNode,
} from 'react';
import type { CartLine, Product, Size } from '@/types';
import {
  cartCount, cartReducer, cartSubtotal, shippingFor, totalFor,
} from '@/lib/cart';
import { storage } from '@/lib/storage';

interface CartCtx {
  lines: CartLine[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  add: (product: Product, size: Size, quantity?: number) => void;
  remove: (productId: string, size: Size) => void;
  setQty: (productId: string, size: Size, quantity: number) => void;
  clear: () => void;
  replace: (lines: CartLine[]) => void;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = 'cart:lines';

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { lines: [] });

  useEffect(() => {
    const saved = storage.get<CartLine[]>(KEY, []);
    if (saved.length) dispatch({ type: 'replace', lines: saved });
  }, []);

  useEffect(() => { storage.set(KEY, state.lines); }, [state.lines]);

  const add = useCallback((product: Product, size: Size, quantity = 1) => {
    dispatch({
      type: 'add',
      line: {
        productId: product.id, slug: product.slug, name: product.name,
        price: product.price, image: product.images[0] ?? '', size, quantity,
      },
    });
  }, []);

  const remove = useCallback((productId: string, size: Size) =>
    dispatch({ type: 'remove', productId, size }), []);

  const setQty = useCallback((productId: string, size: Size, quantity: number) =>
    dispatch({ type: 'setQty', productId, size, quantity }), []);

  const clear = useCallback(() => dispatch({ type: 'clear' }), []);
  const replace = useCallback(
    (lines: CartLine[]) => dispatch({ type: 'replace', lines }), []);

  const subtotal = cartSubtotal(state.lines);
  const shipping = shippingFor(subtotal);
  const total = totalFor(subtotal, shipping);

  const value = useMemo<CartCtx>(() => ({
    lines: state.lines, count: cartCount(state.lines),
    subtotal, shipping, total, add, remove, setQty, clear, replace,
  }), [state.lines, subtotal, shipping, total, add, remove, setQty, clear, replace]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
