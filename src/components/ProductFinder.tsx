import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  finderSteps,
  rankProducts,
  type FinderAnswers,
} from "../data/finder";
import { useCart } from "../hooks/useCart";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

const formatUsd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const RESULT_COUNT = 3;

export function ProductFinder() {
  const { addItem, open: openCart } = useCart();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<FinderAnswers>({});
  const [done, setDone] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const paneRef = useRef<HTMLDivElement | null>(null);

  const step = finderSteps[stepIndex];
  const current = answers[step.id];
  const isLast = stepIndex === finderSteps.length - 1;

  const matches = useMemo(
    () => (done ? rankProducts(answers).slice(0, RESULT_COUNT) : []),
    [done, answers],
  );

  // Answering "not sure" to everything scores nothing, and the ranking falls
  // back to catalogue order. Calling that a "best match" would be a claim the
  // answers never supported, so the results pane says so instead.
  const narrowed = (matches[0]?.score ?? 0) > 0;

  // One tween per pane swap. Under reduced motion the pane is simply set to
  // its final state, matching how the rest of the site branches.
  useEffect(() => {
    const pane = paneRef.current;
    if (!pane) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(pane, { opacity: 1, y: 0 });
      return;
    }
    const tween = gsap.fromTo(
      pane,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
    );
    return () => {
      tween.kill();
    };
  }, [stepIndex, done]);

  const choose = useCallback(
    (optionId: string) => {
      setAnswers((prev) => ({ ...prev, [step.id]: optionId }));
    },
    [step.id],
  );

  const goNext = useCallback(() => {
    if (!answers[step.id]) return;
    if (isLast) {
      setDone(true);
      return;
    }
    setStepIndex((index) => index + 1);
  }, [answers, step.id, isLast]);

  const goBack = useCallback(() => {
    if (done) {
      setDone(false);
      return;
    }
    setStepIndex((index) => Math.max(0, index - 1));
  }, [done]);

  const restart = useCallback(() => {
    setAnswers({});
    setStepIndex(0);
    setDone(false);
  }, []);

  // Typeform-style letter keys, so the whole flow is reachable without a mouse.
  useEffect(() => {
    if (done) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      // Only bail on real text entry. The option radios take focus on click,
      // so blanket-skipping INPUT would kill the shortcuts straight after a
      // mouse selection.
      const isTextEntry =
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        (tag === "INPUT" &&
          !["radio", "checkbox", "button", "submit"].includes(
            (target as HTMLInputElement).type,
          ));
      if (isTextEntry) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const letter = event.key.toUpperCase();
      const optionIndex = LETTERS.indexOf(letter);
      if (optionIndex > -1 && optionIndex < step.options.length) {
        event.preventDefault();
        choose(step.options[optionIndex].id);
        return;
      }
      // A focused button or link already acts on Enter — don't double-fire.
      if (event.key === "Enter" && tag !== "BUTTON" && tag !== "A") {
        event.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [done, step.options, choose, goNext]);

  const handleQuickAdd = (id: string) => {
    addItem(id, 1);
    setAddedId(id);
    openCart();
    window.setTimeout(
      () => setAddedId((value) => (value === id ? null : value)),
      1200,
    );
  };

  return (
    <div className="finder">
      <div className="container finder__inner">
        <div className="finder__bar">
          <span className="mono finder__progress-label">
            {done
              ? "Your matches"
              : `Step ${String(stepIndex + 1).padStart(2, "0")} / ${String(
                  finderSteps.length,
                ).padStart(2, "0")}`}
          </span>
          <span className="finder__dots" aria-hidden>
            {finderSteps.map((candidate, index) => (
              <span
                key={candidate.id}
                className={
                  done || index < stepIndex
                    ? "finder__dot is-complete"
                    : index === stepIndex
                      ? "finder__dot is-active"
                      : "finder__dot"
                }
              />
            ))}
          </span>
        </div>

        {done ? (
          <div className="finder__pane" ref={paneRef}>
            <header className="finder__head">
              <h1 className="h2 finder__question">
                {narrowed ? "Your closest matches." : "Where to start."}
              </h1>
              <p className="lead finder__help">
                {narrowed
                  ? "Ranked against your answers. Every match is supplied for laboratory research only."
                  : "Your answers didn't narrow the catalogue, so these are simply the first three. Change an answer, or view everything."}
              </p>
            </header>

            <div className="finder__results">
              {matches.map((match, index) => (
                <article className="shop-card finder__result" key={match.product.id}>
                  {index === 0 && narrowed && (
                    <span className="finder__best mono">Best match</span>
                  )}
                  <a
                    href={`#/product/${match.product.id}`}
                    className="shop-card__media"
                    data-cursor
                    data-cursor-text="View"
                  >
                    <img
                      src={match.product.image}
                      alt={match.product.title}
                      loading="lazy"
                      decoding="async"
                    />
                  </a>
                  <div className="shop-card__body">
                    <span className="mono shop-card__sector">
                      {match.product.sector}
                    </span>
                    <a
                      href={`#/product/${match.product.id}`}
                      className="shop-card__name"
                      data-cursor
                    >
                      {match.product.title}
                    </a>
                    <p className="shop-card__summary">{match.product.summary}</p>
                    {match.reasons.length > 0 && (
                      <ul className="finder__reasons">
                        {match.reasons.map((reason) => (
                          <li className="finder__reason mono" key={reason}>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="shop-card__row">
                      <span className="shop-card__price">
                        {formatUsd(match.product.price)}
                      </span>
                      <button
                        type="button"
                        className="shop-card__add"
                        onClick={() => handleQuickAdd(match.product.id)}
                        aria-label={`Add ${match.product.title} to cart`}
                        data-cursor
                      >
                        {addedId === match.product.id ? "Added" : "Add to cart"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="finder__nav finder__nav--results">
              <button
                type="button"
                className="finder__back"
                onClick={goBack}
                data-cursor
              >
                ← Change answers
              </button>
              <div className="finder__nav-end">
                <button
                  type="button"
                  className="finder__restart"
                  onClick={restart}
                  data-cursor
                >
                  Start over
                </button>
                <a className="finder__next" href="#/shop" data-cursor>
                  View full catalogue
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="finder__pane" ref={paneRef}>
            <header className="finder__head">
              <h1 className="h2 finder__question">{step.question}</h1>
              <p className="lead finder__help">{step.help}</p>
            </header>

            <fieldset className="finder__options">
              <legend className="sr-only">{step.question}</legend>
              {step.options.map((option, index) => {
                const selected = current === option.id;
                return (
                  <label
                    className={
                      selected ? "finder__option is-selected" : "finder__option"
                    }
                    key={option.id}
                    data-cursor
                  >
                    <input
                      type="radio"
                      name={step.id}
                      value={option.id}
                      checked={selected}
                      onChange={() => choose(option.id)}
                    />
                    <span className="finder__key mono" aria-hidden>
                      {LETTERS[index]}
                    </span>
                    <span className="finder__option-text">
                      <span className="finder__option-label">{option.label}</span>
                      {option.note && (
                        <span className="finder__option-note">{option.note}</span>
                      )}
                    </span>
                  </label>
                );
              })}
            </fieldset>

            <div className="finder__nav">
              <button
                type="button"
                className="finder__back"
                onClick={goBack}
                disabled={stepIndex === 0}
                data-cursor
              >
                ← Back
              </button>
              <button
                type="button"
                className="finder__next"
                onClick={goNext}
                disabled={!current}
                data-cursor
              >
                {isLast ? "See matches" : "Next"} →
              </button>
            </div>
          </div>
        )}

        <p className="compliance-note finder__disclaimer">
          This finder orders the catalogue against your protocol. It is not
          advice. All products are supplied strictly for laboratory research and
          educational use — not for human or veterinary consumption.
        </p>
      </div>
    </div>
  );
}
