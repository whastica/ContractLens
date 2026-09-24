export type LegalArea =
  | "civil_comercial"
  | "familia"
  | "laboral"
  | "penal"
  | "publico"
  | "general";

export interface PromptSet {
  CLASSIFY_PROMPT: string;
  STRUCTURE_PROMPT: string;
  CLAUSE_PROMPT: string;
  RISK_PROMPT: string;
  LEGAL_GROUNDING_PROMPT: string;
}

export interface LegalAreaConfig {
  id: LegalArea;
  label: string;
  description: string;
  pipeline: string;
  disclaimer: string;
  supportedDocuments: string[];
  legalFramework: string[];
  findingCategories: string[];
  clauseCategories: string[];
}
