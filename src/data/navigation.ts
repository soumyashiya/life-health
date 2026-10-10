import { projects } from "./site";
import {
  researchAreas,
  researchAreaHref,
  researchAreaProducts,
} from "./research";
import labFacility from "../assets/liora-healthcare-lab-facility-dubai.jpeg";
import purityImg from "../assets/hplc-verified-peptide-purity.jpg";

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

export type NavId = "research" | "shop" | "science" | "about";
export type MegaId = Extract<NavId, "research" | "shop" | "science">;

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

export const navEntries: NavEntry[] = [
  { id: "research", label: "Research", href: "#/shop", hasPanel: true },
  { id: "shop", label: "Shop", href: "#/shop", hasPanel: true },
  { id: "science", label: "Science", href: "#/science", hasPanel: true },
  { id: "about", label: "About", href: "#/about", hasPanel: false },
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

export const researchPanel = {
  rows: researchRows,
  allLink: {
    label: "All research materials",
    href: "#/shop",
  } satisfies NavLink,
};

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
  allLink: {
    label: "Shop all products",
    href: "#/shop",
  } satisfies NavLink,
};

/* ----------------------------------------------------------------- science */

/**
 * Each row deep-links into a section of the Science page (`#/science?s=…`),
 * which scrolls to it on arrival. These replaced the earlier home-section
 * anchors once the page existed.
 */
export const sciencePanel = {
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
  ] satisfies NavRow[],
  allLink: {
    label: "The science",
    href: "#/science",
  } satisfies NavLink,
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
  label: "Find your product",
  href: "#/find",
};
