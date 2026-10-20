import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { aboutBandCopy, aboutCopy } from "../data/site";
/* Client drops, 2026-10-17 — straight webp conversions of
   `latest-images/about1-latest.png` and `about2.jpeg`, which stay untouched as
   the source of truth, same convention as `new/` → `products/`. Both carry
   compliance notes: see `aboutBandCopy` and `CLAUDE.md`. */
import tallPhoto from "../assets/aboutband/portrait.webp";
import insetPhoto from "../assets/aboutband/inset.webp";

/**
 * The about band under the hero, built to two client references: the layout
 * of the first (tall photograph left; headline, then a small photograph
 * beside a paragraph and a pill CTA, right) and the text effect of the
 * second — the paragraph's words darkening from grey to ink on scroll.
 *
 * The paragraph is `aboutCopy.paragraph`, read rather than restated, so this
 * band and the `#/about` page cannot drift. See `aboutBandCopy` for the two
 * references' own copy and why none of it could ship.
 */
export function AboutBand() {
  const root = useRef<HTMLElement | null>(null);

  /* Split in the component, not in the data: the copy stays one readable
     string in `site.ts`, and the `<p>` keeps its text for selection and for
     assistive tech because the words are plain inline spans. */
  const words = aboutCopy.paragraph.split(" ");

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      /* The reference's effect: the paragraph arrives grey and fills in to
         ink as the band passes. Scrubbed, one word at a time, and it owns
         `opacity` on the words alone — the photographs' entrance below owns
         `clipPath`/`scale`, so the two never contend. */
      gsap.fromTo(
        ".aboutband__word",
        { opacity: 0.22 },
        {
          opacity: 1,
          ease: "none",
          stagger: 1,
          scrollTrigger: {
            trigger: ".aboutband__text",
            /* Starts as the paragraph clears the fold and finishes before it
               leaves the middle of the screen, so the last word is read at
               full strength rather than on the way out. */
            start: "top 85%",
            end: "bottom 55%",
            scrub: true,
          },
        },
      );

      /* Scroll parallax on the two photographs (2026-10-17, requested). They
         counter-drift — the tall one down, the inset up — which is what
         makes the pair read as two planes rather than one flat row; the
         spotlight tiles use the same trick against their photograph.

         It owns `yPercent` on the `<img>`s. The entrance below owns
         `clipPath` on the frames and `scale` on the tall image, so no tween
         shares a property with another on the same element — the rule the
         hero and the feature band also follow. The travel room comes from
         `.aboutband__media img` being 114% tall; see the note there. */
      const drift = {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      } as const;

      gsap.fromTo(
        ".aboutband__media--tall img",
        { yPercent: -6 },
        { yPercent: 6, ease: "none", scrollTrigger: drift },
      );
      gsap.fromTo(
        ".aboutband__media--inset img",
        { yPercent: 5 },
        { yPercent: -5, ease: "none", scrollTrigger: drift },
      );

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 76%", once: true },
      });

      tl.from(".aboutband__media--tall", {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.9,
        ease: "power3.out",
      })
        .from(
          ".aboutband__media--tall img",
          { scale: 1.16, duration: 1.1, ease: "power3.out" },
          "<",
        )
        .from(
          ".aboutband__eyebrow, .aboutband__line > span",
          { yPercent: 110, duration: 0.7, ease: "power3.out", stagger: 0.09 },
          "-=0.6",
        )
        .from(
          ".aboutband__media--inset",
          { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7, ease: "power3.out" },
          "-=0.35",
        )
        .from(
          ".aboutband__cta",
          { y: 18, opacity: 0, duration: 0.6, ease: "power3.out" },
          "-=0.3",
        );
    });

    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section className="section aboutband" ref={root}>
      <div className="aboutband__grid">
        <figure className="aboutband__media aboutband__media--tall">
          <img
            src={tallPhoto}
            alt={aboutBandCopy.tallAlt}
            width={1126}
            height={1398}
            loading="lazy"
            decoding="async"
          />
        </figure>

        <div className="aboutband__panel">
          <span className="aboutband__eyebrow">{aboutBandCopy.eyebrow}</span>

          {/* One entry in `lines` is one rendered line, each behind its own
              mask so the pair rises as the reference's does. */}
          <h2 className="aboutband__title">
            {aboutBandCopy.lines.map((line) => (
              <span className="aboutband__line" key={line}>
                <span>{line}</span>
              </span>
            ))}
          </h2>

          <div className="aboutband__row">
            <figure className="aboutband__media aboutband__media--inset">
              <img
                src={insetPhoto}
                alt={aboutBandCopy.insetAlt}
                width={1024}
                height={682}
                loading="lazy"
                decoding="async"
              />
            </figure>

            <div className="aboutband__copy">
              <p className="aboutband__text">
                {words.map((word, i) => (
                  <span className="aboutband__word" key={`${word}-${i}`}>
                    {word}
                    {i < words.length - 1 ? " " : ""}
                  </span>
                ))}
              </p>

              <a
                className="aboutband__cta"
                href={aboutBandCopy.cta.href}
                data-cursor
              >
                {aboutBandCopy.cta.label}
                <span className="aboutband__cta-disc" aria-hidden>
                  <svg viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3.5 8h8M8 4.5 11.5 8 8 11.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
