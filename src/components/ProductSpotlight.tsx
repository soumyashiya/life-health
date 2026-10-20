import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, spotlightCopy } from "../data/site";
import spotlightImage from "../assets/spotlight/product-info.webp";
/* The three detail tiles are **crops of the band's own photograph** — the
   carton's printed molecular artwork, the pre-filled pen in its window, and
   the content mark. The reference floats ingredient cut-outs here; this
   catalogue has no ingredients to show and drawing some would be invention,
   so the "ingredients" are the real parts of the real lot.

   All three are measured ffmpeg crops of `latest-images/product-info.png`,
   not eyeballed — the coordinates are recorded in CLAUDE.md. The dose crop in
   particular is cut to stop **above** the carton's storage and injection small
   print: that line must not be enlarged into a detail tile. */
import detailMolecules from "../assets/spotlight/detail-molecules.webp";
import detailDevice from "../assets/spotlight/detail-device.webp";
import detailDose from "../assets/spotlight/detail-dose.webp";
/* The corner artwork. **Node positions are traced off the mockup**, not
   invented — a 4x crop of its top-left corner, measured and scaled into this
   240x165 viewBox. Two things make it read as that image rather than as a
   generic lattice:

   - **the atoms come in two kinds** — solid discs and thick open rings. An
     all-solid (or all-outline) set reads as a wireframe pattern.
   - **the network runs off the top and left edges.** The mockup's corner art
     is a crop of something larger; a structure that closes neatly inside its
     own box reads as a logo sitting in the corner instead.

   Fills are set per element here rather than in CSS: a `fill` on the `<svg>`
   is inherited by every child, so the open rings would fill in. */
const MOLECULE = (
  <>
    {/* bonds */}
    <path d="M19 11 66 25l15 44-28 37-39-6-28-45ZM165 26l36 10 5 30-25 22-29-22-2-30Z" />
    <path d="M81 69l41 10 30-13M122 79l11 41M66 25 87-8M53 106l13 32 30 12M133 120l-37 30M206 66l30 12M181 88l15 24" />
    {/* solid atoms */}
    <circle cx="81" cy="69" r="8" fill="currentColor" stroke="none" />
    <circle cx="122" cy="79" r="8" fill="currentColor" stroke="none" />
    <circle cx="53" cy="106" r="9" fill="currentColor" stroke="none" />
    <circle cx="152" cy="66" r="6" fill="currentColor" stroke="none" />
    <circle cx="206" cy="66" r="6" fill="currentColor" stroke="none" />
    <circle cx="14" cy="100" r="6" fill="currentColor" stroke="none" />
    <circle cx="196" cy="112" r="5" fill="currentColor" stroke="none" />
    <circle cx="201" cy="36" r="4" fill="currentColor" stroke="none" />
    <circle cx="150" cy="36" r="4" fill="currentColor" stroke="none" />
    <circle cx="66" cy="138" r="3.5" fill="currentColor" stroke="none" />
    {/* Open atoms. They are drawn **last and filled with the band colour**,
        not left hollow: a transparent ring lets its bonds run straight across
        the middle and the atom reads as a crossed-out circle. The fill is
        invisible against the band and knocks the bond out inside the ring,
        which is how the mockup's are drawn. */}
    <circle className="spotlight__atom" cx="19" cy="11" r="7" strokeWidth={3.5} />
    <circle className="spotlight__atom" cx="66" cy="25" r="7" strokeWidth={3.5} />
    <circle className="spotlight__atom" cx="165" cy="26" r="7" strokeWidth={3.5} />
    <circle className="spotlight__atom" cx="181" cy="88" r="6" strokeWidth={3.5} />
    <circle className="spotlight__atom" cx="133" cy="120" r="7" strokeWidth={3.5} />
    <circle className="spotlight__atom" cx="96" cy="150" r="7" strokeWidth={3.5} />
  </>
);

/* The pale ribbons down both margins — the carton's own printed swirl
   restated as line work. Rendered as a fan of parallel curves because that is
   what the mockup has: a dense bundle of hairlines, not a few loose strokes.
   Generated rather than hand-written so the spacing stays even. */
const RIBBON_COUNT = 12;
const ribbon = (flip: boolean) =>
  Array.from({ length: RIBBON_COUNT }, (_, i) => {
    const d = flip
      ? `M440 ${34 + i * 7} C 330 ${-12 + i * 5}, 270 ${148 + i * 9}, -20 ${68 + i * 6}`
      : `M-20 ${34 + i * 7} C 90 ${-12 + i * 5}, 150 ${148 + i * 9}, 440 ${68 + i * 6}`;
    return <path key={i} d={d} />;
  });

/* One glyph per annotation, keyed by the chip's own id. Plain line icons, the
   same inline-SVG pattern as `TrustBar` — and deliberately generic, so none of
   them can be mistaken for a certification mark. */
const CHIP_ICONS: Record<string, React.ReactNode> = {
  purity: (
    <>
      <path d="M12 3.2 19.4 6.6v5.1c0 3.8-3.1 6.6-7.4 7.9-4.3-1.3-7.4-4.1-7.4-7.9V6.6Z" />
      <path d="M9.2 12.1 11.3 14.2 15.1 10.2" />
    </>
  ),
  batch: (
    <>
      <path d="M14 3.5H7.4a1.7 1.7 0 0 0-1.7 1.7v13.6a1.7 1.7 0 0 0 1.7 1.7h9.2a1.7 1.7 0 0 0 1.7-1.7V8Z" />
      <path d="M14 3.5V8h4.3M8.8 12.4h6.4M8.8 15.8h4.2" />
    </>
  ),
  form: (
    <>
      <path d="M10 3.4h4M10.8 3.4v5.4L6.1 17.2a1.9 1.9 0 0 0 1.6 2.9h8.6a1.9 1.9 0 0 0 1.6-2.9l-4.7-8.4V3.4" />
      <path d="M8.3 14.2h7.4" />
    </>
  ),
  storage: (
    <>
      <path d="M12 3.6a2 2 0 0 1 2 2v7.6a3.6 3.6 0 1 1-4 0V5.6a2 2 0 0 1 2-2Z" />
      <path d="M12 9.4v5.6" />
    </>
  ),
};

/* The annotated product band (2026-10-16), mounted as the 3rd home section.

   Built to a reference that floats labelled chips and small detail images
   around a held product, then **revised to a client mockup of this very
   section** the same day: a centred rule-flanked head, icon chips, a
   selectable detail gallery with pagers, and a warm sand ground carrying
   molecular line art. (The chips' hairline leader lines out to the carton
   were removed on request, 2026-10-17.)

   The chips are sourced from `projects`, never typed as copy: the lot's real
   published purity and batch, and its real specs. The reference's own chips
   are consumer benefit claims ("Moisturizing & Hydrating") — **the one thing
   this catalogue cannot say**, since every product page disclaims human use.

   The photograph is the client's own (`latest-images/product-info.png`, kept
   untouched as the source of truth) and shows a **stocked** lot — Retatrutide
   20mg — which is why this band may name the product on the carton. The hero
   and the showcase picture cartons the catalogue does not stock and are
   deliberately written around them.

   See `.spotlight__*` at the end of portfolio.css. */
export function ProductSpotlight() {
  const root = useRef<HTMLElement | null>(null);
  const [activeDetail, setActiveDetail] = useState(0);

  const product = projects.find((p) => p.id === spotlightCopy.productId);

  /* Scoped to the section, so the selectors below cannot reach another band —
     and so reduced motion gets no timeline and no ScrollTrigger at all, with
     every element already at its finished state in CSS. Every tween is a
     `from`, which is what makes that true. */
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      /* One arrival, played once when the band is well into view. The order is
         the reading order: head, then the product, then what annotates it. */
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 72%", once: true },
      });

      tl.from(".spotlight__head > *", {
        y: 22,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
      })
        /* The photograph wipes up from its own base as it settles, so it reads
           as being set down rather than fading in. `clipPath` and `scale` are
           the entrance's alone — the scrub below owns `yPercent`, and the two
           must never share a property. */
        .from(
          ".spotlight__visual",
          {
            clipPath: "inset(18% 0% 0% 0%)",
            scale: 1.04,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.35",
        )
        /* The shadow spreads out from under the product as it lands. */
        .from(
          ".spotlight__ground",
          { scaleX: 0.55, opacity: 0, duration: 0.9, ease: "power2.out" },
          "-=0.7",
        )
        /* Each chip arrives from the side it sits on, so they read as being
           pinned to the product rather than dropped onto it. */
        .from(
          ".spotlight__chip",
          {
            x: (i: number) => (i % 2 === 0 ? -28 : 28),
            scale: 0.92,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
            stagger: 0.08,
          },
          "-=0.55",
        )
        .from(
          ".spotlight__detail",
          {
            scale: 0.6,
            rotate: -8,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(1.9)",
            stagger: 0.09,
          },
          "-=0.35",
        )
        .from(
          ".spotlight__gallery-nav, .spotlight__foot > *",
          {
            y: 16,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.06,
          },
          "-=0.4",
        );

      /* Scrubbed drift for the whole band as it passes. The art layer moves
         furthest and the photograph least, which is what gives the group its
         depth. All of it is `y`/`yPercent` only — disjoint from the entrance
         above. */
      const drift = {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      } as const;

      gsap.to(".spotlight__art-item", {
        y: (i: number) => (i % 2 === 0 ? -58 : -32),
        ease: "none",
        scrollTrigger: drift,
      });
    });
    /* Scrubbed drift as the band passes. The art layer moves furthest and the
       photograph least, which is what gives the group its depth. */
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(".spotlight__visual", {
        yPercent: -3.5,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  if (!product) return null;

  const lab = "labAnalysis" in product ? product.labAnalysis : undefined;
  const spec = (label: string) =>
    product.specs.find((s) => s.label === label)?.value;

  /* Four annotations, each a fact the site already publishes elsewhere. A chip
     with no source is dropped rather than filled — `chips` is filtered, so a
     lot without an analysis simply shows fewer. */
  const chips = [
    lab && {
      key: "purity",
      label: lab.purity,
      detail: `Verified purity · ${lab.lab}`,
    },
    lab && {
      key: "batch",
      label: `Lot ${lab.batchNumber}`,
      detail: `${lab.fillVolume} fill, reported in full`,
    },
    spec("Form") && {
      key: "form",
      label: spec("Form"),
      detail: spec("Total content"),
    },
    spec("Storage") && {
      key: "storage",
      label: spec("Storage"),
      detail: "Cold-packed and sealed for transit",
    },
  ].filter(Boolean) as { key: string; label: string; detail?: string }[];

  /* The `alt` is doing the caption's job since the visible one was removed —
     it is the only description of each crop a screen reader gets, so keep it
     specific rather than trimming it to "carton detail". */
  const details = [
    {
      key: "molecules",
      src: detailMolecules,
      alt: "The compound artwork printed across the carton face",
    },
    {
      key: "device",
      src: detailDevice,
      alt: `${spec("Form") ?? "Pre-filled research pen"}, shown through the carton window`,
    },
    {
      key: "dose",
      src: detailDose,
      alt: `${spec("Total content") ?? "Total content"} — supplied as 4 doses of 5 mg`,
    },
  ];

  /* **Wraps rather than clamping.** The mockup draws both pagers in full
     burgundy with the first tile already active, so neither is ever dimmed —
     and with three tiles a disabled control is the more annoying of the two
     behaviours anyway. */
  const step = (dir: 1 | -1) =>
    setActiveDetail((i) => (i + dir + details.length) % details.length);

  return (
    <section className="spotlight" ref={root}>
      {/* Decorative. Soft fields plus the line art the mockup carries in its
          corners and margins — drawn as inline SVG rather than shipped as
          images, so it tracks the burgundy tokens and costs no request. */}
      <span className="spotlight__wash" aria-hidden />
      <div className="spotlight__art" aria-hidden>
        <svg
          className="spotlight__art-item spotlight__art-item--tl"
          viewBox="0 0 240 165"
          fill="none"
          stroke="currentColor"
        >
          {MOLECULE}
        </svg>
        <svg
          className="spotlight__art-item spotlight__art-item--br"
          viewBox="0 0 240 165"
          fill="none"
          stroke="currentColor"
        >
          {MOLECULE}
        </svg>
        <svg
          className="spotlight__art-item spotlight__art-item--ribbon-l"
          viewBox="0 0 420 180"
          fill="none"
          stroke="currentColor"
          preserveAspectRatio="none"
        >
          {ribbon(false)}
        </svg>
        <svg
          className="spotlight__art-item spotlight__art-item--ribbon-r"
          viewBox="0 0 420 180"
          fill="none"
          stroke="currentColor"
          preserveAspectRatio="none"
        >
          {ribbon(true)}
        </svg>
      </div>

      <div className="spotlight__inner">
        <div className="spotlight__head">
          <p className="spotlight__eyebrow">
            <span>{spotlightCopy.eyebrow}</span>
          </p>
          <h2 className="spotlight__title">{spotlightCopy.title}</h2>
        </div>

        <div className="spotlight__stage">
          {/* The contact shadow. It sits behind the photograph, which is
              feathered to transparent at its base, so it reads as the group
              standing on a surface instead of floating on the band. */}
          <span className="spotlight__ground" aria-hidden />

          <figure className="spotlight__visual">
            <img
              src={spotlightImage}
              alt={`${product.title} carton held in both hands`}
              width={1800}
              height={1012}
              loading="lazy"
              decoding="async"
            />
          </figure>

          {/* A sibling of the visual, not a child: on desktop it is an
              absolutely-positioned overlay, and below 992px it drops into a
              plain grid under the photograph. Keeping it out of the figure is
              what lets that reflow happen. Same structure as the showcase. */}
          <ul className="spotlight__chips">
            {chips.map((chip) => (
              /* Each chip is seated by `:nth-child` in the CSS — their places
                 around the carton are composed, not generated. */
              <li className="spotlight__chip" key={chip.key}>
                <span className="spotlight__node" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    {CHIP_ICONS[chip.key]}
                  </svg>
                </span>
                <span className="spotlight__chip-copy">
                  <strong>{chip.label}</strong>
                  {chip.detail && <span>{chip.detail}</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* The mockup's thumbnail strip: pagers either side, the active tile
            framed in burgundy. A caption naming the active crop was built
            under the rail and **removed on request** — the comp has no such
            line — so selection now shows only in the frame and the tile's
            slight lift. The captions are still carried on `details` as each
            tile's `alt`, which is what a screen reader announces. */}
        <div className="spotlight__gallery">
          <div className="spotlight__gallery-row">
            <button
              type="button"
              className="spotlight__gallery-nav"
              onClick={() => step(-1)}
              aria-label="Previous carton detail"
              data-cursor
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </button>

            <ul className="spotlight__details">
              {details.map((d, i) => (
                <li className="spotlight__detail" key={d.key}>
                  <button
                    type="button"
                    className={
                      i === activeDetail
                        ? "spotlight__detail-btn spotlight__detail-btn--on"
                        : "spotlight__detail-btn"
                    }
                    onClick={() => setActiveDetail(i)}
                    aria-pressed={i === activeDetail}
                    data-cursor
                  >
                    <img
                      src={d.src}
                      alt={d.alt}
                      width={360}
                      height={360}
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="spotlight__gallery-nav"
              onClick={() => step(1)}
              aria-label="Next carton detail"
              data-cursor
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

        </div>

        <div className="spotlight__foot">
          <a className="spotlight__cta" href={spotlightCopy.cta.href} data-cursor>
            {spotlightCopy.cta.label}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path d="M5 12h13M12 6l6 6-6 6" />
            </svg>
          </a>
          <a
            className="spotlight__report"
            href={spotlightCopy.reportLink.href}
            data-cursor
          >
            {spotlightCopy.reportLink.label}
          </a>
          <p className="spotlight__note">{spotlightCopy.note}</p>
        </div>
      </div>
    </section>
  );
}
