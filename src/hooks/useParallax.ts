import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PARALLAX_FAR, PARALLAX_NEAR, prefersReducedMotion } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Layered scroll parallax at the reference's two depths.
 *
 * It runs its arrow stack at `delta/4` and `delta/7` — a 1.75 ratio between
 * the near and far planes, which is the part worth preserving; the absolute
 * travel there is bound to its own viewport maths. `PARALLAX_NEAR` /
 * `PARALLAX_FAR` keep that ratio in `yPercent`.
 *
 * Mark elements with `data-parallax="near" | "far" | "<yPercent>"`. Two
 * elements at different depths inside one composition is what reads as depth;
 * giving everything the same value just makes the section drift.
 *
 * **This hook owns `yPercent` on its targets.** Where a band's entrance also
 * animates the same element, put the entrance on a wrapper — the project's
 * disjoint-transform rule.
 */
export function useParallax<T extends HTMLElement>(
  selector = "[data-parallax]",
  /* Most bands already own a ref on their `<section>`; pass it rather than
     trying to attach two refs to one element. */
  externalRef?: RefObject<T | null>,
) {
  const internalRef = useRef<T | null>(null);
  const ref = externalRef ?? internalRef;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const targets = Array.from(root.querySelectorAll<HTMLElement>(selector));
      targets.forEach((el) => {
        const raw = el.dataset.parallax || "near";
        const travel =
          raw === "near"
            ? PARALLAX_NEAR
            : raw === "far"
              ? PARALLAX_FAR
              : Number(raw) || PARALLAX_NEAR;

        gsap.fromTo(
          el,
          { yPercent: -travel / 2 },
          {
            yPercent: travel / 2,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, [selector, ref]);

  return ref;
}
