/**
 * Shared motion vocabulary.
 *
 * Every number here is **measured off `designer.incube.agency`** (2026-10-20),
 * read out of its own `style.css` / `main.min.js` rather than eyeballed, so a
 * band that uses these constants moves the way the reference does. Before this
 * file each of the ~38 animated components re-typed its own durations and
 * easings, which is why the page's rhythm varied band to band.
 *
 * The reference states its curves as CSS cubic-beziers; the GSAP equivalents
 * below are exact, not approximations:
 *   cubic-bezier(.215, .61, .355, 1)  ===  easeOutCubic  ===  gsap "power2.out"
 *   cubic-bezier(.19,  1,   .22,  1)  ===  easeOutExpo   ===  gsap "expo.out"
 */

/** The reveal curve — `.animtitle__line span` transitions on this. */
export const EASE_REVEAL = "power2.out";
/** The slow settle used for its image zooms (`.text-img`, 2s). */
export const EASE_SETTLE = "expo.out";

/** `transition: transform 1s …` on the reference's masked lines. */
export const REVEAL_DURATION = 1;
/** Its per-line delay step: nth-child(1) .25s, (2) .5s, (3) .75s … */
export const REVEAL_STAGGER = 0.25;
/** `transform: translate3d(0, 130%, 0)` — the resting position under the mask. */
export const REVEAL_SHIFT = 130;

/**
 * The reference reveals half a viewport early (`around = height / 2`), which
 * works there because its transitions carry delays of up to 2.5s. Ours start
 * on contact, so the equivalent *perceived* timing — the last line landing as
 * the block reaches the middle of the screen — comes from firing later with
 * the same stagger. 85% is already this project's convention.
 */
export const REVEAL_START = "top 85%";

/**
 * `ScrollShift`: the reference drags `h1`, `p` and `ul` against the scroll by
 * an amount proportional to **scroll velocity**, not to position —
 * `y = lerp(prev, delta * 3, 0.07)`. It is switched off below 1024px.
 */
export const SHIFT_K = 3;
export const SHIFT_LERP = 0.07;
export const SHIFT_MIN_WIDTH = 1024;
/**
 * Not in the reference — two reasons it needs one. Its `delta` is bounded by
 * its own frame loop while Lenis's velocity spikes on a flung trackpad; and
 * its headings are ~173px display type where a 90px drag is a third of a
 * line, against ~56px here, where the same number moves a heading a whole
 * line down. Measured at 40 the type reads weighted, never dislodged.
 */
export const SHIFT_CLAMP = 40;

/**
 * Layered parallax depths, read off its arrow stack: `y: delta/4` for the
 * near plane and `y: delta/7` for the far one. The absolute travel there is
 * bound to its own viewport maths; what transfers is the **1.75 ratio**
 * between the planes, kept here in `yPercent`.
 */
export const DEPTH_NEAR = 0.25;
export const DEPTH_FAR = 1 / 7;
export const PARALLAX_NEAR = 7;
export const PARALLAX_FAR = 4;

/** Honoured by every hook in `hooks/use{Reveal,ScrollShift,Parallax}`. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const LINE_CLASS = "anim__line";

/**
 * Wrap each *rendered* line of an element in an overflow mask, as the
 * reference's `.animtitle__line > span` does.
 *
 * Lines are grouped by measuring each word's `offsetTop`, so this works on
 * copy that wraps naturally — the project's existing bands all have to declare
 * their line breaks as data (`heroCopy.lines`, `faqCopy.title`) to get the
 * same effect.
 *
 * Only spans are inserted and the text stays in document order, so selection,
 * screen readers and `::selection` are unaffected — unlike character splitting,
 * which has to be hidden behind an `aria-label` (see `SplitText.tsx`).
 *
 * Returns a restore function. **Always call it on cleanup**: the element is
 * React-owned, and leaving the split DOM in place would fight the next render.
 */
export function splitLines(el: HTMLElement): () => void {
  const original = el.innerHTML;

  const restore = () => {
    el.innerHTML = original;
  };

  // Already split (a resize re-entry) — put it back first so measurement runs
  // against the real line boxes.
  if (el.querySelector(`.${LINE_CLASS}`)) restore();

  /* Splitting works off `textContent`, so any inline markup inside — the FAQ
     heading's italic accent, a `<br>`, a link — would be flattened away.
     Refuse rather than silently destroy it; those headings take `data-anim="up"`
     instead, or declare their lines as data the way the hero does. */
  if (el.children.length > 0) {
    // Authored masks are the supported second route, not a mistake — only the
    // unhandled case is worth a word.
    if (import.meta.env.DEV && !el.querySelector(`.${LINE_CLASS}`)) {
      console.warn("[motion] splitLines skipped: element has markup children", el);
    }
    return () => {};
  }

  const words = (el.textContent ?? "").split(/(\s+)/).filter((w) => w.length > 0);
  if (words.length === 0) return restore;

  el.textContent = "";
  const probes: HTMLElement[] = [];
  words.forEach((word) => {
    if (/^\s+$/.test(word)) {
      el.appendChild(document.createTextNode(word));
      return;
    }
    const span = document.createElement("span");
    span.style.display = "inline-block";
    span.textContent = word;
    el.appendChild(span);
    probes.push(span);
  });

  // Group by vertical position: a new offsetTop is a new line.
  const lines: HTMLElement[][] = [];
  let currentTop: number | null = null;
  probes.forEach((span) => {
    const top = span.offsetTop;
    if (currentTop === null || Math.abs(top - currentTop) > 2) {
      currentTop = top;
      lines.push([]);
    }
    lines[lines.length - 1].push(span);
  });

  if (lines.length === 0) return restore;

  // Rebuild as mask > inner, one pair per measured line.
  const frag = document.createDocumentFragment();
  lines.forEach((line) => {
    const mask = document.createElement("span");
    mask.className = LINE_CLASS;
    const inner = document.createElement("span");
    inner.className = `${LINE_CLASS}-inner`;
    line.forEach((span, i) => {
      if (i > 0) inner.appendChild(document.createTextNode(" "));
      // Unwrap the probe — its inline-block would break justified wrapping.
      inner.appendChild(document.createTextNode(span.textContent ?? ""));
    });
    mask.appendChild(inner);
    frag.appendChild(mask);
  });

  el.textContent = "";
  el.appendChild(frag);

  return restore;
}

/** The inner elements `splitLines` produced, in reading order. */
export function lineTargets(el: HTMLElement): HTMLElement[] {
  return Array.from(el.querySelectorAll<HTMLElement>(`.${LINE_CLASS}-inner`));
}
