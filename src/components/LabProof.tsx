import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  proofCopy,
  purityMethod,
  scienceReports,
  teamPanel,
} from "../data/science";
import moleculeImg from "../assets/science/molecule.webp";
import { SplitText } from "./SplitText";

/* ------------------------------------------------------------------ icons */

/** Inline so the cards need no icon assets. Stroke only, sized by CSS. */
const ICONS: Record<string, ReactNode> = {
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="M7 15.2l3.6-5.2 3 3L20.5 6" />
    </>
  ),
  atom: (
    <>
      <circle cx="12" cy="12" r="2.1" />
      <ellipse cx="12" cy="12" rx="10" ry="4.3" />
      <ellipse cx="12" cy="12" rx="10" ry="4.3" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4.3" transform="rotate(120 12 12)" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.5l8 3v6c0 5-3.4 8.9-8 10-4.6-1.1-8-5-8-10v-6l8-3Z" />
      <path d="M8.6 12.2l2.3 2.3 4.5-4.6" />
    </>
  ),
};

/** One per `purityMethod.steps`, in order. */
const STEP_ICONS = ["chart", "atom", "shield"];

function Icon({ name }: { name: string }) {
  return (
    <svg className="proof__icon" viewBox="0 0 24 24" aria-hidden focusable="false">
      {ICONS[name]}
    </svg>
  );
}

/* -------------------------------------------------------------- component */

export function LabProof() {
  const root = useRef<HTMLElement | null>(null);
  /** Counts up to the real purity figure on reveal. */
  const purity = useRef<HTMLSpanElement | null>(null);

  /* Highest-purity published lot — derived, never hand-picked, so a better
     lot promotes itself and no figure here is written by hand. */
  const lot = scienceReports.reduce<(typeof scienceReports)[number] | null>(
    (best, r) =>
      Number.isFinite(r.purityValue) && (!best || r.purityValue > best.purityValue)
        ? r
        : best,
    null,
  );

  useEffect(() => {
    if (!root.current) return;
    const mm = gsap.matchMedia();

    /* Shared across both layouts: headline, copy, icon draw-on, count-up.
       Returns a cleanup that restores the real purity figure. */
    const common = () => {
      gsap.fromTo(
        ".proof__title .char",
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 1,
          ease: "power4.out",
          stagger: 0.014,
          scrollTrigger: { trigger: ".proof__head", start: "top 82%" },
        },
      );

      gsap.from("[data-proof-reveal]", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 80%" },
      });

      const tileTrigger = { trigger: ".proof__mosaic", start: "top 76%" };

      /* Card icons draw themselves in. */
      gsap.utils
        .toArray<SVGGeometryElement>(
          ".proof__card-icon path, .proof__card-icon circle, .proof__card-icon ellipse",
        )
        .forEach((shape, i) => {
          const len = shape.getTotalLength();
          gsap.fromTo(
            shape,
            { strokeDasharray: len, strokeDashoffset: len },
            {
              strokeDashoffset: 0,
              duration: 1.1,
              ease: "power2.out",
              delay: 0.35 + Math.floor(i / 4) * 0.09,
              scrollTrigger: tileTrigger,
            },
          );
        });

      /* The purity figure counts up to its real published value. */
      const figure = purity.current;
      if (figure && lot) {
        const decimals = (lot.purity.split(".")[1] ?? "").replace(/\D/g, "").length;
        const counter = { value: 0 };
        gsap.to(counter, {
          value: lot.purityValue,
          duration: 1.6,
          ease: "power2.out",
          delay: 0.5,
          scrollTrigger: tileTrigger,
          onUpdate: () => {
            figure.textContent = `${counter.value.toFixed(decimals)}%`;
          },
        });
      }

      return () => {
        if (figure && lot) figure.textContent = lot.purity;
      };
    };

    /* ---- desktop: the section pins and the layout assembles -------------- */
    mm.add(
      "(prefers-reduced-motion: no-preference) and (min-width: 992px)",
      () => {
        const restore = common();
        const mosaic = root.current?.querySelector<HTMLElement>(".proof__mosaic");
        if (!mosaic) return restore;

        const shots = gsap.utils.toArray<HTMLElement>(".proof__shot", mosaic);
        const cards = gsap.utils.toArray<HTMLElement>(".proof__card", mosaic);

        /* --- the opening row arrives: aperture, settle, ring ------------- */
        /* Plays once as the row scrolls in, before the pin takes over. It
           only touches clipPath / filter / boxShadow / the inner image, so it
           cannot collide with the pin timeline's x / y / scale on the same
           elements. */
        shots.forEach((tile, i) => {
          const at = i * 0.14;
          const open = gsap.timeline({
            scrollTrigger: {
              trigger: mosaic,
              start: "top 85%",
              once: true,
            },
          });

          open
            .fromTo(
              tile,
              {
                // 50%, not 71%: these tiles are already circles, so the
                // aperture should stop exactly at the edge.
                clipPath: "circle(0% at 50% 50%)",
                filter: "blur(16px)",
                autoAlpha: 0,
              },
              {
                clipPath: "circle(50% at 50% 50%)",
                filter: "blur(0px)",
                autoAlpha: 1,
                duration: 1.15,
                ease: "power3.inOut",
                delay: at,
              },
              0,
            )
            // The photograph settles outward as the aperture opens.
            .fromTo(
              tile.querySelector("img"),
              { scale: 1.45 },
              { scale: 1, duration: 1.7, ease: "power3.out", delay: at },
              0,
            )
            // A single accent ring breaks out of the edge as it lands.
            .fromTo(
              tile,
              { boxShadow: "0 0 0 0 rgba(255, 238, 200, 0.5)" },
              {
                boxShadow: "0 0 0 26px rgba(255, 238, 200, 0)",
                duration: 1.2,
                ease: "power2.out",
                delay: at + 0.3,
              },
              0,
            );
        });

        /* NOTE: do not collapse the empty second row by animating this
           container's height or margin. Either changes the section's height
           while it is pinned, but ScrollTrigger sizes the pin spacer once at
           setup — so the document ends up shorter than the pin needs and the
           next section scrolls up over this one. The row simply stays
           reserved; it is empty dark space until the cards arrive. */

        /* Where a tile has to start so the three circles read as one row.
           Measured from layout boxes (offsetLeft/offsetTop), which a
           transform cannot corrupt, and recomputed on every refresh. */
        const seat = (el: HTMLElement, axis: "x" | "y") => {
          const gap = parseFloat(getComputedStyle(mosaic).columnGap) || 0;
          const colW = (mosaic.clientWidth - gap * 2) / 3;
          const index = shots.indexOf(el);
          if (axis === "x") {
            const target = index * (colW + gap) + colW / 2;
            return target - (el.offsetLeft + el.offsetWidth / 2);
          }
          // Seated on the FIRST row, not the middle of the finished grid.
          // These start values are applied the moment the timeline is built,
          // so they are what you see scrolling in before the pin engages —
          // centring them left a dead gap between the lead and the circles.
          const target = el.offsetHeight / 2;
          return target - (el.offsetTop + el.offsetHeight / 2);
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            // Pin once the mosaic is centred, so the whole grid is on screen
            // while it assembles.
            trigger: mosaic,
            start: "center center",
            end: "+=90%",
            pin: root.current,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          shots,
          {
            x: (_i, el: HTMLElement) => seat(el, "x"),
            y: (_i, el: HTMLElement) => seat(el, "y"),
            scale: 0.9,
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            ease: "power2.inOut",
            duration: 1,
          },
          0,
        ).fromTo(
          cards,
          { autoAlpha: 0, y: 54, scale: 0.9 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            ease: "power2.out",
            duration: 0.7,
            stagger: 0.1,
          },
          0.3,
        );

        return restore;
      },
      root,
    );

    /* ---- narrow: no pin, tiles simply reveal in place -------------------- */
    mm.add(
      "(prefers-reduced-motion: no-preference) and (max-width: 991px)",
      () => {
        const restore = common();
        const tileTrigger = { trigger: ".proof__mosaic", start: "top 76%" };

        gsap.from(".proof__card", {
          y: 56,
          opacity: 0,
          scale: 0.96,
          duration: 0.95,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: tileTrigger,
        });

        gsap.utils.toArray<HTMLElement>(".proof__shot").forEach((tile, i) => {
          // 71% ≈ half the diagonal, so the circle clears the square corners.
          gsap.fromTo(
            tile,
            { clipPath: "circle(0% at 50% 50%)", opacity: 0 },
            {
              clipPath: "circle(71% at 50% 50%)",
              opacity: 1,
              duration: 1.1,
              ease: "power3.inOut",
              delay: i * 0.12,
              scrollTrigger: tileTrigger,
            },
          );
          gsap.from(tile.querySelector("img"), {
            scale: 1.35,
            duration: 1.5,
            ease: "power3.out",
            delay: i * 0.12,
            scrollTrigger: tileTrigger,
          });
        });

        return restore;
      },
      root,
    );

    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, [lot]);

  const [stepA, stepB, stepC] = purityMethod.steps;

  const card = (
    step: (typeof purityMethod.steps)[number],
    index: number,
  ) => (
    <article className="proof__card" data-proof-tile>
      <span className="proof__card-icon">
        <Icon name={STEP_ICONS[index] ?? "chart"} />
      </span>
      <h3 className="proof__card-title">{step.label}</h3>
      <p className="proof__card-body">{step.body}</p>
    </article>
  );

  return (
    <section
      className="container section proof"
      ref={root}
      aria-labelledby="proof-title"
    >
      {/* ------------------------------------------------- centred header */}
      <header className="proof__head">
        <div className="proof__head-copy">
        <span className="proof__mark" data-proof-reveal>
          Lyfe <span className="proof__mark-tag">[ {proofCopy.mark} ]</span>
        </span>
        {/* Split into characters so each can rise behind its own mask. */}
        <h2
          className="proof__title"
          id="proof-title"
          aria-label={`${proofCopy.titleLead} ${proofCopy.titleAccent}`}
        >
          <SplitText text={proofCopy.titleLead} as="span" ariaLabel="" />{" "}
          <SplitText
            text={proofCopy.titleAccent}
            as="span"
            className="proof__title-accent"
            ariaLabel=""
          />
        </h2>
        </div>

        <p className="proof__lead" data-proof-reveal>
          {proofCopy.text}
        </p>
      </header>

      {/* ------------------------------- 3 × 2 checkerboard: cards + media */}
      <div className="proof__mosaic">
        {card(stepA, 0)}

        <figure className="proof__shot proof__shot--round" data-proof-tile>
          <img
            src={teamPanel.image}
            alt={teamPanel.imageAlt}
            width={600}
            height={600}
            loading="lazy"
            decoding="async"
          />
        </figure>

        {card(stepB, 1)}

        {/* The one tile carrying live data: the highest published lot. */}
        {lot ? (
          <a
            className="proof__shot proof__shot--lot proof__shot--low"
            href={lot.href}
            data-proof-tile
            data-cursor
          >
            <img
              src={lot.image}
              alt=""
              width={600}
              height={600}
              loading="lazy"
              decoding="async"
            />
            <span className="proof__shot-meta">
              <span className="proof__shot-name">{lot.title}</span>
              <span className="proof__shot-figure mono">
                <span ref={purity}>{lot.purity}</span> · lot {lot.batchNumber}
              </span>
            </span>
          </a>
        ) : (
          <figure className="proof__shot proof__shot--lot" data-proof-tile>
            <img
              src={moleculeImg}
              alt=""
              width={600}
              height={600}
              loading="lazy"
              decoding="async"
            />
          </figure>
        )}

        {card(stepC, 2)}

        <figure
          className="proof__shot proof__shot--round proof__shot--low"
          data-proof-tile
        >
          <img
            src={purityMethod.image}
            alt={purityMethod.imageAlt}
            width={600}
            height={600}
            loading="lazy"
            decoding="async"
          />
        </figure>
      </div>
    </section>
  );
}
