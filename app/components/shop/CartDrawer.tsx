'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { useCart } from './CartProvider';
import { startCheckout } from '@/app/shop/actions';
import { formatMoney, imageUrl } from '@/lib/shop/format';

/* ── Bag drawer ───────────────────────────────────────────────────────────────
   Slides in from the right over the storefront. Checkout is the one place the
   customer leaves illusiaagency.com — Shopify hosts the payment page on every
   plan below Plus — so the handoff is stated plainly rather than hidden.
──────────────────────────────────────────────────────────────────────────── */

export default function CartDrawer() {
  const { lines, count, subtotal, rawLines, setQuantity, remove, isOpen, close } =
    useCart();
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState<string | null>(null);

  // Escape closes; the page behind is frozen so the drawer does not scroll the
  // storefront away underneath itself.
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, close]);

  useEffect(() => {
    if (isOpen) setNotice(null);
  }, [isOpen]);

  const checkout = () => {
    startTransition(async () => {
      const result = await startCheckout(rawLines);
      if (result.ok) {
        window.location.href = result.url;
      } else {
        setNotice(result.message);
      }
    });
  };

  return (
    <>
      <div
        className="bag-scrim"
        data-open={isOpen || undefined}
        onClick={close}
        aria-hidden
      />

      <aside
        className="bag"
        data-open={isOpen || undefined}
        aria-label="Shopping bag"
        aria-hidden={!isOpen}
      >
        <header className="bag-head">
          <h2>
            Bag <span>({count})</span>
          </h2>
          <button onClick={close} aria-label="Close bag">
            Close
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="bag-empty">
            <p>Your bag is empty.</p>
            <Link href="/shop" onClick={close}>
              Browse the collection ↗
            </Link>
          </div>
        ) : (
          <ul className="bag-lines">
            {lines.map(({ line, product, variant, lineTotal }) => (
              <li key={line.variantId}>
                <Link
                  href={`/shop/${product.handle}`}
                  onClick={close}
                  className="bag-thumb"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl(product.images[0]?.url ?? '', 240)}
                    alt={product.images[0]?.altText ?? product.title}
                  />
                </Link>

                <div className="bag-info">
                  <Link
                    href={`/shop/${product.handle}`}
                    onClick={close}
                    className="bag-title"
                  >
                    {product.title}
                  </Link>
                  <p className="bag-variant">{variant.title}</p>

                  <div className="bag-qty">
                    <button
                      onClick={() => setQuantity(line.variantId, line.quantity - 1)}
                      aria-label={`Decrease quantity of ${product.title}`}
                    >
                      –
                    </button>
                    <span>{line.quantity}</span>
                    <button
                      onClick={() => setQuantity(line.variantId, line.quantity + 1)}
                      aria-label={`Increase quantity of ${product.title}`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="bag-line-right">
                  <span>{formatMoney(lineTotal)}</span>
                  <button
                    onClick={() => remove(line.variantId)}
                    className="bag-remove"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <footer className="bag-foot">
          <div className="bag-subtotal">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <p className="bag-note">
            Shipping and taxes calculated at checkout.
          </p>

          {notice && <p className="bag-notice">{notice}</p>}

          <button
            className="bag-checkout"
            onClick={checkout}
            disabled={pending || lines.length === 0}
          >
            {pending ? 'Opening checkout…' : 'Checkout'}
          </button>
        </footer>
      </aside>

      <style>{`
        .bag-scrim {
          position: fixed;
          inset: 0;
          z-index: 90;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.35s ease;
        }
        .bag-scrim[data-open] { opacity: 1; pointer-events: all; }

        .bag {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          z-index: 91;
          width: min(430px, 100vw);
          display: flex;
          flex-direction: column;
          background: #0a0a0a;
          border-left: 1px solid rgba(255,255,255,0.1);
          transform: translateX(100%);
          transition: transform 0.42s cubic-bezier(0.25,0.46,0.45,0.94);
          /* Kept in the tree while closed so the slide animates both ways;
             visibility stops it swallowing taps or focus meanwhile. */
          visibility: hidden;
        }
        .bag[data-open] { transform: translateX(0); visibility: visible; }

        .bag-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.09);
          flex-shrink: 0;
        }
        .bag-head h2 {
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .bag-head h2 span { color: rgba(255,255,255,0.45); }
        .bag-head button {
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.55);
          font-family: inherit;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .bag-head button:hover { color: #fff; }

        .bag-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
        }
        .bag-empty p {
          color: rgba(255,255,255,0.45);
          font-size: 13px;
          letter-spacing: 0.04em;
        }
        .bag-empty a {
          color: #fff;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.35);
          padding-bottom: 3px;
        }

        .bag-lines {
          list-style: none;
          flex: 1;
          overflow-y: auto;
          padding: 6px 24px;
        }
        .bag-lines li {
          display: grid;
          grid-template-columns: 74px 1fr auto;
          gap: 14px;
          padding: 20px 0;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .bag-thumb {
          display: block;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          background: #141414;
        }
        .bag-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .bag-title {
          display: block;
          color: #fff;
          text-decoration: none;
          font-size: 12.5px;
          letter-spacing: 0.02em;
        }
        .bag-variant {
          margin-top: 4px;
          font-size: 11px;
          color: rgba(255,255,255,0.42);
        }
        .bag-qty {
          margin-top: 12px;
          display: inline-flex;
          align-items: center;
          border: 1px solid rgba(255,255,255,0.15);
        }
        .bag-qty button {
          background: none;
          border: none;
          cursor: pointer;
          color: #fff;
          width: 26px;
          height: 26px;
          font-size: 13px;
          line-height: 1;
          font-family: inherit;
        }
        .bag-qty button:hover { background: rgba(255,255,255,0.08); }
        .bag-qty span {
          min-width: 26px;
          text-align: center;
          font-size: 11.5px;
        }
        .bag-line-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-between;
          font-size: 12.5px;
        }
        .bag-remove {
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.35);
          font-family: inherit;
          font-size: 9.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 0;
        }
        .bag-remove:hover { color: rgba(255,255,255,0.8); }

        .bag-foot {
          flex-shrink: 0;
          padding: 20px 24px 26px;
          border-top: 1px solid rgba(255,255,255,0.09);
        }
        .bag-subtotal {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .bag-note {
          margin-top: 8px;
          font-size: 10.5px;
          color: rgba(255,255,255,0.38);
        }
        .bag-notice {
          margin-top: 12px;
          font-size: 11px;
          letter-spacing: 0.04em;
          color: #ffd9a0;
          border-left: 2px solid rgba(255,217,160,0.5);
          padding-left: 10px;
        }
        .bag-checkout {
          margin-top: 16px;
          width: 100%;
          background: #fff;
          color: #000;
          border: none;
          cursor: pointer;
          padding: 16px;
          font-family: inherit;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          transition: opacity 0.2s ease;
        }
        .bag-checkout:hover:not(:disabled) { opacity: 0.86; }
        .bag-checkout:disabled { opacity: 0.35; cursor: not-allowed; }
      `}</style>
    </>
  );
}
