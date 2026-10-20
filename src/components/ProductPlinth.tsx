import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { aboutCopy, plinthCopy } from "../data/site";
/* The same pre-cropped carton face the badge band uses — exactly the printed
   rectangle, so the built box's top and side hinge on the artwork's own
   edges. See `.lotfan__box` for why the uncropped render will not do. */
import face from "../assets/lotfan/face.webp";
import cardPhoto from "../assets/standards/purity.webp";

const ICONS: Record<string, ReactNode> = {
  lab: (
    <>
      <path d="M9 3v6.2L4.6 17A2.4 2.4 0 0 0 6.7 20.6h10.6A2.4 2.4 0 0 0 19.4 17L15 9.2V3" />
      <path d="M7.5 3h9M7.8 13.5h8.4" />
    </>
  ),
  seal: (
    <>
      <circle cx="12" cy="10" r="5.5" />
      <path d="M9 15l-1 6 4-2 4 2-1-6" />
    </>
  ),
};

/**
 * The plinth band: a centred head, the pack standing on a white plinth with
 * a feature either side, a round link badge, and a three-part foot.
 *
 * See `plinthCopy` for the reference this is built to and for the three
 * things in it — benefit headline, formulation features and a review count —
 * that could not ship.
 */
export function ProductPlinth() {
  const root = useRef<HTMLElement | null>(null);
  /* The figure is one the About page already publishes, not a new claim. */
  const stat = aboutCopy.stats[1];

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 74%", once: true },
      });

      tl.from(".plinth__line > span", {
        yPercent: 110,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.09,
      })
        .from(".plinth__lead", { y: 16, opacity: 0, duration: 0.6 }, "-=0.45")
        .from(
          ".plinth__pedestal",
          { scaleY: 0.4, opacity: 0, duration: 0.7, ease: "power3.out", transformOrigin: "50% 100%" },
          "-=0.35",
        )
        .from(
          ".plinth__pack",
          { y: 60, opacity: 0, duration: 0.9, ease: "power3.out" },
          "-=0.55",
        )
        .from(
          ".plinth__feature",
          { x: (i: number) => (i === 0 ? -28 : 28), opacity: 0, duration: 0.6, stagger: 0.1 },
          "-=0.6",
        )
        .from(
          ".plinth__badge",
          { scale: 0.5, opacity: 0, duration: 0.6, ease: "back.out(1.8)" },
          "-=0.4",
        )
        .from(
          ".plinth__foot > *",
          { y: 22, opacity: 0, duration: 0.6, stagger: 0.09 },
          "-=0.35",
        );

      /* Disjoint from the entrance: that owns `y`/`opacity`/`scaleY`/`x`,
         this owns the box's rotation alone. Positive only — the left side of
         the box is not built. `perspective` is on the wrapper because GSAP
         writes `transform` wholesale. */
      gsap.fromTo(
        ".plinth__box",
        { rotateY: 6, rotateX: 8 },
        {
          rotateY: 24,
          rotateX: 3,
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
    <section className="section plinth" ref={root}>
      <header className="plinth__head">
        <h2 className="plinth__title">
          {plinthCopy.lines.map((line) => (
            <span className="plinth__line" key={line}>
              <span>{line}</span>
            </span>
          ))}
        </h2>
        <p className="plinth__lead">{plinthCopy.lead}</p>
      </header>

      <div className="plinth__stage">
        {/* A sibling of the product, not a child: an absolute overlay on
            desktop and a plain row underneath once the stage narrows. */}
        <ul className="plinth__features">
          {plinthCopy.features.map((f) => (
            <li className="plinth__feature" key={f.icon}>
              <span className="plinth__feature-icon" aria-hidden>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {ICONS[f.icon]}
                </svg>
              </span>
              <span className="plinth__feature-text">
                <strong>{f.title}</strong>
                <span>{f.note}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="plinth__product">
          {/* The wrapper carries the perspective and is what GSAP animates;
              the box carries only the rotation. */}
          <div className="plinth__pack">
            <div className="plinth__box">
              <img
                className="plinth__face"
                src={face}
                alt={plinthCopy.packAlt}
                width={846}
                height={390}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <div className="plinth__pedestal" aria-hidden />
        </div>

        {/* The reference's badge reads "Explore Product". This one goes to
            the catalogue — the pack on the plinth has no product page, and a
            badge that looked like one would imply it is for sale. */}
        <a className="plinth__badge" href={plinthCopy.badge.href} data-cursor>
          {plinthCopy.badge.label}
        </a>
      </div>

      <div className="plinth__foot">
        <p className="plinth__aside">{plinthCopy.aside}</p>

        <article className="plinth__card">
          <div className="plinth__card-copy">
            <p>{plinthCopy.card.text}</p>
            <a href={plinthCopy.card.link.href} data-cursor>
              {plinthCopy.card.link.label}
            </a>
          </div>
          <img
            src={cardPhoto}
            alt={plinthCopy.card.photoAlt}
            width={900}
            height={1118}
            loading="lazy"
            decoding="async"
          />
        </article>

        {/* `aboutCopy.stats` — a figure the About page already publishes. */}
        <div className="plinth__stat">
          <span className="plinth__stat-value">
            {stat.value}
            {stat.suffix}
          </span>
          <span className="plinth__stat-label">{stat.label}</span>
        </div>
      </div>
    </section>
  );
}
