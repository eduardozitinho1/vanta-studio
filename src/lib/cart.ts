import type { CartLine, Size } from '@/types';

export interface CartState { lines: CartLine[]; }

export type CartAction =
  | { type: 'add'; line: CartLine }
  | { type: 'remove'; productId: string; size: Size }
  | { type: 'setQty'; productId: string; size: Size; quantity: number }
  | { type: 'clear' }
  | { type: 'replace'; lines: CartLine[] };

const sameLine = (a: CartLine, productId: string, size: Size): boolean =>
  a.productId === productId && a.size === size;

export const MAX_QTY = 99;

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const existing = state.lines.find((l) =>
        sameLine(l, action.line.productId, action.line.size));
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            sameLine(l, action.line.productId, action.line.size)
              ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + action.line.quantity) }
              : l),
        };
      }
      return { lines: [...state.lines, { ...action.line }] };
    }
    case 'remove':
      return { lines: state.lines.filter((l) => !sameLine(l, action.productId, action.size)) };
    case 'setQty': {
      const q = Math.max(0, Math.min(MAX_QTY, Math.floor(action.quantity)));
      if (q === 0) {
        return { lines: state.lines.filter((l) => !sameLine(l, action.productId, action.size)) };
      }
      return {
        lines: state.lines.map((l) =>
          sameLine(l, action.productId, action.size) ? { ...l, quantity: q } : l),
      };
    }
    case 'clear':   return { lines: [] };
    case 'replace': return { lines: action.lines };
    default:        return state;
  }
}

export const cartSubtotal = (lines: CartLine[]): number =>
  Math.round(lines.reduce((s, l) => s + l.price * l.quantity, 0) * 100) / 100;

export const cartCount = (lines: CartLine[]): number =>
  lines.reduce((s, l) => s + l.quantity, 0);

export const DEMO_FREE_SHIPPING_THRESHOLD = 800;
export const DEMO_FLAT_SHIPPING = 29.9;

export const shippingFor = (subtotal: number): number =>
  subtotal >= DEMO_FREE_SHIPPING_THRESHOLD ? 0 : DEMO_FLAT_SHIPPING;

export const totalFor = (subtotal: number, shipping: number): number =>
  Math.round((subtotal + shipping) * 100) / 100;
