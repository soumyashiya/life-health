import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  EASE_REVEAL,
  REVEAL_DURATION,
  REVEAL_SHIFT,
  REVEAL_STAGGER,
  REVEAL_START,
  lineTargets,
  prefersReducedMotion,
  splitLines,
} from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

interface RevealOptions {
  /** Defaults to `[data-anim]`. */
  selector?: string;
  start?: string;
  /** Per-line delay inside one element. */
  stagger?: number;
  once?: boolean;
}

/**
 * The reference's reveal system, as a hook.
 *
 * Attach the returned ref to a section and mark its children:
 *
 *   <h2 data-anim="lines">        masked line-by-line rise (its signature)
 *   <p  data-anim="up">           a short rise
 *   <figure data-anim="mask">     a clip-path wipe from the base
 *   <li data-anim="up" data-anim-delay="0.25">   its `--delayed-N` offset
 *
 * **Each element carries its own trigger**, as the reference does — the
 * sequencing between a label, a heading and a CTA comes from them entering at
 * different moments, not from one section timeline. That also means a tall
 * section never fires its lower half early.
 *
 * Reduced motion gets no tween at all: every animation here is a `from`, so
 * the CSS resting state is the finished one.
 */
export function useReveal<T extends HTMLElement>(options: RevealOptions = {}) {
  const ref = useRef<T | null>(null);
  const {
    selector = "[data-anim]",
    start = REVEAL_START,
    stagger = REVEAL_STAGGER,
    once = true,
  } = options;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (prefersReducedMotion()) return;

    const restores: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const targets = Array.from(root.querySelectorAll<HTMLElement>(selector));

      targets.forEach((el) => {
        const kind = el.dataset.anim || "up";
        const delay = Number(el.dataset.animDelay ?? 0) || 0;
        const trigger = { trigger: el, start, once };

        if (kind === "lines") {
          /* Two ways in. Plain-text headings are measured and split here;
             headings whose breaks are already declared in the markup (the
             hero's `lines` array, the FAQ's two-tone title) just carry
             `.anim__line > .anim__line-inner` themselves, and `splitLines`
             stands aside because it would flatten their inline markup. */
          restores.push(splitLines(el));
          const lines = lineTargets(el);
          if (lines.length === 0) return;
          gsap.from(lines, {
            yPercent: REVEAL_SHIFT,
            duration: REVEAL_DURATION,
            ease: EASE_REVEAL,
            stagger,
            delay,
            scrollTrigger: trigger,
          });
          return;
        }

        if (kind === "mask") {
          /* `fromTo`, not `from`: a resting `clip-path` of `none` cannot be
             interpolated towards, which is the trap half the bands in this
             project carry a note about. Stating both ends also lets the
             element's own corner radius ride along, so a rounded figure does
             not square off for the length of the wipe. */
          const radius = getComputedStyle(el).borderRadius;
          const round = radius && parseFloat(radius) > 0 ? ` round ${radius}` : "";
          gsap.fromTo(
            el,
            { clipPath: `inset(0% 0% 100% 0%${round})`, scale: 1.05 },
            {
              clipPath: `inset(0% 0% 0% 0%${round})`,
              scale: 1,
              duration: REVEAL_DURATION,
              ease: EASE_REVEAL,
              delay,
              scrollTrigger: trigger,
            },
          );
          return;
        }

        if (kind === "fade") {
          gsap.from(el, {
            opacity: 0,
            duration: REVEAL_DURATION,
            ease: EASE_REVEAL,
            delay,
            scrollTrigger: trigger,
          });
          return;
        }

        gsap.from(el, {
          y: 22,
          opacity: 0,
          duration: REVEAL_DURATION,
          ease: EASE_REVEAL,
          delay,
          scrollTrigger: trigger,
        });
      });
    }, root);

    /* A line split is measured, so it is only valid at the width it was taken
       at. Re-splitting mid-scroll would drop the tween's targets, so the
       cheapest correct answer is to rebuild the whole context on a settled
       resize — the same thing ScrollTrigger does with `invalidateOnRefresh`. */
    let frame = 0;
    let lastWidth = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === lastWidth) return; // mobile URL-bar height change
      lastWidth = window.innerWidth;
      window.clearTimeout(frame);
      frame = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(frame);
      ctx.revert();
      restores.forEach((restore) => restore());
    };
  }, [selector, start, stagger, once]);

  return ref;
}
