import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  aboutContact,
  aboutHero,
  aboutQuotes,
  aboutSignals,
  aboutStats,
  compliance,
  deliveryPanel,
  operating,
} from "../data/about";
import { parse, useRouter } from "../hooks/useRouter";

export function AboutPage() {
  const root = useRef<HTMLDivElement | null>(null);
  const { navigate } = useRouter();

  useEffect(() => {
    if (!root.current) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const targets =
        root.current?.querySelectorAll<HTMLElement>("[data-about-reveal]");
      targets?.forEach((target) => {
        gsap.from(target, {
          y: 28,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: target, start: "top 88%" },
        });
      });
    });

    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <div className="about-page" ref={root}>
      {/* ---------------------------------------------------------- hero */}
      <header className="about-page__hero">
        <div className="about-page__hero-media" aria-hidden>
          <img
            src={aboutHero.image}
            alt=""
            loading="eager"
            decoding="async"
            width={1600}
            height={1067}
          />
          <span className="about-page__hero-scrim" />
        </div>

        <div className="container about-page__hero-inner">
          <span className="eyebrow" data-about-reveal>
            {aboutHero.eyebrow}
          </span>
          <h1 className="h3 about-page__hero-title" data-about-reveal>
            {aboutHero.title}
          </h1>
          <p className="lead about-page__hero-lead" data-about-reveal>
            {aboutHero.lead}
          </p>
        </div>
      </header>

      {/* --------------------------------------------------------- stats */}
      <section className="container about-page__stats-wrap">
        <dl className="about-page__stats" data-about-reveal>
          {aboutStats.map((stat) => (
            <div key={stat.label}>
              <dt className="about-page__stat-value">
                {stat.value}
                <span>{stat.suffix}</span>
              </dt>
              <dd className="about-page__stat-label mono">{stat.label}</dd>
            </div>
          ))}
        </dl>

        <ul className="about-page__signals" data-about-reveal>
          {aboutSignals.map((signal) => (
            <li key={signal.label}>
              <span className="about-page__signal-label mono">{signal.label}</span>
              <span className="about-page__signal-value">{signal.value}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ----------------------------------------------------- operating */}
      <section className="container section about-page__block">
        <div className="about-page__split">
          <figure className="about-page__split-media" data-about-reveal>
            <img
              src={operating.image}
              alt={operating.imageAlt}
              loading="lazy"
              decoding="async"
              width={1400}
              height={933}
            />
          </figure>

          <div className="about-page__split-body">
            <h2 className="h4 about-page__split-title" data-about-reveal>
              {operating.title}
            </h2>
            {operating.body.map((paragraph) => (
              <p className="about-page__split-text" key={paragraph} data-about-reveal>
                {paragraph}
              </p>
            ))}
            <a
              className="about-page__inline-link"
              href={operating.link.href}
              data-cursor
              data-about-reveal
              onClick={(e) => {
                e.preventDefault();
                navigate(parse(operating.link.href));
              }}
            >
              {operating.link.label}
              <svg viewBox="0 0 16 16" fill="none" aria-hidden focusable="false">
                <path
                  d="M3 8h9M8.5 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="square"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- quotes */}
      <section className="container section about-page__block">
        <ul className="about-page__quotes">
          {aboutQuotes.map((quote) => (
            <li className="about-page__quote" key={quote.name} data-about-reveal>
              <blockquote>“{quote.quote}”</blockquote>
              <div className="about-page__quote-by">
                <img
                  src={quote.avatar}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={96}
                  height={96}
                />
                <span>
                  <span className="about-page__quote-name">{quote.name}</span>
                  <span className="about-page__quote-role mono">{quote.role}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------------------------------------------- compliance */}
      <section className="container section about-page__block">
        <div className="about-page__compliance">
          <figure className="about-page__compliance-media" data-about-reveal>
            <img
              src={deliveryPanel.image}
              alt={deliveryPanel.imageAlt}
              loading="lazy"
              decoding="async"
              width={1400}
              height={933}
            />
          </figure>

          <div className="about-page__compliance-body" data-about-reveal>
            <h2 className="about-page__compliance-title">{compliance.title}</h2>
            <ul className="about-page__compliance-list">
              {compliance.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- contact */}
      <section className="container section about-page__block">
        <div className="about-page__contact" data-about-reveal>
          <div>
            <h2 className="h4 about-page__contact-title">{aboutContact.title}</h2>
            <p className="about-page__contact-text">{aboutContact.body}</p>
          </div>

          <div className="about-page__contact-links">
            <a className="about-page__contact-email" href={`mailto:${aboutContact.email}`}>
              {aboutContact.email}
            </a>
            <ul className="about-page__socials">
              {aboutContact.socials.map((social) => (
                <li key={social.href}>
                  <a href={social.href} target="_blank" rel="noreferrer noopener">
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="btn"
              onClick={() => navigate({ name: "shop" })}
            >
              Browse the catalogue
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
