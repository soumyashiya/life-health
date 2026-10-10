import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  purityMethod,
  scienceHero,
  scienceReports,
  scienceSections,
  scienceStats,
  standards,
  teamPanel,
  type ScienceSection,
} from "../data/science";
import { useRouter } from "../hooks/useRouter";

type Props = { section?: ScienceSection };

export function SciencePage({ section }: Props) {
  const root = useRef<HTMLDivElement | null>(null);
  const [current, setCurrent] = useState<ScienceSection>(
    section ?? "standards",
  );
  /** Only one certificate open at a time — the scans are full-page images. */
  const [openReport, setOpenReport] = useState<string | null>(null);
  const { navigate } = useRouter();

  /* ---- deep link: scroll to the requested section once laid out --------- */
  useEffect(() => {
    if (!section) return;
    const el = document.getElementById(`science-${section}`);
    if (!el) return;
    // One frame so the section has its final height before we measure it.
    const id = window.requestAnimationFrame(() => {
      el.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    });
    return () => window.cancelAnimationFrame(id);
  }, [section]);

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

  /* ---- entrance reveals ------------------------------------------------- */
  useEffect(() => {
    if (!root.current) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const targets = root.current?.querySelectorAll<HTMLElement>("[data-sci-reveal]");
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

  const go = (id: ScienceSection) => {
    navigate({ name: "science", section: id });
    document
      .getElementById(`science-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
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
          <h1 className="h2 science__hero-title" data-sci-reveal>
            {scienceHero.title}
          </h1>
          <p className="lead science__hero-lead" data-sci-reveal>
            {scienceHero.lead}
          </p>

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

      {/* ------------------------------------------------- sticky section rail */}
      <nav className="science__rail" aria-label="On this page">
        <div className="container science__rail-inner">
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
        </div>
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
            Quality is the work. These are the controls that sit behind every kit
            we ship.
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
            The published analysis for every lot currently in the catalogue.
            Open a row to read the certificate exactly as the lab issued it.
          </p>
        </div>

        <ul className="reports">
          {scienceReports.map((report) => {
            const isOpen = openReport === report.productId;
            return (
              <li key={report.productId} data-sci-reveal>
                <article className={clsx("report", isOpen && "is-open")}>
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
            <div className="science__closing-actions">
              <button
                type="button"
                className="btn"
                onClick={() => navigate({ name: "shop" })}
              >
                Browse the catalogue
              </button>
              <a
                className="btn btn-ghost"
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
