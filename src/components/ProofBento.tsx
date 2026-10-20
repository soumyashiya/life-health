import { useEffect, useRef } from "react";
import clsx from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { bentoCopy } from "../data/site";
import { standards } from "../data/science";
import featureShot from "../assets/products/retatrutide-20mg.webp";
import wideShot from "../assets/products/tirzepatide-40mg.webp";

/* The numbered supply grid, mounted under `ProductSpotlight`.

   See `bentoCopy` in `data/site.ts` for the reference this is built to and
   why its four outcome categories could not ship. The tiles are `standards`
   from `data/science.ts` — the same four numbered entries the Science page
   publishes — read here rather than retyped, so the band and that page cannot
   say different things, and a fifth standard would appear by itself.

   `.bento__*` at the end of portfolio.css. */

/* Positional, matching the reference's layout: 01 is the tall feature tile,
   02 the plain card, 03 the tinted one, 04 the wide tile underneath. */
const TILE_CLASS = [
  "bento__tile--feature",
  "bento__tile--plain",
  "bento__tile--tint",
  "bento__tile--wide",
];

/* Only two tiles carry a packshot, as the reference does. Both are lots this
   catalogue actually stocks, so the alt text may name them. */
const SHOTS: (string | null)[] = [featureShot, null, null, wideShot];
const SHOT_ALTS = [bentoCopy.shots.feature, "", "", bentoCopy.shots.wide];

export function ProofBento() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".bento__head > *", {
        y: 22,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: { trigger: el, start: "top 76%", once: true },
      });

      /* The tiles arrive in reading order rather than all at once — the grid
         is the content here, so it gets the stagger. */
      gsap.from(".bento__tile", {
        y: 34,
        opacity: 0,
        scale: 0.97,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".bento__grid", start: "top 82%", once: true },
      });
    });

    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section className="bento" ref={root}>
      <div className="bento__inner">
        <div className="bento__head">
          <div className="bento__head-copy">
            <p className="bento__eyebrow">{bentoCopy.eyebrow}</p>
            <h2 className="bento__title">{bentoCopy.title}</h2>
          </div>
          <a className="bento__cta" href={bentoCopy.cta.href} data-cursor>
            {bentoCopy.cta.label}
            <span className="bento__cta-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h13M12 6l6 6-6 6" />
              </svg>
            </span>
          </a>
        </div>

        <div className="bento__grid">
          {standards.map((item, i) => (
            <article key={item.number} className={clsx("bento__tile", TILE_CLASS[i])}>
              <p className="bento__num">{item.number}</p>
              {/* The reference's oversized corner index. It repeats the line
                  above it, so assistive tech is spared the duplicate. */}
              <span className="bento__ghost" aria-hidden>
                {item.number}
              </span>
              <div className="bento__tile-body">
                <h3 className="bento__tile-title">{item.title}</h3>
                <p className="bento__tile-text">{item.body}</p>
              </div>
              {SHOTS[i] && (
                <img
                  className="bento__shot"
                  src={SHOTS[i] as string}
                  alt={SHOT_ALTS[i]}
                  width={900}
                  height={1130}
                  loading="lazy"
                  decoding="async"
                />
              )}
            </article>
          ))}
        </div>

        <p className="bento__note">{bentoCopy.note}</p>
      </div>
    </section>
  );
}
