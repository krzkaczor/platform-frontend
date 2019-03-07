import { TBookbuildingStatsType } from "../../lib/api/eto/EtoApi.interfaces";

export interface IEtoFlowState {
  etoPreviewCode?: string;
  loading: boolean;
  saving: boolean;
  bookbuildingStats: TBookbuildingStatsType[];
  newStartDate?: Date;
  signedInvestmentAgreementUrlLoading: boolean;
  signedInvestmentAgreementUrl: string | null;
}

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
