import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { collageCopy, projects } from "../data/site";
import collageSupport from "../assets/standards/support.webp";
import collagePurity from "../assets/standards/purity.webp";
/* Generated for this band (Magnific). Shot to match the existing
   `standards/` set — a **plain unbranded** carton and pen on warm stone.
   Unbranded is the point: the image models re-draw printed packaging and
   reliably garble it, so nothing here carries type to get wrong. */
import collageStill from "../assets/collage/desk-still.webp";

/* The two lots whose packshots fill the square cards. Real catalogue entries,
   so each tile links to its own product page. */
const TILE_IDS = ["p1", "p4"];

/* Every compound the catalogue publishes an analysis for, in the order the
   lots appear, with the measured concentration beside it.

   **The published strings are carried through, never reformatted.** A range
   is built by comparing parsed numbers but printed from the original values —
   rounding a reported concentration here would put a figure on the page that
   no report backs. */
function buildCompounds() {
  const seen = new Map<string, { v: number; s: string }[]>();

  for (const p of projects) {
    const lab = "labAnalysis" in p ? p.labAnalysis : undefined;
    if (!lab) continue;
    for (const c of lab.compounds) {
      const v = Number.parseFloat(c.concentration);
      if (!Number.isFinite(v)) continue;
      const list = seen.get(c.name) ?? [];
      list.push({ v, s: c.concentration });
      seen.set(c.name, list);
    }
  }

  return [...seen.entries()].map(([name, list]) => {
    const lo = list.reduce((a, b) => (b.v < a.v ? b : a));
    const hi = list.reduce((a, b) => (b.v > a.v ? b : a));
    const detail =
      lo.s === hi.s ? lo.s : `${lo.s.replace(/\s*mg\/mL$/, "")}–${hi.s}`;
    return { name, detail, lots: list.length };
  });
}

/* The collage band, mounted under `ProofBento`.

   See `collageCopy` in `data/site.ts` for what the reference put in this
   list and why it could not be reused. The layout is taken from the
   reference's own geometry, measured off it: a 468x663 card tilted -10deg, a
   432x608 card sitting straight, and a 325x325 card tilted +8deg, overlapping
   left to right and rising to the right.

   `.collage__*` at the end of portfolio.css. */
export function CompoundCollage() {
  const root = useRef<HTMLElement | null>(null);

  const compounds = buildCompounds();
  const tiles = TILE_IDS.map((id) => projects.find((p) => p.id === id)).filter(
    (p): p is (typeof projects)[number] => Boolean(p),
  );

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".collage__line", {
        yPercent: 110,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: "top 76%", once: true },
      });

      /* The cards settle rather than slide: `scale` and `opacity` only, so
         nothing here touches the CSS `rotate` that gives each its tilt, and
         nothing collides with the scrub below — which owns `yPercent` alone.
         Same split as the hero and the spotlight. */
      gsap.from(".collage__card", {
        scale: 0.88,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".collage__stage", start: "top 85%", once: true },
      });

      gsap.from(".collage__row", {
        x: 18,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.07,
        scrollTrigger: { trigger: ".collage__list", start: "top 88%", once: true },
      });

      /* The reference's cards are static. This drift is ours: the three move
         at different rates as the band passes, which is what stops a stack of
         tilted rectangles reading as a flat sticker sheet. */
      gsap.to(".collage__card", {
        yPercent: (i: number) => [-7, -3.5, -11, -13, -5][i] ?? -5,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section className="collage" ref={root}>
      <div className="collage__inner">
        <h2 className="collage__heading">
          <span className="collage__mask">
            <span className="collage__line">{collageCopy.headingLight}</span>
          </span>
          <span className="collage__mask">
            <span className="collage__line collage__line--bold">
              {collageCopy.headingBold}
            </span>
          </span>
        </h2>

        <div className="collage__body">
          <div className="collage__stage">
            <figure className="collage__card collage__card--1">
              <img
                src={collageSupport}
                alt="A sealed carton on a table beside a phone, during an order check"
                width={900}
                height={1130}
                loading="lazy"
                decoding="async"
              />
            </figure>

            <figure className="collage__card collage__card--2">
              <img
                src={collagePurity}
                alt="A pre-filled research pen beside its carton"
                width={900}
                height={1130}
                loading="lazy"
                decoding="async"
              />
            </figure>

            {/* The square cards are packshots rather than photographs, so each
                links to the lot it shows. The sand ground and `cover` crop are
                the documented treatment for these tall transparent canvases. */}
            {tiles[0] && (
              <figure className="collage__card collage__card--3">
                <a
                  href={`#/product/${tiles[0].id}`}
                  data-cursor
                  data-cursor-text="View"
                >
                  <img
                    src={tiles[0].image}
                    alt={tiles[0].title}
                    width={900}
                    height={1130}
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </figure>
            )}

            {/* 4 and 5 fill the two holes the three-card composition leaves —
                above the big card under the heading, and along the bottom
                where the stage ran empty beside the list. */}
            {tiles[1] && (
              <figure className="collage__card collage__card--4">
                <a
                  href={`#/product/${tiles[1].id}`}
                  data-cursor
                  data-cursor-text="View"
                >
                  <img
                    src={tiles[1].image}
                    alt={tiles[1].title}
                    width={900}
                    height={1130}
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </figure>
            )}

            <figure className="collage__card collage__card--5">
              <img
                src={collageStill}
                alt="A sealed carton and a pre-filled research pen on a work surface"
                width={1400}
                height={1056}
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>

          <div className="collage__list">
            <h3 className="collage__list-title">{collageCopy.listTitle}</h3>
            <ul>
              {compounds.map((c) => (
                <li className="collage__row" key={c.name}>
                  <span className="collage__mark" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                  <p>
                    <strong>{c.name}</strong>
                    <span>{c.detail}</span>
                  </p>
                </li>
              ))}
            </ul>
            <p className="collage__note">{collageCopy.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
