import { useState } from "react";
import { projects } from "../data/site";
import { useCart } from "../hooks/useCart";

const formatUsd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export function ShopPage() {
  const { addItem, open: openCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const results = projects;

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
          <span className="eyebrow">Shop</span>
          <h1 className="h2 shop-page__title">The full catalogue.</h1>
          <p className="lead">
            Research-grade peptide reference materials, independently lab tested and
            packed for laboratory analysis. Documentation and batch data available on
            every product.
          </p>
        </header>

        <p className="shop-page__count mono">
          {results.length} product{results.length === 1 ? "" : "s"}
        </p>

        {results.length === 0 ? null : (
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
                    <img src={p.image} alt={p.title} loading="lazy" />
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
