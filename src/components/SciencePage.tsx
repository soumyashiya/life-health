import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  purityMethod,
  scienceHero,
  sciencePromises,
  scienceReports,
  scienceSections,
  scienceStats,
  standards,
  teamPanel,
  type ScienceSection,
} from "../data/science";
import { useCart } from "../hooks/useCart";
import { useRouter } from "../hooks/useRouter";
import { getLenis } from "../hooks/useSmoothScroll";
import { SplitText } from "./SplitText";

type Props = { section?: ScienceSection };

const formatUsd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

/* One stroke weight across the strip, the header controls' convention. The
   first and second differ from the About page's set — this page's promise is
   the paperwork, so the lab flask leads — but the markup and CSS are shared
   with `.about-page__props` deliberately: one strip design, not two. */
const PROP_ICONS: Record<string, ReactNode> = {
  doc: <path d="M7 3h7l4 4v14H7V3Zm7 0v4h4M10 12h5M10 16h5" />,
  lab: <path d="M10 3h4M11 3v6L5.5 18A2 2 0 0 0 7.2 21h9.6a2 2 0 0 0 1.7-3L13 9V3M8.5 14h7" />,
  cold: <path d="M12 2v20M4 6l16 12M20 6 4 18M9 3.5l3 2.5 3-2.5M9 20.5l3-2.5 3 2.5" />,
  chat: <path d="M4 5h16v11H9l-5 4V5Zm4 5h8M8 13h5" />,
};

export function SciencePage({ section }: Props) {
  const root = useRef<HTMLDivElement | null>(null);
  const railInner = useRef<HTMLDivElement | null>(null);
  const marker = useRef<HTMLSpanElement | null>(null);
  const progress = useRef<HTMLSpanElement | null>(null);
  const [current, setCurrent] = useState<ScienceSection>(
    section ?? "standards",
  );
  /** Only one certificate open at a time — the scans are full-page images. */
  const [openReport, setOpenReport] = useState<string | null>(null);
  /** Which row's Add to cart is showing its confirmation, as `ProductRange`. */
  const [addedId, setAddedId] = useState<string | null>(null);
  const { navigate } = useRouter();
  const { addItem, open: openCart } = useCart();

  const addToCart = (id: string) => {
    addItem(id, 1);
    setAddedId(id);
    openCart();
    window.setTimeout(
      () => setAddedId((current) => (current === id ? null : current)),
      1400,
    );
  };

  /**
   * Scroll through Lenis rather than `scrollIntoView`. Native smooth scrolling
   * fights the smooth-scroll instance that runs site-wide, and the offset has
   * to clear the fixed header *and* this page's own sticky rail — otherwise
   * the section heading lands underneath it.
   */
  const scrollToSection = useCallback((id: ScienceSection) => {
    const el = document.getElementById(`science-${id}`);
    if (!el) return;
    const navH =
      document.querySelector<HTMLElement>(".nav")?.offsetHeight ?? 0;
    const railH =
      document.querySelector<HTMLElement>(".science__rail")?.offsetHeight ?? 0;
    const offset = -(navH + railH + 16);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = getLenis();

    if (lenis) {
      lenis.scrollTo(el, { offset, duration: reduced ? 0 : 1.2 });
      return;
    }
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY + offset,
      behavior: reduced ? "auto" : "smooth",
    });
  }, []);

  /* ---- deep link: scroll to the requested section once laid out --------- */
  useEffect(() => {
    if (!section) return;
    // One frame so the section has its final height before we measure it.
    const id = window.requestAnimationFrame(() => scrollToSection(section));
    return () => window.cancelAnimationFrame(id);
  }, [section, scrollToSection]);

  /* ---- rail follows whichever section owns the viewport ----------------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!hit) return;
        const id = hit.target.id.replace("science-", "");
        setCurrent(id as ScienceSection);
      },
      // Band across the middle of the viewport, so the active item changes
      // when a section genuinely takes over rather than on first pixel.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    for (const s of scienceSections) {
      const el = document.getElementById(`science-${s.id}`);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  /* ---- rail: sliding marker follows the active section ------------------ */
  useEffect(() => {
    const strip = railInner.current;
    const bar = marker.current;
    if (!strip || !bar) return;

    const index = scienceSections.findIndex((s) => s.id === current);
    const link = strip.children[index] as HTMLElement | undefined;
    if (!link) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(bar, {
      x: link.offsetLeft,
      width: link.offsetWidth,
      duration: reduced ? 0 : 0.5,
      ease: "power3.out",
    });

    // Keep the active item in view when the strip scrolls on narrow screens.
    if (strip.scrollWidth > strip.clientWidth) {
      strip.scrollTo({
        left: link.offsetLeft - (strip.clientWidth - link.offsetWidth) / 2,
        behavior: reduced ? "auto" : "smooth",
      });
    }
  }, [current]);

  /* ---- entrance + scroll-driven animation ------------------------------- */
  useEffect(() => {
    if (!root.current) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      /* Hero headline rises character by character behind its own mask. */
      gsap.fromTo(
        ".science__hero-title .char",
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 1,
          ease: "power4.out",
          stagger: 0.012,
          delay: 0.1,
        },
      );

      /* The banner drifts slower than the page scrolling over it. */
      gsap.to(".science__hero-media img", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: ".science__hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      /* Reading progress across the rail. */
      if (progress.current) {
        gsap.fromTo(
          progress.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.3,
            },
          },
        );
      }

      /* Generic reveals, batched so a row of cards arrives together rather
         than each firing its own trigger. */
      ScrollTrigger.batch("[data-sci-reveal]", {
        start: "top 88%",
        onEnter: (batch) =>
          gsap.from(batch, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.08,
            overwrite: true,
          }),
      });

      /* The purity meters fill to their real reading as each row arrives.
         Animate scaleX, never width: `width` is set inline as a percentage of
         the lot's actual purity, and tweening it makes GSAP freeze that into a
         pixel value — the bars then under-report the published figure. The
         fill already has `transform-origin: left center` for this. */
      gsap.utils.toArray<HTMLElement>(".report__meter-fill").forEach((bar) => {
        gsap.from(bar, {
          scaleX: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: bar, start: "top 92%" },
        });
      });

      /* The method image counter-drifts against its column. */
      gsap.to(".science__purity-media img", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: ".science__purity",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);

    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  const go = (id: ScienceSection) => {
    navigate({ name: "science", section: id });
    scrollToSection(id);
  };

  return (
    <div className="science" ref={root}>
      {/* ---------------------------------------------------------- hero */}
      <header className="science__hero">
        <div className="science__hero-media" aria-hidden>
          <img
            src={scienceHero.image}
            alt=""
            loading="eager"
            decoding="async"
            width={1600}
            height={1067}
          />
          <span className="science__hero-scrim" />
        </div>

        <div className="container science__hero-inner">
          <span className="eyebrow" data-sci-reveal>
            {scienceHero.eyebrow}
          </span>
          {/* Split so each character can rise behind its own mask. */}
          <h1
            className="h2 science__hero-title"
            aria-label={scienceHero.title}
          >
            <SplitText text={scienceHero.title} as="span" ariaLabel="" />
          </h1>
          <p className="lead science__hero-lead" data-sci-reveal>
            {scienceHero.lead}
          </p>

          {/* Shares the About hero's pill, deliberately — one control design
              across both pages rather than a second set of rules. */}
          <div className="science__hero-actions" data-sci-reveal>
            {scienceHero.ctas.map((cta) => (
              <a
                key={cta.href}
                className={clsx(
                  "about-page__pill",
                  cta.primary && "about-page__pill--solid",
                )}
                href={cta.href}
                data-cursor
                onClick={(e) => {
                  e.preventDefault();
                  if (cta.href.startsWith("#/science")) {
                    go("reports");
                    return;
                  }
                  navigate({ name: "shop" });
                }}
              >
                {cta.label}
              </a>
            ))}
          </div>

          <ul className="science__hero-marks" data-sci-reveal>
            {scienceHero.marks.map((mark) => (
              <li key={mark}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  <path d="M5 12.5 10 17.5 19 7.5" />
                </svg>
                {mark}
              </li>
            ))}
          </ul>

          <dl className="science__stats" data-sci-reveal>
            {scienceStats.map((stat) => (
              <div key={stat.label}>
                <dt className="science__stat-value">{stat.value}</dt>
                <dd className="science__stat-label mono">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* ------------------------------------------------- promise strip */}
      {/* Shares the About page's strip — same classes, same `whyUs` source, so
          the two surfaces cannot drift and this cost no new CSS. It sits above
          the rail because it is page furniture, not one of the three
          sections. */}
      <section
        className="about-page__props-band"
        aria-label="What you get with every order"
      >
        <ul className="container about-page__props" data-sci-reveal>
          {sciencePromises.map((prop) => (
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

      {/* ------------------------------------------------- sticky section rail */}
      <nav className="science__rail" aria-label="On this page">
        <div className="container science__rail-inner" ref={railInner}>
          {scienceSections.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx("science__rail-link", current === s.id && "is-current")}
              aria-current={current === s.id ? "true" : undefined}
              data-cursor
              onClick={() => go(s.id)}
            >
              {s.label}
            </button>
          ))}
          {/* Slides between items rather than fading one underline out and
              another in. Positioned from the active link's layout box. */}
          <span className="science__rail-marker" ref={marker} aria-hidden />
        </div>
        {/* Reading progress for the whole page. */}
        <span className="science__rail-progress" ref={progress} aria-hidden />
      </nav>

      {/* ----------------------------------------------------- 01 standards */}
      <section className="container section science__block" id="science-standards">
        <div className="science__block-head">
          <span className="science__block-num mono" data-sci-reveal>
            01
          </span>
          <h2 className="h3 science__block-title" data-sci-reveal>
            Our standards
          </h2>
          <p className="lead science__block-lead" data-sci-reveal>
            Four controls sit behind every order that leaves us. This is what
            "verified" means when you see it on a product page.
          </p>
        </div>

        <ul className="science__standards">
          {standards.map((item) => (
            <li className="science__standard" key={item.number} data-sci-reveal>
              <span className="science__standard-num mono">{item.number}</span>
              <h3 className="science__standard-title">{item.title}</h3>
              <p className="science__standard-body">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* -------------------------------------------------------- 02 purity */}
      <section className="container section science__block" id="science-purity">
        <div className="science__block-head">
          <span className="science__block-num mono" data-sci-reveal>
            02
          </span>
          <h2 className="h3 science__block-title" data-sci-reveal>
            Verified purity
          </h2>
          <p className="lead science__block-lead" data-sci-reveal>
            Purity is measured, not asserted. Each batch goes through the same
            two-instrument check before it is released.
          </p>
        </div>

        <div className="science__purity">
          <figure className="science__purity-media" data-sci-reveal>
            <img
              src={purityMethod.image}
              alt={purityMethod.imageAlt}
              loading="lazy"
              decoding="async"
              width={1400}
              height={933}
            />
          </figure>

          <ol className="science__method">
            {purityMethod.steps.map((step, i) => (
              <li className="science__method-step" key={step.label} data-sci-reveal>
                <span className="science__method-index mono">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="science__method-label">{step.label}</h3>
                  <p className="science__method-body">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="science__doc" data-sci-reveal>
          <p className="science__doc-title mono">Every certificate carries</p>
          <ul className="science__doc-list">
            {purityMethod.documentation.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------- 03 reports */}
      <section className="container section science__block" id="science-reports">
        <div className="science__block-head">
          <span className="science__block-num mono" data-sci-reveal>
            03
          </span>
          <h2 className="h3 science__block-title" data-sci-reveal>
            Lab reports
          </h2>
          <p className="lead science__block-lead" data-sci-reveal>
            Every lot in the shop, with its published analysis and its price.
            Open a row to read the certificate exactly as the lab issued it, or
            add the lot straight to your cart.
          </p>
        </div>

        <ul className="reports">
          {scienceReports.map((report) => {
            const isOpen = openReport === report.productId;
            return (
              <li key={report.productId} data-sci-reveal>
                <article className={clsx("report", isOpen && "is-open")}>
                  {/* The buy controls sit OUTSIDE the expand button — a button
                      cannot nest inside a button — so the row is a flex pair:
                      the whole left side expands the certificate, the right
                      side buys the lot. */}
                  <div className="report__row">
                    <h3 className="report__heading">
                      <button
                        type="button"
                        className="report__summary"
                        aria-expanded={isOpen}
                        aria-controls={`report-${report.productId}`}
                        data-cursor
                        onClick={() =>
                          setOpenReport(isOpen ? null : report.productId)
                        }
                      >
                        <span className="report__thumb" aria-hidden>
                          <img
                            src={report.image}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            width={320}
                            height={320}
                          />
                        </span>

                        <span className="report__id">
                          <span className="report__title">{report.title}</span>
                          {report.shelf && (
                            <span className="report__shelf">{report.shelf}</span>
                          )}
                          <span className="report__batch mono">
                            Lot {report.batchNumber} · {report.fillVolume}
                          </span>
                        </span>

                        {/* Meter runs the true 0–100 scale: every lot reading
                            near-full is the honest picture, and the exact
                            figure is printed beside it either way. */}
                        <span className="report__purity">
                          <span className="report__purity-top">
                            <span className="report__purity-label mono">
                              HPLC purity
                            </span>
                            <span className="report__purity-figure">
                              {report.purity}
                            </span>
                          </span>
                          <span className="report__meter">
                            <span
                              className="report__meter-fill"
                              style={{
                                width: Number.isFinite(report.purityValue)
                                  ? `${Math.min(report.purityValue, 100)}%`
                                  : "0%",
                              }}
                            />
                          </span>
                        </span>

                        <span className="report__toggle" aria-hidden>
                          <span className="report__toggle-text mono">
                            {isOpen ? "Close" : "Report"}
                          </span>
                          <span className="report__chevron" />
                        </span>
                      </button>
                    </h3>

                    <div className="report__buy">
                      <span className="report__price">
                        {formatUsd(report.price)}
                      </span>
                      <button
                        type="button"
                        className={clsx(
                          "report__add",
                          addedId === report.productId && "is-added",
                        )}
                        data-cursor
                        onClick={() => addToCart(report.productId)}
                      >
                        {addedId === report.productId ? "Added" : "Add to cart"}
                      </button>
                    </div>
                  </div>

                  <div
                    className="report__detail"
                    id={`report-${report.productId}`}
                    hidden={!isOpen}
                  >
                    <div className="report__detail-inner">
                      <div className="report__analysis">
                        <p className="report__analysis-title mono">
                          Analysis · {report.lab}
                        </p>
                        <table className="report__table">
                          <thead>
                            <tr>
                              <th scope="col">Compound</th>
                              <th scope="col">Concentration</th>
                              <th scope="col">Verified</th>
                            </tr>
                          </thead>
                          <tbody>
                            {report.compounds.map((c) => (
                              <tr key={c.name}>
                                <th scope="row">{c.name}</th>
                                <td className="mono">{c.concentration}</td>
                                <td className="mono">{c.verified}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <button
                          type="button"
                          className="btn report__cta"
                          onClick={() =>
                            navigate({ name: "product", id: report.productId })
                          }
                        >
                          View {report.title}
                        </button>
                      </div>

                      {report.reportImages.length > 0 && (
                        <figure className="report__scan">
                          <figcaption className="report__scan-cap mono">
                            Certificate as issued · scroll to read
                          </figcaption>
                          {/* The certificates are full-page scans; framing
                              them keeps one open row near a screen tall.
                              data-lenis-prevent stops the smooth-scroll
                              wrapper swallowing this inner scroll. */}
                          <div className="report__scan-frame" data-lenis-prevent>
                            <img
                              src={report.reportImages[0]}
                              alt={`${report.lab} certificate of analysis for lot ${report.batchNumber}.`}
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                        </figure>
                      )}
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        {/* The band prices and sells now, so it carries the lot's own
            research-use-only line, printed directly under the only prices on
            the page — same rule as `rangeCopy.note` and the About shop band. */}
        {scienceReports[0] && (
          <p className="science__shop-note" data-sci-reveal>
            {scienceReports[0].note}
          </p>
        )}

        <aside className="science__closing" data-sci-reveal>
          <img
            src={teamPanel.image}
            alt={teamPanel.imageAlt}
            loading="lazy"
            decoding="async"
            width={1400}
            height={933}
          />
          <div className="science__closing-body">
            <h3 className="science__closing-title">
              Need the paperwork for a specific lot?
            </h3>
            <p className="science__closing-text">
              Batch data is printed on every product page. If you need something
              we have not published, ask and we will pull it from the retained
              sample record.
            </p>
            {/* The card is a burgundy field now, so the shared `.btn` (which
                fills burgundy) would have been invisible on it. These are the
                About closing band's pills — light on the fill, ghost beside
                it — the same controls, one design. */}
            <div className="science__closing-actions">
              <button
                type="button"
                className="about-page__pill about-page__pill--light"
                data-cursor
                onClick={() => navigate({ name: "shop" })}
              >
                Shop all products
              </button>
              <a
                className="about-page__pill about-page__pill--ghost"
                data-cursor
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  navigate({ name: "home" });
                  window.setTimeout(() => {
                    document
                      .querySelector("#contact")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 120);
                }}
              >
                Contact us
              </a>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
