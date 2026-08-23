'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  CartLine,
  Money,
  Product,
  ResolvedCartLine,
} from '@/lib/shop/types';

/* ── Cart ─────────────────────────────────────────────────────────────────────
   Lines live in localStorage and hold nothing but a variant id and a quantity.
   Titles, images and prices are re-joined against the catalogue on every
   render, so a price change in Shopify can never be masked by a stale cart
   the customer left open last week.
──────────────────────────────────────────────────────────────────────────── */

const STORAGE_KEY = 'illusia.cart.v1';

type CartContextValue = {
  lines: ResolvedCartLine[];
  count: number;
  subtotal: Money;
  /** Raw lines, for handing to the checkout server action. */
  rawLines: CartLine[];
  add: (variantId: string, quantity?: number) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}

function readStorage(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is CartLine =>
        typeof l === 'object' &&
        l !== null &&
        typeof (l as CartLine).variantId === 'string' &&
        typeof (l as CartLine).quantity === 'number'
    );
  } catch {
    // Corrupt or unavailable storage (private mode, quota) — start empty
    // rather than take the whole shop down.
    return [];
  }
}

export function CartProvider({
  products,
  children,
}: {
  /** The full curated catalogue, so lines can be resolved without a fetch. */
  products: Product[];
  children: ReactNode;
}) {
  const [rawLines, setRawLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Hydrate after mount, never during render: the server has no localStorage,
  // and seeding state from it directly would mismatch on hydration.
  useEffect(() => {
    setRawLines(readStorage());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rawLines));
    } catch {
      /* storage full or blocked — the in-memory cart still works */
    }
  }, [rawLines]);

  const variantIndex = useMemo(() => {
    const map = new Map<string, { product: Product; variantIdx: number }>();
    for (const product of products) {
      product.variants.forEach((variant, variantIdx) => {
        map.set(variant.id, { product, variantIdx });
      });
    }
    return map;
  }, [products]);

  /* Lines whose variant has vanished from the catalogue are dropped rather
     than rendered blank — a product pulled from the collection should leave
     no ghost in anyone's bag. */
  const lines = useMemo<ResolvedCartLine[]>(() => {
    const resolved: ResolvedCartLine[] = [];
    for (const line of rawLines) {
      const hit = variantIndex.get(line.variantId);
      if (!hit) continue;
      const variant = hit.product.variants[hit.variantIdx];
      resolved.push({
        line,
        product: hit.product,
        variant,
        lineTotal: {
          amount: variant.price.amount * line.quantity,
          currencyCode: variant.price.currencyCode,
        },
      });
    }
    return resolved;
  }, [rawLines, variantIndex]);

  const count = useMemo(
    () => lines.reduce((n, l) => n + l.line.quantity, 0),
    [lines]
  );

  const subtotal = useMemo<Money>(
    () => ({
      amount: lines.reduce((sum, l) => sum + l.lineTotal.amount, 0),
      currencyCode: lines[0]?.lineTotal.currencyCode ?? 'USD',
    }),
    [lines]
  );

  const add = useCallback((variantId: string, quantity = 1) => {
    setRawLines((prev) => {
      const existing = prev.find((l) => l.variantId === variantId);
      if (!existing) return [...prev, { variantId, quantity }];
      return prev.map((l) =>
        l.variantId === variantId
          ? { ...l, quantity: l.quantity + quantity }
          : l
      );
    });
    setIsOpen(true);
  }, []);

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    setRawLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.variantId !== variantId)
        : prev.map((l) => (l.variantId === variantId ? { ...l, quantity } : l))
    );
  }, []);

  const remove = useCallback((variantId: string) => {
    setRawLines((prev) => prev.filter((l) => l.variantId !== variantId));
  }, []);

  const clear = useCallback(() => setRawLines([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count,
      subtotal,
      // Only lines that still resolve are offered to checkout, so Shopify is
      // never handed a variant id the catalogue has already dropped.
      rawLines: lines.map((l) => l.line),
      add,
      setQuantity,
      remove,
      clear,
      isOpen,
      open,
      close,
    }),
    [lines, count, subtotal, add, setQuantity, remove, clear, isOpen, open, close]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
