import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lineStoryCopy } from "../data/site";
/* The expanding image (client drop, 2026-10-19) — a straight webp conversion
   of `latest-images/bg-latest.png`, which stays untouched as the source of
   truth. Its 1672x941 is almost exactly the 16/9 the pill opens to, so the
   expand lands on it with nothing cropped.

   COMPLIANCE: it pictures a TESAMORELIN carton, which the catalogue does not
   stock, and at the open size its benefit strapline is legible — see
   `CLAUDE.md`. Its printed copy is at least clean, unlike the confidence
   band's drop. Nothing in this band refers to the pack and the alt names no
   compound. */
import expandArt from "../assets/linestory/expand.webp";

/**
 * The statement band, built to section 3 of `nymphaicosmetics.com`: one large
 * centred statement with an inline image that opens mid-sentence as the band
 * passes, over a two-paragraph block whose words fill from faded to solid.
 *
 * See `lineStoryCopy` for the reference's own statement and why it could not
 * ship. `.linestory__*` at the end of portfolio.css.
 */
export function LineStory() {
  const root = useRef<HTMLElement | null>(null);

  /* Split in the component, not in the data: the copy stays two readable
     strings in `site.ts`, and because the spans are plain inline text the
     paragraphs still select and read normally. Same contract as
     `.aboutband__word`. */
  const paragraphs = lineStoryCopy.paragraphs.map((p) => p.split(" "));

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const pill = el.querySelector<HTMLElement>(".linestory__pill");
      const inner = el.querySelector<HTMLElement>(".linestory__inner");

      if (pill && inner) {
        /* **The expand — the band's signature move, and it grows in place.**
           The image is the inline element itself, so the sentence re-flows
           around it: "material that arrives" is pushed left, "fully
           documented," right, and the lines above and below are pushed apart
           as the line box grows taller. That is the reference's actual
           behaviour.

           An earlier pass flew the image out of the socket into a full-width
           frame below the statement. It was dropped: the words have to
           *move*, not be covered, and that version needed the statement
           faded out to stop the two colliding.

           **The CSS resting state is the finished one** — full size, square
           corners — so reduced motion, which never enters this block, renders
           the image open with no tween to undo. */
        const openW = () => Math.min(inner.clientWidth, 608);
        const shutW = () => Math.min(inner.clientWidth * 0.3, 104);

        gsap.fromTo(
          pill,
          {
            width: shutW,
            height: () => shutW() * 0.44,
            borderRadius: 999,
          },
          {
            width: openW,
            height: () => openW() * (9 / 16),
            borderRadius: 18,
            ease: "none",
            scrollTrigger: {
              trigger: ".linestory__type",
              start: "top 82%",
              /* Finishes while the statement still holds the middle of the
                 screen, so the open image is read rather than landing on the
                 way out of the band. */
              end: "bottom 58%",
              scrub: true,
              /* The open width tracks the band's width, so the values have to
                 be re-read on resize rather than baked in at setup. */
              invalidateOnRefresh: true,
            },
          },
        );

        /* The photograph pulls back inside the growing box, so it reads as a
           zoom rather than a crop being uncovered. It owns `scale` on the
           `<img>`; the tween above owns the pill's geometry, so nothing
           shares a property on one element. */
        gsap.fromTo(
          ".linestory__pill img",
          { scale: 1.5 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".linestory__type",
              start: "top 82%",
              end: "bottom 58%",
              scrub: true,
            },
          },
        );
      }

      /* The statement's own arrival. */
      gsap.from(".linestory__type", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 76%", once: true },
      });

      /* The paragraphs fill a word at a time as the band passes — the site's
         existing device (`.aboutband__word`), at its settings, so this band
         and the about band read as one language. The resting CSS state is the
         *finished* one, so reduced motion renders them at full strength. */
      gsap.fromTo(
        ".linestory__word",
        { opacity: 0.3 },
        {
          opacity: 1,
          ease: "none",
          stagger: 1,
          scrollTrigger: {
            trigger: ".linestory__copy",
            start: "top 88%",
            end: "bottom 60%",
            scrub: true,
          },
        },
      );
    });

    /* **Re-measure once the webfont has swapped in.** The statement is set in
       Roboto 300; until it loads the heading is laid out in the fallback and
       its lines are ~26px shorter, which moves every trigger this band owns. */
    let cancelled = false;
    void document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section className="section linestory" ref={root}>
      <div className="linestory__inner">
        {/* **Explicit lines, so the image opens in the middle one.** Left to
            wrap, it went wherever the break happened to fall — the end of
            line one. One entry in the data is one rendered line, the contract
            the hero and the FAQ heading already use. */}
        <h2 className="linestory__type">
          <span className="linestory__line">{lineStoryCopy.lineOne}</span>
          <span className="linestory__line">
            <span className="linestory__before">{lineStoryCopy.before}</span>
            {/* The image *is* the inline element — that is what lets the
                sentence set around it as it opens. Decorative framing, so the
                figure carries the alt and nothing else. */}
            <span className="linestory__pill">
              <img
                src={expandArt}
                alt={lineStoryCopy.pillAlt}
                width={1672}
                height={942}
                loading="lazy"
                decoding="async"
              />
            </span>
            <span className="linestory__after">{lineStoryCopy.after}</span>
          </span>
          <span className="linestory__line">{lineStoryCopy.lineThree}</span>
        </h2>

        <div className="linestory__copy">
          {paragraphs.map((words, p) => (
            <p className="linestory__para" key={p}>
              {words.map((word, i) => (
                <span className="linestory__word" key={`${p}-${i}`}>
                  {word}
                  {i < words.length - 1 ? " " : ""}
                </span>
              ))}
            </p>
          ))}
        </div>
        {/* The enormous ghost word that closed the band was **removed on
            request (2026-10-19)** — the opening image is the band's display
            element now, and a second oversized mark under it competed with
            it. `.linestory__ghost*` is gone from the CSS with it. */}
      </div>
    </section>
  );
}
