import { projects } from "./site";
import metabolicImg from "../assets/research/metabolic.webp";
import cellularImg from "../assets/research/cellular.webp";
import recoveryImg from "../assets/research/recovery.webp";
import formulationImg from "../assets/research/formulation.webp";
/* Category tile art, generated 2026-10-20 (Magnific). The old `categories/*`
   lifestyle set was shot for goal-style labels ("Explore metabolic pathways")
   and no longer matched "NAD+ & cellular" or "Multi-compound blends"; those
   files are untouched and still used by the contact band's photo circles.

   **Four passes in one day, all on request.** Abstract macro → full-figure
   lifestyle portraits → tight studio body crops → **this**: a warm golden-hour
   set, a figure seen from behind at a window, backlit with the view beyond.
   The language came from the client's own drop,
   `latest-images/recovery.jpeg`, which `recovery` used directly; `cellular`,
   `peptide` and `blends` were generated to match it. **Only `peptide` is still
   mounted** — see the 2026-10-26 note on the imports below.

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
/* ⚠ THREE TILES RE-SHOT FROM CLIENT DROPS, 2026-10-26 — `recovery`, `cellular`
   and `formulation` (Skin & Hair). Straight 4:5 crops of
   `latest-images/{recovery,nad cellular,skin and hair}.png` (1600x900 each),
   which stay untouched as the source of truth, same convention as `new/` →
   `products/`. The crop is horizontal, because a 16:9 source in a 4:5 tile only
   ever crops on x: 720x900 out of the frame at x=730 / 568 / 760, each measured
   to put the figure in the tile rather than on its edge. **Re-measure if a drop
   is replaced.** The four generated tiles they supersede
   (`shop-categories/{recovery,cellular,blends}.webp`) stay on disk, unused.

   ⚠ COMPLIANCE, open and client-directed — these three are further into
   consumer-lifestyle territory than the set they replace, and two break rules
   this file previously held:
   - **`recovery` pictures a man gripping his knee on a gym bench.** That is an
     injury being nursed, directly under the Recovery label — the one framing
     the earlier set was generated to avoid ("no bandage, brace, strapping,
     bruising, injury or massage — nothing that reads as being treated"). On a
     laboratory-use-only catalogue it reads as what the line is *for*.
   - **`skin and hair` is a beauty frame with the face held in the middle of
     it**, where the whole set's mitigation has been that faces stay out of
     frame and nobody is posed as a result. Under "Skin & Hair" it is an
     outcome.
   - `nad cellular` is the one that is fine: a figure seen from behind at a
     window, which is the set's own language.
   Mitigations unchanged: the tiles take `alt=""` (the label beside them is the
   accessible text), no packaging, capsule, syringe, lab coat or clinical
   setting appears, and no description claims anything. To close it, re-shoot
   `recovery` without the injury gesture and `skin and hair` from behind or
   over the shoulder. */
import metabolicShop from "../assets/categories/metabolic.webp";
import cellularShop from "../assets/shop-categories/nad-cellular.webp";
import recoveryShop from "../assets/shop-categories/recovery-new.webp";
import formulationShop from "../assets/shop-categories/skin-hair.webp";

/**
 * ⚠ `"peptide"` was removed from this union on 2026-10-26 (requested: remove
 * the Longevity card). It was the "All peptides" catch-all, then "Skin & Glow",
 * then "Longevity" for a few hours the same day. **Nothing is stranded by it**:
 * its only lot, `p2` (Glow 70mg), is still filed under `recovery` and
 * `formulation`, so it is still reachable from the band, the shop chips and the
 * nav dropdown — all three are data-driven from `researchAreas` and lost the
 * row by themselves. A saved `#/shop?research=peptide` link degrades to the
 * unfiltered `#/shop`: `isResearchAreaId` rejects the id and `parse()` drops
 * the filter, so it lands on the catalogue rather than erroring.
 * `assets/research/peptide.webp` and `assets/shop-categories/peptide.webp` stay
 * on disk, unused — restoring the line is this union entry, two imports and the
 * entry itself.
 */
export type ResearchVisualKey =
  | "metabolic"
  | "cellular"
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

/**
 * ⚠ RE-CUT TO THE CLIENT REFERENCE'S FIVE LINES, 2026-10-21 (requested: *"whole
 * content changed like reference website"*). That site files the same ALLUVI
 * catalogue under **Metabolic · Recovery · Skin & Glow · Longevity · Blends**,
 * so the names and the product mapping here now match it.
 *
 * **The ids did not change** — `#/shop?research=<id>` links, saved or shared,
 * still resolve. Two of them now read oddly against their label (`cellular` is
 * Longevity, `peptide` is Skin & Glow) and that is deliberate: renaming an id
 * breaks every existing link for a cosmetic gain.
 *
 * **The catch-all "All peptides" line is gone**, as the reference has none —
 * "Shop all products" already covers it from two bands. `ProductRange` used to
 * exclude that id from its four tiles and now simply takes the first four.
 *
 * **⚠ COMPLIANCE, open and client-directed: "Longevity" and "Skin & Glow" are
 * outcome-shaped category names on a laboratory-use-only catalogue.** They say
 * nothing about what a compound does, and the descriptions under them are
 * strictly about contents and format — but the labels themselves carry the
 * implication, which is why every other name here is a compound class. Raised
 * when the reference's content was adopted; the direction was to match it. To
 * close it, rename to "Cellular" and "Skin peptides" — one `name` field each.
 *
 * **⚠ The ids are NOT in catalogue order** —  is Retatrutide 40mg,  is
 * Tirzepatide 40mg and  is NAD+. Reading them numerically put NAD+ under
 * Metabolic and Retatrutide 40mg under Longevity on the first pass. Check
 *  in ./site before editing any list here.
 *
 * **⚠ THE IDS ARE NOT IN CATALOGUE ORDER** — `p6` is Retatrutide 40mg, `p4` is
 * Tirzepatide 40mg and `p5` is NAD+. Reading them numerically put NAD+ under
 * Metabolic and Retatrutide 40mg under Longevity on the first pass of this
 * re-cut. Check `projects` in ./site before editing any list here.
 *
 * Every mapping below is factual: the GLP-1 class lots sit under Metabolic,
 * NAD+ under Longevity, the GHK-Cu lot under Skin & Glow, the BPC-157/TB-500
 * pairings under Recovery, and anything with two or more assayed compounds
 * under Blends. Every lot appears under at least one line.
 */
export const researchAreas: ResearchArea[] = [
  {
    id: "metabolic",
    number: "01",
    titleLines: ["Metabolic", "Compounds"],
    name: "Metabolic",
    description:
      "Pre-filled GLP-1, GIP and glucagon receptor-agonist lots.",
    image: metabolicImg,
    shopTitleLines: ["GLP-1 &", "metabolic"],
    shopImage: metabolicShop,
    productIds: ["p1", "p6", "p4"],
  },
  {
    id: "recovery",
    number: "02",
    titleLines: ["Recovery", "Peptides"],
    name: "Recovery",
    description:
      "BPC-157 and TB-500 pairings, supplied as pre-filled pens.",
    image: recoveryImg,
    shopTitleLines: ["Recovery", "peptides"],
    shopImage: recoveryShop,
    productIds: ["p3", "p2"],
  },
  {
    /* `cellular` carried the Longevity label from the 10-21 re-cut until
       2026-10-26, when Longevity moved onto the `peptide` line for a few hours
       and then left the catalogue with it (see the note on the removed line
       below). It reads as the NAD+ line again, which is also what the client's
       replacement photograph for this tile is named. The lot is unchanged. */
    id: "cellular",
    number: "03",
    titleLines: ["Cellular", "Compounds"],
    name: "Cellular",
    description: "NAD+, supplied as two sealed 500 mg pens.",
    image: cellularImg,
    shopTitleLines: ["NAD+ &", "cellular"],
    shopImage: cellularShop,
    productIds: ["p5"],
  },
  {
    /* Renamed from the reference's "Multi-compound / Blends" on request,
       2026-10-26. The id, the photograph slot and both product ids are
       unchanged — only the label and the description moved, so
       `#/shop?research=formulation` still resolves and the tile's count is
       still a real figure.

       ⚠ COMPLIANCE: an outcome-shaped line name on a laboratory-use-only
       catalogue, same class as the note above. The description stays strictly
       contents and format, and names the two lots' assayed compounds rather
       than anything they are associated with. To close it, rename to a
       compound class ("Copper peptides") — one `name` field plus the two
       `*titleLines` pairs. */
    id: "formulation",
    number: "04",
    titleLines: ["Skin", "& Hair"],
    name: "Skin & Hair",
    description:
      "GHK-Cu, BPC-157 and TB-500 lots — two or more assayed compounds in one sealed pen.",
    image: formulationImg,
    shopTitleLines: ["Skin", "& Hair"],
    shopImage: formulationShop,
    productIds: ["p2", "p3"],
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
