import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { confidenceCopy } from "../data/site";
/* The centre media, **swapped from a product film to this still on request
   (2026-10-19)** — a straight webp conversion of the client drop
   `latest-images/product-analysis.png`, which stays untouched as the source
   of truth. It is a cut-out, so it sits straight on the band's own ground.

   ⚠ **Its printed pack copy is garbled** — see the compliance note on this
   band in `CLAUDE.md`. The film it replaced (`loop.mp4` + `poster.webp`) was
   built from the real catalogue render with ffmpeg precisely to avoid that;
   both files are kept, so restoring it is this import plus the markup below. */
import analysis from "../assets/confidence/analysis.webp";

/* Line icons, drawn into a 24 viewBox inside the outlined disc. */
const ICONS: Record<string, ReactNode> = {
  lab: <path d="M9.5 3h5M10.5 3v5.5L5.2 18.4A1.8 1.8 0 0 0 6.8 21h10.4a1.8 1.8 0 0 0 1.6-2.6L13.5 8.5V3M8 15h8" />,
  chart: <path d="M4 20h16M7 16v-4M11 16V8M15 16v-6M19 16V5" />,
  tag: <path d="M3 12V4h8l9 9-8 8-9-9Zm5-4.5h.01" />,
  seal: <path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3Zm-3 9 2.2 2.2L15.5 10" />,
  cold: <path d="M12 2v20M4 6l16 12M20 6 4 18M9 3.5l3 2.5 3-2.5M9 20.5l3-2.5 3 2.5" />,
  shield: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM5.6 5.6l12.8 12.8" />,
};

type Feature = (typeof confidenceCopy.left)[number];

function FeatureItem({ f }: { f: Feature }) {
  return (
    <li className="confidence__item">
      <span className="confidence__icon" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          {ICONS[f.icon]}
        </svg>
      </span>
      <h3 className="confidence__item-title">{f.title}</h3>
      <p className="confidence__item-text">{f.text}</p>
    </li>
  );
}

/**
 * A centred heading, three features down each side and a product film in
 * the middle. `.confidence__*` at the end of portfolio.css.
 */
export function ConfidenceBand() {
  const root = useRef<HTMLElement | null>(null);

  /* The on-screen playback gate that used to live here went with the film
     (2026-10-19) — a still needs no observer. It is in git with the `<video>`
     if the loop is ever restored. */

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 72%", once: true },
      });

      tl.from(".confidence__title", { y: 24, opacity: 0, duration: 0.7, ease: "power3.out" })
        .from(
          ".confidence__media",
          { scale: 0.9, opacity: 0, duration: 1.1, ease: "power3.out" },
          "-=0.4",
        )
        /* Each column slides in from its own side, one feature at a time. */
        .from(
          ".confidence__col--left .confidence__item",
          { x: -40, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.12 },
          "-=0.8",
        )
        .from(
          ".confidence__col--right .confidence__item",
          { x: 40, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.12 },
          "<",
        );

      /* The icons draw themselves in once their feature has landed. */
      el.querySelectorAll<SVGPathElement>(".confidence__icon path").forEach((p) => {
        const len = p.getTotalLength();
        gsap.fromTo(
          p,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            duration: 1.2,
            ease: "power2.inOut",
            delay: 0.6,
            scrollTrigger: { trigger: p, start: "top 85%", once: true },
          },
        );
      });

      /* A slow counter-drift on the centre media against the columns. */
      gsap.fromTo(
        ".confidence__media img",
        { yPercent: -4 },
        {
          yPercent: 4,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });

    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section className="confidence" ref={root} aria-labelledby="confidence-title">
      <h2 className="confidence__title" id="confidence-title">
        {confidenceCopy.title}
      </h2>

      <div className="confidence__grid">
        <ul className="confidence__col confidence__col--left">
          {confidenceCopy.left.map((f) => (
            <FeatureItem f={f} key={f.title} />
          ))}
        </ul>

        <figure className="confidence__media">
          <img
            src={analysis}
            alt={confidenceCopy.mediaAlt}
            width={941}
            height={1672}
            loading="lazy"
            decoding="async"
          />
        </figure>

        <ul className="confidence__col confidence__col--right">
          {confidenceCopy.right.map((f) => (
            <FeatureItem f={f} key={f.title} />
          ))}
        </ul>
      </div>
    </section>
  );
}
