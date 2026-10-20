import { trustBar } from "../data/site";

/* The muted strip directly under the hero. See `trustBar` in `data/site.ts`
   for why these are credentials rather than partner logos — short version: the
   only real named third party here is Janoshik, and inventing marks for the
   rest would imply endorsements the site cannot evidence.

   Icons are plain line glyphs, deliberately generic so none of them can be
   mistaken for a company mark. Same inline-SVG pattern as `LabProof`. */
const ICONS: Record<string, React.ReactNode> = {
  lab: (
    <>
      <path d="M9 3h6M10.5 3v6.2L5.6 17.4A2 2 0 0 0 7.3 20.5h9.4a2 2 0 0 0 1.7-3.1L13.5 9.2V3" />
      <path d="M8 14.5h8" />
    </>
  ),
  wave: (
    <>
      <path d="M3 12h3l2.5-6 3.5 12 3-9 2 3h4" />
    </>
  ),
  seal: (
    <>
      <path d="M12 3.2 20 7v5.4c0 4-3.4 7-8 8.4-4.6-1.4-8-4.4-8-8.4V7Z" />
      <path d="M9 12.2l2.2 2.2L15.4 10" />
    </>
  ),
  doc: (
    <>
      <path d="M14 3H7a1.8 1.8 0 0 0-1.8 1.8v14.4A1.8 1.8 0 0 0 7 21h10a1.8 1.8 0 0 0 1.8-1.8V7.8Z" />
      <path d="M14 3v5h4.8M8.6 12.4h6.8M8.6 16h4.4" />
    </>
  ),
  truck: (
    <>
      <path d="M3 7.6h10.4v8.8H3ZM13.4 10.6h3.9l2.7 3v2.8h-6.6Z" />
      <circle cx="7" cy="18.4" r="1.7" />
      <circle cx="16.6" cy="18.4" r="1.7" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.2 20 7v5.4c0 4-3.4 7-8 8.4-4.6-1.4-8-4.4-8-8.4V7Z" />
      <path d="M12 9v4.4M12 16.4h.01" />
    </>
  ),
};

export function TrustBar() {
  return (
    <section className="trustbar" aria-label="How every lot is supplied">
      <div className="container trustbar__inner">
        <ul className="trustbar__list">
          {/* **No scroll reveal here** (added and removed on request,
              2026-10-20). The strip spans the hero's two cards, so at the
              default 1440x900 it sits just below the fold — a reveal keyed to
              `top 85%` left all six entries invisible on arrival, which is
              exactly when this row has to be readable. Anything added here
              must play on load, not on scroll. */}
          {trustBar.map((item) => (
            <li className="trustbar__item" key={item.label}>
              <svg
                className="trustbar__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                {ICONS[item.icon]}
              </svg>
              <span className="trustbar__text">
                <span className="trustbar__label">{item.label}</span>
                <span className="trustbar__note">{item.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
