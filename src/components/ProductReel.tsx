import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, reelCopy } from "../data/site";
/* Carton faces, pre-cropped to exactly their printed rectangle. These are the
   same crops `ProductSpotlight` overlays onto its photograph (measured at
   alpha >= 250, so the five agree to within 0.6% and one box frames all of
   them) — which is what lets the CSS-built 3D box hinge its top and side on
   the printed edges. A whole catalogue render would carry its transparent
   canvas into the box and the built faces would float detached. */
import faceP1 from "../assets/spotlight/cartons/p1.webp";
import faceP2 from "../assets/spotlight/cartons/p2.webp";
import faceP4 from "../assets/spotlight/cartons/p4.webp";
/* The arch backdrop behind each carton — one per lot, so the ground changes
   with the product as the reference's does.

   **Product stills, not the `categories/*` lifestyle set.** Those are the one
   place the no-people imagery rule is waived, but they were waived for
   *category* tiles; behind a named and priced lot a fitness frame reads as
   that compound's outcome, which is the claim this catalogue cannot make. */
import archP1 from "../assets/standards/purity.webp";
import archP2 from "../assets/standards/consistency.webp";
import archP4 from "../assets/standards/packaging.webp";

const FACES: Record<string, string> = { p1: faceP1, p2: faceP2, p4: faceP4 };
const ARCHES: Record<string, string> = { p1: archP1, p2: archP2, p4: archP4 };

const formatUsd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

/* Resolved once at module scope, not per render: everything it reads is
   static, and rebuilding the array each render hands the scroll effect a new
   identity every time — `react-hooks/exhaustive-deps` flags it, and that
   warning is the only thing between this file and the clean 9-error
   baseline. Same note as `ProductSpotlight`'s `LOTS`. */
const LOTS = reelCopy.ids
  .map((id) => projects.find((p) => p.id === id))
  .filter((p): p is (typeof projects)[number] => Boolean(p));

/**
 * The product reel, built to section 4 of `nymphaicosmetics.com`: a pinned
 * band that steps through three lots one at a time, the carton standing over
 * an arch-masked photograph with a counter and a thumbnail rail.
 *
 * See `reelCopy` for the reference's Spline 3D bottles and why the carton is
 * a CSS-built box here instead. `.reel__*` at the end of portfolio.css.
 */
export function ProductReel() {
  const root = useRef<HTMLElement | null>(null);
  /* Drives the counter and the thumbnail rail. The slides themselves are
     tweened by GSAP, not re-rendered — only these two readouts need React. */
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);

    /* **Pinned at >=992px only.** Below that the band shows every lot stacked
       and scrolls normally: pinning a band on a phone traps the reader, the
       same rule `Services`, `LabProof`, `Contact` and `ProductSpotlight` all
       follow. */
    mm.add("(min-width: 992px) and (prefers-reduced-motion: no-preference)", () => {
      const slides = gsap.utils.toArray<HTMLElement>(".reel__slide", el);
      const steps = slides.length - 1;
      if (steps < 1) return;

      /* One step per lot after the first, so the pin is as long as the run.
         The timeline is scrubbed, which is what makes the carton change feel
         like the reader is turning it rather than watching a carousel. */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${steps * 100}%`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const i = Math.round(self.progress * steps);
            setActive((prev) => (prev === i ? prev : i));
          },
        },
      });

      /* **The swap takes the middle of each step, not all of it.** Fading two
         slides across a whole step leaves them at 50/50 for most of the run,
         and two sets of printed artwork at half opacity read as one doubled,
         ghosted carton rather than as a change. Same contract — and the same
         FADE share — as `ProductSpotlight`. */
      const FADE = 0.34;
      const hold = (1 - FADE) / 2;

      slides.forEach((slide, i) => {
        if (i === 0) return;
        const at = i - 1 + hold;
        tl.to(slides[i - 1], { opacity: 0, duration: FADE, ease: "none" }, at)
          .fromTo(
            slide,
            { opacity: 0 },
            { opacity: 1, duration: FADE, ease: "none" },
            at,
          )
          /* The ground travels with the product, so the band is lit by the
             lot rather than drifting ahead of it. */
          .fromTo(
            `.reel__ground--${i}`,
            { opacity: 0 },
            { opacity: 1, duration: FADE, ease: "none" },
            at,
          );
      });

      /* Pad the timeline to the full run so the last lot is held rather than
         landing exactly on the release. */
      tl.to({}, { duration: Math.max(0, steps - (steps - 1 + hold + FADE)) });

      /* The carton turns while its slide is on screen — the analogue of the
         reference's live 3D bottles. Each box owns `rotateY`/`rotateX` alone;
         the slide owns `opacity`, so no two tweens share a property on one
         element. `perspective` lives on the wrapper because GSAP writes
         `transform` wholesale and would wipe a `perspective()` inside it. */
      gsap.fromTo(
        ".reel__box",
        /* `rotate: 0` is load-bearing: GSAP reads the start off the computed
           *matrix* and decomposes it into its own rotation order, and the CSS
           resting pose (`rotateX` composed with `rotateY`) leaves a residual
           ~2.7deg roll that visibly tilts the carton. Same trap as `LotFan`. */
        { rotate: 0, rotateY: -8, rotateX: 11 },
        {
          rotate: 0,
          rotateY: 26,
          rotateX: 3,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${steps * 100}%`,
            scrub: true,
          },
        },
      );
    });

    /* The entrance runs at every width, pinned or not. */
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".reel__head, .reel__counter, .reel__previews", {
        y: 26,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 76%", once: true },
      });
      gsap.from(".reel__arch", {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 76%", once: true },
      });
    });

    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section className="section reel" ref={root}>
      {/* One tinted ground per lot, cross-faded by the timeline. They sit
          behind everything, so the band is lit by whichever lot is up. */}
      {LOTS.map((lot, i) => (
        <div
          className={`reel__ground reel__ground--${i}`}
          key={`ground-${lot.id}`}
          aria-hidden
        />
      ))}

      <div className="reel__inner">
        <p className="reel__head">{reelCopy.eyebrow}</p>

        {/* The counter, as the reference sets it: the active index against
            the run length. `aria-hidden` — the slides below carry the real
            reading order. */}
        <p className="reel__counter" aria-hidden>
          <span className="reel__counter-num">
            {String(active + 1).padStart(2, "0")}
          </span>
          <span className="reel__counter-sep">/</span>
          <span className="reel__counter-total">
            {String(LOTS.length).padStart(2, "0")}
          </span>
        </p>

        <div className="reel__stage">
          {LOTS.map((lot, i) => (
            <article
              className={`reel__slide${i === 0 ? " is-first" : ""}`}
              key={lot.id}
            >
              <div className="reel__copy">
                <p className="reel__label">{lot.sector}</p>
                <h3 className="reel__name">{lot.title}</h3>
                <p className="reel__price">{formatUsd(lot.price)}</p>
                <a className="reel__explore" href={`#/product/${lot.id}`}>
                  {reelCopy.explore}
                  <span className="reel__explore-arrow" aria-hidden>
                    ↗
                  </span>
                </a>
                {/* The lot's own `summary`, not restated copy — the product
                    page and this band cannot drift. */}
                <p className="reel__lede">{lot.summary}</p>
              </div>

              <div className="reel__visual">
                {/* The arch, the reference's own frame for its product. */}
                <div className="reel__arch">
                  <img
                    src={ARCHES[lot.id]}
                    alt=""
                    width={1024}
                    height={1024}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* The carton, built as a box so it turns in space — the
                    client's renders are all flat front-on. The render is the
                    front face; the hinged panels are the top and both sides.
                    See `LotFan` for the full note on this device. */}
                <div className="reel__pack">
                  <div className="reel__box">
                    <img
                      className="reel__face"
                      src={FACES[lot.id]}
                      alt={`${lot.title} research carton`}
                      width={846}
                      height={390}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="reel__side reel__side--top" aria-hidden />
                    <span className="reel__side reel__side--left" aria-hidden />
                    <span className="reel__side reel__side--right" aria-hidden />
                  </div>
                  <span className="reel__shadow" aria-hidden />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* The thumbnail rail. Indicators, not controls: the band is scrubbed
            by the scroll while it is pinned, so a click that jumped the run
            would fight the gesture that drives it. */}
        <ul className="reel__previews" aria-hidden>
          {LOTS.map((lot, i) => (
            <li
              className={`reel__preview${i === active ? " is-active" : ""}`}
              key={`prev-${lot.id}`}
            >
              <span className="reel__preview-media">
                <img
                  src={FACES[lot.id]}
                  alt=""
                  width={846}
                  height={390}
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span className="reel__preview-label">{lot.title}</span>
            </li>
          ))}
        </ul>

        <p className="reel__note">{reelCopy.note}</p>
      </div>
    </section>
  );
}
