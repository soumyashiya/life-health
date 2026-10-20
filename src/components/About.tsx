import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { aboutCopy, projects, site } from "../data/site";
import { SplitText } from "./SplitText";

const aboutImageSrc = site.aboutImage;

/* The packshot that floats over the photo — a real catalogue product, and the
   purity chip beside it is that lot's published figure, never a round number. */
const FEATURED = projects.find((p) => p.id === "p1") ?? projects[0];

const TRUST = [
  "Third-party tested",
  "Sealed & cold-packed",
  "Batch documented",
  "Tracked delivery",
  "WhatsApp support",
];

export function About() {
  const root = useRef<HTMLElement | null>(null);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      // The start state must live inside the tween: a standalone gsap.set() is
      // re-applied by ScrollTrigger.refresh() (which images fire on load) and
      // strands the chars offset behind the .split mask.
      gsap.fromTo(
        ".about__heading .char",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1,
          ease: "power4.out",
          stagger: 0.02,
          scrollTrigger: { trigger: ".about__heading", start: "top 80%" },
        },
      );

      gsap.utils.toArray<HTMLElement>(".about__stat-value").forEach((node) => {
        const target = Number(node.dataset.target ?? 0);
        const counter = { value: 0 };
        gsap.to(counter, {
          value: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: node,
            start: "top 85%",
            toggleActions: "play none none reset",
          },
          onUpdate: () => {
            const numEl = node.querySelector(".about__stat-number");
            if (numEl) numEl.textContent = String(Math.round(counter.value));
          },
        });
      });

      gsap.from("[data-about-reveal]", {
        y: 32,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });

      gsap.fromTo(
        ".about__media-inner",
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.4,
          ease: "power4.out",
          scrollTrigger: { trigger: ".about__media", start: "top 85%" },
        },
      );

      /* The packshot card arrives after the frame it sits on */
      gsap.from(".about__float", {
        y: 40,
        opacity: 0,
        scale: 0.92,
        duration: 1,
        ease: "power3.out",
        delay: 0.35,
        scrollTrigger: { trigger: ".about__media", start: "top 80%" },
      });

      gsap.to(".about__photo-img", {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: ".about__media",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      /* Counter-drift so the packshot separates from the photo on scroll */
      gsap.to(".about__float", {
        yPercent: -14,
        ease: "none",
        scrollTrigger: {
          trigger: ".about__media",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  const purity = FEATURED.labAnalysis?.purity;

  return (
    <section id="about" className="container section about" ref={root}>
      <div className="about__head">
        <span className="eyebrow" data-about-reveal>
          About us
        </span>
        <SplitText
          text={aboutCopy.heading}
          as="h2"
          className="about__heading"
        />
      </div>

      <div className="about__grid">
        <figure className="about__media" data-cursor data-cursor-text="Lab">
          <div className="about__media-inner">
            {!imageFailed && (
              <img
                className="about__photo-img"
                src={aboutImageSrc}
                alt={`${site.name} — research-grade peptide reference materials`}
                onError={() => setImageFailed(true)}
              />
            )}
          </div>

          {purity && (
            <span className="about__chip">
              <strong>{purity}</strong>
              HPLC verified
            </span>
          )}

          {/* A product, not a decoration: it links to its own page */}
          <a className="about__float" href={`#/product/${FEATURED.id}`}>
            <span className="about__float-media">
              <img src={FEATURED.image} alt="" loading="lazy" decoding="async" />
            </span>
            <span className="about__float-meta">
              <span className="about__float-name">{FEATURED.title}</span>
              <span className="about__float-price">${FEATURED.price}</span>
            </span>
          </a>
        </figure>

        <div className="about__content">
          <p className="about__body" data-about-reveal>
            {aboutCopy.paragraph}
          </p>

          <ul className="about__signals" data-about-reveal>
            {aboutCopy.signals.map((s) => (
              <li key={s.label}>
                <span className="mono">{s.label}</span>
                <span>{s.value}</span>
              </li>
            ))}
          </ul>

          <div className="about__actions" data-about-reveal>
            <a className="btn btn--secondary" href="#/shop">
              Shop the range
            </a>
            <a className="btn btn--ghost" href="#/about">
              Our story
            </a>
          </div>

          <ul className="about__stats">
            {aboutCopy.stats.map((stat) => (
              <li className="about__stat" key={stat.label} data-about-reveal>
                <span className="about__stat-value" data-target={stat.value}>
                  <span className="about__stat-number">0</span>
                  <span className="about__stat-suffix">{stat.suffix}</span>
                </span>
                <span className="about__stat-label">{stat.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="about__trust" aria-hidden>
        <div className="about__trust-track">
          {[...TRUST, ...TRUST, ...TRUST, ...TRUST].map((item, i) => (
            <span className="about__trust-item" key={`${item}-${i}`}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
