import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  SHIFT_CLAMP,
  SHIFT_K,
  SHIFT_LERP,
  SHIFT_MIN_WIDTH,
  prefersReducedMotion,
} from "../lib/motion";
import { getLenis } from "./useSmoothScroll";

/**
 * The reference's `ScrollShift`: type is dragged against the scroll by an
 * amount proportional to **scroll velocity**, then settles back to rest when
 * the scroll stops. It is what makes its headings feel weighted rather than
 * pinned to the page.
 *
 *   percentage = lerp(percentage, delta * 3, 0.07)   →   tween `y`
 *
 * Two deliberate differences from the original:
 *
 * - It reads **Lenis's own velocity** off the shared instance rather than
 *   measuring scroll deltas itself, so there is no second scroll handler and
 *   nothing to get out of step with the smooth scroll.
 * - The target is clamped. The reference's `delta` is bounded by its frame
 *   loop; Lenis's velocity spikes on a flung trackpad, and unclamped that
 *   throws a heading a long way off its line.
 *
 * It runs on the GSAP ticker, not on scroll events — the lerp has to keep
 * running after the last event to bring the element home.
 *
 * Mark targets with `data-shift`, optionally `data-shift="0.5"` for a shallower
 * plane. **The target's `y` must not be animated by anything else** — this hook
 * owns that property, the project's usual disjoint-transform rule.
 *
 * Off below 1024px and under reduced motion, as the reference is.
 */
export function useScrollShift<T extends HTMLElement>(selector = "[data-shift]") {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (prefersReducedMotion()) return;

    const mq = window.matchMedia(`(min-width: ${SHIFT_MIN_WIDTH}px)`);
    let teardown: (() => void) | null = null;

    const start = () => {
      const els = Array.from(root.querySelectorAll<HTMLElement>(selector));
      if (els.length === 0) return;

      const depths = els.map((el) => Number(el.dataset.shift) || 1);
      const setters = els.map((el) =>
        gsap.quickTo(el, "y", { duration: 1, ease: "power3.out" }),
      );
      const current = els.map(() => 0);
      const clamp = gsap.utils.clamp(-SHIFT_CLAMP, SHIFT_CLAMP);

      const tick = () => {
        const velocity = getLenis()?.velocity ?? 0;
        const target = clamp(velocity * SHIFT_K);
        for (let i = 0; i < els.length; i += 1) {
          const next = current[i] + (target * depths[i] - current[i]) * SHIFT_LERP;
          // Park exactly at rest rather than lerping forever at sub-pixels.
          current[i] = Math.abs(next) < 0.05 ? 0 : next;
          setters[i](current[i]);
        }
      };

      gsap.ticker.add(tick);
      teardown = () => {
        gsap.ticker.remove(tick);
        gsap.set(els, { y: 0 });
      };
    };

    const onChange = () => {
      teardown?.();
      teardown = null;
      if (mq.matches) start();
    };

    onChange();
    mq.addEventListener("change", onChange);

    return () => {
      mq.removeEventListener("change", onChange);
      teardown?.();
    };
  }, [selector]);

  return ref;
}
