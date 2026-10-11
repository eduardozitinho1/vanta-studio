import { describe, it, expect } from 'vitest';
import { checkoutSchema, productSchema } from '@/lib/validation';

const validCheckout = {
  name: 'Ana Silva', email: 'ana@example.com', phone: '(11) 91234-5678',
  cep: '01310-100', street: 'Av. Paulista', number: '1000',
  complement: '', city: 'São Paulo', state: 'SP', paymentMethod: 'pix' as const,
};

describe('checkoutSchema', () => {
  it('accepts valid input', () => {
    expect(checkoutSchema.safeParse(validCheckout).success).toBe(true);
  });
  it('rejects invalid CEP', () => {
    const r = checkoutSchema.safeParse({ ...validCheckout, cep: 'abc' });
    expect(r.success).toBe(false);
  });
  it('rejects invalid UF', () => {
    const r = checkoutSchema.safeParse({ ...validCheckout, state: 'XYZ' });
    expect(r.success).toBe(false);
  });
  it('uppercases state', () => {
    const r = checkoutSchema.safeParse({ ...validCheckout, state: 'sp' });
    expect(r.success && r.data.state).toBe('SP');
  });
});

describe('productSchema', () => {
  it('requires at least one image', () => {
    const r = productSchema.safeParse({
      name: 'X', slug: 'x', description: 'descrição longa aqui', price: 100,
      category: 'shirts', stock: 1, sizes: ['M'], images: [], featured: false,
    });
    expect(r.success).toBe(false);
  });
});
