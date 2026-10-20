import { projects } from "./site";
import {
  researchAreas,
  researchAreaHref,
  researchAreaProducts,
} from "./research";
import labFacility from "../assets/liora-healthcare-lab-facility-dubai.jpeg";
import purityImg from "../assets/hplc-verified-peptide-purity.jpg";
import learnImg from "../assets/nav/learn.webp";
import supportImg from "../assets/nav/support.webp";
import aboutImg from "../assets/about/hero-lattice.webp";
import faqImg from "../assets/faq-seo.webp";
import contactImg from "../assets/quick-support.avif";

/**
 * Information architecture for the header.
 *
 * Every `href` here resolves to a destination that already exists — either a
 * hash route handled by `parse()` in hooks/useRouter, or a section id rendered
 * on the home view. Nothing in this file may point at a page we have not built:
 * a link that 404s or silently lands on the home page reads as broken trust on
 * a site whose whole proposition is verifiable documentation.
 *
 * Real routes:  #/shop, #/shop?research=<id>, #/product/<id>, #/track,
 *               #/account, #/cart, #/policies/<slug>
 * Real sections: #home #about #services #work #why-us #reviews
 *                #faq #contact
 *
 * Research and Shop open mega panels; Science and About are direct links, so
 * the bar stays four items wide and the panels stay worth opening.
 */

export type NavId = "shop" | "learn" | "support";
export type MegaId = NavId;

export type NavLink = {
  label: string;
  href: string;
  /** Optional one-line gloss, rendered under the label. */
  note?: string;
};

export type NavEntry = {
  id: NavId;
  label: string;
  /** Where the item goes when followed directly rather than opened. */
  href: string;
  /** Only Research and Shop carry a panel. */
  hasPanel: boolean;
};

/**
 * Three top-level words, each opening a panel. The four options this header
 * used to carry in the bar itself — Research, Shop, Science, About — are now
 * sub-items inside them: Research became the category row under Shop, Science
 * and About sit under Learn, and the old utility row is Support's whole panel.
 */
export const navEntries: NavEntry[] = [
  { id: "shop", label: "Shop", href: "#/shop", hasPanel: true },
  { id: "learn", label: "Learn", href: "#/science", hasPanel: true },
  { id: "support", label: "Support", href: "#/track", hasPanel: true },
];

export const megaIds = navEntries
  .filter((entry) => entry.hasPanel)
  .map((entry) => entry.id as MegaId);

export const isMegaId = (value: string): value is MegaId =>
  (megaIds as string[]).includes(value);

/* ---------------------------------------------------------------- research */

/**
 * A dropdown row: thumbnail, name, and one short meta line. Deliberately not
 * a description — the panels stay scannable at a glance, and the full copy
 * lives on the page each row leads to.
 */
export type NavRow = {
  id: string;
  label: string;
  /** One terse line — a count or a category, never a sentence. */
  meta: string;
  image: string;
  href: string;
};

export const researchRows: NavRow[] = researchAreas.map((area) => {
  const count = researchAreaProducts(area).length;
  return {
    id: area.id,
    label: area.name,
    meta: `${count} ${count === 1 ? "product" : "products"}`,
    image: area.image,
    href: researchAreaHref(area),
  };
});

/** The old Research panel, now the category row inside Shop. */
export const researchLinks: NavLink[] = researchAreas.map((area) => ({
  label: area.name.replace(/\s+research$/i, ""),
  href: researchAreaHref(area),
}));

/* -------------------------------------------------------------------- shop */

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export const shopRows: NavRow[] = projects.map((product) => ({
  id: product.id,
  label: product.title,
  meta: usd(product.price),
  image: product.image,
  href: `#/product/${product.id}`,
}));

export const shopPanel = {
  rows: shopRows,
  /* Rendered as a compact wrapped row, not six more thumbnails — the panel has
     to stay short enough to scan. */
  groupLabel: "Shop by research area",
  groupLinks: researchLinks,
  allLink: {
    label: "Shop all products",
    href: "#/shop",
  } satisfies NavLink,
};

/* ------------------------------------------------------------------- learn */

/**
 * The old Science panel plus the About page, which used to be its own item in
 * the bar. Each science row deep-links into a section of `#/science?s=…`,
 * which scrolls to it on arrival.
 */
export const learnPanel = {
  rows: [
    {
      id: "standards",
      label: "Our standards",
      meta: "How we work",
      image: labFacility,
      href: "#/science?s=standards",
    },
    {
      id: "purity",
      label: "Verified purity",
      meta: "HPLC + mass spec",
      image: purityImg,
      href: "#/science?s=purity",
    },
    {
      id: "reports",
      label: "Lab reports",
      meta: "Every published lot",
      image: learnImg,
      href: "#/science?s=reports",
    },
    {
      id: "about",
      label: "About us",
      meta: "Who we supply",
      image: aboutImg,
      href: "#/about",
    },
  ] satisfies NavRow[],
  allLink: {
    label: "The science",
    href: "#/science",
  } satisfies NavLink,
};

/* ----------------------------------------------------------------- support */

/** What used to ride the hairline utility row at the foot of every panel. */
export const supportPanel = {
  rows: [
    {
      id: "track",
      label: "Track order",
      meta: "By order number",
      image: supportImg,
      href: "#/track",
    },
    {
      id: "faq",
      label: "FAQ",
      meta: "Shipping, storage, payment",
      image: faqImg,
      href: "#faq",
    },
    {
      id: "contact",
      label: "Contact us",
      meta: "Email or WhatsApp",
      image: contactImg,
      href: "#contact",
    },
  ] satisfies NavRow[],
  /* Its rows already are the utility row — repeating it below them would be
     the same three links twice. */
  showUtility: false,
};

/* ----------------------------------------------------------------- utility */

/**
 * Support destinations. Research and Shop lost their old "Learn"/"Support"
 * siblings in this header, so these ride a single hairline row at the foot of
 * each dropdown — one line, so the panel stays short — and the mobile drawer.
 */
export const utilityLinks: NavLink[] = [
  { label: "Track order", href: "#/track" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export const primaryCta: NavLink = {
  label: "How we verify",
  href: "#/science?s=purity",
};
