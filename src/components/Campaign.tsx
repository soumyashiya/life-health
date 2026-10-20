import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { campaignCopy } from "../data/site";
/* The client drop `latest-images/11.png`, a straight webp conversion —
   nothing cropped, graded or composited. `latest-images/` stays untouched as
   the source of truth, same convention as `new/` -> `products/`. */
import scene from "../assets/campaign/scene.webp";

/**
 * The campaign band: one full-bleed photograph with the headline set over it
 * and the reference's white technical spec card in the opposite corner.
 *
 * **Where the type can go is decided by the photograph, not by the
 * reference.** The reference clears its whole left half for the headline;
 * this drop puts the carton there and the clear space across the top (a
 * coarse sky/brightness scan of the frame put the open band at y 0-20%, and
 * the carton at x 4-61%, y 20-74%). So the headline is left-aligned and sits
 * high, which keeps it off the pack — white type over a white carton would
 * vanish, and scrimming the carton dark to fix that would hide the product
 * the band exists to show.
 */
export function Campaign() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 75%", once: true },
      });

      tl.from(".campaign__line > span", {
        yPercent: 110,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
      })
        .from(".campaign__note", { y: 14, opacity: 0, duration: 0.6 }, "-=0.45")
        .from(
          ".campaign__spec",
          { y: 24, opacity: 0, duration: 0.7, ease: "power3.out" },
          "-=0.5",
        );

      /* Disjoint from the entrance above: that owns `yPercent`/`opacity` on
         the type, this owns `scale` on the photograph alone — the same split
         the hero and the feature band use. */
      gsap.fromTo(
        ".campaign__photo",
        { scale: 1.07 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });

    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section className="campaign" ref={root}>
      <div className="campaign__frame">
        <img
          className="campaign__photo"
          src={scene}
          alt={campaignCopy.photoAlt}
          width={1672}
          height={940}
          loading="lazy"
          decoding="async"
        />

        <div className="campaign__copy">
          {/* One entry in `campaignCopy.lines` is one rendered line, each
              behind its own mask so the pair rises as the reference's does. */}
          <h2 className="campaign__title">
            {campaignCopy.lines.map((line) => (
              <span className="campaign__line" key={line}>
                <span>{line}</span>
              </span>
            ))}
          </h2>
          <p className="campaign__note">{campaignCopy.note}</p>
        </div>

        {/* The reference's dimensioned drawing, in the corner it puts it.
            The leader lines are kept and the quantities are not: the carton's
            physical size is unknown and would have to be invented, so each
            callout carries a fact legible on the pack itself. */}
        <aside className="campaign__spec">
          <span className="campaign__spec-label">{campaignCopy.spec.label}</span>

          <div className="campaign__spec-body">
            <svg
              className="campaign__spec-art"
              viewBox="0 0 150 104"
              fill="none"
              aria-hidden
            >
              {/* the carton, front face with its device window */}
              <rect
                x="12"
                y="18"
                width="104"
                height="68"
                rx="3"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <rect
                x="24"
                y="34"
                width="80"
                height="26"
                rx="2"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              {/* the pre-filled pen inside the window */}
              <rect
                x="31"
                y="42"
                width="60"
                height="10"
                rx="5"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path d="M91 47h8" stroke="currentColor" strokeWidth="1.2" />
              <path
                d="M24 70h40M24 76h26"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.45"
              />
              {/* callout rules, drawn like the reference's dimension lines */}
              <path
                d="M128 18v68M124 18h8M124 86h8"
                stroke="currentColor"
                strokeWidth="1"
              />
              <path
                d="M12 96h104M12 92v8M116 92v8"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>

            <span className="campaign__spec-side">{campaignCopy.spec.side}</span>
          </div>

          <span className="campaign__spec-base">{campaignCopy.spec.base}</span>
          <span className="campaign__spec-foot">{campaignCopy.spec.foot}</span>
        </aside>
      </div>
    </section>
  );
}
