import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { driftCopy } from "../data/site";
import gallery1 from "../assets/drift/gallery1.webp";
import gallery2 from "../assets/drift/gallery2.webp";
import gallery3 from "../assets/drift/gallery3.webp";
import gallery4 from "../assets/drift/gallery4.webp";
import gallery5 from "../assets/drift/gallery5.webp";
import gallery6 from "../assets/drift/gallery6.webp";

/* Six tiles around the statement. `x`/`y` are the tile's centre as a share
   of the stage, `size` its width as a share of the stage, `tilt` its resting
   angle and `depth` how far it travels with the pointer and the scroll —
   larger tiles sit "nearer" and move more, which is what reads as depth.

   The client's gallery set, 2026-10-20. Every frame is a person holding an
   ALLUVI pack, and several of those packs are compounds this catalogue does
   not stock — so, same rule as the hero and the about band, no alt here may
   name a compound and nothing in the band's copy describes a pack. */
const TILES: {
  src: string;
  alt: string;
  x: number;
  y: number;
  size: number;
  tilt: number;
  depth: number;
  pos?: number;
}[] = [
  /* `pos` is the square crop's vertical bias, left at the default 50% here:
     this frame sits centred and the device is well inside the crop. The
     gallery1-new drop that briefly replaced this one needed `pos: 15` — she
     stood high in that frame — so re-check the crop if the image changes. */
  { src: gallery1, alt: "A customer holding a pre-filled device", x: 22, y: 18, size: 13, tilt: -7, depth: 0.6 },
  { src: gallery2, alt: "", x: 78, y: 17, size: 15, tilt: 6, depth: 1 },
  { src: gallery3, alt: "A customer holding a pre-filled device", x: 9, y: 62, size: 14, tilt: 5, depth: 0.85 },
  { src: gallery4, alt: "", x: 92, y: 52, size: 12, tilt: -6, depth: 0.5 },
  { src: gallery5, alt: "A customer holding a sealed carton", x: 62, y: 80, size: 16, tilt: -4, depth: 1.15 },
  { src: gallery6, alt: "", x: 33, y: 84, size: 11, tilt: 8, depth: 0.4 },
];

/**
 * A centred statement with photo tiles drifting around it. On scroll the
 * tiles fly out from behind the type to their seats and keep a parallax
 * drift; on desktop they also lean towards the pointer.
 *
 * Each tile is nested layers so no two animations share a transform:
 * `.drift__tile` takes the parallax (its seat and tilt are the CSS
 * `translate`/`rotate` properties), `.drift__scroll` the fly-out,
 * `.drift__lean` the pointer, and `.drift__float` a CSS idle bob. `.drift__*` at the end of portfolio.css.
 */
export function DriftBand() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tiles = gsap.utils.toArray<HTMLElement>(".drift__tile", el);

      /* Out from the centre: each tile starts tucked behind the statement,
         small and level, and scrubs to its seat as the band rises into view. */
      tiles.forEach((tile, i) => {
        const t = TILES[i];
        /* Offsets in px from the stage, re-read on refresh, so every tile
           starts exactly on the statement's centre at any width. */
        gsap.fromTo(
          tile.querySelector(".drift__scroll"),
          {
            x: () => (0.5 - t.x / 100) * el.offsetWidth,
            y: () => (0.5 - t.y / 100) * el.offsetHeight,
            scale: 0.35,
            rotate: -t.tilt,
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "center 55%",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          },
        );
        /* Then a parallax drift for the rest of the band's pass, on the
           tile itself — the fly-out owns the inner layer's transform. The
           tile is centred on its seat with the CSS `translate` property,
           which composes with GSAP's `transform` instead of being wiped. */
        gsap.fromTo(
          tile,
          { y: 0 },
          {
            y: -90 * t.depth,
            ease: "none",
            scrollTrigger: { trigger: el, start: "center 55%", end: "bottom top", scrub: true },
          },
        );
      });

      gsap.from(".drift__line > span", {
        yPercent: 110,
        duration: 1,
        ease: "power4.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".drift__title", start: "top 80%", once: true },
      });
      gsap.from(".drift__link", {
        y: 14,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ".drift__title", start: "top 70%", once: true },
      });
    });

    /* The pointer lean, fine pointers only — a touch screen has no hover to
       follow. `quickTo` keeps it to one tween per axis per tile. */
    mm.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)", () => {
      const leans = gsap.utils.toArray<HTMLElement>(".drift__lean", el).map((node, i) => ({
        x: gsap.quickTo(node, "x", { duration: 0.9, ease: "power3.out" }),
        y: gsap.quickTo(node, "y", { duration: 0.9, ease: "power3.out" }),
        depth: TILES[i].depth,
      }));

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        leans.forEach((l) => {
          l.x(nx * 46 * l.depth);
          l.y(ny * 36 * l.depth);
        });
      };
      const onLeave = () => leans.forEach((l) => (l.x(0), l.y(0)));

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    });

    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section className="drift" ref={root} aria-labelledby="drift-title">
      <div className="drift__stage">
        {TILES.map((t, i) => (
          <figure
            className="drift__tile"
            key={i}
            style={
              {
                "--x": `${t.x}%`,
                "--y": `${t.y}%`,
                "--size": `${t.size}%`,
                "--tilt": `${t.tilt}deg`,
                "--pos": `${t.pos ?? 50}%`,
                "--delay": `${i * -1.3}s`,
              } as CSSProperties
            }
          >
            <div className="drift__scroll">
              <div className="drift__lean">
                <div className="drift__float">
                  <img
                    src={t.src}
                    alt={t.alt}
                    width={720}
                    height={900}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </figure>
        ))}

        <div className="drift__copy">
          <h2 className="drift__title" id="drift-title">
            {driftCopy.lines.map((line) => (
              <span className="drift__line" key={line}>
                <span>{line}</span>
              </span>
            ))}
          </h2>
          <a className="drift__link" href={driftCopy.link.href} data-cursor>
            {driftCopy.link.label}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path d="M5 12h13M12 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
