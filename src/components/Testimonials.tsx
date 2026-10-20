import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { testimonials } from "../data/site";
import stretchClip from "../assets/reviews/stretch.mp4";
import stretchPoster from "../assets/reviews/stretch.webp";
import calisthenicsClip from "../assets/reviews/calisthenics.mp4";
import calisthenicsPoster from "../assets/reviews/calisthenics.webp";
import foamrollClip from "../assets/reviews/foamroll.mp4";
import foamrollPoster from "../assets/reviews/foamroll.webp";
import terraceClip from "../assets/reviews/terrace.mp4";
import terracePoster from "../assets/reviews/terrace.webp";

type Review = (typeof testimonials)[number];

/* The client's four customer clips (2026-10-16), replacing the portraits as
   the card media. Each is a 6s silent loop cut from the drop in
   `latest-images/videos/`, which stays untouched as the source of truth —
   see `CLAUDE.md` for the encode and why they had to be cut down this far.

   **Four clips, six reviews**, so they cycle. The rail already repeats, so a
   clip appearing twice per copy is not a new kind of repetition. Add a fifth
   file here and it is picked up without touching anything else. */
const REVIEW_CLIPS = [
  { src: stretchClip, poster: stretchPoster },
  { src: calisthenicsClip, poster: calisthenicsPoster },
  { src: foamrollClip, poster: foamrollPoster },
  { src: terraceClip, poster: terracePoster },
];

/* **One card per column** (2026-10-16, requested). The rail used to alternate
   a tall portrait with a column of two stacked short ones — the reference's
   masonry — and `buildColumns()` is gone with it, along with the `short` card
   size. Every review is now its own full-height card, so the rail reads as a
   single row and no review is half the size of its neighbour. The stagger
   that masonry gave the row is carried by `--lift` alone now.

   Fixed lifts, not random: the two marquee copies have to land identically. */
const COLUMN_LIFTS = [1.5, -1, 2.25, 0, 1, -1.75];

export function Testimonials() {
  const root = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!trackRef.current) return;
    const track = trackRef.current;

    const ctx = gsap.context(() => {
      const half = track.scrollWidth / 2;
      const tween = gsap.to(track, {
        x: -half,
        duration: 55,
        ease: "none",
        repeat: -1,
        modifiers: { x: (x) => `${parseFloat(x) % -half}px` },
      });

      /* Pausing on hover is what makes the review readable — it is revealed by
         the same gesture that would otherwise carry it off screen. */
      const onEnter = () => gsap.to(tween, { timeScale: 0, duration: 0.5 });
      const onLeave = () => gsap.to(tween, { timeScale: 1, duration: 0.6 });
      track.addEventListener("mouseenter", onEnter);
      track.addEventListener("mouseleave", onLeave);

      return () => {
        track.removeEventListener("mouseenter", onEnter);
        track.removeEventListener("mouseleave", onLeave);
      };
    }, root);

    return () => ctx.revert();
  }, []);

  /* **Only the clips actually on screen are allowed to decode.** The rail
     renders 24 `<video>` elements and no browser will play that many at once;
     the marquee carries most of them far off either side of the viewport, and
     a plain `autoplay` would have every one of them decoding regardless. The
     observer watches each video's own box, so playback tracks the marquee.

     Network cost is unaffected either way — there are only four distinct
     sources, so the browser fetches four files however many elements point at
     them. This is purely about decode.

     Reduced motion gets no playback at all, only the posters: an autoplaying
     loop is motion, and `index.css` kills every other animation on the page
     under that preference. */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const videos = [...el.querySelectorAll<HTMLVideoElement>(".stories__clip")];
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            /* Autoplay can still be refused (data saver, battery). The poster
               is the clip's own first frame, so a rejection degrades to a
               still rather than to an empty box. */
            void video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { rootMargin: "100px" },
    );
    videos.forEach((video) => io.observe(video));

    return () => io.disconnect();
  }, []);

  /* The loop is `x % -half`, so HALF the track has to be at least a viewport
     wide or the wrap exposes blank space on the right. **Four copies, down
     from six since the cards became video** — half the track is then two
     copies, ~3100px at 1440 and ~3450px at 1920, which still clears any
     viewport, and it is a third fewer video elements to manage. */
  const loop = Array.from({ length: 4 }, () => testimonials).flat();

  const card = (review: Review, key: string, clipIndex: number) => {
    const clip = REVIEW_CLIPS[clipIndex % REVIEW_CLIPS.length];
    return (
      <article className="stories__card" key={key}>
        {/* Replaced the portrait on 2026-10-16. Muted and silent by encode —
            these are spoken pieces to camera, but the rail is a marquee and
            the written quote is what the hover reveals. */}
        <video
          className="stories__photo stories__clip"
          src={clip.src}
          poster={clip.poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={`${review.name} — verified Lyfe Health customer`}
        />
        <span className="stories__name">{review.name}</span>

        {/* Sits over the clip, tilted, until a hover brings it up */}
        <div className="stories__review">
          <span className="stories__stars" aria-label="Five out of five">
            <span aria-hidden>★★★★★</span>
          </span>
          <p className="stories__quote">{review.quote}</p>
          <span className="stories__by">
            {/* The clip's own first frame, not `review.avatar` — the card
                behind this note is the clip now, and the portrait would put
                two different people a few pixels apart. */}
            <img src={clip.poster} alt="" loading="lazy" decoding="async" />
            <span>
              <span className="stories__by-name">{review.name}</span>
              <span className="stories__by-role">{review.role}</span>
            </span>
          </span>
        </div>
      </article>
    );
  };

  return (
    <section id="reviews" className="testimonials stories" ref={root}>
      <div className="container stories__head">
        <span className="eyebrow stories__eyebrow">Reviews</span>
        <h2 className="stories__title">Stories from our customers</h2>
      </div>

      <div className="stories__rail" ref={trackRef}>
        {loop.map((review, c) => (
          <div
            className="stories__col"
            key={`c-${c}`}
            style={
              {
                "--lift": `${COLUMN_LIFTS[c % COLUMN_LIFTS.length]}rem`,
              } as React.CSSProperties
            }
          >
            {/* The clip follows the review's position in the source list, not
                its position in the loop, so every copy of the rail matches. */}
            {card(review, `${c}-${review.name}`, c % testimonials.length)}
          </div>
        ))}
      </div>
    </section>
  );
}
