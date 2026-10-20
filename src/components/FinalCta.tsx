import { finalCtaCopy } from "../data/site";
import { useReveal } from "../hooks/useReveal";

/**
 * The closing shopping band, between the FAQ and the contact band.
 *
 * **It is burgundy rather than near-black on purpose.** The FAQ above it is
 * cream and `.contact` below it opens dark before its wipe, so a black band
 * here would merge straight into the contact band; the brand accent is the one
 * value that separates both neighbours.
 *
 * The copy claims nothing that needs evidence — a headline, a line `promoCopy`
 * already says, and two links to routes that exist.
 */
export function FinalCta() {
  const revealRef = useReveal<HTMLElement>();

  return (
    <section className="finalcta" aria-labelledby="finalcta-title" ref={revealRef}>
      <div className="finalcta__inner">
        <h2 className="finalcta__title" id="finalcta-title" data-anim="lines">
          {finalCtaCopy.lines.map((line) => (
            // The breaks are authored, so the masks are too — see `useReveal`.
            <span className="finalcta__line anim__line" key={line}>
              <span className="anim__line-inner">{line}</span>
            </span>
          ))}
        </h2>

        <p className="finalcta__lead" data-anim="up" data-anim-delay="0.25">
          {finalCtaCopy.lead}
        </p>

        <div className="finalcta__actions" data-anim="up" data-anim-delay="0.35">
          <a className="finalcta__btn" href={finalCtaCopy.primary.href} data-cursor>
            {finalCtaCopy.primary.label}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path d="M5 12h13M12 6l6 6-6 6" />
            </svg>
          </a>
          <a className="finalcta__ghost" href={finalCtaCopy.secondary.href} data-cursor>
            {finalCtaCopy.secondary.label}
          </a>
        </div>

        <p className="finalcta__note">{finalCtaCopy.note}</p>
      </div>
    </section>
  );
}
