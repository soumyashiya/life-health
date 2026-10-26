import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sciBandCopy } from "../data/site";
import { standards } from "../data/science";
import { useParallax } from "../hooks/useParallax";
import backdrop from "../assets/sciband/background.webp";

/* Line icons for the four report-field cards, by position in
   `purityMethod.documentation`: lot number, HPLC purity, mass-spec, fill
   volume. Generic glyphs — no mark here stands for a certification. */
const ICONS = [
  <path key="0" d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3Zm-3 9 2.2 2.2L15.5 10" />,
  <path key="1" d="M9.5 3h5M10.5 3v5.5L5.2 18.4A1.8 1.8 0 0 0 6.8 21h10.4a1.8 1.8 0 0 0 1.6-2.6L13.5 8.5V3M8 15h8" />,
  <path key="2" d="M3 12h4l2-5 4 10 2.5-6.5L17 12h4" />,
  <path key="3" d="M8 3h8M9 3v15a3 3 0 0 0 6 0V3M9 10h6" />,
];

/* The "our science" band, rebuilt 2026-10-19 to a client reference: copy on a
   sand ground at left — eyebrow, two-tone headline, lead, four icon cards and
   a pill CTA with a tagline — and the photograph as a rounded card bleeding
   off the right edge.

   See `sciBandCopy` in `data/site.ts` for what the reference carried that
   this band does not, and the note on the device pictured.

   `.sciband__*` at the end of portfolio.css. */
export function ScienceBand() {
  const root = useRef<HTMLElement | null>(null);
  /* The photograph drifts as the band passes. The entrance below owns `scale`
     on the same element and this owns `yPercent` — disjoint properties, the
     usual rule. */
  useParallax<HTMLElement>("[data-parallax]", root);

  /* ⚠ The cards are **the four controls a lot goes through**, read from
     `standards` — 2026-10-21, with the pass that took the home page's content
     to the client reference. That reference heads this band *"How each pen is
     prepared"* over Source / Verify / Seal, which is what `standards` already
     describes; using it keeps the band and the Science page's section 01 from
     saying different things, and a fifth control would appear here by itself.
     It used to read `purityMethod.documentation` — what every *report*
     carries — which is the Science page's section 02 and a different subject.
     The reference shows three; the fourth is ours (retained samples) and it
     also keeps the 2×2 grid even. */
  const chips = standards;

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 74%", once: true },
      });

      tl.from(".sciband__eyebrow, .sciband__line, .sciband__lead", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
      })
        .from(
          ".sciband__chip",
          {
            y: 18,
            opacity: 0,
            duration: 0.55,
            ease: "power3.out",
            stagger: 0.08,
          },
          "-=0.35",
        )
        .from(
          ".sciband__foot",
          { y: 16, opacity: 0, duration: 0.5, ease: "power2.out" },
          "-=0.25",
        )
        /* The card wipes in from the right, the edge it bleeds off. */
        .from(
          ".sciband__media",
          {
            clipPath: "inset(0% 0% 0% 100% round 1.75rem 0 0 1.75rem)",
            duration: 1,
            ease: "power3.out",
          },
          0.15,
        )
        .from(
          ".sciband__photo",
          { scale: 1.1, duration: 1.3, ease: "power3.out" },
          "<",
        );
    });

    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section className="sciband" ref={root} aria-labelledby="sciband-title">
      <div className="sciband__inner">
        <div className="sciband__copy">
          <p className="sciband__eyebrow">{sciBandCopy.eyebrow}</p>

          <h2 className="sciband__title" id="sciband-title">
            {sciBandCopy.lines.map((line) => (
              <span className="sciband__line" key={line}>
                {line}
              </span>
            ))}
          </h2>

          <p className="sciband__lead">{sciBandCopy.lead}</p>

          <p className="sciband__chips-label">{sciBandCopy.chipsLabel}</p>
          <ul className="sciband__chips">
            {chips.map((chip, i) => (
              <li className="sciband__chip" key={chip.number}>
                <span className="sciband__icon" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    {ICONS[i]}
                  </svg>
                </span>
                <span className="sciband__chip-text">
                  <span className="sciband__chip-title">{chip.title}</span>
                  <span className="sciband__chip-note">{chip.body}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="sciband__foot">
            <a className="sciband__cta" href={sciBandCopy.cta.href} data-cursor>
              {sciBandCopy.cta.label}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                <path d="M5 12h13M12 6l6 6-6 6" />
              </svg>
            </a>
            <p className="sciband__tags">
              {sciBandCopy.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </p>
          </div>
        </div>

        <figure className="sciband__media">
          <img
            className="sciband__photo"
            src={backdrop}
            alt={sciBandCopy.photoAlt}
            width={1672}
            height={941}
            loading="lazy"
            decoding="async"
            data-parallax="far"
          />
        </figure>
      </div>
    </section>
  );
}
