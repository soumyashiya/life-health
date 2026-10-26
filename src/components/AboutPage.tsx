import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import clsx from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  aboutContact,
  aboutHero,
  aboutQuotes,
  aboutSignals,
  aboutStats,
  closing,
  compliance,
  deliveryPanel,
  operating,
  ordering,
  valueProps,
} from "../data/about";
import { parse, useRouter } from "../hooks/useRouter";

/* One stroke weight across the strip, same convention as the header controls. */
const PROP_ICONS: Record<string, ReactNode> = {
  repeat: <path d="M4 9h12l-3-3M20 15H8l3 3" />,
  doc: <path d="M7 3h7l4 4v14H7V3Zm7 0v4h4M10 12h5M10 16h5" />,
  cold: <path d="M12 2v20M4 6l16 12M20 6 4 18M9 3.5l3 2.5 3-2.5M9 20.5l3-2.5 3 2.5" />,
  chat: <path d="M4 5h16v11H9l-5 4V5Zm4 5h8M8 13h5" />,
};

/**
 * `#/about` — rebuilt as a storefront page, 2026-10-21 (requested).
 *
 * It was an editorial about page: a banner, a hairline stats grid, a copy
 * split, two pull-quotes and a contact row. It now reads as a shop — CTAs in
 * the hero, a promise strip, and an ordering walkthrough with the policy
 * links.
 *
 * **The "Shop the range" product grid was removed on request** the same day.
 * It was the only place on this page carrying prices and an add-to-cart, so
 * the page no longer sells anything directly — it points at `#/shop` from the
 * hero, the ordering band and the closing CTA instead. `shopPanel` in
 * `data/about.ts` and the `.about-page__shop-*` rules are kept, unused, so
 * restoring it is the JSX only (it is one commit back).
 *
 * What is deliberately NOT here, and must not be added:
 * - **star ratings or review counts.** There is no review data in this
 *   project; the quotes carry a name and role, which is all `testimonials`
 *   actually has.
 * - **offers, bundles, struck-through prices or shipping thresholds.** None is
 *   configured anywhere, so any figure would be fabricated commercial data —
 *   the objection that cut the same device out of `ProductOffer`.
 * - **anything that softens the research-use-only position.** The compliance
 *   block is verbatim and stays.
 */
export function AboutPage() {
  const root = useRef<HTMLDivElement | null>(null);
  const { navigate } = useRouter();

  /* Hash links are driven through the router rather than the browser — the
     site owns the hash, same as every other in-page link here. */
  const go = (href: string) => (e: MouseEvent) => {
    e.preventDefault();
    navigate(parse(href));
  };

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
            height={900}
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

          <div className="about-page__hero-actions" data-about-reveal>
            {aboutHero.ctas.map((cta) => (
              <a
                key={cta.href}
                className={clsx(
                  "about-page__pill",
                  cta.primary && "about-page__pill--solid",
                )}
                href={cta.href}
                onClick={go(cta.href)}
                data-cursor
              >
                {cta.label}
              </a>
            ))}
          </div>

          <ul className="about-page__hero-marks" data-about-reveal>
            {aboutHero.marks.map((mark) => (
              <li key={mark}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  <path d="M5 12.5 10 17.5 19 7.5" />
                </svg>
                {mark}
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* ------------------------------------------------- promise strip */}
      <section className="about-page__props-band" aria-label="What you get with every order">
        <ul className="container about-page__props" data-about-reveal>
          {valueProps.map((prop) => (
            <li className="about-page__prop" key={prop.title}>
              <span className="about-page__prop-icon" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  {PROP_ICONS[prop.icon]}
                </svg>
              </span>
              <span className="about-page__prop-text">
                <span className="about-page__prop-title">{prop.title}</span>
                <span className="about-page__prop-note">{prop.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

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
              height={1056}
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
              onClick={go(operating.link.href)}
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

      {/* ------------------------------------------------------ ordering */}
      <section className="about-page__ordering" aria-labelledby="about-ordering-title">
        <div className="container about-page__ordering-inner">
          <div className="about-page__ordering-copy">
            <span className="eyebrow" data-about-reveal>
              {ordering.eyebrow}
            </span>
            <h2
              className="h4 about-page__ordering-title"
              id="about-ordering-title"
              data-about-reveal
            >
              {ordering.title}
            </h2>

            <ol className="about-page__steps">
              {ordering.steps.map((step) => (
                <li className="about-page__step" key={step.number} data-about-reveal>
                  <span className="about-page__step-num mono">{step.number}</span>
                  <span className="about-page__step-body">
                    <span className="about-page__step-title">{step.title}</span>
                    <span className="about-page__step-text">{step.text}</span>
                  </span>
                </li>
              ))}
            </ol>

            <ul className="about-page__help-links" data-about-reveal>
              {ordering.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={go(link.href)} data-cursor>
                    {link.label}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                      <path d="M5 12h13M12 6l6 6-6 6" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <figure className="about-page__ordering-media" data-about-reveal>
            <img
              src={ordering.image}
              alt={ordering.imageAlt}
              loading="lazy"
              decoding="async"
              width={1500}
              height={1000}
            />
          </figure>
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
              height={1056}
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
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- closing */}
      <section className="container about-page__closing-wrap">
        <div className="about-page__closing" data-about-reveal>
          <img
            className="about-page__closing-photo"
            src={closing.image}
            alt={closing.imageAlt}
            loading="lazy"
            decoding="async"
            width={1600}
            height={900}
          />
          <div className="about-page__closing-body">
            <h2 className="h4 about-page__closing-title">{closing.title}</h2>
            <p className="about-page__closing-text">{closing.text}</p>
            <div className="about-page__closing-actions">
              {closing.ctas.map((cta) => (
                <a
                  key={cta.href}
                  className={clsx(
                    "about-page__pill",
                    cta.primary
                      ? "about-page__pill--light"
                      : "about-page__pill--ghost",
                  )}
                  href={cta.href}
                  onClick={go(cta.href)}
                  data-cursor
                >
                  {cta.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
