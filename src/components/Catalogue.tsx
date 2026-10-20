import { useEffect, useRef, useState } from "react";
import { catalogueCopy, projects } from "../data/site";
import {
  researchAreas,
  researchAreaProducts,
  type ResearchVisualKey,
} from "../data/research";
import { useCart } from "../hooks/useCart";

const formatUsd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

/* "Pre-filled research pen · 20 mg total" — reads as a product shelf line
   instead of the receptor pharmacology in `summary`. */
const productLine = (p: (typeof projects)[number]) => {
  const spec = (label: string) =>
    p.specs.find((s) => s.label === label)?.value;
  return [spec("Form"), spec("Total content")].filter(Boolean).join(" · ");
};

export function Catalogue() {
  const { addItem, open: openCart } = useCart();
  const [active, setActive] = useState<ResearchVisualKey>(researchAreas[0].id);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [scrollable, setScrollable] = useState(false);
  const railRef = useRef<HTMLDivElement | null>(null);

  /* An area with two lots fits on screen — don't offer arrows that do nothing.
     ResizeObserver fires on observe, so the first measure comes from it too. */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const observer = new ResizeObserver(() =>
      setScrollable(rail.scrollWidth > rail.clientWidth + 4),
    );
    observer.observe(rail);
    return () => observer.disconnect();
  }, [active]);

  const area = researchAreas.find((a) => a.id === active) ?? researchAreas[0];
  const items = researchAreaProducts(area);

  const handleQuickAdd = (id: string, title: string) => {
    addItem(id, 1);
    setAddedId(id);
    openCart();
    window.setTimeout(
      () => setAddedId((current) => (current === id ? null : current)),
      1200,
    );
    return title;
  };

  /* One card per press — the rail is scroll-snapped, so the browser settles it */
  const page = (dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>(".catalog__card");
    const step = card ? card.offsetWidth + 24 : rail.clientWidth * 0.8;
    rail.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section id="work" className="catalog">
      <div className="container catalog__inner">
        <h2 className="catalog__title">{catalogueCopy.title}</h2>
        <p className="catalog__lead">{catalogueCopy.lead}</p>

        <div className="catalog__tabs">
          <div className="catalog__tablist" role="group" aria-label="Research areas">
            {researchAreas.map((a) => (
              <button
                key={a.id}
                type="button"
                className={
                  a.id === active
                    ? "catalog__tab catalog__tab--on"
                    : "catalog__tab"
                }
                aria-pressed={a.id === active}
                onClick={() => setActive(a.id)}
                data-cursor
              >
                {/* Shop-style label: "Metabolic", not "Metabolic research" */}
                {a.titleLines[0]}
              </button>
            ))}
          </div>

          <a className="catalog__shop-all" href={catalogueCopy.shopAll.href} data-cursor>
            {catalogueCopy.shopAll.label}
          </a>
        </div>

        <div className="catalog__carousel">
          {/* Lenis swallows inner scroll without this */}
          {/* Same fix as `.range__rail` (2026-10-20): `data-lenis-prevent` on
              an x-axis-only rail kills vertical page scroll over the cards.
              This band is unmounted, but it would land the same bug the day it
              comes back. */}
          <div className="catalog__rail" ref={railRef}>
            {items.map((p) => {
              const lab = "labAnalysis" in p ? p.labAnalysis : undefined;
              return (
                <article className="catalog__card" key={p.id}>
                  <div className="catalog__media">
                    <a
                      href={`#/product/${p.id}`}
                      className="catalog__media-link"
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
                    <button
                      type="button"
                      className="catalog__quick"
                      onClick={() => handleQuickAdd(p.id, p.title)}
                      aria-label={`Add ${p.title} to cart`}
                      data-cursor
                    >
                      <span aria-hidden>{addedId === p.id ? "✓" : "+"}</span>
                    </button>
                  </div>

                  <div className="catalog__body">
                    {lab && <span className="catalog__flag">Lab verified</span>}
                    <a className="catalog__name" href={`#/product/${p.id}`} data-cursor>
                      {p.title}
                    </a>
                    {/* Shelf-style attributes, not the technical summary */}
                    <p className="catalog__desc">{productLine(p)}</p>
                    <div className="catalog__row">
                      <span className="catalog__price">{formatUsd(p.price)}</span>
                      <button
                        type="button"
                        className="catalog__add"
                        onClick={() => handleQuickAdd(p.id, p.title)}
                        data-cursor
                      >
                        {addedId === p.id ? "Added" : "Add to cart"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {scrollable && (
            <>
              <button
                type="button"
                className="catalog__arrow catalog__arrow--prev"
                onClick={() => page(-1)}
                aria-label="Previous products"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  <path d="M19 12H6M12 6l-6 6 6 6" />
                </svg>
              </button>
              <button
                type="button"
                className="catalog__arrow catalog__arrow--next"
                onClick={() => page(1)}
                aria-label="More products"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  <path d="M5 12h13M12 6l6 6-6 6" />
                </svg>
              </button>
            </>
          )}
        </div>

        <h3 className="catalog__tiles-title">{catalogueCopy.tilesTitle}</h3>
        <ul className="catalog__tiles">
          {researchAreas.map((a) => (
            <li key={a.id}>
              <a
                className="catalog__tile"
                href={`#/shop?research=${a.id}`}
                data-cursor
                data-cursor-text="Browse"
              >
                <img src={a.shopImage} alt="" loading="lazy" decoding="async" />
                <span className="catalog__tile-title">
                  {a.shopTitleLines[0]}
                  <br />
                  {a.shopTitleLines[1]}
                </span>
                <span className="catalog__tile-arrow" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 12h13M12 6l6 6-6 6" />
                  </svg>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="catalog__note">
          Supplied strictly for laboratory research. Not for human or veterinary use.
        </p>
      </div>
    </section>
  );
}
