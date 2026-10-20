import { categoryCopy } from "../data/site";
import { researchAreas, researchAreaHref } from "../data/research";
import { useReveal } from "../hooks/useReveal";

/**
 * "Shop by category" — the five real `researchAreas` as clickable tiles.
 *
 * Everything here is read from `data/research.ts`: the name, the description,
 * the tile photograph (`shopImage`) and the two-line label (`shopTitleLines`),
 * which have been in the data but unused on the home view since `Catalogue`
 * was unmounted. Each tile links to `#/shop?research=<id>` — the filter the
 * shop page already supports — so **no category is invented and no link is
 * dead**. Adding a sixth area to the data adds a sixth tile here.
 *
 * The whole tile is one anchor, so the image, label and count are all part of
 * the same target rather than a card with a small link inside it.
 */
export function ShopCategories() {
  const revealRef = useReveal<HTMLElement>();

  return (
    <section className="cats" aria-labelledby="cats-title" ref={revealRef}>
      <div className="cats__inner">
        <header className="cats__head">
          <div className="cats__head-copy">
            <span className="cats__eyebrow mono" data-anim="up">
              {categoryCopy.eyebrow}
            </span>
            <h2 className="cats__title" id="cats-title" data-anim="lines">
              {categoryCopy.title}
            </h2>
            <p className="cats__lead" data-anim="up" data-anim-delay="0.25">
              {categoryCopy.lead}
            </p>
          </div>
          <a className="cats__all" href={categoryCopy.allHref} data-cursor data-anim="up">
            {categoryCopy.allLabel}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path d="M5 12h13M12 6l6 6-6 6" />
            </svg>
          </a>
        </header>

        <ul className="cats__grid">
          {researchAreas.map((area, i) => (
            <li
              className="cats__item"
              key={area.id}
              data-anim="up"
              data-anim-delay={(i * 0.08).toFixed(2)}
            >
              <a className="cats__card" href={researchAreaHref(area)} data-cursor>
                <span className="cats__media">
                  <img
                    src={area.shopImage}
                    alt=""
                    width={900}
                    height={1125}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span className="cats__body">
                  <span className="cats__name">
                    {area.shopTitleLines[0]}
                    <br />
                    {area.shopTitleLines[1]}
                  </span>
                  {/* A real figure — the length of the area's own product list,
                      not a number typed into copy. */}
                  <span className="cats__count mono">
                    {area.productIds.length} product
                    {area.productIds.length === 1 ? "" : "s"}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
