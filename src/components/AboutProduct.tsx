import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { aboutProductCopy, services } from "../data/site";
import { purityMethod } from "../data/science";
/* The stage image (client drop, 2026-10-19) — a straight webp conversion of
   `latest-images/product-info-img1.png`, which stays untouched as the source
   of truth. It replaced the `p1` catalogue render that sat on the oval.

   ⚠ **Its printed pack copy is garbled** — the same AI-rendered pack as the
   confidence band's drop, mangled and partly mirrored. See the compliance
   note on this band in `CLAUDE.md`. It is also a TESAMORELIN carton, which
   the catalogue does not stock, so nothing in the band describes the pack and
   the alt names no compound. */
import stagePhoto from "../assets/aboutprod/stage.webp";
/* The "The same every order" circle's photo (2026-10-20, requested) — a
   straight webp conversion of the client drop `latest-images/every order.png`.
   Overridden here rather than on `services[1]`, whose image the Contact band
   also uses. */
import everyOrderPhoto from "../assets/aboutprod/every-order.webp";

/* Resolved once at module scope, not per render: everything they read is
   static, and rebuilding them hands the scroll effects a new identity every
   time. Same note as `ProductSpotlight`'s `LOTS`.

   **The two cards and the two circles are the four `services` promises**, one
   each — the reference's own cards and labels are benefit and formulation
   claims and could not ship. See `aboutProductCopy`. */
const SIDES = [
  { circle: services[1], circleImage: everyOrderPhoto, card: services[0] },
  { circle: services[3], circleImage: services[3].image, card: services[2] },
] as const;

/* Every field a published report carries. Five entries, which is also the
   reference's chip count. */
const CHIPS = purityMethod.documentation;


/**
 * The about-product band: a centred title and lead over the product on an
 * oval stage, with a circular mark and a tinted card down each side joined to
 * the centre by hairline braces, closed by a row of chips.
 *
 * See `aboutProductCopy` for the reference this is built to and for why
 * almost none of its copy could ship. `.aboutprod__*` at the end of
 * portfolio.css.
 */
export function AboutProduct() {
  const root = useRef<HTMLElement | null>(null);

  /* Split in the component, not in the data: the copy stays one readable
     string in `site.ts`, and because the spans are plain inline text the lead
     still selects and reads as one sentence. Same contract as
     `.aboutband__word`. */
  const words = aboutProductCopy.lead.split(" ");

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      /* **The arrival, eased long and overlapped** (2026-10-19, requested:
         "smooth animation when loaded"). It starts earlier (`top 82%`) and
         every beat overlaps the one before, so the band assembles as one
         movement instead of a sequence of separate pops. `--ease-out`'s curve
         (`power3.out`) is the site's, used throughout. */
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
      });

      /* The stage opens first and the two sides arrive towards it, which is
         what makes the braces read as connections rather than decoration. */
      tl.from(".aboutprod__title", { y: 22, opacity: 0, duration: 0.7 })
        .from(".aboutprod__lead", { y: 18, opacity: 0, duration: 0.8 }, "-=0.5")
        /* The oval opens from its own centre and focuses in — the aperture +
           blur device `LabProof`'s circles use, which is what makes a round
           frame read as opening rather than scaling. */
        .from(
          ".aboutprod__stage",
          {
            clipPath: "circle(0% at 50% 50%)",
            scale: 0.92,
            opacity: 0,
            duration: 1.15,
            ease: "power2.out",
          },
          "-=0.55",
        )
        .from(
          ".aboutprod__pack",
          { scale: 1.25, filter: "blur(12px)", duration: 1.2, ease: "power2.out" },
          "<",
        )
        .from(
          ".aboutprod__side--left .aboutprod__circle, .aboutprod__side--left .aboutprod__card",
          { x: -40, opacity: 0, duration: 0.8, stagger: 0.12 },
          "-=0.85",
        )
        .from(
          ".aboutprod__side--right .aboutprod__circle, .aboutprod__side--right .aboutprod__card",
          { x: 40, opacity: 0, duration: 0.8, stagger: 0.12 },
          "<",
        )
        /* The braces draw themselves in towards the stage. `scaleX` from the
           outer edge, so the line grows the way the eye travels. */
        .from(
          ".aboutprod__brace",
          { scaleX: 0, opacity: 0, duration: 0.6, ease: "power2.out" },
          "-=0.5",
        )
        .from(
          ".aboutprod__chip",
          { y: 20, opacity: 0, duration: 0.6, stagger: 0.07 },
          "-=0.35",
        )
        .from(".aboutprod__note", { opacity: 0, duration: 0.5 }, "-=0.25");

      /* The lead fills a word at a time as the band passes — the site's
         existing device (`.aboutband__word`), at its settings, so this band
         and the about band read as one language. The resting CSS state is the
         *finished* one, so reduced motion renders it at full strength. */
      gsap.fromTo(
        ".aboutprod__word",
        { opacity: 0.28 },
        {
          opacity: 1,
          ease: "none",
          stagger: 1,
          scrollTrigger: {
            trigger: ".aboutprod__lead",
            start: "top 88%",
            end: "bottom 62%",
            scrub: true,
          },
        },
      );

      /* The pack drifts against the band as it passes. It owns `y` on the
         `<img>`; the entrance owns `scale`/`opacity` on the stage around it,
         so nothing shares a property on one element. */
      gsap.fromTo(
        ".aboutprod__pack",
        { y: 14 },
        {
          y: -14,
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
    <section className="section aboutprod" ref={root}>
      <div className="aboutprod__inner">
        <h2 className="aboutprod__title">{aboutProductCopy.title}</h2>

        <p className="aboutprod__lead">
          {words.map((word, i) => (
            <span className="aboutprod__word" key={`${word}-${i}`}>
              {word}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </p>

        <div className="aboutprod__grid">
          {SIDES.map((side, i) => (
            <div
              className={`aboutprod__side aboutprod__side--${i === 0 ? "left" : "right"}`}
              key={side.card.number}
            >
              <figure className="aboutprod__circle">
                <span className="aboutprod__circle-media">
                  <img
                    src={side.circleImage}
                    alt=""
                    width={900}
                    height={1118}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <figcaption className="aboutprod__circle-label">
                  {side.circle.title}
                </figcaption>
              </figure>

              {/* The reference's hairline bracket running from the mark in
                  towards the stage. Decorative. */}
              <span className="aboutprod__brace" aria-hidden />

              <div className="aboutprod__card">
                <h3 className="aboutprod__card-title">{side.card.title}</h3>
                <p className="aboutprod__card-text">{side.card.description}</p>
              </div>
            </div>
          ))}

          {/* The oval stage, as the reference centres its bottle. The client
              drop fills it rather than sitting on it — see the import note
              and `aboutProductCopy` for the compliance position. */}
          <div className="aboutprod__stage">
            <img
              className="aboutprod__pack"
              src={stagePhoto}
              alt={aboutProductCopy.stageAlt}
              width={941}
              height={1672}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        {/* Every field a published report carries, read from
            `purityMethod.documentation` so this band and the Science page
            cannot drift. */}
        <ul className="aboutprod__chips" aria-label={aboutProductCopy.chipsLabel}>
          {CHIPS.map((chip, i) => (
            <li className={`aboutprod__chip aboutprod__chip--${i % 2}`} key={chip}>
              {chip}
            </li>
          ))}
        </ul>

        <p className="aboutprod__note">{aboutProductCopy.note}</p>
      </div>
    </section>
  );
}
