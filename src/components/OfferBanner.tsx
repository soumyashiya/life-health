import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { offerBannerCopy, projects } from "../data/site";
/* The band's ground — a straight webp conversion of the client drop
   `latest-images/offer-banner-img.png`, which stays untouched as the source
   of truth. Unlike the confidence and about-product drops, **this one's pack
   copy is clean**: the carton's headline, strapline, dose line and storage
   lines all read correctly. */
import banner from "../assets/offer/banner.webp";
/* The three chips. **Composited, not generated**: each is the real catalogue
   render laid over a flat colour with ffmpeg, so the printed artwork is
   untouched. Generating "the product on a different background" re-draws the
   packaging, which is the failure this project has hit repeatedly — see the
   hero and confidence-band notes in `CLAUDE.md`. */
import thumbP1 from "../assets/offer/thumb-p1.webp";
import thumbP2 from "../assets/offer/thumb-p2.webp";
import thumbP4 from "../assets/offer/thumb-p4.webp";

const THUMBS: Record<string, string> = {
  p1: thumbP1,
  p2: thumbP2,
  p4: thumbP4,
};

const formatUsd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

/* Resolved once at module scope — everything they read is static, and
   rebuilding them per render hands the scroll effects a new identity every
   time. Same note as `ProductSpotlight`'s `LOTS`. */
const LOT = projects.find((p) => p.id === offerBannerCopy.productId);
const CHIPS = offerBannerCopy.chipIds
  .map((id) => projects.find((p) => p.id === id))
  .filter((p): p is (typeof projects)[number] => Boolean(p));

/**
 * The offer banner, mounted directly above the FAQ: a full-bleed photographic
 * band with a headline, lead and pill CTA on the left, and a translucent
 * panel under them carrying three product chips, the lot's real price and a
 * line about how orders ship.
 *
 * See `offerBannerCopy` for the reference's struck-through price and bundle
 * offer and why neither could ship. `.offerband__*` at the end of
 * portfolio.css.
 */
export function OfferBanner() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });

      tl.from(".offerband__line", { yPercent: 110, duration: 0.85, stagger: 0.1 })
        .from(".offerband__lead", { y: 18, opacity: 0, duration: 0.7 }, "-=0.5")
        .from(".offerband__cta", { y: 16, opacity: 0, duration: 0.6 }, "-=0.45")
        .from(
          ".offerband__panel",
          { y: 26, opacity: 0, duration: 0.8 },
          "-=0.4",
        )
        .from(
          ".offerband__chip",
          { scale: 0.7, opacity: 0, duration: 0.55, stagger: 0.09 },
          "-=0.5",
        );

      /* The photograph drifts behind the content as the band passes. It owns
         `yPercent` on the `<img>`; the entrance owns nothing on that element,
         so no two tweens share a property. */
      gsap.fromTo(
        ".offerband__bg img",
        { yPercent: -4 },
        {
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });

    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section className="section offerband" ref={root}>
      <div className="offerband__frame">
        {/* The client drop, full bleed. The scrim over it is directional —
            heavy on the left where the type sits, clear on the right where
            the figure and the carton are — the site's page-banner device. */}
        <div className="offerband__bg" aria-hidden>
          <img
            src={banner}
            alt=""
            width={1670}
            height={942}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="offerband__inner">
          <h2 className="offerband__title">
            {offerBannerCopy.lines.map((line) => (
              <span className="offerband__line-mask" key={line}>
                <span className="offerband__line">{line}</span>
              </span>
            ))}
          </h2>

          <p className="offerband__lead">{offerBannerCopy.lead}</p>

          <a className="offerband__cta" href={offerBannerCopy.cta.href}>
            {offerBannerCopy.cta.label}
            <span className="offerband__cta-dot" aria-hidden />
          </a>

          <div className="offerband__panel">
            <ul className="offerband__chips">
              {CHIPS.map((lot) => (
                <li className="offerband__chip" key={lot.id}>
                  <a href={`#/product/${lot.id}`} aria-label={lot.title}>
                    <img
                      src={THUMBS[lot.id]}
                      alt=""
                      width={600}
                      height={400}
                      loading="lazy"
                      decoding="async"
                    />
                  </a>
                </li>
              ))}
            </ul>

            <div className="offerband__deal">
              {/* **The lot's real price, and nothing struck through.** The
                  reference sets a was-price beside its own; there is no
                  discount pricing in `projects` to draw one from. */}
              {LOT ? (
                <p className="offerband__price">
                  <span className="offerband__price-note">
                    {offerBannerCopy.priceNote}
                  </span>
                  {formatUsd(LOT.price)}
                </p>
              ) : null}
              <p className="offerband__deal-text">
                {offerBannerCopy.panelLine}
              </p>
            </div>
          </div>

          <p className="offerband__note">{offerBannerCopy.note}</p>
        </div>
      </div>
    </section>
  );
}
