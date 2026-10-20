import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { billboardCopy, projects } from "../data/site";
/* **Generated plate, real carton.** The figure was generated holding a blank
   white box and the catalogue's own render was composited onto it — image
   models re-draw printed packaging and garble it, so no generated pack was
   ever going to be usable. Background removed, then trimmed to its alpha
   bounds. See `CLAUDE.md` for the measured box quad. */
import figure from "../assets/billboard/figure.webp";
/* The four spec cards. Product-led retail stills, no people — the band names
   and prices a real lot, so a lifestyle frame beside it would read as that
   compound's outcome. */
import cardPurity from "../assets/standards/purity.webp";
import cardConsistency from "../assets/standards/consistency.webp";
import cardPackaging from "../assets/standards/packaging.webp";
import cardSupport from "../assets/standards/support.webp";

const CARD_IMAGES = [cardPurity, cardConsistency, cardPackaging, cardSupport];

/* Resolved once at module scope — everything it reads is static, and
   rebuilding it per render hands the scroll effects a new identity every
   time. Same note as `ProductSpotlight`'s `LOTS`. */
const LOT = projects.find((p) => p.id === billboardCopy.productId);

/**
 * The billboard band: a burgundy panel with the lot's name set enormous
 * behind a cut-out figure holding it, a frosted pill bottom left, a short
 * copy block bottom right, and the lot's own specs as a 4-up card row below.
 *
 * See `billboardCopy` for the reference this is built to and for why the
 * reference's own ingredient cards could not ship. `.billboard__*` at the end
 * of portfolio.css.
 */
export function Billboard() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 74%", once: true },
      });

      /* The ghost arrives first and the figure rises onto it, so the band
         reads as the word being stood in front of rather than the two
         appearing together. */
      tl.from(".billboard__ghost", {
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
      })
        .from(
          ".billboard__figure",
          { yPercent: 8, opacity: 0, duration: 1, ease: "power3.out" },
          "-=0.5",
        )
        .from(
          ".billboard__pill, .billboard__copy",
          { y: 26, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.1 },
          "-=0.5",
        )
        .from(
          ".billboard__card",
          {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.08,
          },
          "-=0.4",
        );

      /* The ghost drifts across as the band passes — the why-us band's
         effect at its settings, so every watermark on the site moves the
         same way. It owns `x`; the entrance owns `opacity`. */
      gsap.fromTo(
        ".billboard__ghost",
        { x: -34 },
        {
          x: 34,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      /* The figure counter-drifts against it, which is what separates the
         two planes. It owns `y` on the `<img>`; the entrance owns
         `yPercent`/`opacity` on the wrapper, so nothing shares a property on
         one element. */
      gsap.fromTo(
        ".billboard__figure img",
        { y: 26 },
        {
          y: -26,
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

  if (!LOT) return null;

  return (
    <section className="section billboard" ref={root}>
      <div className="billboard__panel">
        {/* The lot's own name set enormous, as the reference sets its product
            line. Decorative — the pill below carries the real, readable one —
            so it is hidden from assistive tech rather than read twice. */}
        <span className="billboard__ghost" aria-hidden>
          {LOT.title.split(" ")[0]}
        </span>

        <div className="billboard__figure">
          <img
            src={figure}
            alt={billboardCopy.figureAlt}
            width={524}
            height={1153}
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* The frosted pill, bottom left — a link rather than a label, as the
            reference draws it as a control. */}
        <a className="billboard__pill" href={billboardCopy.cta.href}>
          <span className="billboard__pill-label">
            {billboardCopy.pillLabel}
          </span>
          <span className="billboard__pill-name">{LOT.title}</span>
        </a>

        {/* The copy block, bottom right. Both lines are things the site
            already publishes — see `billboardCopy`. */}
        <div className="billboard__copy">
          <p className="billboard__copy-name">{LOT.title}</p>
          {billboardCopy.lines.map((line) => (
            <p className="billboard__copy-line" key={line}>
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* The reference's card row. Every card is one of the lot's real
          `specs`, read from `projects` — a figure typed into copy goes stale
          the moment the lot does. */}
      <ul className="billboard__cards">
        {LOT.specs.slice(0, 4).map((spec, i) => (
          <li className="billboard__card" key={spec.label}>
            <span className="billboard__card-media">
              <img
                src={CARD_IMAGES[i]}
                alt=""
                width={1024}
                height={1024}
                loading="lazy"
                decoding="async"
              />
            </span>
            <span className="billboard__card-title">{spec.label}</span>
            <span className="billboard__card-sub">{spec.value}</span>
          </li>
        ))}
      </ul>

      <p className="billboard__note">{billboardCopy.note}</p>
    </section>
  );
}
