import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "../data/site";

export function Services() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      /* Only the head animates. The cards and shots are position:sticky — a GSAP
         transform on them would fight the sticky offset. */
      gsap.from(".services__head > *", {
        y: 48,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    }, root);
    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section id="services" className="container section services" ref={root}>
      <div className="services__head">
        <div>
          <span className="eyebrow">Why shop with us</span>
          <h2 className="h2" style={{ marginTop: "1rem" }}>
            What you get, every order.
          </h2>
        </div>
        <p className="lead">
          Four things we promise on every order, whether it's your first single
          kit or your tenth restock.
        </p>
      </div>

      <div className="services__track">
        {/* Shots all pin at the same offset, so each one wipes over the last */}
        <div className="services__media" aria-hidden>
          {services.map((service) => (
            <figure className="services__shot" key={service.number}>
              <img
                src={service.image}
                alt=""
                width={900}
                height={1125}
                loading="lazy"
                decoding="async"
              />
            </figure>
          ))}
          {/* Matches the list's tail so both columns end together */}
          <span className="services__tail" />
        </div>

        {/* Cards pin at staggered offsets, so each one parks under the headers
            of the cards before it. */}
        <ol className="services__list">
          {services.map((service, i) => (
            <li
              className="service"
              key={service.number}
              style={{ "--i": i } as React.CSSProperties}
            >
              {/* The opaque panel is content-height, not card-height: it has to
                  cover the previous card's text without also covering the
                  wordmark sitting behind the empty lower half. */}
              <div className="service__panel">
                <div className="service__head">
                  <span className="service__num">[{service.number}]</span>
                  <h3 className="service__title">{service.title}</h3>
                </div>
                <div className="service__body">
                  <p className="service__desc">{service.description}</p>
                  <a className="service__link" href={service.link.href}>
                    {service.link.label}
                  </a>
                </div>
              </div>
            </li>
          ))}
          {/* Scroll room after the last card: without it the final card has no
              sticky window and the whole stack is pushed off the top. */}
          <li className="services__tail" aria-hidden />
          {/* Pinned to the bottom of the viewport, so it sits under every card
              in turn rather than only under the last one. */}
          <li className="services__word" aria-hidden>
            Every order
          </li>
        </ol>
      </div>
    </section>
  );
}
