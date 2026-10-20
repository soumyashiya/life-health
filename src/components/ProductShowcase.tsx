import { showcaseCopy } from "../data/site";
/* The client's own render, straight from `latest-images/tesamorelin.png` —
   cropped to its alpha bounds and converted, nothing else. It supersedes a
   reconstruction stitched out of the hero shot, which was soft and had hard
   edges; see CLAUDE.md for why that is no longer needed.
   `carton.webp` is the MOTS-C render it replaced — kept, not imported. */
import showcaseCarton from "../assets/showcase/carton-tesamorelin.webp";

/* The band under the hero: one device held large in the middle of a ringed
   stage, with three claim cards floating around it. See `.showcase__*` at the
   end of portfolio.css.

   Scattered pens were built around the carton first, to stand in for the
   reference's tumbling capsules, and **removed on request (2026-10-15)** —
   the band is the carton, the rings and the three cards, nothing else.
   `assets/showcase/pen.webp` is the cut-out, kept but no longer imported. */

export function ProductShowcase() {
  return (
    <section className="showcase" id="inside">
      <div className="container showcase__inner">
        <p className="showcase__eyebrow">
          <span className="showcase__index">{showcaseCopy.index}</span>
          <span>{showcaseCopy.eyebrow}</span>
        </p>

        {/* The visual and the cards are siblings on purpose: it keeps the
            card overlay out of the ringed stage, so the cards can drop below
            the product on a narrow screen without disturbing it. */}
        <div className="showcase__stage">
          <div className="showcase__visual">
            <span className="showcase__rings" aria-hidden />

            {/* Deliberately not named in the alt text: this carton is a
                compound the catalogue does not stock, so it stands for the
                *format* every lot ships in, never for a product on sale. */}
            <img
              className="showcase__product"
              src={showcaseCarton}
              alt="A pre-filled, sealed research device shown with its carton."
              width={1110}
              height={524}
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="showcase__cards">
            {showcaseCopy.cards.map((card, i) => (
              <article className={`showcase__card showcase__card--${i + 1}`} key={card.title}>
                <p className="showcase__value">{card.value}</p>
                <h3 className="showcase__card-title">{card.title}</h3>
                <p className="showcase__card-text">{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
