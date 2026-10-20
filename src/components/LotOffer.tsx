import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lotOfferCopy, projects } from "../data/site";
import { useCart } from "../hooks/useCart";
/* The lot's own catalogue render, cropped to the carton and its shadow
   (900x480 at 0,345 of the 900x1130 canvas) so it can be sized by width
   without carrying two thirds of empty canvas. */
import carton from "../assets/lotoffer/carton.webp";

const formatUsd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n);

const product = projects.find((p) => p.id === lotOfferCopy.productId)!;

type Row = { title: string; note?: string; tag: string };

/* What the order actually is — read from the lot, never typed into copy, so a
   lot without an analysis simply loses its report row. See `lotOfferCopy`
   for why none of these carries a price. */
const ROWS: Row[] = [
  ...(product.packageContents ?? []).map((item) => ({
    title: item,
    tag: lotOfferCopy.tags.inBox,
  })),
  ...(product.labAnalysis
    ? [
        {
          title: `${product.labAnalysis.lab} report`,
          note: `Batch ${product.labAnalysis.batchNumber} · ${product.labAnalysis.purity} purity`,
          tag: lotOfferCopy.tags.published,
        },
      ]
    : []),
  { ...lotOfferCopy.dispatch, tag: lotOfferCopy.tags.standard },
];

const spec = (label: string) =>
  product.specs?.find((s) => s.label === label)?.value;

/**
 * The lot offer: a pale panel with the carton on a lit stage, and a dark
 * panel pricing that one lot and listing what comes with it.
 * `.lotoffer__*` at the end of portfolio.css.
 */
export function LotOffer() {
  const root = useRef<HTMLElement | null>(null);
  const { addItem, open: openCart } = useCart();
  const shelf = [spec("Form"), spec("Total content")].filter(Boolean).join(" · ");

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 72%", once: true },
      });

      tl.from(".lotoffer__kicker", { y: 14, opacity: 0, duration: 0.6, ease: "power3.out" })
        .from(
          ".lotoffer__pack",
          { y: 40, scale: 0.94, opacity: 0, duration: 1, ease: "power3.out" },
          "-=0.4",
        )
        .from(
          ".lotoffer__eyebrow, .lotoffer__line, .lotoffer__lead, .lotoffer__product",
          { y: 22, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 },
          0.1,
        )
        .from(
          ".lotoffer__row, .lotoffer__total",
          { x: 18, opacity: 0, duration: 0.5, ease: "power2.out", stagger: 0.06 },
          "-=0.4",
        )
        .from(
          ".lotoffer__cta, .lotoffer__badge",
          { y: 14, opacity: 0, duration: 0.5, ease: "power2.out", stagger: 0.05 },
          "-=0.25",
        );

      /* A slow drift on the carton alone — `yPercent` on the image, while the
         entrance owns `y`/`scale`/`opacity` on its wrapper. */
      gsap.fromTo(
        ".lotoffer__pack img",
        { yPercent: 6 },
        {
          yPercent: -6,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });

    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  const add = () => {
    addItem(product.id, 1);
    openCart();
  };

  return (
    <section className="lotoffer" ref={root} aria-labelledby="lotoffer-title">
      <div className="lotoffer__stage">
        <p className="lotoffer__kicker">{lotOfferCopy.kicker}</p>
        <div className="lotoffer__pack">
          <img
            src={carton}
            alt={lotOfferCopy.packAlt}
            width={900}
            height={480}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <div className="lotoffer__panel">
        <p className="lotoffer__eyebrow">{lotOfferCopy.eyebrow}</p>
        <h2 className="lotoffer__title" id="lotoffer-title">
          {lotOfferCopy.lines.map((line) => (
            <span className="lotoffer__line" key={line}>
              {line}
            </span>
          ))}
        </h2>
        <p className="lotoffer__lead">{lotOfferCopy.lead}</p>

        <div className="lotoffer__product">
          <span className="lotoffer__product-name">
            <a href={`#/product/${product.id}`}>{product.title}</a>
            {shelf && <span className="lotoffer__product-spec">{shelf}</span>}
          </span>
          <span className="lotoffer__price">{formatUsd(product.price)}</span>
        </div>

        <p className="lotoffer__includes">{lotOfferCopy.includesLabel}</p>
        <ul className="lotoffer__rows">
          {ROWS.map((row) => (
            <li className="lotoffer__row" key={row.title}>
              <span className="lotoffer__row-text">
                <span className="lotoffer__row-title">{row.title}</span>
                {row.note && <span className="lotoffer__row-note">{row.note}</span>}
              </span>
              <span className="lotoffer__row-tag">{row.tag}</span>
            </li>
          ))}
        </ul>

        <div className="lotoffer__total">
          <span>{lotOfferCopy.totalLabel}</span>
          <span>{formatUsd(product.price)}</span>
        </div>

        <button type="button" className="lotoffer__cta" onClick={add} data-cursor>
          {lotOfferCopy.ctaLabel} — {product.title}
        </button>

        <ul className="lotoffer__badges">
          {lotOfferCopy.badges.map((b) => (
            <li className="lotoffer__badge" key={b}>
              {b}
            </li>
          ))}
        </ul>

        <p className="lotoffer__note">{product.safetyProtocol}</p>
      </div>
    </section>
  );
}
