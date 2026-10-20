import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lotFanCopy, site } from "../data/site";
/* **The carton face, cropped to exactly its printed rectangle** (846x391 at
   27,375 of the 900x1130 catalogue render, measured at alpha >= 250). The
   built box below hinges its top and side on the *element* edges, so the
   element has to be the carton and nothing else — fitting the uncropped
   render left a sliver of its transparent canvas above the artwork and the
   top face then floated detached, with a dark gap under it. */
import pack from "../assets/lotfan/face.webp";

/**
 * The lot band: a cream panel carrying a rule-flanked eyebrow, one long
 * statement whose words fill from grey to ink as the band passes, the pack
 * turned in 3D over an enormous pale ghost wordmark, and a hairline stat row
 * of four carton facts.
 *
 * See `lotFanCopy` for the client reference this is built to, for the two
 * parts of it that could not ship, and for the compliance note on the pack.
 */
export function LotFan() {
  const root = useRef<HTMLElement | null>(null);

  /* Split in the component, not in the data: the copy stays one readable
     string in `site.ts`, and because the spans are plain inline text the
     sentence still selects and reads as one heading. Same contract as
     `.aboutband__word`. */
  const words = lotFanCopy.title.split(" ");

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      /* The entrance deliberately leaves the headline alone: its words are
         owned by the scrub below, and the fill *is* its arrival. */
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 74%", once: true },
      });

      tl.from(".lotfan__eyebrow", {
        y: 18,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      })
        /* The mark alone — the sub-word is nested inside it now and fades
           with it, so tweening both compounds the same opacity twice. */
        .from(
          ".lotfan__ghost",
          { opacity: 0, duration: 0.9, ease: "power2.out" },
          "-=0.35",
        )
        /* The wrapper's own arrival — `opacity` here is what fades the shadow
           and the built faces in with it, so none of them needs a tween of
           its own. */
        .from(
          ".lotfan__pack",
          {
            y: 64,
            scale: 0.92,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.2",
        )
        .from(
          ".lotfan__stat",
          {
            y: 24,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.08,
          },
          "-=0.5",
        )
        .from(
          ".lotfan__note",
          { y: 14, opacity: 0, duration: 0.5, ease: "power3.out" },
          "-=0.35",
        );

      /* **The statement fills in a word at a time**, which is what gives the
         reference's dark-first-line / grey-tail reading while the band is
         mid-screen. Same settings as the about band, so the two read as one
         device, and the resting CSS state is the finished one — reduced
         motion (no `mm.add` branch) renders the sentence at full strength. */
      gsap.fromTo(
        ".lotfan__word",
        { opacity: 0.26 },
        {
          opacity: 1,
          ease: "none",
          stagger: 1,
          scrollTrigger: {
            trigger: ".lotfan__title",
            start: "top 88%",
            end: "bottom 58%",
            scrub: true,
          },
        },
      );

      /* The ghost mark drifts across as the band passes — the why-us band's
         effect, at its settings, so the two watermarks read as one device.
         It owns `x` on the row alone; the entrance owns `opacity` on the two
         words inside it, so no tween shares a property on the same element. */
      gsap.fromTo(
        ".lotfan__ghost-row",
        { x: -30 },
        {
          x: 30,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      /* **The 3D turn.** The box rotates through the band, and the specular
         band travels across the printed face with it — the two are one tween
         so the highlight can never drift out of step with the angle.

         GSAP owns the box's whole transform — `perspective` lives on the
         wrapper for exactly that reason, because GSAP writes `transform`
         wholesale and a `perspective()` inside it would be overwritten on
         the first tick. The CSS still carries a static turn so reduced
         motion renders a dimensional box rather than a flat one.

         **The turn runs through zero**, which the two-face version could not
         do: all four sides are built, so there is a panel to catch the turn
         whichever way it leans instead of the box reading hollow. Note a
         positive `rotateY` pushes the box's *right* edge away and brings the
         left one forward — so a positive angle shows the **left** face, and
         that is the one shaded as catching the light.

         **The range is deliberately lopsided.** A symmetric sweep puts the
         flat-on angle at progress 0.5 — which is the band centred in the
         viewport, i.e. exactly when it is being looked at, and a carton
         square to the camera is the one angle with no dimension in it at
         all. Starting at -6deg moves the crossing down to roughly progress
         0.17, while the band is still low on the screen, so it is turned for
         the whole time it holds the middle. */
      gsap.fromTo(
        ".lotfan__box",
        /* **`rotate: 0` is load-bearing.** GSAP reads the element's starting
           transform off the computed *matrix* and decomposes it into its own
           rotation order, and the CSS resting pose (`rotateX` composed with
           `rotateY`) does not decompose cleanly — it leaves a residual ~3deg
           roll on the z axis, which tilted the carton on the page. Stating it
           zeroes it; the only roll the box should carry is the float's. */
        { rotate: 0, rotateY: -6, rotateX: 13, "--lotfan-sheen": "122%" },
        {
          rotate: 0,
          rotateY: 30,
          rotateX: 3,
          "--lotfan-sheen": "-22%",
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      /* **The idle float**, which is what makes the pack read as a suspended
         object rather than a still with a slant on it. The shadow contracts
         as the box rises, so the two read as one body and one light.

         Paused off screen: it is an infinite tween, and there is no reason to
         run it while the band is three viewports away. */
      const idle = gsap
        .timeline({ repeat: -1, yoyo: true, defaults: { ease: "sine.inOut" } })
        .to(".lotfan__float", { y: -18, rotate: 1.2, duration: 3.1 }, 0)
        .to(".lotfan__shadow", { scaleX: 0.88, scaleY: 0.82, duration: 3.1 }, 0);

      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? idle.play() : idle.pause()),
      });
    });

    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section className="section lotfan" ref={root}>
      <div className="lotfan__inner">
        <p className="lotfan__eyebrow">{lotFanCopy.eyebrow}</p>

        {/* One sentence, one word per span so the scrub can fill them in
            order. The trailing space is inside the span so the sentence still
            copies and reads normally. */}
        <h2 className="lotfan__title">
          {words.map((word, i) => (
            <span className="lotfan__word" key={`${word}-${i}`}>
              {word}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </h2>

        <div className="lotfan__stage">
          {/* The **brand** set enormous behind the pack, not the product name
              (2026-10-19, requested) — read from `site` so it cannot drift
              from the header, and built as the why-us band's ghost pair: a
              huge mark with its sub-word beside it at cap height. Decorative,
              so it is hidden from assistive tech rather than read as a third
              heading; the header carries the real wordmark. */}
          <div className="lotfan__ghost-row" aria-hidden>
            {/* **The sub-word is nested, not a sibling.** The reference puts
                its product over the middle of a single ghost word; with the
                two set as a flex pair the *lockup* centred instead, which put
                the pack over the gap between them and hid the back half of
                the mark. Hanging the sub off the mark's right edge leaves the
                mark itself centred, so the carton covers its middle and the
                outer letters read either side. */}
            <span className="lotfan__ghost">
              {site.brandMark}
              <span className="lotfan__ghost-sub">{site.brandSub}</span>
            </span>
          </div>

          {/* The pack is turned in 3D, as the reference's bottle is. There is
              no dimensional render in the client's set — every drop is a flat
              front-on carton — so the box is **built**: the real render is the
              front face and CSS adds a side and a top behind it.

              The wrapper carries the perspective and is what GSAP animates;
              the box carries only the rotation. See `.lotfan__box`. */}
          <div className="lotfan__pack">
            {/* The bob lives on its own element so it cannot collide with the
                entrance (which owns `y` on the wrapper) or the scroll turn
                (which owns the rotation on the box). Three transforms, three
                elements — the usual disjoint-property rule, applied through
                the DOM rather than through property names. */}
            <div className="lotfan__float">
              <div className="lotfan__box">
                <img
                  className="lotfan__face"
                  src={pack}
                  alt={lotFanCopy.packAlt}
                  width={846}
                  height={390}
                  loading="lazy"
                  decoding="async"
                />
                {/* A narrow specular band that sweeps the printed face as the
                    box turns, so the carton reads as a lit object rather than
                    a flat image on a slant. Kept low-alpha: the pack's own
                    printed copy has to stay legible under it. */}
                <span className="lotfan__sheen" aria-hidden />
                {/* All four sides are built, not just the top and the right.
                    That is what lets the turn run through zero — with only two
                    faces a negative angle swings an un-built edge forward and
                    the box reads hollow. */}
                <span className="lotfan__side lotfan__side--top" aria-hidden />
                <span className="lotfan__side lotfan__side--bottom" aria-hidden />
                <span className="lotfan__side lotfan__side--right" aria-hidden />
                <span className="lotfan__side lotfan__side--left" aria-hidden />
              </div>
            </div>
            {/* The contact shadow is a sibling of the float, not a child: it
                has to stay put while the pack rises off it, which is what
                sells the hover. */}
            <span className="lotfan__shadow" aria-hidden />
          </div>
        </div>

        {/* The reference's closing row: four figures over small caps labels,
            under one hairline. Every figure is a fact off the carton or a
            fact about how every order ships — see `lotFanCopy`. */}
        <ul className="lotfan__stats">
          {lotFanCopy.stats.map((stat) => (
            <li className="lotfan__stat" key={stat.figure}>
              <span className="lotfan__figure">{stat.figure}</span>
              <span className="lotfan__stat-label">{stat.label}</span>
            </li>
          ))}
        </ul>

        {/* In the band, not only on the product pages: this one names a pack
            in display type, so the disclaimer travels with it. */}
        <p className="lotfan__note">{lotFanCopy.note}</p>
      </div>
    </section>
  );
}
