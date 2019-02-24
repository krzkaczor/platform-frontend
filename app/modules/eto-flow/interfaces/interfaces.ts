import { IStateDetailedBookbuildingStats } from "../../bookbuilding-flow/interfaces/DetailedBookbuildingStats";
import { IApiCompanyEtoData, IStateCompanyEtoData } from "./CompanyEtoData";
import { IApiPublicEtoData, IStatePublicEtoData } from "./PublicEtoData";

export interface IEtoFlowState {
  etoPreviewCode?: string;
  loading: boolean;
  saving: boolean;
  bookbuildingStats: IStateDetailedBookbuildingStats[];
  newStartDate?: Date; //todo no Dates in state
}

export type TStateGeneralEtoData = {
  etoData: IStatePublicEtoData;
  companyData: IStateCompanyEtoData;
};

export type TApiGeneralEtoData = {
  etoData: IApiPublicEtoData;
  companyData: IApiCompanyEtoData;
};

export enum EEtoFormTypes {
  CompanyInformation = "companyInformation",
  LegalInformation = "legalInformation",
  KeyIndividuals = "keyIndividuals",
  ProductVision = "productVision",
  EtoTerms = "etoTerms",
  EtoInvestmentTerms = "etoInvestmentTerms",
  EtoMedia = "etoMedia",
  EtoVotingRights = "etoVotingRights",
  EtoEquityTokenInfo = "etoEquityTokenInfo",
  EtoRiskAssessment = "etoRiskAssessment",
}

export enum EEtoState {
  PREVIEW = "preview",
  PENDING = "pending",
  LISTED = "listed",
  PROSPECTUS_APPROVED = "prospectus_approved",
  ON_CHAIN = "on_chain",
}
export enum EtoStateToCamelcase {
  "preview" = "preview",
  "pending" = "pending",
  "listed" = "listed",
  "prospectus_approved" = "prospectusApproved",
  "on_chain" = "onChain",
}
// Since only keys are transformed from snake case to camel case we have to manually map states
// see@ swagger /api/eto-listing/ui/#!/ETO/api_eto_get_me
// see@ swagger api/eto-listing/ui/#!/Documents/api_document_documents_state_info
