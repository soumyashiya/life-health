import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { docBandCopy, services } from "../data/site";
import { useParallax } from "../hooks/useParallax";
import pack from "../assets/docband/pack.webp";

/* The reference's three tiles are ingredient cards; ours are the shop promises
   the Standards band already publishes, with their own imagery and links, so
   the two cannot drift. Three of the four fit the row. */
const TILES = services.slice(0, 3);

/**
 * "Every order starts with a documented lot." — the pack held large on the
 * left, the heading, paragraph and CTA on the right, and the three promise
 * tiles closing the band. `.docband__*` at the end of portfolio.css.
 */
export function DocBand() {
  const root = useRef<HTMLElement | null>(null);
  /* The three promise tiles drift at alternating depths — the about band's
     device. It owns `yPercent` on the `<img>`s; the band's own timeline below
     owns `y`/`opacity` on the `<li>`s around them, so nothing shares a
     property on one element. */
  useParallax<HTMLElement>("[data-parallax]", root);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia(el);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 72%", once: true },
      });
      tl.from(".docband__media", {
        clipPath: "inset(0% 0% 100% 0%)",
        scale: 1.06,
        duration: 1,
        ease: "power3.out",
      })
        .from(".docband__chip", { y: 16, opacity: 0, duration: 0.5, ease: "power2.out" }, 0.15)
        .from(
          ".docband__line > span",
          { yPercent: 110, duration: 0.9, ease: "power4.out", stagger: 0.1 },
          0.25,
        )
        .from(".docband__accent", { opacity: 0, x: -24, duration: 0.7, ease: "power2.out" }, 0.75)
        .from(
          ".docband__body, .docband__cta",
          { y: 18, opacity: 0, duration: 0.6, ease: "power2.out", stagger: 0.1 },
          0.8,
        )
        .from(
          ".docband__tile",
          { y: 28, opacity: 0, duration: 0.6, ease: "power2.out", stagger: 0.12 },
          0.95,
        )
        .from(".docband__note", { opacity: 0, duration: 0.5 }, 1.2);

      /* The pack drifts for the rest of the band's pass. The entrance owns the
         frame's clipPath and scale; this owns `yPercent` on the <img> inside
         it, so nothing shares a property on one element. */
      gsap.to(".docband__pack", {
        yPercent: -7,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section className="docband" ref={root} aria-labelledby="docband-title">
      <div className="docband__inner">
        <div className="docband__copy">
          <p className="docband__chip">
            <span className="docband__dot" aria-hidden />
            {docBandCopy.chip}
          </p>

          <h2 className="docband__title" id="docband-title">
            {docBandCopy.lines.map((line) => (
              <span className="docband__line" key={line}>
                <span>{line}</span>
              </span>
            ))}
            <span className="docband__accent">{docBandCopy.accent}</span>
          </h2>

          <p className="docband__body">{docBandCopy.body}</p>

          <a className="docband__cta" href={docBandCopy.cta.href} data-cursor>
            {docBandCopy.cta.label}
            <span className="docband__cta-disc" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h13M12 6l6 6-6 6" />
              </svg>
            </span>
          </a>
        </div>

        {/* The cut-out's right edge is where the forearm leaves the generated
            plate, so the media has to run to the viewport edge — a flat cut
            at the page's own edge is invisible, anywhere inside it is not. */}
        <figure className="docband__media">
          <img
            className="docband__pack"
            src={pack}
            alt={docBandCopy.packAlt}
            width={836}
            height={718}
            loading="lazy"
            decoding="async"
          />
        </figure>

        <div className="docband__foot">
          <ul className="docband__tiles">
            {TILES.map((tile, i) => (
              <li className="docband__tile" key={tile.number}>
                <a href={tile.link.href} data-cursor>
                  {/* The about band's device: the three photographs drift at
                      alternating depths, which is what reads as layers rather
                      than as one row sliding. The travel room is CSS (the
                      image overhangs its frame) — see `.docband__tile img`. */}
                  <img
                    src={tile.image}
                    alt=""
                    width={720}
                    height={540}
                    loading="lazy"
                    decoding="async"
                    data-parallax={i % 2 === 0 ? "near" : "far"}
                  />
                  <span className="docband__tile-label">{tile.title}</span>
                </a>
              </li>
            ))}
          </ul>

          <p className="docband__note">{docBandCopy.note}</p>
        </div>
      </div>
    </section>
  );
}
