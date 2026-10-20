import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { featureCopy, projects } from "../data/site";
import { useParallax } from "../hooks/useParallax";
import { useCart } from "../hooks/useCart";
/* Client drop, 2026-10-16 — a straight webp conversion of
   `latest-images/featured-img.png`, which stays untouched as the source of
   truth (same convention as `new/` -> `products/`). It is **portrait 2:3 in a
   landscape slot**, so it is framed by `object-fit: cover` plus a tuned
   `object-position`; nothing is baked into the file. */
import featurePhoto from "../assets/feature/featured-lot.webp";

/* The featured-lot band, mounted under `ProductSpotlight`.

   See `featureCopy` in `data/site.ts` for the reference this is built to and
   the two things in it — a benefit headline and consumer-supplement chips —
   that could not ship. Everything shoppable here is read from `projects`:
   the price, the specs behind the chips and the lot the stepper adds.

   `.feature__*` at the end of portfolio.css. */

const formatUsd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export function ProductFeature() {
  const root = useRef<HTMLElement | null>(null);
  /* The photograph drifts as the band passes — the about band's device. The
     entrance below owns `scale` on the same element and this owns `yPercent`,
     the usual disjoint-property rule. */
  useParallax<HTMLElement>("[data-parallax]", root);
  const { addItem, open: openCart } = useCart();
  const [qty, setQty] = useState(1);

  const product =
    projects.find((p) => p.id === featureCopy.productId) ?? projects[0];

  const spec = (label: string) =>
    product.specs.find((s) => s.label === label)?.value;

  /* The reference's three pills. Derived, never typed — a lot without an
     analysis simply shows two chips rather than an invented third. */
  const chips = [
    spec("Form"),
    spec("Total content"),
    product.labAnalysis
      ? `${product.labAnalysis.purity} verified`
      : undefined,
  ].filter(Boolean) as string[];

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 74%", once: true },
      });

      /* The photograph wipes in from its own edge while the panel's copy
         rises — `clipPath` on one side, `y` on the other, so the two tweens
         never contend for the same property. */
      tl.from(".feature__media", {
        clipPath: "inset(0% 100% 0% 0%)",
        duration: 0.9,
        ease: "power3.out",
      })
        .from(
          ".feature__photo",
          { scale: 1.18, duration: 1.1, ease: "power3.out" },
          "<",
        )
        .from(
          ".feature__panel > *",
          {
            y: 26,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.08,
          },
          "-=0.6",
        );
    });

    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  const handleAdd = () => {
    addItem(product.id, qty);
    openCart();
  };

  return (
    <section className="feature" ref={root} aria-labelledby="feature-title">
      <div className="feature__inner">
        <figure className="feature__media">
          <img
            className="feature__photo"
            data-parallax="far"
            src={featurePhoto}
            alt={featureCopy.photoAlt}
            width={1024}
            height={1536}
            loading="lazy"
            decoding="async"
          />
          {/* The featured lot's own packshot used to sit here as a small card.
              **Removed on request, 2026-10-16**, once the client photograph
              replaced the product-adjacent still — it put two different
              cartons in one band. The consequence is that the photograph now
              shows a carton this catalogue does not stock while the panel
              names and prices another; see `featureCopy` and `CLAUDE.md`. */}
        </figure>

        <div className="feature__panel">
          <p className="feature__eyebrow">{featureCopy.eyebrow}</p>

          <h2 className="feature__title" id="feature-title">
            {featureCopy.lines.map((line) => (
              <span className="feature__line" key={line}>
                {line}
              </span>
            ))}
          </h2>

          {/* The lot's own summary — the band must not describe it twice. */}
          <p className="feature__lead">{product.summary}</p>

          <ul className="feature__chips">
            {chips.map((chip) => (
              <li className="feature__chip" key={chip}>
                {chip}
              </li>
            ))}
          </ul>

          <p className="feature__price">
            <span className="sr-only">{product.title} — </span>
            {formatUsd(product.price)}
          </p>

          <div className="feature__buy">
            <div className="feature__qty" role="group" aria-label={featureCopy.qtyLabel}>
              <button
                type="button"
                className="feature__step"
                onClick={() => setQty((n) => Math.max(1, n - 1))}
                disabled={qty <= 1}
                aria-label="Decrease quantity"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  <path d="M6 12h12" />
                </svg>
              </button>
              <span className="feature__qty-value" aria-live="polite">
                {qty}
              </span>
              <button
                type="button"
                className="feature__step"
                onClick={() => setQty((n) => Math.min(99, n + 1))}
                disabled={qty >= 99}
                aria-label="Increase quantity"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  <path d="M12 6v12M6 12h12" />
                </svg>
              </button>
            </div>

            <button type="button" className="feature__add" onClick={handleAdd} data-cursor>
              {featureCopy.cta}
              <span className="feature__add-icon" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M6 7h12l-1 12H7L6 7Z" />
                  <path d="M9 7a3 3 0 0 1 6 0" />
                </svg>
              </span>
            </button>
          </div>

          <a className="feature__spec" href={`#/product/${product.id}`}>
            {featureCopy.specLink}
          </a>

          {/* Every shoppable surface on this site carries it. */}
          <p className="feature__note">{product.safetyProtocol}</p>
        </div>
      </div>
    </section>
  );
}
