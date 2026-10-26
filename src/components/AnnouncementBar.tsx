import { useState } from "react";
import { announcementCopy } from "../data/site";
import { safeRefreshScrollTriggers } from "../lib/motion";

/* Same `liora.*` prefix as the cart and auth keys — see the rebrand table in
   CLAUDE.md for why those were deliberately not renamed to `lyfe.*`. */
const STORAGE_KEY = "liora.announce.v1";

const wasDismissed = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    // Private mode / storage disabled — show the bar rather than crash.
    return false;
  }
};

/* **Runs at import, before React's first render — and it has to.** The offset
   lives in `:root` so the header is in the right place on the very first
   frame; if this were done in an effect instead, a returning visitor who had
   dismissed the bar would get one frame with a 40px gap and the header would
   then jump up into it. `document` always exists here: this is a Vite SPA with
   no server rendering. */
if (typeof document !== "undefined" && wasDismissed()) {
  document.documentElement.style.setProperty("--announce-h", "0px");
}

/**
 * The compact strip above the header.
 *
 * **It is `position: fixed` and the page is offset by `--announce-h`**, which
 * `index.css` adds to `body`'s padding and to `.nav__shell`'s `top`. Dismissing
 * it sets that custom property to `0px`, so the header and every band close the
 * gap with no reflow of their own measurements.
 *
 * `announcementCopy` carries no offer deliberately — there is no promotions
 * system in this project to read a real one from.
 */
export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(wasDismissed);

  if (dismissed) return null;

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* Not worth failing the dismissal over. */
    }
    document.documentElement.style.setProperty("--announce-h", "0px");
    setDismissed(true);
    /* The document just got shorter by the bar's height, so every trigger
       below it is measuring against a stale offset. Guarded — see the hook. */
    safeRefreshScrollTriggers();
  };

  return (
    <aside className="announce" aria-label="Announcement">
      {/* ⚠ A MARQUEE AS OF 2026-10-21, built to the client reference's strip.
          The list is rendered **twice** and the keyframe travels `-50%`, so the
          loop is seamless — change one and you must change the other, the same
          contract the about band's trust strip carries. The second copy is
          `aria-hidden`: a screen reader should hear four claims, not eight.
          The two-length `message` / `messageShort` pair the static bar used is
          still in the data and still correct if this is ever reverted. */}
      <div className="announce__viewport">
        <div className="announce__track">
          {[0, 1].map((copy) => (
            <ul
              className="announce__list"
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
            >
              {announcementCopy.marquee.map((claim) => (
                <li key={claim}>{claim}</li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="announce__close"
        onClick={dismiss}
        aria-label={announcementCopy.dismissLabel}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </aside>
  );
}
