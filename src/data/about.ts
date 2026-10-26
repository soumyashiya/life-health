import { aboutCopy, projects, site, testimonials, whyUs } from "./site";
/* Generated 2026-10-20 (Magnific) when the page was rebuilt for a shopper.
   The three they replace were made for the **dark theme** — a cyan/violet node
   lattice on near-black, a cool quality-control bench, a case of vials — and
   had been off-palette since the burgundy inversion. These are warm dispatch
   stills instead, which is also what the new copy is about.

   **No printed packaging in any of them** — plain kraft boxes, unbranded
   silver mailers, blank cold packs. Image models garble pack copy, which is
   how two other drops on this site ended up with mangled small print. Keep
   `no text, no labels, no logos, no printed packaging, no branded cartons` in
   any re-prompt. `hero-lattice.webp`, `operations.webp` and `compliance.webp`
   stay on disk, unused. */
/* ⚠ RE-SHOT 2026-10-21 (Magnific, requested: *"create images like home page"*).
   The set this replaces was five **object stills** — a dispatch bench, hands at
   a mailer, stacked boxes, a flat lay, a parcel on a step. Correct, but the
   home view runs **warm backlit lifestyle photography with people** (the
   `shop-categories` window scenes, the `drift` gallery portraits), so the two
   read as different sites. These five are shot in that language: golden window
   light, burgundy/rose/sand, a figure in four of them, seen from behind or with
   the face clear of the product.

   **⚠ ALL FIVE NOW CARRY THE REAL CARTON, COMPOSITED IN (2026-10-21,
   requested: the product in every image should be the ALLUVI box).** Each
   plate was generated holding a **completely blank** box and the catalogue's
   own `spotlight/cartons/p1.webp` — Retatrutide 20mg, a **stocked** lot — was
   mapped onto its face afterwards. Every pixel of printed artwork is real;
   none of it was drawn by a model. This is the Billboard / DocBand method,
   now the project's standard route, and the fourth time it has been used.

   Why it has to be done this way: image models re-draw printed packaging and
   garble it. The earlier take of `preparing` proved it again — it came back
   with a cold pack carrying **garbled blue print**, caught only by cropping it
   at 1:1. **Check any new drop at 1:1 before using it.**

   What this set cost, worth knowing before repeating it:
   - **Box proportions are the whole game, and you cannot prompt your way to
     them.** The carton is 2.17:1. Asking for "22 cm wide and 10 cm tall" gave
     ~1.5; "exactly twice as wide as it is tall" gave **3.34**; the same prompt
     again gave 1.8. Generate a batch and **pick the plate nearest 2.17** — the
     Campaign entry's advice, confirmed. Shipped faces are 1.65–2.45, i.e. up
     to ~30% stretch, which is invisible at render size (Billboard shipped 11%,
     ProductSpotlight 14%).
   - **Measure the face by eye off a grid overlay, not with a detector.** An
     auto largest-bright-region pass kept locking onto backlit windows, and
     tile-level estimates were out by 30%+ every time.
   - **A plate with fingers on the face needs the artwork masked to the blank
     area**, or the carton paints over the thumb and stops reading as held —
     the failure ProductSpotlight documents. The mask keys on *chromaticity*
     (skin is redder than the box) and is **one-sided**: a symmetric window
     also rejects the box's own highlight and leaves a torn white edge.
     Still lifes take `NOMASK=1` — with nothing occluding the face the mask
     only clips the artwork where the box falls into shadow.

   **No open compliance item**, which is rare here: the pack is stocked, so the
   alts name it; the printed copy is the real artwork rather than a model's
   attempt at it; nobody ingests anything and nothing reads as treatment. The
   eight earlier About images stay on disk, unused. */
import heroImg from "../assets/about/holding-box.webp";
import operationsImg from "../assets/about/sealing.webp";
import complianceImg from "../assets/about/stack.webp";
import counterImg from "../assets/about/preparing.webp";
import doorstepImg from "../assets/about/delivered.webp";

/**
 * Content for the About page.
 *
 * **The hero's headline and lead are the page's own as of 2026-10-20**
 * (requested: rebuild this page for a shopper, leaving the home band alone).
 * They used to be `aboutCopy.heading` / `.paragraph`, which the home about
 * band also reads — editing them there changed both, which is exactly what
 * had to be avoided. `aboutStats` and `aboutSignals` are still shared, and
 * should stay shared: those are published figures and must never disagree
 * between the two.
 *
 * The compliance wording further down is the same language already carried on
 * product pages and at checkout — a legal position, not marketing copy, so it
 * must not be paraphrased.
 */

export const aboutHero = {
  eyebrow: "About",
  /* Addressed to the person ordering, not to a laboratory. Every clause is
     something the site already publishes — the Janoshik reports, `promoCopy`'s
     packing claim, the WhatsApp channel — and none of it claims an outcome.
     The research-use-only position is unchanged: it sits in the compliance
     block below and on every product page. */
  title: "Know exactly what you're buying.",
  lead: "Every lot we sell is tested by an independent lab and listed with its own report — purity, batch number and the full breakdown, on the product page before you add it to the cart. Orders ship sealed and cold-packed with the paperwork inside, and a real person answers when you ask about one.",
  image: heroImg,
  /* The alt NAMES the lot, which is only allowed because the pack in frame is
     a stocked one and its artwork is the real catalogue render — see the
     import block. On the bands that picture a carton the shop does not stock,
     the alt must name no compound. */
  imageAlt: "A customer holding a Retatrutide 20mg carton in a sunlit room.",
  /* Both resolve: `#/shop` is the collection page, `#/science?s=reports` the
     deep link the Science rail already supports. */
  ctas: [
    { label: "Shop all products", href: "#/shop", primary: true },
    { label: "See a lab report", href: "#/science?s=reports", primary: false },
  ],
  /* Facts the site publishes elsewhere — the Janoshik reports, `promoCopy`'s
     packing claim, `whyUs[2]`. No offer, no shipping threshold, no guarantee:
     none of those is configured anywhere in this project, and inventing one on
     a live storefront is a real-money error (same rule as the announcement
     bar). */
  marks: [
    "Independent lab report on every lot",
    "Sealed and cold-packed",
    "Tracked delivery worldwide",
  ],
};

export const aboutStats = aboutCopy.stats;
export const aboutSignals = aboutCopy.signals;

/**
 * The shop-promise strip under the hero. Read from `whyUs` rather than
 * restated, so this page and the `WhyChoose` band cannot drift — it renders
 * the short `note`, the form that layout was written for. The icon keys map
 * to the inline SVGs in `AboutPage.tsx`, in this order.
 */
export const valueProps = whyUs.map((row, i) => ({
  icon: (["repeat", "doc", "cold", "chat"] as const)[i] ?? "doc",
  title: row.title,
  note: row.note,
}));

/**
 * How ordering works — the storefront's own four steps.
 *
 * Every line describes something that exists: the catalogue's shelf specs, the
 * `labAnalysis` block on each product page, the real checkout (card via
 * Klyme/AabanPay or manual bank transfer, with the confirmation email the
 * `server/` app sends), and the packing format `promoCopy` already claims. The
 * links all resolve — three policy routes and the order tracker.
 */
export const ordering = {
  eyebrow: "How ordering works",
  title: "Four steps, and you can check our working at every one.",
  image: counterImg,
  imageAlt: "A Retatrutide 20mg carton on a sunlit counter as an order is packed.",
  steps: [
    {
      number: "01",
      title: "Browse the range",
      text: "A short catalogue of pre-filled lots, each listed with its form, total content and price before you open it.",
    },
    {
      number: "02",
      title: "Read the report",
      text: "Purity, batch number and the full compound breakdown sit on the product page. Read them before you add to cart.",
    },
    {
      number: "03",
      title: "Check out",
      text: "Card or bank transfer, a confirmation email with your order number, and an account page you can reorder from.",
    },
    {
      number: "04",
      title: "Sealed, cold-packed, tracked",
      text: "Your order ships in an insulated mailer with a cold pack and the batch paperwork inside, with a tracking number.",
    },
  ],
  links: [
    { label: "Shipping policy", href: "#/policies/shipping-policy" },
    { label: "Refund policy", href: "#/policies/refund-policy" },
    { label: "Track an order", href: "#/track" },
  ],
};

/**
 * **⚠ NO LONGER RENDERED — the "Shop the range" band was removed from the page
 * on request, 2026-10-21.** Kept, with its `.about-page__shop-*` CSS, so the
 * band can come back as JSX alone; it is one commit back in git. Removing it
 * means the About page carries **no price and no add-to-cart** at all — it
 * links to `#/shop` from the hero, the ordering band and the closing CTA
 * instead.
 *
 * The shop band. `ids` are stocked lots with their own carton render — `p3`
 * (BPC-157 & TB-500) is left out for the same reason `ProductRange` hides it:
 * there is no render for that compound and it is visibly the odd one out. It
 * is still routable and still on `#/shop`, which the foot link goes to.
 */
export const shopPanel = {
  eyebrow: "Shop the range",
  title: "Every lot, with its paperwork.",
  lead: "Six pre-filled lots, one spec each. Prices are per unit and the purity badge is the lot's own published figure — never a rounded one.",
  ids: ["p1", "p2", "p4", "p5"],
  shopAll: { label: "Shop all products", href: "#/shop" },
  note: projects[0].safetyProtocol,
};

export const operating = {
  image: operationsImg,
  imageAlt: "A Retatrutide 20mg carton being packed into a shipping box.",
  /* Was "A supply chain built for people who have to show their working." over
     a paragraph opening "Laboratories do not buy on a brand promise" — true,
     but written about the buyer rather than to them. Same facts, told as what
     you get when you order. */
  title: "A short catalogue, and a report behind every line of it.",
  body: [
    "We keep the range small on purpose: every lot is bought from a verified supplier, handled in controlled conditions, sampled, and sent to an independent lab before it goes on sale. The report comes back against that exact batch and we publish it as received — not a summary of it.",
    "So there is nothing on the site we cannot show you the paperwork for. If a lot has no report yet, it does not get listed.",
  ],
  link: { label: "See how purity is verified", href: "#/science?s=purity" },
};

/**
 * Sits beside the research-use-only notice, so it must not show clinicians,
 * patients or anything that reads as treatment — that would contradict the
 * text next to it.
 */
export const deliveryPanel = {
  image: complianceImg,
  imageAlt: "A Retatrutide 20mg carton in front of sealed parcels ready for dispatch.",
};

/** The two shortest reviews — long pull-quotes read as filler. */
export const aboutQuotes = testimonials
  .slice()
  .sort((a, b) => a.quote.length - b.quote.length)
  .slice(0, 2);

/**
 * Verbatim from the product pages and the checkout compliance block. Do not
 * reword — this is the site's stated legal position.
 */
export const compliance = {
  title: "Research use only",
  points: [
    "Produced for laboratory research only. Not for human or veterinary consumption.",
    "These products are not intended to diagnose, treat, cure, or prevent any disease.",
    "Supplied in sealed, fixed-volume formats intended for laboratory analysis.",
  ],
};

export const aboutContact = {
  title: "Talk to us before you order",
  body: "Questions about a lot, its report, or how an order ships — message us and a real person answers, usually the same day.",
  email: site.email,
  socials: site.socials,
};

/**
 * The closing band. Claims nothing new: a heading, the packing fact
 * `promoCopy` already makes, and two links to routes that exist.
 */
export const closing = {
  title: "Ready to order?",
  text: "Pick a lot, read its report, and it ships sealed and cold-packed with the paperwork inside.",
  image: doorstepImg,
  imageAlt: "A Retatrutide 20mg carton resting on a delivered parcel at a sunlit doorstep.",
  ctas: [
    { label: "Shop all products", href: "#/shop", primary: true },
    { label: "Track an order", href: "#/track", primary: false },
  ],
};
