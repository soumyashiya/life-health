import { useState } from "react";
import clsx from "clsx";
import { faqCopy, faqItems } from "../data/site";
import { useReveal } from "../hooks/useReveal";
import { useParallax } from "../hooks/useParallax";
/* Client drop, 2026-10-27 — a straight webp conversion of
   `latest-images/faq.png`, which stays untouched as the source of truth. The
   pen in it is **BPC-157 & TB-500 (`p3`), a stocked lot**, which closes this
   band's long-standing compliance item: every drop before it pictured a
   TESAMORELIN pack the catalogue does not carry. `portrait-burgundy.webp`,
   `documents.webp`, `photo.webp`, `figure.webp` and `portrait.webp` are all
   kept on disk, unused. */
import portrait from "../assets/faq/portrait-latest.webp";

/**
 * Rebuilt 2026-10-19 to a client reference: a large serif heading with one
 * italic word, a portrait under it and a "View more" link at the foot of
 * that column; the questions in a hairline list opposite, each with a plus
 * that turns into a cross when open. `.faq__*` in portfolio.css.
 */
export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const revealRef = useReveal<HTMLElement>();
  /* The portrait drifts as the band passes. Both hooks read the same section
     element — `useParallax` takes an external ref for exactly this. */
  useParallax<HTMLElement>("[data-parallax]", revealRef);

  const items = showAll ? faqItems : faqItems.slice(0, faqCopy.initialCount);
  const hasMore = faqItems.length > faqCopy.initialCount;

  return (
    <section id="faq" className="section faq" ref={revealRef}>
      <div className="faq__main">
        <div className="faq__intro">
          {/* The breaks are authored, so the masks are too — `splitLines`
              would flatten the italic accent out of line one. */}
          <h2 className="faq__title" data-anim="lines">
            <span className="faq__line anim__line">
              <span className="anim__line-inner">{faqCopy.title.brand}</span>
            </span>
            <span className="faq__line anim__line">
              <span className="anim__line-inner">
                {faqCopy.title.lead} <em>{faqCopy.title.accent}</em>
              </span>
            </span>
            <span className="faq__line anim__line">
              <span className="anim__line-inner">{faqCopy.title.tail}</span>
            </span>
          </h2>

          <figure className="faq__figure" data-anim="mask" data-anim-delay="0.25">
            <img
              src={portrait}
              data-parallax="far"
              alt={faqCopy.figureAlt}
              width={1397}
              height={1126}
              loading="lazy"
              decoding="async"
            />
          </figure>

          {hasMore && (
            <button
              type="button"
              className="faq__more"
              aria-expanded={showAll}
              aria-controls="faq-list"
              onClick={() => setShowAll((v) => !v)}
            >
              {showAll ? faqCopy.viewLess : faqCopy.viewMore}
            </button>
          )}
        </div>

        <div className="faq__list" id="faq-list">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                className={clsx("faq__item", isOpen && "is-open")}
                key={item.question}
              >
                <button
                  className="faq__trigger"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span className="faq__q">{item.question}</span>
                  {/* One plus that turns 45° into a cross — the state reads
                      as a movement rather than a swapped glyph. */}
                  <span className="faq__mark" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 5v14M5 12h14"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>
                <div className="faq__panel">
                  <div className="faq__panel-inner">
                    <p className="faq__answer">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
