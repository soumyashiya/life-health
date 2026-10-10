import { projects } from "./site";
import metabolicImg from "../assets/research/metabolic.webp";
import cellularImg from "../assets/research/cellular.webp";
import peptideImg from "../assets/research/peptide.webp";
import recoveryImg from "../assets/research/recovery.webp";
import formulationImg from "../assets/research/formulation.webp";

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
  /** Real ids from `projects` in ./site — never invent product ids here. */
  productIds: string[];
};

export const researchAreas: ResearchArea[] = [
  {
    id: "metabolic",
    number: "01",
    titleLines: ["Metabolic", "Research"],
    name: "Metabolic research",
    description:
      "Receptor-agonist reference materials for metabolic and energy-pathway studies.",
    image: metabolicImg,
    productIds: ["p1", "p6", "p4"],
  },
  {
    id: "cellular",
    number: "02",
    titleLines: ["Cellular", "Research"],
    name: "Cellular research",
    description:
      "Coenzyme and signalling compounds for cellular energy and pathway work.",
    image: cellularImg,
    productIds: ["p5", "p2"],
  },
  {
    id: "peptide",
    number: "03",
    titleLines: ["Peptide", "Research"],
    name: "Peptide research",
    description:
      "Characterised peptide reference materials for structural and stability analysis.",
    image: peptideImg,
    productIds: ["p3", "p2", "p1", "p6", "p4"],
  },
  {
    id: "recovery",
    number: "04",
    titleLines: ["Recovery", "Research"],
    name: "Recovery research",
    description:
      "Tissue-repair peptide pairings for regeneration-focused laboratory studies.",
    image: recoveryImg,
    productIds: ["p3", "p2"],
  },
  {
    id: "formulation",
    number: "05",
    titleLines: ["Formulation", "Research"],
    name: "Formulation research",
    description:
      "Multi-compound blends supplied in sealed, fixed-volume research formats.",
    image: formulationImg,
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
