import { aboutCopy, site, testimonials } from "./site";
import heroImg from "../assets/about/hero-lattice.webp";
import operationsImg from "../assets/about/operations.webp";
import complianceImg from "../assets/about/compliance.webp";

/**
 * Content for the About page.
 *
 * Headline, paragraph, stats and signals are re-used from `aboutCopy` in
 * ./site so the page and the home section can never tell different stories.
 * The compliance wording is the same language already carried on product
 * pages and at checkout — it is a legal position, not marketing copy, so it
 * must not be paraphrased here.
 */

export const aboutHero = {
  eyebrow: "About",
  title: aboutCopy.heading,
  lead: aboutCopy.paragraph,
  image: heroImg,
  imageAlt:
    "Abstract network of connected nodes and filaments in cyan and violet on near-black.",
};

export const aboutStats = aboutCopy.stats;
export const aboutSignals = aboutCopy.signals;

export const operating = {
  image: operationsImg,
  imageAlt:
    "Quality-control station: sealed vials in a tamper-evident tray beside a clipboard and calipers.",
  title: "A supply chain built for people who have to show their working.",
  body: [
    "Laboratories do not buy on a brand promise — they buy on documentation. So the operation is built backwards from that: verified suppliers, controlled handling, a retained sample from every lot, and an independent analysis published against the material it belongs to.",
    "That is also why the catalogue is deliberately small. Every item we list is one we can stand behind with a batch-specific certificate.",
  ],
  link: { label: "See how we verify purity", href: "#/science?s=purity" },
};

/**
 * Sits beside the research-use-only notice, so it must not show clinicians,
 * patients or anything that reads as treatment — that would contradict the
 * text next to it.
 */
export const deliveryPanel = {
  image: complianceImg,
  imageAlt:
    "Sealed unlabelled research vials in a protective insert inside an open transport case.",
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
  title: "Talk to us",
  body: "Questions on handling, documentation or a specific lot — we answer them ourselves.",
  email: site.email,
  socials: site.socials,
};
