import Link from 'next/link';

/* Storefront footer — the counterpart to the shop nav. Kept static (no client
   state) so it stays out of the browser bundle. */
export default function ShopFooter() {
  return (
    <>
      <footer className="shop-foot">
        <div className="shop-foot-top">
          <div className="shop-foot-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/illusia-logo.png" alt="Illusia" />
            <p>Only the ascended.</p>
          </div>

          <nav className="shop-foot-cols">
            <div>
              <p className="section-label">Shop</p>
              <Link href="/shop">All Products</Link>
              <Link href="/shop?c=new">New Arrivals</Link>
              <Link href="/shop?c=apparel">Apparel</Link>
              <Link href="/shop?c=headwear">Headwear</Link>
            </div>
            <div>
              <p className="section-label">Agency</p>
              <Link href="/">Home</Link>
              <Link href="/#work">Work</Link>
              <Link href="/#services">Services</Link>
              <Link href="/#team">Team</Link>
            </div>
            <div>
              <p className="section-label">Help</p>
              <a href="mailto:parker@illusiaagency.com?subject=Shop%20Enquiry">
                Contact
              </a>
              <a href="mailto:parker@illusiaagency.com?subject=Order%20Support">
                Order Support
              </a>
            </div>
          </nav>
        </div>

        <div className="shop-foot-bottom">
          <span>© {new Date().getFullYear()} Illusia Agency</span>
          <span>Printed &amp; shipped on demand</span>
        </div>
      </footer>

      <style>{`
        .shop-foot {
          border-top: 1px solid rgba(255,255,255,0.09);
          padding: 56px 32px 28px;
        }
        .shop-foot-top {
          display: flex;
          justify-content: space-between;
          gap: 48px;
          flex-wrap: wrap;
        }
        .shop-foot-brand img { height: 28px; width: auto; }
        .shop-foot-brand p {
          margin-top: 14px;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }
        .shop-foot-cols {
          display: flex;
          gap: 62px;
          flex-wrap: wrap;
        }
        .shop-foot-cols > div {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .shop-foot-cols .section-label { margin-bottom: 4px; }
        .shop-foot-cols a {
          color: rgba(255,255,255,0.62);
          text-decoration: none;
          font-size: 12px;
        }
        .shop-foot-cols a:hover { color: #fff; }

        .shop-foot-bottom {
          margin-top: 52px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.07);
          display: flex;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.32);
        }

        @media (max-width: 640px) {
          .shop-foot { padding: 42px 16px 24px; }
          .shop-foot-cols { gap: 34px; }
        }
      `}</style>
    </>
  );
}
