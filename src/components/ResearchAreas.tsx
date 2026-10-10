import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  researchAreas,
  researchAreaHref,
  researchAreaProducts,
} from "../data/research";

export function ResearchAreas() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!root.current) return;

    // matchMedia keeps the reveal opt-in: under reduced motion nothing is
    // registered, so the cards render in their final state.
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-research-reveal]", {
        y: 32,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: root.current,
          start: "top 80%",
        },
      });

      gsap.from(".research-card", {
        y: 64,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".research__grid",
          start: "top 82%",
        },
      });
    });

    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      id="research"
      className="container section research"
      ref={root}
      aria-labelledby="research-heading"
    >
      <div className="research__head">
        <div className="research__head-meta">
          <span className="eyebrow" data-research-reveal>
            Explore research
          </span>
          <span className="mono" data-research-reveal>
            {String(researchAreas.length).padStart(2, "0")} areas
          </span>
        </div>
        <div className="research__head-row">
          <h2 className="h2 research__heading" id="research-heading" data-research-reveal>
            Explore research areas
          </h2>
          <p className="lead research__lead" data-research-reveal>
            Explore our research-focused categories and discover materials
            relevant to different areas of laboratory research.
          </p>
        </div>
      </div>

      <ul className="research__grid">
        {researchAreas.map((area) => {
          const count = researchAreaProducts(area).length;
          return (
            <li className="research__cell" key={area.id}>
              <a
                className="research-card"
                href={researchAreaHref(area)}
                data-cursor
                data-cursor-text="Explore"
              >
                <span className="research-card__corner tl" aria-hidden />
                <span className="research-card__corner br" aria-hidden />

                <div className="research-card__body">
                  <span className="research-card__head">
                    <span className="research-card__num">{area.number}</span>
                    <span className="research-card__count mono">
                      {count} {count === 1 ? "product" : "products"}
                    </span>
                  </span>
                  <h3 className="research-card__title">
                    {area.titleLines[0]}
                    <span className="research-card__title-line">
                      {area.titleLines[1]}
                    </span>
                  </h3>
                  <p className="research-card__desc">{area.description}</p>
                  <span className="research-card__cta">
                    Explore Research
                    <svg
                      className="research-card__arrow"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden
                      focusable="false"
                    >
                      <path
                        d="M3 13 13 3M6 3h7v7"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="square"
                      />
                    </svg>
                  </span>
                </div>

                {/* Decorative: the heading and description already name the
                    area, so an alt here would only pad the link's name. */}
                <div className="research-card__media">
                  <img
                    className="research-card__img"
                    src={area.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={1600}
                    height={1062}
                  />
                  <span className="research-card__scrim" aria-hidden />
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
