import { useState } from "react";
import { projects } from "../data/site";
import { useCart } from "../hooks/useCart";
import { parse, useRouter } from "../hooks/useRouter";

const formatUsd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);

/* The lot this band features. First entry in `projects` — swap the id, not the
   markup, if a different one should lead. */
const FEATURED_ID = "p1";

/* Pack sizes are **quantities**, not SKUs. Each one is literally n x the unit
   price, so the totals below are arithmetic on real catalogue data. */
const PACKS = [1, 3, 5] as const;

/* The offer band, built to a supplement-site reference.
   See `.offer__*` in portfolio.css.

   **What the reference does that this cannot.** Its right column sells two
   tiers — "Subscribe & Save" against "One-time Purchase" — with a 48% OFF
   badge and struck-through was-prices on both. None of that exists here:
   there is no subscription system, no multi-pack SKUs and no discount pricing
   anywhere in `projects`. Inventing a crossed-out price or a saving is
   fabricating commercial data, so this band has one real purchase mode, one
   real unit price, and totals computed from it.

   The dark badge carries the lot's **published purity** instead of a fake
   discount — a real number doing the job the reference gives to "48% OFF". */
export function ProductOffer() {
  const { addItem } = useCart();
  const { navigate } = useRouter();
  const [qty, setQty] = useState<number>(3);

  const product =
    projects.find((p) => p.id === FEATURED_ID) ?? projects[0];
  const lab = "labAnalysis" in product ? product.labAnalysis : undefined;
  const spec = (label: string) =>
    product.specs.find((s) => s.label === label)?.value;

  const checkout = () => {
    addItem(product.id, qty);
    /* Straight to the real checkout route, as the reference's CTA implies.
       Through the router rather than by writing `location.hash` — the hash
       router owns that, and assigning it directly also trips the lint rule
       against mutating globals from a component. The cart is the source of
       truth; nothing about the order is passed through this component. */
    navigate(parse("#/checkout"));
  };

  return (
    <section className="offer">
      <div className="offer__inner">
        <figure className="offer__media">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            decoding="async"
          />
          {lab && (
            <figcaption className="offer__badge">
              <strong>{lab.purity}</strong>
              <span>Verified</span>
            </figcaption>
          )}
        </figure>

        <div className="offer__buy">
          <p className="offer__tag">Sealed · Cold-packed · Documented</p>

          <div className="offer__price-card">
            <p className="offer__price-label">
              {qty}-Pack · {product.title}
            </p>
            <p className="offer__price">
              {formatUsd(product.price)}
              <span>each</span>
            </p>
            <p className="offer__total">
              Total: <strong>{formatUsd(product.price * qty)}</strong>
            </p>
          </div>

          <div className="offer__specs">
            {spec("Form") && <span>{spec("Form")}</span>}
            {spec("Total content") && <span>{spec("Total content")}</span>}
          </div>

          {/* A real quantity control, not a variant picker — the catalogue has
              one SKU per lot. */}
          <div
            className="offer__packs"
            role="group"
            aria-label={`Quantity of ${product.title}`}
          >
            {PACKS.map((n) => (
              <button
                key={n}
                type="button"
                className={
                  n === qty ? "offer__pack offer__pack--on" : "offer__pack"
                }
                aria-pressed={n === qty}
                onClick={() => setQty(n)}
                data-cursor
              >
                {n}-Pack
              </button>
            ))}
          </div>

          <button
            type="button"
            className="offer__cta"
            onClick={checkout}
            data-cursor
          >
            Checkout now
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path d="M5 12h13M12 6l6 6-6 6" />
            </svg>
          </button>

          <p className="offer__note">
            Supplied strictly for laboratory research. Not for human or
            veterinary use.
          </p>
        </div>
      </div>
    </section>
  );
}
