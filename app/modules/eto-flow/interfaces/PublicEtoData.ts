import BigNumber from "bignumber.js";
import {NumericString} from "../../../types";
import {
  bigNumberToNumber,
  bigNumberToNumericString,
  numberToNumericString,
  numericStringToBigNumber
} from "../../../utils/numericStringUtils";
import {TEtoDocumentTemplates} from "../../eto-documents/interfaces";
import {EEtoState} from "./interfaces";

export interface IStatePublicEtoData {
  currencies: Array<string>;//fixme should be an enum?
  prospectusLanguage: string,
  minTicketEur:NumericString;
  maxTicketEur: NumericString;
  enableTransferOnSuccess: boolean,
  notUnderCrowdfundingRegulations: boolean;
  allowRetailInvestors: boolean;
  whitelistDurationDays: number;
  publicDurationDays: number;
  signingDurationDays: number;
  additionalTerms?: string;

  equityTokenName: string;
  equityTokenSymbol: string;
  equityTokenImage: string;

  nominee: string;
  liquidationPreferenceMultiplier: NumericString;
  generalVotingRule: string;

  equityTokensPerShare: NumericString;
  shareNominalValueEur: NumericString;
  preMoneyValuationEur: NumericString;
  existingCompanyShares: NumericString;
  authorizedCapitalShares: NumericString;
  newSharesToIssue: NumericString;
  minimumNewSharesToIssue: NumericString;
  newSharesToIssueInWhitelist: NumericString;
  whitelistDiscountFraction: NumericString;
  publicDiscountFraction: NumericString;
  newSharesToIssueInFixedSlots: NumericString;
  fixedSlotsMaximumDiscountFraction: NumericString;
  discountScheme: string;

  etoId: string;
  companyId: string;
  previewCode: string;
  state: EEtoState;
  isBookbuilding: boolean;
  templates: TEtoDocumentTemplates;
  startDate: string;
  documents: TEtoDocumentTemplates;
  maxPledges: NumericString;
  canEnableBookbuilding: boolean;
}



export interface IApiPublicEtoData {
  currencies: Array<string>;//fixme should be an enum?
  prospectusLanguage: string,
  minTicketEur:number;
  maxTicketEur: number;
  enableTransferOnSuccess: boolean,
  notUnderCrowdfundingRegulations: boolean;
  allowRetailInvestors: boolean;
  whitelistDurationDays: number;
  publicDurationDays: number;
  signingDurationDays: number;
  additionalTerms?: string;

  equityTokenName: string;
  equityTokenSymbol:string;
  equityTokenImage: string;

  nominee: string;
  liquidationPreferenceMultiplier: number;
  generalVotingRule: string;

  equityTokensPerShare: number;
  shareNominalValueEur: number;
  preMoneyValuationEur: number;
  existingCompanyShares: number;
  authorizedCapitalShares:number;
  newSharesToIssue: number;
  minimumNewSharesToIssue:number;
  newSharesToIssueInWhitelist: number;
  whitelistDiscountFraction: number;
  publicDiscountFraction: number;
  newSharesToIssueInFixedSlots: number;
  fixedSlotsMaximumDiscountFraction: number;
  discountScheme: string;

  etoId: string;
  companyId: string;
  previewCode: string;
  state: EEtoState;
  isBookbuilding: boolean;
  templates: TEtoDocumentTemplates;
  startDate: string;
  documents: TEtoDocumentTemplates;
  maxPledges: number;
  canEnableBookbuilding: boolean;
}

export interface IBlPublicEtoData {
  currencies: Array<string>;//fixme should be an enum?
  prospectusLanguage: string,
  minTicketEur:BigNumber;
  maxTicketEur: BigNumber;
  enableTransferOnSuccess: boolean,
  notUnderCrowdfundingRegulations: boolean;
  allowRetailInvestors: boolean;
  whitelistDurationDays: number;
  publicDurationDays: number;
  signingDurationDays: number;
  additionalTerms?: string;

  equityTokenName: string;
  equityTokenSymbol: string;
  equityTokenImage: string;

  nominee: string;
  liquidationPreferenceMultiplier: BigNumber;
  generalVotingRule: string;

  equityTokensPerShare: BigNumber;
  shareNominalValueEur: BigNumber;
  preMoneyValuationEur: BigNumber;
  existingCompanyShares: BigNumber;
  authorizedCapitalShares: BigNumber;
  newSharesToIssue: BigNumber;
  minimumNewSharesToIssue: BigNumber;
  newSharesToIssueInWhitelist: BigNumber;
  whitelistDiscountFraction: BigNumber;
  publicDiscountFraction: BigNumber;
  newSharesToIssueInFixedSlots: BigNumber;
  fixedSlotsMaximumDiscountFraction: BigNumber;
  discountScheme: string;

  etoId: string;
  companyId: string;
  previewCode: string;
  state: EEtoState;
  isBookbuilding: boolean;
  templates: TEtoDocumentTemplates;
  startDate: string;
  documents: TEtoDocumentTemplates;
  maxPledges: BigNumber;
  canEnableBookbuilding: boolean;
}


export const apiToStateConversionSpec = {
  minTicketEur:numberToNumericString(),
  maxTicketEur: numberToNumericString(),
  liquidationPreferenceMultiplier:numberToNumericString(),
  equityTokensPerShare: numberToNumericString(),
  shareNominalValueEur: numberToNumericString(),
  preMoneyValuationEur: numberToNumericString(),
  existingCompanyShares: numberToNumericString(),
  authorizedCapitalShares: numberToNumericString(),
  newSharesToIssue: numberToNumericString(),
  minimumNewSharesToIssue: numberToNumericString(),
  newSharesToIssueInWhitelist: numberToNumericString(),
  whitelistDiscountFraction: numberToNumericString(),
  publicDiscountFraction: numberToNumericString(),
  newSharesToIssueInFixedSlots: numberToNumericString(),
  fixedSlotsMaximumDiscountFraction: numberToNumericString(),
};

export const stateToBlConversionSpec = {
  minTicketEur:numericStringToBigNumber(),
  maxTicketEur: numericStringToBigNumber(),
  liquidationPreferenceMultiplier:numericStringToBigNumber(),
  equityTokensPerShare: numericStringToBigNumber(),
  shareNominalValueEur: numericStringToBigNumber(),
  preMoneyValuationEur: numericStringToBigNumber(),
  existingCompanyShares: numericStringToBigNumber(),
  authorizedCapitalShares: numericStringToBigNumber(),
  newSharesToIssue: numericStringToBigNumber(),
  minimumNewSharesToIssue: numericStringToBigNumber(),
  newSharesToIssueInWhitelist: numericStringToBigNumber(),
  whitelistDiscountFraction: numericStringToBigNumber(),
  publicDiscountFraction: numericStringToBigNumber(),
  newSharesToIssueInFixedSlots: numericStringToBigNumber(),
  fixedSlotsMaximumDiscountFraction: numericStringToBigNumber(),
};

export const blToApiConversionSpec = {
  minTicketEur:bigNumberToNumber(),
  maxTicketEur: bigNumberToNumber(),
  liquidationPreferenceMultiplier:bigNumberToNumber(),
  equityTokensPerShare: bigNumberToNumber(),
  shareNominalValueEur: bigNumberToNumber(),
  preMoneyValuationEur: bigNumberToNumber(),
  existingCompanyShares: bigNumberToNumber(),
  authorizedCapitalShares: bigNumberToNumber(),
  newSharesToIssue: bigNumberToNumber(),
  minimumNewSharesToIssue: bigNumberToNumber(),
  newSharesToIssueInWhitelist: bigNumberToNumber(),
  whitelistDiscountFraction: bigNumberToNumber(),
  publicDiscountFraction: bigNumberToNumber(),
  newSharesToIssueInFixedSlots: bigNumberToNumber(),
  fixedSlotsMaximumDiscountFraction: bigNumberToNumber(),
};

export const blToStateConversionSpec = {
  minTicketEur:bigNumberToNumericString(),
  maxTicketEur: bigNumberToNumericString(),
  liquidationPreferenceMultiplier:bigNumberToNumericString(),
  equityTokensPerShare: bigNumberToNumericString(),
  shareNominalValueEur: bigNumberToNumericString(),
  preMoneyValuationEur: bigNumberToNumericString(),
  existingCompanyShares: bigNumberToNumericString(),
  authorizedCapitalShares: bigNumberToNumericString(),
  newSharesToIssue: bigNumberToNumericString(),
  minimumNewSharesToIssue: bigNumberToNumericString(),
  newSharesToIssueInWhitelist: bigNumberToNumericString(),
  whitelistDiscountFraction: bigNumberToNumericString(),
  publicDiscountFraction: bigNumberToNumericString(),
  newSharesToIssueInFixedSlots: bigNumberToNumericString(),
  fixedSlotsMaximumDiscountFraction: bigNumberToNumericString(),
};

