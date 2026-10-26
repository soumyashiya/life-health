import { useEffect, useRef, type MouseEvent } from "react";
import clsx from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { benchCopy, projects } from "../data/site";
import { parse, useRouter } from "../hooks/useRouter";

const formatUsd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

/**
 * The Bench Programme band — recurring supply (2026-10-21, requested, built to
 * the client reference's own subscription band).
 *
 * **Read the note on `benchCopy` in `data/site.ts` before touching this.**
 * The short version:
 *
 * - **Every figure is computed from the lot's real `price`.** The reference
 *   prints a struck-through price beside a saving; ours strikes through the
 *   lot's *actual* catalogue price and shows the discounted figure derived
 *   from it, so the two can never disagree. Nothing is typed.
 * - **The terms are client-confirmed** — 15% off, three monthly deliveries —
 *   and are printed in the band rather than left to the headline.
 * - **There is no enrol-and-pay button, deliberately.** Charging the discount
 *   needs a `plan` on the cart line, the discount in the subtotal and the flag
 *   in the order payload; `lib/api.ts` is a contract with the external order
 *   service. Until that lands the CTA sends you to the catalogue. Don't add a
 *   button that takes money on terms the checkout cannot honour yet.
 */
export function BenchProgramme() {
  const root = useRef<HTMLElement | null>(null);
  const { navigate } = useRouter();

  const lot = projects.find((p) => p.id === benchCopy.productId) ?? projects[0];
  const perDelivery = lot.price * (1 - benchCopy.discount);
  const saving = lot.price - perDelivery;

  const go = (href: string) => (e: MouseEvent) => {
    e.preventDefault();
    navigate(parse(href));
  };

  useEffect(() => {
    if (!root.current) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 72%", once: true },
      });

      tl.from(".bench__line > span", {
        yPercent: 110,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
      })
        .from(
          ".bench__lead, .bench__price, .bench__terms, .bench__actions",
          { y: 24, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 },
          "-=0.5",
        )
        .from(
          ".bench__benefit",
          { y: 28, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 },
          "-=0.5",
        );
    }, root);

    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    /* `id="bench"` is a real anchor — the footer's Laboratory column links to
       it, the way the reference links to its own `/bench` page. */
    <section id="bench" className="bench" ref={root} aria-labelledby="bench-title">
      <div className="container bench__inner">
        <div className="bench__copy">
          <span className="bench__eyebrow mono">{benchCopy.eyebrow}</span>

          {/* Authored lines, so they carry their own masks — `splitLines`
              stands aside, the FAQ heading's contract. */}
          <h2 className="bench__title" id="bench-title">
            <span className="bench__line">
              <span>{benchCopy.titleLead}</span>
            </span>
            <span className="bench__line bench__line--accent">
              <span>{benchCopy.titleAccent}</span>
            </span>
          </h2>

          <p className="bench__lead">
            Your bench supply, delivered with each verified batch. Choose any
            lot, receive it monthly for {benchCopy.deliveries} deliveries, and
            save {Math.round(benchCopy.discount * 100)}% on every one — with
            cold-chain shipping included.
          </p>

          {/* The worked example. Both figures derive from `lot.price`. */}
          <div className="bench__price">
            <span className="bench__price-name">{lot.title}</span>
            <span className="bench__price-was">{formatUsd(lot.price)}</span>
            <span className="bench__price-now">{formatUsd(perDelivery)}</span>
            <span className="bench__price-unit mono">/ delivery</span>
            <span className="bench__price-save mono">
              Save {formatUsd(saving)}
            </span>
          </div>

          <p className="bench__terms">{benchCopy.terms}</p>

          <div className="bench__actions">
            {benchCopy.ctas.map((cta) => (
              <a
                key={cta.href}
                className={clsx(
                  "about-page__pill",
                  cta.primary
                    ? "about-page__pill--light"
                    : "about-page__pill--ghost",
                )}
                href={cta.href}
                data-cursor
                onClick={go(cta.href)}
              >
                {cta.label}
              </a>
            ))}
          </div>

          <p className="bench__note mono">{benchCopy.note}</p>
        </div>

        <ul className="bench__benefits">
          {benchCopy.benefits.map((benefit) => (
            <li className="bench__benefit" key={benefit.number}>
              <span className="bench__benefit-num">{benefit.number}</span>
              <h3 className="bench__benefit-title">{benefit.title}</h3>
              <p className="bench__benefit-text">{benefit.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
