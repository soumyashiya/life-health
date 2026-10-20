import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { projects, rangeCopy } from "../data/site";
import { useCart } from "../hooks/useCart";
import { useReveal } from "../hooks/useReveal";

const formatUsd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

/* Hidden from this band on request (2026-10-15). `p3` is BPC-157 & TB-500.
   It is only hidden **here** — still in `projects`, still routable at
   `#/product/p3`, still on `#/shop` and still referenced by three
   `researchAreas.productIds`. Deleting the entry would strand the id in any
   saved cart in `liora.cart.v1`. */
const HIDDEN_IDS = new Set(["p3"]);

/* "Pre-filled research pen · 20 mg total" — the shelf line, not the receptor
   pharmacology in `summary`. */
const shelfLine = (p: (typeof projects)[number]) => {
  const spec = (label: string) => p.specs.find((s) => s.label === label)?.value;
  return [spec("Form"), spec("Total content")].filter(Boolean).join(" · ");
};

/* The home product band, mounted under the hero. **Rebuilt 2026-10-16 to a
   best-sellers reference**: a white band, the title on the left with a pair of
   circular pagers on the right, and a 4-up scroll-snapped rail of cards whose
   sand media tile reveals an Add to cart pill on hover.

   It replaced a continuous marquee on a burgundy backdrop — so the list is
   rendered **once** now, and `assets/range/backdrop.webp` is no longer
   imported (kept on disk).

   Two things the reference does that this catalogue cannot:
   - its cards carry a star rating and a review count. **There is no review
     data here**, and inventing it is the same fabrication the site's rules
     exclude everywhere else. That line carries the lot's real shelf spec
     instead, and the only figure on a card is a published purity.
   - its tiles are filled with photographs of people holding the product.
     Staging those would read as endorsement the site cannot evidence, so the
     tiles carry the packshots.

   Carries `id="work"` because the `Catalogue` band it replaced did. */
export function ProductRange() {
  const { addItem, open: openCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);
  const [scrollable, setScrollable] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const railRef = useRef<HTMLDivElement | null>(null);
  const revealRef = useReveal<HTMLElement>();

  const items = projects.filter((p) => !HIDDEN_IDS.has(p.id));

  /* The pagers only appear when the rail actually overflows, and each one
     greys out at its end of the travel — a control that does nothing is worse
     than no control. ResizeObserver fires on observe, so the first measure
     comes from it rather than a separate layout effect. */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const measure = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      setScrollable(max > 4);
      setAtStart(rail.scrollLeft <= 4);
      setAtEnd(rail.scrollLeft >= max - 4);
    };

    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    rail.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      rail.removeEventListener("scroll", measure);
    };
  }, []);

  /* One card per press — the rail is scroll-snapped, so the browser settles it */
  const page = (dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>(".range__card");
    const step = card ? card.offsetWidth + 24 : rail.clientWidth * 0.8;
    rail.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const add = (id: string) => {
    addItem(id, 1);
    setAddedId(id);
    openCart();
    window.setTimeout(
      () => setAddedId((current) => (current === id ? null : current)),
      1400,
    );
  };

  return (
    <section id="work" className="range" ref={revealRef}>
      <div className="range__inner">
        <div className="range__head">
          <div className="range__head-copy">
            <h2 className="range__title" data-anim="lines">
              {rangeCopy.title}
            </h2>
            <p className="range__lead" data-anim="up" data-anim-delay="0.25">
              {rangeCopy.lead}
            </p>
          </div>

          {scrollable && (
            <div className="range__pagers">
              <button
                type="button"
                className="range__pager"
                onClick={() => page(-1)}
                disabled={atStart}
                aria-label="Previous products"
                data-cursor
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  <path d="M19 12H6M12 6l-6 6 6 6" />
                </svg>
              </button>
              <button
                type="button"
                className="range__pager range__pager--on"
                onClick={() => page(1)}
                disabled={atEnd}
                aria-label="More products"
                data-cursor
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  <path d="M5 12h13M12 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* **No `data-lenis-prevent` here** (removed 2026-10-20). It tells
            Lenis to ignore the wheel for everything inside the element, and
            this rail scrolls on the **x axis only** — so over the cards, which
            fill most of the band, the page stopped scrolling vertically and
            the section read as stuck. Lenis is configured
            `gestureOrientation: "vertical"`, so horizontal wheel and trackpad
            gestures pass straight through to the rail anyway, and touch is
            native. The attribute belongs on genuinely vertical inner-scroll
            regions — `.report__scan-frame` on the Science page is the real
            case. */}
        <div className="range__rail" ref={railRef}>
          {items.map((p, i) => {
            /* Only some lots carry an analysis, and the figure shown is the
               real published one — never rounded, never invented. */
            const lab = "labAnalysis" in p ? p.labAnalysis : undefined;
            const added = addedId === p.id;

            return (
              /* The cards stagger at 0.08s, not the reference's 0.25 — five
                 cards at its step would hold the last price back 1.25s, and
                 this is the band the shop converts on. */
              <article
                className="range__card"
                key={p.id}
                data-anim="up"
                data-anim-delay={(i * 0.08).toFixed(2)}
              >
                <div className="range__media">
                  <a
                    className="range__media-link"
                    href={`#/product/${p.id}`}
                    data-cursor
                    data-cursor-text="View"
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      decoding="async"
                    />
                  </a>

                  {lab && (
                    <span className="range__purity">
                      <strong>{lab.purity}</strong>
                      <span>Verified</span>
                    </span>
                  )}

                </div>

                <div className="range__body">
                  {/* The reference's rating row. No review data exists here, so
                      this is the lot's real shelf spec instead. */}
                  <p className="range__spec">{shelfLine(p)}</p>
                  {/* Name and price on the left, the add button opposite them —
                      always visible, not a hover reveal (2026-10-19, requested). */}
                  <div className="range__row">
                    <div className="range__meta">
                      <a className="range__name" href={`#/product/${p.id}`} data-cursor>
                        {p.title}
                      </a>
                      <span className="range__price">{formatUsd(p.price)}</span>
                    </div>
                    <button
                      type="button"
                      className={clsx("range__add", added && "is-added")}
                      onClick={() => add(p.id)}
                      aria-label={`Add ${p.title} to cart`}
                      data-cursor
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                        <path d="M6 8h12l-1 11H7L6 8Z" />
                        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                      </svg>
                      <span>{added ? "Added" : "Add"}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="range__foot">
          <a className="range__all" href={rangeCopy.shopAll.href} data-cursor>
            {rangeCopy.shopAll.label}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path d="M5 12h13M12 6l6 6-6 6" />
            </svg>
          </a>
          <p className="range__note">{rangeCopy.note}</p>
        </div>
      </div>
    </section>
  );
}
