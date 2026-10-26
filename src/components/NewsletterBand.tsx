import { useState, type FormEvent } from "react";
import { newsletterCopy } from "../data/site";
import { subscribeNewsletter } from "../lib/api";

/**
 * The newsletter band (2026-10-21), built to the client reference's own, which
 * sits directly above its footer.
 *
 * **⚠ The reference promises "10% off your first order when you join" and this
 * band does not.** The client has confirmed a 10% first-order discount but has
 * not yet supplied the promo code, and the checkout can only honour a code
 * that exists server-side — so `newsletterCopy.offer` is `null` and the offer
 * line does not render. Set it the day the code arrives; nothing else needs
 * touching. **Do not type the percentage into the copy instead.**
 *
 * It posts through the existing `subscribeNewsletter` endpoint — the same one
 * the footer's form uses — so this adds a surface, not an integration.
 */
export function NewsletterBand() {
  const [email, setEmail] = useState("");
  /* Honeypot, same contract as the footer's form: a genuine submission leaves
     it empty and the endpoint rejects anything that doesn't. */
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [already, setAlready] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || state === "sending") return;
    setState("sending");
    try {
      const res = await subscribeNewsletter({
        email: email.trim(),
        consent: true,
        source: "home_newsletter",
        website,
      });
      setAlready(Boolean(res.already_subscribed));
      setState("done");
      setEmail("");
    } catch {
      setState("error");
    }
  };

  return (
    <section className="newsband" aria-labelledby="newsband-title">
      <div className="container newsband__inner">
        <div className="newsband__copy">
          <span className="newsband__eyebrow mono">{newsletterCopy.eyebrow}</span>
          <h2 className="newsband__title" id="newsband-title">
            {newsletterCopy.title}
          </h2>
          <p className="newsband__lead">{newsletterCopy.lead}</p>
          {newsletterCopy.offer && (
            <p className="newsband__offer">
              {newsletterCopy.offer.percent}% off your first order with code{" "}
              <strong>{newsletterCopy.offer.code}</strong>.
            </p>
          )}
        </div>

        <form className="newsband__form" onSubmit={onSubmit}>
          <label className="sr-only" htmlFor="newsband-email">
            Email address
          </label>
          <input
            id="newsband-email"
            className="newsband__input"
            type="email"
            required
            placeholder={newsletterCopy.placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="newsband__hp"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
          <button
            type="submit"
            className="newsband__submit"
            data-cursor
            disabled={state === "sending"}
          >
            {state === "sending" ? "Joining…" : newsletterCopy.submitLabel}
          </button>

          <p className="newsband__note mono" role="status">
            {state === "done"
              ? already
                ? "You're already on the list — thanks!"
                : "You're on the list."
              : state === "error"
                ? "That didn't send — try again, or email us."
                : newsletterCopy.note}
          </p>
        </form>
      </div>
    </section>
  );
}
