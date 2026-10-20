import { useMemo, useState } from "react";
import clsx from "clsx";
import { projects } from "../data/site";
import {
  getResearchArea,
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

type Product = (typeof projects)[number];

/* Every option sorts on a field the catalogue actually carries — there is no
   review data, no release date and no stock count to sort by, so none of
   those appear. */
const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "purity", label: "Highest verified purity" },
  { id: "name", label: "Name: A–Z" },
] as const;

type SortId = (typeof SORTS)[number]["id"];

/* Only some lots carry a published analysis. Those that don't sort to the end
   of the purity order rather than being given a placeholder figure. */
const purityOf = (p: Product): number => {
  const lab = "labAnalysis" in p ? p.labAnalysis : undefined;
  if (!lab?.purity) return -1;
  const n = parseFloat(String(lab.purity).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : -1;
};

/* Searches what a buyer would actually type: the product name, its shelf
   specs and its summary. */
const haystack = (p: Product) =>
  [p.title, p.summary, p.sector, ...p.specs.map((s) => `${s.label} ${s.value}`)]
    .join(" ")
    .toLowerCase();

export function ShopPage({ research }: { research?: ResearchVisualKey } = {}) {
  const { addItem, open: openCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortId>("featured");

  const area = research ? getResearchArea(research) : undefined;

  /* Changing category is a route change, but this component is not remounted —
     only its `research` prop changes — so a live search would survive into the
     new category and show "no products" for a category that has them. Reset it
     during render rather than in an effect: the project lints `set-state-in-effect`,
     and this is React's documented way to adjust state when a prop changes. */
  const [lastResearch, setLastResearch] = useState(research);
  if (research !== lastResearch) {
    setLastResearch(research);
    setQuery("");
  }

  /* The category lives in the route (`#/shop?research=<id>`), so a filtered
     view stays linkable and shareable — the chips below are real links, not
     local state. Search and sort are view state and stay in the component. */
  const results = useMemo(() => {
    const base = area ? researchAreaProducts(area) : projects;
    const q = query.trim().toLowerCase();
    const matched = q ? base.filter((p) => haystack(p).includes(q)) : base;

    const sorted = [...matched];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "name") sorted.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "purity") sorted.sort((a, b) => purityOf(b) - purityOf(a));
    return sorted;
  }, [area, query, sort]);

  const filtered = Boolean(area) || query.trim().length > 0;

  const handleQuickAdd = (id: string) => {
    addItem(id, 1);
    setAddedId(id);
    openCart();
    window.setTimeout(() => setAddedId((current) => (current === id ? null : current)), 1200);
  };

  return (
    <div className="shop-page">
      <div className="container">
        <header className="shop-page__hero">
          <span className="eyebrow">{area ? "Category" : "Shop"}</span>
          <h1 className="h2 shop-page__title">
            {area ? `${area.name}.` : "Shop all products."}
          </h1>
          <p className="lead">
            {area
              ? area.description
              : "Every lot is third-party tested, sealed and cold-packed — with its full purity report on the product page before you buy."}
          </p>
        </header>

        <div className="shop-page__toolbar">
          {/* Categories are the five real research areas — no invented
              collections, and every chip resolves to a route that exists. */}
          <nav className="shop-page__chips" aria-label="Filter by category">
            <a
              className={clsx("shop-page__chip", !area && "is-active")}
              href="#/shop"
              aria-current={!area ? "page" : undefined}
              data-cursor
            >
              All products
            </a>
            {researchAreas.map((a) => (
              <a
                key={a.id}
                className={clsx("shop-page__chip", area?.id === a.id && "is-active")}
                href={`#/shop?research=${a.id}`}
                aria-current={area?.id === a.id ? "page" : undefined}
                data-cursor
              >
                {a.name.replace(/\s+research$/i, "")}
              </a>
            ))}
          </nav>

          <div className="shop-page__controls">
            <div className="shop-page__search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                <circle cx="11" cy="11" r="6.5" />
                <path d="M16 16l4.5 4.5" />
              </svg>
              <label className="sr-only" htmlFor="shop-search">
                Search products
              </label>
              <input
                id="shop-search"
                type="search"
                className="shop-page__search-input"
                placeholder="Search products or specs"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
              />
              {query && (
                <button
                  type="button"
                  className="shop-page__search-clear"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              )}
            </div>

            <div className="shop-page__sort">
              <label className="sr-only" htmlFor="shop-sort">
                Sort products
              </label>
              <select
                id="shop-sort"
                className="shop-page__sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortId)}
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                <path d="M7 10l5 5 5-5" />
              </svg>
            </div>
          </div>
        </div>

        <div className="shop-page__filter">
          {/* `aria-live` so a screen reader hears the count change as the
              search narrows, rather than silently re-rendering the grid. */}
          <p className="shop-page__count mono" aria-live="polite">
            {results.length} product{results.length === 1 ? "" : "s"}
            {filtered ? " found" : ""}
          </p>
          {filtered && (
            <a
              className="shop-page__clear mono"
              href="#/shop"
              onClick={() => setQuery("")}
              data-cursor
            >
              Clear filters
            </a>
          )}
        </div>

        {results.length === 0 ? (
          <div className="shop-page__empty">
            <p className="shop-page__empty-title">No products match that search.</p>
            <p className="shop-page__empty-note">
              Try a compound name such as “Retatrutide”, a strength such as “40 mg”,
              or browse the full catalogue.
            </p>
            <a
              className="btn btn--primary"
              href="#/shop"
              onClick={() => setQuery("")}
              data-cursor
            >
              View all products
            </a>
          </div>
        ) : (
          <div className="shop-page__grid">
            {results.map((p) => {
              const hasLab = "labAnalysis" in p && !!p.labAnalysis;
              return (
                <article className="shop-card" key={p.id}>
                  <a
                    href={`#/product/${p.id}`}
                    className="shop-card__media"
                    data-cursor
                    data-cursor-text="View"
                  >
                    <img src={p.image} alt={p.title} loading="lazy" decoding="async" />
                    {hasLab && <span className="shop-card__badge">Lab verified</span>}
                  </a>
                  <div className="shop-card__body">
                    <span className="mono shop-card__sector">{p.sector}</span>
                    <a href={`#/product/${p.id}`} className="shop-card__name" data-cursor>
                      {p.title}
                    </a>
                    <p className="shop-card__summary">{p.summary}</p>
                    <div className="shop-card__row">
                      <span className="shop-card__price">{formatUsd(p.price)}</span>
                      <button
                        type="button"
                        className="shop-card__add"
                        onClick={() => handleQuickAdd(p.id)}
                        aria-label={`Add ${p.title} to cart`}
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
        )}

        <p className="compliance-note shop-page__disclaimer">
          All products are supplied strictly for laboratory research and educational
          use. Not intended for human or veterinary consumption. Buyer is responsible
          for ensuring compliance with all applicable local laws and regulations.
        </p>
      </div>
    </div>
  );
}
