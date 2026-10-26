import { useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import {
  benchCopy,
  bestsellerIds,
  projects,
  rangeCopy,
  shelfLines,
} from "../data/site";
import { useCart } from "../hooks/useCart";
import { useReveal } from "../hooks/useReveal";

const formatUsd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

/* The card price is a round catalogue figure and reads better without cents;
   a **saving** is not — 15% of $350 is $52.50, and rounding it to $53 would
   overstate by half a dollar on a live storefront. Exact, always. */
const formatUsdExact = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

/* Hidden from this band on request (2026-10-15). `p3` is BPC-157 & TB-500.
   It is only hidden **here** — still in `projects`, still routable at
   `#/product/p3`, still on `#/shop` and still referenced by three
   `researchAreas.productIds`. Deleting the entry would strand the id in any
   saved cart in `liora.cart.v1`. */
const HIDDEN_IDS = new Set(["p3"]);

const ICONS: Record<string, ReactNode> = {
  lab: <path d="M9.5 3h5M10.5 3v5.5L5.2 18.4A1.8 1.8 0 0 0 6.8 21h10.4a1.8 1.8 0 0 0 1.6-2.6L13.5 8.5V3M8 15h8" />,
  doc: <path d="M7 3h7l4 4v14H7V3Zm7 0v4h4M10 12h5M10 16h5" />,
  cold: <path d="M12 2v20M4 6l16 12M20 6 4 18M9 3.5l3 2.5 3-2.5M9 20.5l3-2.5 3 2.5" />,
};

const spec = (p: (typeof projects)[number], label: string) =>
  p.specs.find((s) => s.label === label)?.value;

/* The home shop band, rebuilt 2026-10-20 to a client reference: an eyebrow
   pill, title and lead with three trust marks opposite, a 3-up carousel of
   rounded product cards with arrows either side, page dots under it, then the
   shop-all link and the research-use-only line.

   ⚠ **It is products only as of 2026-10-26.** It used to close on a row of
   four category tiles — it had absorbed the `ShopCategories` band when that
   was unmounted — but `ShopCategories` was remounted on 10-21 directly above
   this band, so the same four `researchAreas` were being rendered twice from
   the same fields. The row was removed on request; see the note where it sat.

   What the reference does that this catalogue cannot, and what took its place:
   - **star ratings and review counts** — there is no review data here. The
     card's foot carries the lot's batch number instead.
   - **"Bestseller / Trending / New" badges** — sales claims with no data
     behind them. The badge is the lot's real published purity, or nothing.
   - **a wishlist heart** — there is no wishlist. That corner is the add to
     cart button, which is a real action.

   Carries `id="work"`, which the Products nav anchor points at. */
export function ProductRange() {
  const { addItem, open: openCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);
  const [pages, setPages] = useState(1);
  const [pageIndex, setPageIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const railRef = useRef<HTMLDivElement | null>(null);
  const revealRef = useReveal<HTMLElement>();

  /* Bestsellers first (2026-10-21). The band is headed "Bestsellers" after the
     reference, and the client named one lot — so the rail opens on it rather
     than on catalogue order. Everything else keeps its order; this is a stable
     partition, not a ranking. */
  const items = projects
    .filter((p) => !HIDDEN_IDS.has(p.id))
    .slice()
    .sort(
      (a, b) =>
        Number(bestsellerIds.includes(b.id)) -
        Number(bestsellerIds.includes(a.id)),
    );

  /* Dots and arrows are measured off the rail, so they follow the 3 / 2 / 1-up
     breakpoints by themselves. ResizeObserver fires on observe, so the first
     measure comes from it. */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const measure = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      const total = Math.max(1, Math.round(rail.scrollWidth / rail.clientWidth));
      setPages(total);
      setPageIndex(max > 0 ? Math.round((rail.scrollLeft / max) * (total - 1)) : 0);
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

  const page = (dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: dir * rail.clientWidth, behavior: "smooth" });
  };

  const goTo = (i: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    rail.scrollTo({ left: pages > 1 ? (max * i) / (pages - 1) : 0, behavior: "smooth" });
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
    <section id="work" className="range" ref={revealRef} aria-labelledby="range-title">
      <div className="range__inner">
        <header className="range__head">
          <div className="range__head-copy">
            <span className="range__eyebrow" data-anim="up">
              {rangeCopy.eyebrow}
            </span>
            <h2 className="range__title" id="range-title" data-anim="lines">
              {rangeCopy.title}
            </h2>
            <p className="range__lead" data-anim="up" data-anim-delay="0.25">
              {rangeCopy.lead}
            </p>
          </div>

          <ul className="range__trust" data-anim="up" data-anim-delay="0.3">
            {rangeCopy.trust.map((t) => (
              <li className="range__trust-item" key={t.icon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  {ICONS[t.icon]}
                </svg>
                <span>
                  {t.lines[0]}
                  <br />
                  {t.lines[1]}
                </span>
              </li>
            ))}
          </ul>
        </header>

        <div className="range__carousel">
          <button
            type="button"
            className="range__arrow range__arrow--prev"
            onClick={() => page(-1)}
            disabled={atStart}
            aria-label="Previous products"
            data-cursor
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>

          {/* No `data-lenis-prevent`: this rail scrolls on x only, and the
              attribute would stop the page scrolling vertically over the
              cards (fixed 2026-10-20 — see CLAUDE.md). */}
          <div className="range__rail" ref={railRef}>
            {items.map((p, i) => {
              /* The badge is the real published purity, never rounded and
                 never invented — a lot without an analysis shows none. */
              const lab = "labAnalysis" in p ? p.labAnalysis : undefined;
              const added = addedId === p.id;
              const content = spec(p, "Total content");

              return (
                <article
                  className="range__card"
                  key={p.id}
                  data-anim="up"
                  data-anim-delay={(Math.min(i, 2) * 0.08).toFixed(2)}
                >
                  <div className="range__media">
                    <a
                      className="range__media-link"
                      href={`#/product/${p.id}`}
                      data-cursor
                      data-cursor-text="View"
                      tabIndex={-1}
                      aria-hidden
                    >
                      <img src={p.image} alt="" loading="lazy" decoding="async" />
                    </a>

                    {/* ⚠ The bestseller flag is **client-supplied**, not
                        derived — there is no sales data in this project. One
                        lot carries it; see `bestsellerIds` in `data/site.ts`.
                        It sits opposite the purity badge so the two never
                        stack. */}
                    {bestsellerIds.includes(p.id) && (
                      <span className="range__flag mono">Bestseller</span>
                    )}

                    {lab && (
                      <span className="range__badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                          <path d="M5 12.5 10 17.5 19 7.5" />
                        </svg>
                        {lab.purity} verified
                      </span>
                    )}

                    {content && (
                      <span className="range__chip">
                        <span className="range__chip-dot" aria-hidden />
                        {content}
                      </span>
                    )}
                  </div>

                  <div className="range__body">
                    <a className="range__name" href={`#/product/${p.id}`} data-cursor>
                      {p.title}
                    </a>
                    {/* The reference's shelf line — compound class and format
                        ("Triple agonist · 20 mg pen"), read from `shelfLines`.
                        A lot with no entry falls back to its `Form` spec. */}
                    <p className="range__desc">
                      {shelfLines[p.id] ?? spec(p, "Form")}
                    </p>
                    <div className="range__foot-row">
                      <span className="range__batch">
                        {lab ? `Batch ${lab.batchNumber} · ${lab.lab}` : "Research use only"}
                      </span>
                      <span className="range__price">{formatUsd(p.price)}</span>
                    </div>
                    {/* The Bench saving, computed from this lot's own price at
                        the client-confirmed rate — never typed. The reference
                        prints the same chip on every card. */}
                    <span className="range__bench mono">
                      Save {formatUsdExact(p.price * benchCopy.discount)} with
                      the Bench Programme
                    </span>

                    {/* ⚠ The full-width pill the 2026-10-26 reference closes
                        its cards with. It used to be a round icon button in
                        the media tile's corner, where that reference puts a
                        wishlist heart — there is no wishlist here, so the one
                        real action took the corner. Now it is where the
                        reference actually puts it.

                        **No `aria-label`**: the button carries visible text,
                        and an accessible name that does not contain it
                        ("Add Retatrutide 20mg to cart") fails label-in-name.
                        The product it belongs to is its own `<article>`. */}
                    <button
                      type="button"
                      className={clsx("range__add", added && "is-added")}
                      onClick={() => add(p.id)}
                      data-cursor
                    >
                      {added ? "Added" : "Add to cart"}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                        {added ? (
                          <path d="M5 12.5 10 17.5 19 7.5" />
                        ) : (
                          <>
                            <path d="M6 8h12l-1 11H7L6 8Z" />
                            <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <button
            type="button"
            className="range__arrow range__arrow--next"
            onClick={() => page(1)}
            disabled={atEnd}
            aria-label="More products"
            data-cursor
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {pages > 1 && (
          <div className="range__dots" role="group" aria-label="Product pages">
            {Array.from({ length: pages }, (_, i) => (
              <button
                type="button"
                key={i}
                className={clsx("range__dot", i === pageIndex && "is-active")}
                onClick={() => goTo(i)}
                aria-label={`Page ${i + 1} of ${pages}`}
                aria-current={i === pageIndex || undefined}
              />
            ))}
          </div>
        )}

        {/* ⚠ The row of four category tiles that sat here was removed on
            request, 2026-10-26. It was a straight duplicate: `ShopCategories`
            is mounted directly above this band and renders the same four
            `researchAreas` from the same `shopImage` / `shopTitleLines`
            fields, so the page carried the categories twice. The `.range__cat*`
            CSS and `rangeCopy.categoriesLabel` are kept — restoring the row is
            this block plus the `researchAreas` import. */}
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
