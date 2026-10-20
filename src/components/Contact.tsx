import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "../data/site";
import standardPurity from "../assets/standards/purity.webp";
import standardConsistency from "../assets/standards/consistency.webp";
import standardPackaging from "../assets/standards/packaging.webp";
import standardSupport from "../assets/standards/support.webp";
import catMetabolic from "../assets/categories/metabolic.webp";
import catCellular from "../assets/categories/cellular.webp";
import catRecovery from "../assets/categories/recovery.webp";
import catFormulation from "../assets/categories/formulation.webp";

/**
 * `site.phone` / `site.whatsapp` are still placeholders (a run of zeros).
 * Showing them reads as broken on a site selling on credibility, so the
 * channel is hidden until real numbers land — then it returns on its own.
 */
const isPlaceholderNumber = (value: string) =>
  /0{6,}/.test(value.replace(/\D/g, ""));

/* size classes mirror the reference's small / large / medium / small rhythm */
const LEFT_PHOTOS = [
  { src: catMetabolic, size: "sm" },
  { src: standardPurity, size: "lg" },
  { src: catCellular, size: "md" },
  { src: standardConsistency, size: "sm" },
];

const RIGHT_PHOTOS = [
  { src: standardSupport, size: "lg" },
  { src: catRecovery, size: "sm" },
  { src: standardPackaging, size: "md" },
  { src: catFormulation, size: "sm" },
];

export function Contact() {
  const root = useRef<HTMLElement | null>(null);

  const whatsappReady =
    !isPlaceholderNumber(site.whatsapp) && !isPlaceholderNumber(site.phone);

  /* The email is set on an arc: ends low, middle high. Deterministic, so it
     matches between renders — no randomness. */
  const chars = Array.from(site.email);
  const lift = (i: number) =>
    Math.round(Math.sin(((i + 0.5) / chars.length) * Math.PI) * -34);

  useEffect(() => {
    if (!root.current) return;
    const mm = gsap.matchMedia();

    /* The turnover **plays once the band is reached, at every width, with no
       pin** (2026-10-20). History, so it is not re-tried: pin + 1:1 scrub
       ("stuck") → plain scrub → timed play on arrival → pin + smoothed scrub
       (`end: "+=70%"`, `anticipatePin: 1`), which was reported as **stuck
       and doubled** — pinning switches the band to `position: fixed`, and
       with Lenis driving the scroll and `anticipatePin` re-laying it out a
       frame early, it painted in two places as it latched and released.
       **Don't pin this band again.** The disc opens on its own as the band
       arrives and rewinds if you scroll back up past it. */
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap.fromTo(
          ".contact__grow",
          { scale: 0 },
          {
            scale: 1,
            duration: 1.6,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: root.current,
              start: "top 55%",
              toggleActions: "play none none reverse",
            },
          },
        );
      },
      root,
    );

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      /* Each circle opens like an aperture — the frame clips from nothing to a
         full circle while the photograph inside settles out of a blur and the
         whole thing drifts in from its own side of the band. Touching only
         clipPath / x / rotate on the frame and scale / filter on the <img>
         keeps it clear of the scroll drift below, which owns `y`. */
      gsap.utils.toArray<HTMLElement>(".contact__photo").forEach((photo, i) => {
        const fromLeft = photo.closest(".contact__photos--left") !== null;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
          delay: i * 0.09,
        });

        tl.fromTo(
          photo,
          {
            clipPath: "circle(0% at 50% 50%)",
            x: fromLeft ? -90 : 90,
            rotate: fromLeft ? -9 : 9,
            opacity: 0,
          },
          {
            clipPath: "circle(50% at 50% 50%)",
            x: 0,
            rotate: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
          },
        ).fromTo(
          photo.querySelector("img"),
          { scale: 1.45, filter: "blur(14px)" },
          { scale: 1, filter: "blur(0px)", duration: 1.3, ease: "power2.out" },
          0,
        );
      });

      /* Afterwards they keep moving: alternating drift speeds so the two
         columns never read as a static frame. */
      gsap.utils.toArray<HTMLElement>(".contact__photo").forEach((photo, i) => {
        gsap.to(photo, {
          y: i % 2 === 0 ? -48 : -22,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      gsap.from(".contact__char", {
        yPercent: 60,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.015,
        scrollTrigger: { trigger: ".contact__email", start: "top 85%" },
      });
    }, root);

    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section id="contact" className="contact" ref={root}>
      <span className="contact__grow" aria-hidden />

      <div className="container contact__inner">
        <div className="contact__photos contact__photos--left" aria-hidden>
          {LEFT_PHOTOS.map((photo, i) => (
            <span
              className={`contact__photo contact__photo--${photo.size}`}
              key={`l-${i}`}
            >
              <img src={photo.src} alt="" loading="lazy" decoding="async" />
            </span>
          ))}
        </div>

        <div className="contact__main">
          <span className="contact__eyebrow">Contact us</span>
          <h2 className="contact__title">
            Orders, batches and paperwork — ask us anything.
          </h2>

          <a className="contact__email" href={`mailto:${site.email}`}>
            <span className="sr-only">{site.email}</span>
            <span aria-hidden>
              {chars.map((char, i) => (
                <span
                  className="contact__char"
                  key={`${char}-${i}`}
                  style={{ transform: `translateY(${lift(i)}%)` }}
                >
                  {char}
                </span>
              ))}
            </span>
          </a>

          <div className="contact__actions">
            {whatsappReady && (
              <a
                className="contact__action"
                href={site.whatsapp}
                target="_blank"
                rel="noreferrer"
              >
                Message on WhatsApp
              </a>
            )}
            <a className="contact__action" href="#/track">
              Track an order
            </a>
          </div>
        </div>

        <div className="contact__photos contact__photos--right" aria-hidden>
          {RIGHT_PHOTOS.map((photo, i) => (
            <span
              className={`contact__photo contact__photo--${photo.size}`}
              key={`r-${i}`}
            >
              <img src={photo.src} alt="" loading="lazy" decoding="async" />
            </span>
          ))}
        </div>
      </div>

      <div className="container contact__foot">
        <div className="contact__links">
          <span className="contact__links-label">Shop</span>
          <a href="#/shop">All products</a>
          <a href="#/science?s=reports">Lab reports</a>
        </div>
        <div className="contact__links">
          <span className="contact__links-label">Help</span>
          <a href="#/track">Track order</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="contact__links contact__links--end">
          <span className="contact__links-label">Follow</span>
          {site.socials
            .filter((social) => !isPlaceholderNumber(social.href))
            .map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
              >
                {social.label}
              </a>
            ))}
        </div>
      </div>
    </section>
  );
}
