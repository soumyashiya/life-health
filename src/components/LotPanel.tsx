import { purityMethod, standards } from "../data/science";
import { projects } from "../data/site";

/* Six real rows: the three verification steps, then the first three handling
   standards. Both come straight from `data/science.ts` — the same copy the
   Science page publishes, so this band cannot drift away from it. */
const ROWS = [
  ...purityMethod.steps.map((s) => ({ label: s.label, body: s.body })),
  ...standards.slice(0, 3).map((s) => ({ label: s.title, body: s.body })),
];

/* The burgundy panel band. See `.lotpanel__*` in portfolio.css.

   **The reference's content is the one thing this cannot copy.** Its panel
   reads "Our patented formula is made with Vitamin B12 to help support:" over
   rows like *Cellular Energy Production*, *Healthy Immune Function* and
   *Overall Good Health* — consumer health-benefit claims. This is a
   laboratory-use-only catalogue whose every product page says "not for human
   or veterinary use"; benefit claims are exactly what it cannot make.

   So the layout is the reference's and the content is what the site can
   actually evidence: what is verified on each lot, and how it is handled. */
export function LotPanel() {
  /* Decorative bleed images — real packshots, nothing staged. */
  const left = projects[0];
  const right = projects[1] ?? projects[0];

  return (
    <section className="lotpanel">
      <div className="lotpanel__panel">
        <img
          className="lotpanel__bleed lotpanel__bleed--left"
          src={left.image}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <img
          className="lotpanel__bleed lotpanel__bleed--right"
          src={right.image}
          alt=""
          loading="lazy"
          decoding="async"
        />

        <div className="lotpanel__head">
          <h2 className="lotpanel__title">Documented, lot by lot</h2>
          <p className="lotpanel__lead">
            Every lot is released against the same checks, and ships with the
            report that proves them:
          </p>
        </div>

        {/* Native `<details>` — keyboard and screen-reader accessible with no
            JavaScript, and it survives the reduced-motion rules untouched. */}
        <ul className="lotpanel__rows">
          {ROWS.map((row) => (
            <li key={row.label}>
              <details className="lotpanel__row">
                <summary>
                  <span>{row.label}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </summary>
                <p>{row.body}</p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
