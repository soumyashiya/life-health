import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import clsx from "clsx";
import { partnerModal } from "../data/site";
import { parse, useRouter } from "../hooks/useRouter";
import { getLenis } from "../hooks/useSmoothScroll";
import packShot from "../assets/products/retatrutide-20mg.webp";

/** Read once, at the first render — see the note on `seen` below. */
const wasSeen = () => {
  try {
    return window.localStorage.getItem(partnerModal.storageKey) === "1";
  } catch {
    // Private mode / storage disabled: show it rather than crash.
    return false;
  }
};

/**
 * The entry overlay (2026-10-21, requested — built to the client reference's
 * opening modal).
 *
 * It states the partnership, which is a **client-confirmed commercial claim**
 * rather than copy — see the note on `partnerModal` in `data/site.ts` before
 * editing a word of it.
 *
 * Three things it deliberately does:
 * - **Shows once per visitor**, keyed in `localStorage` under the `liora.*`
 *   prefix. An overlay a returning buyer has to dismiss on every visit is a
 *   bounce, not a welcome.
 * - **Waits for the preloader.** `ready` is passed from `App`; the rAF-driven
 *   `Preloader` owns the screen until it completes, and an overlay opened
 *   behind it is dismissed before it is ever seen.
 * - **Traps nothing it cannot release.** Escape and the backdrop both close
 *   it, focus moves to the dialog on open and back to the document after.
 */
export function PartnerModal({ ready }: { ready: boolean }) {
  /* `open` is **derived during render**, never set from an effect: the project
     lints `react-hooks/set-state-in-effect`, and opening on a `ready` effect
     would also cost a frame with the overlay missing. The storage check is a
     lazy `useState` initialiser so it is read exactly once — re-reading it
     every render would flip the modal shut the instant the key is written,
     and reading it in a ref during render is the other thing the lint
     forbids. */
  const [seen] = useState(wasSeen);
  const [closed, setClosed] = useState(false);
  const open = ready && !seen && !closed;

  const dialog = useRef<HTMLDivElement | null>(null);
  const { navigate } = useRouter();

  const close = useCallback(() => {
    setClosed(true);
    try {
      window.localStorage.setItem(partnerModal.storageKey, "1");
    } catch {
      // ignore quota errors
    }
  }, []);

  /* Escape closes, and the page behind must not scroll while it is open.
     **`overflow: hidden` on the body is not enough** — Lenis drives the scroll
     itself and keeps running, so the overlay appears to float away from the
     page under it. `lenis.stop()` is the one that actually holds it; the class
     is kept for the native-scroll case, before Lenis has started. */
  useEffect(() => {
    if (!open) return;
    dialog.current?.focus();
    const lenis = getLenis();
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("has-modal");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("has-modal");
      lenis?.start();
    };
  }, [open, close]);

  if (!open) return null;

  const go = (href: string) => (e: MouseEvent) => {
    e.preventDefault();
    close();
    navigate(parse(href));
  };

  return (
    <div
      className="partner"
      role="dialog"
      aria-modal="true"
      aria-labelledby="partner-title"
    >
      <button
        type="button"
        className="partner__backdrop"
        aria-label={partnerModal.dismissLabel}
        onClick={close}
      />

      <div className="partner__card" ref={dialog} tabIndex={-1}>
        <figure className="partner__media">
          <img
            src={packShot}
            alt="A sealed ALLUVI Retatrutide 20mg research kit."
            width={900}
            height={1130}
            decoding="async"
          />
        </figure>

        <div className="partner__body">
          <span className="partner__eyebrow mono">{partnerModal.eyebrow}</span>

          <span className="partner__brand" aria-hidden>
            {partnerModal.brand}
            <span>{partnerModal.brandSub}</span>
          </span>

          <h2 className="partner__title" id="partner-title">
            {partnerModal.title}
          </h2>
          <p className="partner__lead">{partnerModal.lead}</p>

          <ul className="partner__marks">
            {partnerModal.marks.map((mark) => (
              <li key={mark}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  <path d="M5 12.5 10 17.5 19 7.5" />
                </svg>
                {mark}
              </li>
            ))}
          </ul>

          <div className="partner__actions">
            {partnerModal.ctas.map((cta) => (
              <a
                key={cta.href}
                className={clsx(
                  "about-page__pill",
                  cta.primary && "about-page__pill--solid",
                )}
                href={cta.href}
                data-cursor
                onClick={go(cta.href)}
              >
                {cta.label}
              </a>
            ))}
          </div>

          <p className="partner__note mono">{partnerModal.note}</p>
        </div>

        <button
          type="button"
          className="partner__close"
          aria-label={partnerModal.dismissLabel}
          data-cursor
          onClick={close}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
