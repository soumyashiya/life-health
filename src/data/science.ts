import { projects, whyUs } from "./site";
/* ⚠ IMAGERY RE-SHOT 2026-10-21 (Magnific, requested: *"create images like home
   page"*). The three it replaces were stock laboratory photography — a lit
   facility, an HPLC bench, a research team — kept on disk and still used as nav
   dropdown thumbnails (`data/navigation.ts`), so nothing is orphaned.

   They had been off-palette since the burgundy inversion and, more to the
   point, they are the reason this page read as a laboratory microsite rather
   than part of the shop: the home view runs warm backlit lifestyle photography
   (`shop-categories`, `drift`) and these were cool clinical frames.

   **All three carry the real carton, composited in** — the Billboard /
   DocBand / About method, fifth use. Each plate was generated holding or
   standing a **completely blank** box and the catalogue's own
   `spotlight/cartons/p1.webp` (Retatrutide 20mg, a **stocked** lot) was mapped
   onto its face afterwards through a homography. Every pixel of printed
   artwork is real; none of it was drawn by a model — which is the whole point,
   since image models re-draw printed packaging and garble it.

   What this set confirmed, on top of the About notes:
   - **Re-prompting for box proportions DID work here**, as it did for DocBand.
     The first batch of twelve came back with faces at 1.16–1.92; a second
     batch asking for "a long flat pack, very wide and short, about 22 cm
     across and only 10 cm tall, like a slim medicine carton" landed faces at
     2.2–2.7. Shipped faces are 2.2, 2.23 and 2.7 against the carton's 2.18 —
     the closest set this project has had. Generate a batch and pick nearest
     anyway; one prompt is not reliable on its own.
   - **The held plate needs the one-sided skin mask** (fingers cross the face's
     ends); the two still frames do not, and masking them would clip the
     artwork where the box falls into shadow.

   **No open compliance item**, the same as the About set: the pack is stocked,
   so the alts name it; the printed copy is the real artwork; nobody ingests
   anything and nothing reads as treatment. */
import heroPack from "../assets/science/hero-pack.webp";
import verifiedImg from "../assets/science/verified.webp";
import paperworkImg from "../assets/science/paperwork.webp";

/**
 * Content for the Science page.
 *
 * Everything measurable here is derived from `projects` in ./site — batch
 * numbers, purity figures and compound breakdowns are the same values printed
 * on each product page. Nothing on this page may assert a result we do not
 * already publish against a specific lot.
 */

export type ScienceSection = "standards" | "purity" | "reports";

export const scienceSections: { id: ScienceSection; label: string }[] = [
  { id: "standards", label: "Our standards" },
  { id: "purity", label: "Verified purity" },
  { id: "reports", label: "Lab reports" },
];

export const isScienceSection = (value: string): value is ScienceSection =>
  scienceSections.some((s) => s.id === value);

export const scienceHero = {
  eyebrow: "Science",
  /* Addressed to the person buying, not to a laboratory — the same move the
     About hero made on 2026-10-20. Every clause is evidence this page itself
     shows further down; nothing here claims an outcome, and the
     research-use-only position is untouched (it is printed on every lot in
     section 03 and on every product page). */
  title: "Read the report before you buy.",
  lead: "Every lot in the shop is tested by an independent lab and listed with its own certificate — purity, batch number and the full compound breakdown, published exactly as it came back.",
  image: heroPack,
  /* The alt NAMES the lot, which is only allowed because the pack in frame is
     a stocked one and its artwork is the real catalogue render — see the
     import block. On the bands picturing a carton the shop does not stock, the
     alt must name no compound. */
  imageAlt:
    "A customer holding a Retatrutide 20mg carton up to the light in a sunlit room.",
  /* Added 2026-10-21 with the storefront pass. Both resolve: the reports
     section is on this page, `#/shop` is the collection page. The page is the
     evidence layer, so the primary action is to READ a report — the shop link
     is the secondary one, the opposite weighting to the About hero. */
  ctas: [
    { label: "Read a lab report", href: "#/science?s=reports", primary: true },
    { label: "Shop all products", href: "#/shop", primary: false },
  ],
  /* Facts this page itself publishes below — the report count, the named
     analyst, and what every certificate carries. No claim here needs evidence
     the page does not already show. */
  marks: [
    "Independent analysis on every lot",
    "Batch-specific certificate",
    "Published as received",
  ],
};

/* ------------------------------------------------------------- standards */

export const standards = [
  {
    number: "01",
    title: "Verified sourcing",
    body: "Materials come from manufacturers held to strict testing, handling and documentation requirements on every production run.",
  },
  {
    number: "02",
    title: "Controlled processes",
    body: "Repeatable, documented handling so each unit matches the one before it — the point of a reference material is that it does not drift.",
  },
  {
    number: "03",
    title: "Sealed packaging",
    body: "Tamper-evident research kits, with cold-chain packing where the compound requires refrigeration.",
  },
  {
    number: "04",
    title: "Retained samples",
    body: "A reference sample is kept from every lot, so a result can be cross-checked against the material it came from.",
  },
];

/* ---------------------------------------------------------------- purity */

/**
 * ⚠ `image` / `imageAlt` are also read by `LabProof` (unmounted) — the method
 * circle in its mosaic. Nothing else consumes them.
 */
export const purityMethod = {
  image: verifiedImg,
  imageAlt: "A Retatrutide 20mg carton on a sunlit table, sealed and unopened.",
  steps: [
    {
      label: "Reverse-phase HPLC",
      body: "Separates the target compound from related substances and quantifies purity as a percentage of total peak area.",
    },
    {
      label: "High-resolution mass spectrometry",
      body: "Confirms molecular identity against the expected mass — purity alone does not prove you have the right molecule.",
    },
    {
      label: "Independent verification",
      body: "Analysis is carried out by Janoshik Analytical rather than in-house, and the report is published as received.",
    },
  ],
  documentation: [
    "Lot number",
    "HPLC purity",
    "Mass-spec confirmation",
    "Fill volume",
    "Storage and handling notes",
  ],
};

/** Same note as `purityMethod`: `LabProof` reads this too. */
export const teamPanel = {
  image: paperworkImg,
  imageAlt:
    "A customer at a sunlit desk with a Retatrutide 20mg carton and the batch paperwork.",
};

/**
 * The shop-promise strip under the banner. Read from `whyUs` — the same source
 * the About page's strip and the `WhyChoose` band use — so the three cannot
 * drift. It renders the short `note`, the form that layout was written for.
 * The icon keys map to the inline SVGs in `SciencePage.tsx`, in this order.
 */
export const sciencePromises = whyUs.map((row, i) => ({
  icon: (["doc", "lab", "cold", "chat"] as const)[i] ?? "doc",
  title: row.title,
  note: row.note,
}));

/* --------------------------------------------------------------- reports */

export type ScienceReport = {
  productId: string;
  title: string;
  href: string;
  image: string;
  /** The lot's real catalogue price — this band sells, as of 2026-10-21. */
  price: number;
  /** Shelf line, built from the lot's own specs: "Pre-filled pen · 20 mg total". */
  shelf: string;
  /** The lot's own research-use-only line. Printed under the price. */
  note: string;
  lab: string;
  batchNumber: string;
  purity: string;
  /** Numeric form of `purity`, for the meter. NaN if it ever stops parsing. */
  purityValue: number;
  fillVolume: string;
  compounds: { name: string; concentration: string; verified: string }[];
  /** The actual certificate scans, revealed when a row is expanded. */
  reportImages: string[];
};

/**
 * Only products that actually carry a published analysis appear here — the
 * list is filtered, never padded, so an absent report stays absent.
 */
export const scienceReports: ScienceReport[] = projects
  .filter((product) => product.labAnalysis)
  .map((product) => {
    const lab = product.labAnalysis!;
    /* Form and total content, the two specs a buyer reads off a shelf — the
       same pair `Catalogue` and `ProductRange` print on a card. A spec that is
       missing is dropped rather than guessed. */
    const shelf = ["Form", "Total content"]
      .map((label) => product.specs.find((s) => s.label === label)?.value)
      .filter(Boolean)
      .join(" · ");
    return {
      productId: product.id,
      title: product.title,
      href: `#/product/${product.id}`,
      image: product.image,
      price: product.price,
      shelf,
      note: product.safetyProtocol,
      lab: lab.lab,
      batchNumber: lab.batchNumber,
      purity: lab.purity,
      purityValue: Number.parseFloat(lab.purity),
      fillVolume: lab.fillVolume,
      compounds: lab.compounds,
      reportImages: lab.reportImages ?? [],
    };
  });

export const scienceStats = [
  { value: String(scienceReports.length), label: "Published reports" },
  { value: "Janoshik", label: "Independent analyst" },
  { value: "Per lot", label: "Batch-specific COA" },
];

/* ------------------------------------------------------------ home teaser */

/**
 * Copy for the home-page "proof" section. The lot count and analyst name are
 * read from `scienceReports`, so the sentence stays true as lots are added.
 */
export const proofCopy = {
  mark: "Proof",
  titleLead: "Every batch comes",
  titleAccent: "with its paperwork.",
  text: `${scienceReports.length} lots in the shop ship with a report from ${
    scienceReports[0]?.lab ?? "an independent laboratory"
  } — an outside lab, not ours. Open any product and you can read it before you buy: batch number, purity, fill volume and what's actually in the device.`,
  cta: { label: "Read the reports", href: "#/science?s=reports" },
  crumb: { parent: "Science", parentHref: "#/science", label: "Lab reports" },
  disclaimer: "For laboratory research only. Not for human or veterinary use.",
};
