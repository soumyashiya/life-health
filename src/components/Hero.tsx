import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroCopy, projects, site, testimonials } from "../data/site";
/* A client-supplied cut-out (`latest-images/hero-withoutbg.png`), so the right
   half is a figure standing on a plain ground with the wordmark ghosted behind
   her — no background photograph, and so no second layer to keep aligned. */
import heroModel from "../assets/hero/figure.webp";
/* The inline disc renders at about 40px across, where packaging detail is mush
   — and the catalogue packshots sit on tall transparent canvases that crop to
   a circle badly anyway. A crop of the band's own portrait reads cleanly at
   that size and ties the two halves together — it is a crop of the very
   figure standing beside it. The old `showcase.webp` crop is purple and would
   now read as a foreign image. */
import heroDisc from "../assets/hero/figure.webp";

/* Real catalogue entries, so every packshot in the band links to its own
   product page. Falls back gracefully if the ids ever change. */
const SHELF_IDS = ["p1", "p4", "p5"];

/** `ready` flips true when the preloader has lifted — see the reveal below. */
export function Hero({ ready = true }: { ready?: boolean }) {
  const root = useRef<HTMLElement | null>(null);

  const shelf = SHELF_IDS.map((id) => projects.find((p) => p.id === id)).filter(
    (p): p is (typeof projects)[number] => Boolean(p),
  );
  const faces = testimonials.slice(0, 4);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    // Scoped so the selectors below only match inside the hero, and so reduced
    // motion gets no timeline and no ScrollTrigger at all — every element is
    // already at its finished state in CSS.
    const mm = gsap.matchMedia(el);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // The band's arrival — headline, copy, CTA, shelf — belongs to the
      // sequence in Navbar.tsx, because the hero is hidden behind that
      // sequence's field until it lifts. All this adds is the photograph's
      // settle and a restrained parallax as the band leaves.
      //
      // Both run on `.hero__frame`, never on the two image layers: the cut-out
      // only reads as part of the photograph while it sits exactly over it, so
      // anything that moves one must move both. They also take disjoint
      // properties — the entrance owns scale/opacity, the scrub owns yPercent
      // — so the two tweens cannot fight over the same transform.
      gsap.from(".hero__frame", {
        scale: 1.06,
        opacity: 0,
        duration: 1.4,
        ease: "power3.out",
        delay: 0.2,
      });

      gsap.to(".hero__frame", {
        yPercent: -4,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
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

  /* **The headline reveal waits for the preloader** (2026-10-20 fix). It used
     to belong to the page-load sequence in `Navbar.tsx`, which starts on
     mount — so the lines rose *behind* the preloader and were already sitting
     still by the time it lifted, and below 992px there was no reveal at all.
     Now the lines (and the copy, CTA and foot row after them) are held hidden
     until `ready`, then rise behind their per-line masks like every other
     band's heading. When `ready` flips, matchMedia reverts and re-adds in
     the same tick, so the hidden state is re-applied before any paint — no
     flash of the finished text. Reduced motion gets no branch: CSS is the
     finished state. */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia(el);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lines = ".hero__line > span";
      const bits = ".hero__content > *:not(.hero__title), .hero__foot";
      gsap.set(lines, { yPercent: 110 });
      gsap.set(bits, { opacity: 0, y: 24 });
      if (!ready) return;

      gsap
        .timeline({ delay: 0.15 })
        .to(lines, {
          yPercent: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.12,
        })
        .to(
          bits,
          { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", stagger: 0.1 },
          "-=0.6",
        );
    });

    return () => mm.revert();
  }, [ready]);

  return (
    <section id="home" className="hero" ref={root}>
      <div className="hero__panel">
        <div className="hero__content">
          <h1 className="hero__title">
            {heroCopy.lines.map((parts, i) => (
              /* Static, art-directed lines — the index is a stable key. A line
                 given two parts carries the disc between them. */
              <span className="hero__line" key={i}>
                <span>
                  {parts.map((part, p) => (
                    <span key={p}>
                      {p > 0 && (
                        <span className="hero__disc" aria-hidden>
                          <img
                            src={heroDisc}
                            alt=""
                            loading="lazy"
                            decoding="async"
                          />
                        </span>
                      )}
                      {p > 0 ? " " : ""}
                      {part}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </h1>

          <p className="hero__lede">{heroCopy.lede}</p>

          <a className="hero__cta" href={heroCopy.cta.href} data-cursor data-cursor-text="Shop">
            {heroCopy.cta.label}
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M2.5 8h11M9.5 4l4 4-4 4" />
            </svg>
          </a>

        </div>

        {/* The proof cluster and the shelf share one row along the panel's
            foot — left and right, as the reference sets them. */}
        <div className="hero__foot">
          <div className="hero__proof">
            <span className="hero__faces">
              {faces.map((t) => (
                <img key={t.name} src={t.avatar} alt="" loading="lazy" decoding="async" />
              ))}
            </span>
            <span className="hero__proof-text">
              <strong>{heroCopy.proof.value}</strong>
              {heroCopy.proof.label}
            </span>
          </div>

          {/* Real catalogue entries, each linking to its own product page. */}
          <ul className="hero__shelf">
            {shelf.map((p) => (
              <li className="hero__shelf-item" key={p.id}>
                <a href={`#/product/${p.id}`} data-cursor data-cursor-text="View">
                  <img src={p.image} alt={p.title} loading="lazy" decoding="async" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* The brand set large and ghosted behind the figure, as the reference
          does. Decorative only — the bar already carries the real wordmark.
          `.hero__visual` is the rounded card and does the clipping; the frame
          inside it is what moves, so the card never leaves its grid slot and
          opens a white gap. */}
      <div className="hero__visual">
        <div className="hero__frame">
          <span className="hero__wordmark" aria-hidden>
            {site.brandMark}
          </span>
          <img
            className="hero__model"
            src={heroModel}
            alt=""
            width={1199}
            height={1312}
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
