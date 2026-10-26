import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { whyChooseCopy, whyUs } from "../data/site";
import photo from "../assets/categories/cellular.webp";
import packA from "../assets/products/retatrutide-20mg.webp";
import packB from "../assets/products/glow-70mg.webp";
import packC from "../assets/products/tirzepatide-40mg.webp";

const PACKS = [packA, packB, packC];

/**
 * The "why choose us" band, built to a client reference: an enormous pale
 * ghost WHY behind the composition, a photograph overlapping it, a stack of
 * three packs, and a numbered list of reasons.
 *
 * It carries `id="why-us"`, which the footer's `Why Us` link has pointed at
 * since the old `WhyUs` band was unmounted — that anchor resolves again.
 *
 * The rows are `whyUs`, read rather than restated, so this band and that
 * block cannot drift. See `whyChooseCopy` for the reference's own headline
 * and why it could not ship.
 */
export function WhyChoose() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 74%", once: true },
      });

      tl.from(".whychoose__line > span", {
        yPercent: 110,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.09,
      })
        .from(
          ".whychoose__ghost, .whychoose__ghost-sub",
          { opacity: 0, duration: 0.9, ease: "power2.out", stagger: 0.1 },
          "-=0.5",
        )
        .from(
          ".whychoose__photo",
          {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6",
        )
        .from(
          ".whychoose__pack",
          { y: 26, opacity: 0, duration: 0.6, ease: "back.out(1.6)", stagger: 0.08 },
          "-=0.5",
        )
        .from(
          ".whychoose__row",
          { y: 16, opacity: 0, duration: 0.5, ease: "power3.out", stagger: 0.07 },
          "-=0.4",
        );

      /* The about band's effect, applied here on request (2026-10-17): the
         rows arrive grey and fill in to ink one at a time as the band
         passes. Same settings as `.aboutband__word`, so the two bands read
         as one device.

         It owns `opacity` on `.whychoose__label` — a *child* of the row the
         entrance above animates, which is what keeps the two off the same
         property on the same element. Don't move it onto `.whychoose__row`. */
      gsap.fromTo(
        ".whychoose__label",
        { opacity: 0.22 },
        {
          opacity: 1,
          ease: "none",
          stagger: 1,
          scrollTrigger: {
            trigger: ".whychoose__list",
            start: "top 88%",
            end: "bottom 62%",
            scrub: true,
          },
        },
      );

      /* Disjoint from the entrance: that owns `yPercent`/`opacity`/`clipPath`
         on the type and the tiles, this owns `x` on the ghost word alone, so
         the two tweens never contend. The reference's word is static; the
         drift is what keeps it from reading as a flat watermark. */
      gsap.fromTo(
        ".whychoose__ghost-row",
        { x: -30 },
        {
          x: 30,
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

  /* No `container` class: the band is aligned to the header's own line,
     which is wider than `.container`'s 88rem cap — see `.whychoose`. */
  return (
    <section id="why-us" className="section whychoose" ref={root}>
      <h2 className="whychoose__title">
        {whyChooseCopy.lines.map((line) => (
          <span className="whychoose__line" key={line}>
            <span>{line}</span>
          </span>
        ))}
      </h2>

      <div className="whychoose__stage">
        {/* Decorative: the heading above and the list below carry the
            section's actual content, so this is hidden from assistive tech
            rather than read as two more headings. */}
        <div className="whychoose__ghost-row" aria-hidden>
          <span className="whychoose__ghost">{whyChooseCopy.ghost}</span>
          <span className="whychoose__ghost-sub">{whyChooseCopy.ghostSub}</span>
        </div>

        <div className="whychoose__front">
          <figure className="whychoose__photo">
            <img
              src={photo}
              alt={whyChooseCopy.photoAlt}
              width={1024}
              height={676}
              loading="lazy"
              decoding="async"
            />
          </figure>

          {/* Three packshots stacked as the reference stacks its cans. Each
              tile crops the render's tall transparent canvas down to the
              carton itself — see the note on `.whychoose__pack`. */}
          <div className="whychoose__stack" role="img" aria-label={whyChooseCopy.stackAlt}>
            {PACKS.map((src) => (
              <span className="whychoose__pack" key={src}>
                <img src={src} alt="" width={900} height={1130} loading="lazy" decoding="async" />
              </span>
            ))}
          </div>

          <ol className="whychoose__list">
            {whyUs.map((item) => (
              /* The row is the reference's number · hairline · title line,
                 with one short supporting fact under it. `note`, not
                 `description`: the long form runs five lines in this column
                 and buries the band — see `whyUs`. */
              /* Redesigned 2026-10-20 (requested): a number badge, then the
                 title over its note. The row used to reuse `.whychoose__line`
                 — the heading's line class — so the heading's rise tween and
                 a grid rule meant for the rows each landed on the other. */
              <li className="whychoose__row" key={item.number}>
                <span className="whychoose__num">{item.number}</span>
                <span className="whychoose__row-text">
                  <span className="whychoose__label">{item.title}</span>
                  <span className="whychoose__note">{item.note}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
