import { projects } from "./site";
import metabolicImg from "../assets/research/metabolic.webp";
import cellularImg from "../assets/research/cellular.webp";
import peptideImg from "../assets/research/peptide.webp";
import recoveryImg from "../assets/research/recovery.webp";
import formulationImg from "../assets/research/formulation.webp";
/* Category tile art, generated 2026-10-20 (Magnific). The old `categories/*`
   lifestyle set was shot for goal-style labels ("Explore metabolic pathways")
   and no longer matched "NAD+ & cellular" or "Multi-compound blends"; those
   files are untouched and still used by the contact band's photo circles.

   **Four passes in one day, all on request.** Abstract macro → full-figure
   lifestyle portraits → tight studio body crops → **this**: a warm golden-hour
   set, a figure seen from behind at a window, backlit with the view beyond.
   The language comes from the client's own drop,
   `latest-images/recovery.jpeg`, which `recovery` uses directly; `cellular`,
   `peptide` and `blends` were generated to match it.

   `cellular` was then re-shot closer (requested, "related to cellular"): the
   others are full figures at a distance, this one frames a shoulder and arm
   with the low sun falling **across the skin**. That is as near as this set
   gets to the category without making a claim — NAD+ is associated with
   cellular energy and ageing, so anything more literal (a renewal or
   anti-ageing read) would be the outcome claim the catalogue disclaims, and a
   microscopy image would break both the set and the no-clinical rule.

   **`metabolic` is deliberately not in that language** — it was reverted to
   the original `categories/metabolic.webp` on request and is the one cool
   studio crop left in the row. Flagged as the odd frame out; client-directed.

   People are allowed here; this is the one place the project's no-people rule
   has always been waived. The note on `shopImage` below is the part that is
   not optional. */
/* **Metabolic is the one tile still on the original `categories/*` set**
   (reverted on request, 2026-10-20). It is a cropped midriff in sportswear
   holding a dumbbell — the fitness framing the rest of this set was generated
   to avoid, because GLP-1 is a weight-loss drug class and that image under
   that label reads as a weight-loss claim on a catalogue whose every product
   page says not for human use. Raised when the replacement was built and again
   when this revert was asked for; client-directed both times.
   `shop-categories/metabolic.webp` (a woman walking through a room) is kept on
   disk, unused — restoring it is this one import line. */
import metabolicShop from "../assets/categories/metabolic.webp";
import cellularShop from "../assets/shop-categories/cellular.webp";
import peptideShop from "../assets/shop-categories/peptide.webp";
import recoveryShop from "../assets/shop-categories/recovery.webp";
import formulationShop from "../assets/shop-categories/blends.webp";

export type ResearchVisualKey =
  | "metabolic"
  | "cellular"
  | "peptide"
  | "recovery"
  | "formulation";

export type ResearchArea = {
  id: ResearchVisualKey;
  number: string;
  /** Rendered on two lines in the card: ["METABOLIC", "RESEARCH"]. */
  titleLines: [string, string];
  /** Single-line plain-text name, used by the filtered shop view. */
  name: string;
  description: string;
  /** Card artwork — dark-field scientific imagery on the brand palette. */
  image: string;
  /** Goal-style label for the shop band tiles, rendered on two lines. Stays
      research-framed: the catalogue is laboratory-use-only, so these never
      promise a personal health outcome. */
  shopTitleLines: [string, string];
  /** Bright lifestyle still life for the white shop band on the home page.
      Deliberately separate from `image`: the nav panel stays dark-field. */
  /* The category tile photograph. Four of the five are a figure seen **from
     behind** at a window in warm golden-hour light, matched to the client's
     `latest-images/recovery.jpeg`; `metabolic` is the original studio crop.

     **⚠ This is consumer lifestyle imagery on a laboratory-use-only catalogue
     and it is an open, client-directed item.** It sits under GLP-1 (a
     weight-loss drug class) and Recovery, where a person pictured beside the
     label can read as the outcome the compound is associated with — the one
     claim every product page disclaims. The from-behind framing is what keeps
     it to "a customer", not "a result": nobody is posed to display a body or
     to endorse anything. Raised at every pass; the direction was reaffirmed
     each time.

     **What is held regardless, and must stay in any re-prompt:**
     - no packaging (image models garble printed artwork — see the hero notes),
       no capsule, no pill, no syringe, no vial, no lab coat, no clinical or
       medical setting;
     - for `recovery`: no bandage, brace, strapping, bruising, injury or
       massage — nothing that reads as being treated;
     - no weighing scale, measuring tape or before-and-after framing anywhere;
     - no food or drink. An earlier `cellular` take came back holding a cup and
       was re-picked: a drink is ingestion imagery;
     - **faces stay out of frame.** */
  shopImage: string;
  /** Real ids from `projects` in ./site — never invent product ids here. */
  productIds: string[];
};

export const researchAreas: ResearchArea[] = [
  {
    id: "metabolic",
    number: "01",
    titleLines: ["Metabolic", "Compounds"],
    name: "Metabolic",
    description:
      "Pre-filled GLP-1, GIP and glucagon receptor-agonist devices.",
    image: metabolicImg,
    shopTitleLines: ["GLP-1 &", "metabolic"],
    shopImage: metabolicShop,
    productIds: ["p1", "p6", "p4"],
  },
  {
    id: "cellular",
    number: "02",
    titleLines: ["Cellular", "Compounds"],
    name: "Cellular",
    description:
      "NAD+ and GHK-Cu lots, sealed in fixed-volume devices.",
    image: cellularImg,
    shopTitleLines: ["NAD+ &", "cellular"],
    shopImage: cellularShop,
    productIds: ["p5", "p2"],
  },
  {
    id: "peptide",
    number: "03",
    titleLines: ["All", "Peptides"],
    name: "Peptides",
    description:
      "Every peptide lot we stock, each with its own published purity report.",
    image: peptideImg,
    shopTitleLines: ["All", "peptides"],
    shopImage: peptideShop,
    productIds: ["p3", "p2", "p1", "p6", "p4"],
  },
  {
    id: "recovery",
    number: "04",
    titleLines: ["Recovery", "Peptides"],
    name: "Recovery",
    description:
      "BPC-157 and TB-500 pairings, supplied as pre-filled devices.",
    image: recoveryImg,
    shopTitleLines: ["Recovery", "peptides"],
    shopImage: recoveryShop,
    productIds: ["p3", "p2"],
  },
  {
    id: "formulation",
    number: "05",
    titleLines: ["Multi-compound", "Blends"],
    name: "Blends",
    description:
      "Two or more compounds in a single sealed, fixed-volume device.",
    image: formulationImg,
    shopTitleLines: ["Multi-compound", "blends"],
    shopImage: formulationShop,
    productIds: ["p2", "p3", "p5"],
  },
];

export const researchAreaIds = researchAreas.map((area) => area.id);

export const isResearchAreaId = (value: string): value is ResearchVisualKey =>
  researchAreaIds.includes(value as ResearchVisualKey);

export const getResearchArea = (id: string) =>
  researchAreas.find((area) => area.id === id);

/** Products belonging to a research area, in catalogue order. */
export const researchAreaProducts = (area: ResearchArea) =>
  projects.filter((product) => area.productIds.includes(product.id));

/** Href for a card — the existing shop route, filtered. */
export const researchAreaHref = (area: ResearchArea) =>
  `#/shop?research=${area.id}`;
