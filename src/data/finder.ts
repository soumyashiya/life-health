import { projects, type Project } from "./site";
import { researchAreas, type ResearchVisualKey } from "./research";

/**
 * Guided product finder.
 *
 * The whole point is the "which one do I pick?" case, so no question may
 * assume the visitor already knows the catalogue — never ask for a compound
 * by name, a strength in mg, or anything else only a returning buyer could
 * answer. Each step asks about the study instead: what it looks at, whether
 * it isolates one active, what paperwork it needs, what it can spend.
 *
 * It still asks about the *protocol*, never about the person running it:
 * these are laboratory reference materials, so a "what's your health goal"
 * style quiz would misrepresent what the catalogue is for.
 *
 * Nothing here hard-codes a product. Intent maps to products through
 * `researchAreas.productIds`; everything else is read off each product's own
 * assay, specs and price, so a new product in `site.ts` enters the finder
 * with no edit here.
 */

export type FinderStepId =
  | "application"
  | "composition"
  | "documentation"
  | "scale";

export type FinderOption = {
  id: string;
  label: string;
  /** One supporting line under the label — never a sentence of marketing. */
  note?: string;
};

export type FinderStep = {
  id: FinderStepId;
  question: string;
  /** Short framing line under the question. */
  help: string;
  options: FinderOption[];
};

export type FinderAnswers = Partial<Record<FinderStepId, string>>;

/** The published third-party assay for a lot, where there is one. */
const lotReport = (product: Project) =>
  "labAnalysis" in product ? product.labAnalysis : undefined;

/**
 * How many actives a product carries, read from the published assay so the
 * count is the independently verified one. A lot with no assay falls back to
 * its spec line, where actives are joined with "+".
 */
const activeCount = (product: Project) => {
  const lab = lotReport(product);
  if (lab) return lab.compounds.length;
  const total =
    product.specs.find((spec) => spec.label === "Total content")?.value ?? "";
  return total.split("+").length;
};

type PriceBand = "pilot" | "standard" | "extended";

const priceBand = (product: Project): PriceBand => {
  if (product.price < 300) return "pilot";
  if (product.price < 450) return "standard";
  return "extended";
};

export const finderSteps: FinderStep[] = [
  {
    id: "application",
    question: "What is your work looking at?",
    help: "Closest is good enough — this only orders the results.",
    options: [
      ...researchAreas.map((area) => ({
        id: area.id,
        label: area.name,
        note: area.description,
      })),
      {
        id: "any",
        label: "Not sure yet",
        note: "Rank on the answers that follow.",
      },
    ],
  },
  {
    id: "composition",
    question: "One active, or a combination?",
    help: "Everything ships sealed and pre-filled — this is about what is inside it.",
    options: [
      {
        id: "single",
        label: "A single active",
        note: "One compound per kit, so a result traces to one variable.",
      },
      {
        id: "blend",
        label: "A combination",
        note: "Two or three actives, each quantified separately on the assay.",
      },
      { id: "any", label: "Either", note: "Show me both." },
    ],
  },
  {
    id: "documentation",
    question: "What documentation do you need?",
    help: "Every order carries a research information sheet. Most lots also carry a third-party assay.",
    options: [
      {
        id: "report",
        label: "A published lot assay",
        note: "Batch number, fill volume and HPLC purity from Janoshik Analytical.",
      },
      {
        id: "breakdown",
        label: "A per-compound breakdown",
        note: "Every active in a combination quantified on its own line.",
      },
      {
        id: "any",
        label: "The standard sheet is fine",
        note: "Rank on the other answers.",
      },
    ],
  },
  {
    id: "scale",
    question: "What can the study spend per unit?",
    help: "Used to order your matches, not to rule anything out.",
    options: [
      { id: "pilot", label: "Pilot run", note: "Under $300 per unit." },
      { id: "standard", label: "Standard protocol", note: "$300 – $450 per unit." },
      { id: "extended", label: "Extended programme", note: "$450 and above." },
      { id: "any", label: "No preference", note: "Rank on the other answers." },
    ],
  },
];

/** Option label for a reason chip, by id rather than by step position. */
const optionLabel = (stepId: FinderStepId, optionId: string) =>
  finderSteps
    .find((step) => step.id === stepId)
    ?.options.find((option) => option.id === optionId)?.label;

export type FinderMatch = {
  product: Project;
  score: number;
  /** Which answers this product satisfied — rendered as chips on the card. */
  reasons: string[];
};

/**
 * Scores rather than filters, so the finder always returns something to look
 * at — a visitor who answers "not sure" to everything still gets a ranked
 * catalogue rather than an empty state. Application is weighted heaviest
 * because it is the only answer tied to curated data
 * (`researchAreas.productIds`) rather than a derived spec.
 */
export const rankProducts = (answers: FinderAnswers): FinderMatch[] => {
  const area = researchAreas.find(
    (candidate) => candidate.id === (answers.application as ResearchVisualKey),
  );

  return projects
    .map((product, index) => {
      let score = 0;
      const reasons: string[] = [];

      if (area?.productIds.includes(product.id)) {
        score += 4;
        reasons.push(area.name);
      }

      const actives = activeCount(product);
      if (answers.composition === "single" && actives === 1) {
        score += 3;
        reasons.push("Single active");
      } else if (answers.composition === "blend" && actives > 1) {
        score += 3;
        reasons.push(`${actives}-compound combination`);
      }

      // A breakdown implies a report, so a single-active lot with an assay
      // still earns partial credit rather than dropping to zero.
      if (answers.documentation === "report" && lotReport(product)) {
        score += 2;
        reasons.push("Published lot assay");
      } else if (answers.documentation === "breakdown" && lotReport(product)) {
        const blend = actives > 1;
        score += blend ? 2 : 1;
        reasons.push(blend ? "Per-compound breakdown" : "Published lot assay");
      }

      if (answers.scale && answers.scale !== "any") {
        if (priceBand(product) === answers.scale) {
          score += 2;
          const label = optionLabel("scale", answers.scale);
          if (label) reasons.push(label);
        }
      }

      // Catalogue order is the tie-break, kept here so the sort stays stable
      // across browsers without mutating `projects`.
      return { product, score, reasons, index };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ product, score, reasons }) => ({ product, score, reasons }));
};
