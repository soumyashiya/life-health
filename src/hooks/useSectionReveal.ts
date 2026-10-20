import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../lib/motion";

/**
 * Generic `[data-reveal]` stagger. Predates `useReveal`, which implements the
 * reference's masked line system — prefer that one for new work.
 */
export function useSectionReveal<T extends HTMLElement>(
  selector: string = "[data-reveal]",
) {
  const containerRef = useRef<T | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    /* `index.css` kills CSS animation under this preference, but a GSAP tween
       writes inline transforms that rule never sees — so the branch has to be
       here. Every tween below is a `from`, so bailing out renders the finished
       state. */
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const targets = el.querySelectorAll<HTMLElement>(selector);
      targets.forEach((target) => {
        gsap.from(target, {
          y: 48,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: target,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, el);

    return () => ctx.revert();
  }, [selector]);

  return containerRef;
}
