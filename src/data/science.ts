import { projects } from "./site";
import labFacility from "../assets/liora-healthcare-lab-facility-dubai.jpeg";
import purityImg from "../assets/hplc-verified-peptide-purity.jpg";
import teamImg from "../assets/research-team-peptide-lab.jpeg";

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
  title: "Every claim, traceable to a lot.",
  lead: "How we source, handle and verify research materials — and the published analysis behind each one.",
  image: labFacility,
  imageAlt:
    "Lyfe Health laboratory facility, lit workbenches and sealed storage.",
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

export const purityMethod = {
  image: purityImg,
  imageAlt: "HPLC instrumentation used for peptide purity verification.",
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

export const teamPanel = {
  image: teamImg,
  imageAlt: "Research team working at a peptide laboratory bench.",
};

/* --------------------------------------------------------------- reports */

export type ScienceReport = {
  productId: string;
  title: string;
  href: string;
  image: string;
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
    return {
      productId: product.id,
      title: product.title,
      href: `#/product/${product.id}`,
      image: product.image,
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
