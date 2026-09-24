import type { LegalArea, PromptSet } from "./types";

import * as civilComercial from "./civil_comercial";
import * as familia from "./familia";
import * as laboral from "./laboral";
import * as penal from "./penal";
import * as publico from "./publico";
import * as general from "./general";

export type { LegalArea, PromptSet, LegalAreaConfig } from "./types";

const promptRegistry: Record<LegalArea, PromptSet> = {
  civil_comercial: civilComercial,
  familia: familia,
  laboral: laboral,
  penal: penal,
  publico: publico,
  general: general,
};

export function getPromptsForArea(area: LegalArea): PromptSet {
  return promptRegistry[area] ?? promptRegistry.general;
}

export function getAvailableAreas(): LegalArea[] {
  return Object.keys(promptRegistry) as LegalArea[];
}

export { LEGAL_AREA_CONFIGS } from "./area-configs";
