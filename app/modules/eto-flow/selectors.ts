import BigNumber from "bignumber.js";
import { IAppState } from "../../store";
import { DeepPartial } from "../../types";
import { selectIsUserEmailVerified } from "../auth/selectors";
import { selectPlatformTermsConstants } from "../contracts/selectors";
import { TEtoDocumentTemplates } from "../eto-documents/interfaces";
import { selectEtoDocumentLoading } from "../eto-documents/selectors";
import { ERequestStatus } from "../kyc/interfaces";
import { selectKycRequestStatus } from "../kyc/selectors";
import {
  EETOStateOnChain,
  TBlEtoWithCompanyAndContract,
} from "../public-etos/interfaces/interfaces";
import { selectEtoWithCompanyAndContract, selectPublicEto } from "../public-etos/selectors";
import { IBlCompanyEtoData } from "./interfaces/CompanyEtoData";
import { EEtoState } from "./interfaces/interfaces";
import { IBlPublicEtoData } from "./interfaces/PublicEtoData";
import { isValidEtoStartDate } from "./utils";

export const selectIssuerEtoPreviewCode = (state: IAppState): string | undefined =>
  state.etoFlow.etoPreviewCode;

export const selectIssuerEto = (state: IAppState): IBlPublicEtoData | undefined => {
  const issuerEtoPreviewCode = selectIssuerEtoPreviewCode(state);

  if (issuerEtoPreviewCode) {
    return selectPublicEto(state, issuerEtoPreviewCode);
  }

  return undefined;
};

export const selectIssuerEtoWithCompanyAndContract = (
  state: IAppState,
): TBlEtoWithCompanyAndContract | undefined => {
  const issuerEtoPreviewCode = selectIssuerEtoPreviewCode(state);

  if (issuerEtoPreviewCode) {
    return selectEtoWithCompanyAndContract(state, issuerEtoPreviewCode);
  }

  return undefined;
};

export const selectIsBookBuilding = (state: IAppState): boolean => {
  const eto = selectIssuerEto(state);

  if (eto) {
    return eto.isBookbuilding;
  }

  return false;
};

export const selectMaxPledges = (state: IAppState): BigNumber | null => {
  const eto = selectIssuerEto(state);

  return eto !== undefined ? eto.maxPledges : null;
};

export const selectEtoId = (state: IAppState): string | undefined => {
  const eto = selectIssuerEto(state);
  if (eto) {
    return eto.etoId;
  }
  return undefined;
};

export const selectCanEnableBookBuilding = (state: IAppState): boolean => {
  const eto = selectIssuerEto(state);

  if (eto) {
    return eto.canEnableBookbuilding;
  }

  return false;
};

export const selectIssuerEtoState = (state: IAppState): EEtoState | undefined => {
  const eto = selectIssuerEto(state);

  if (eto) {
    return eto.state;
  }

  return undefined;
};

export const selectIssuerEtoIsRetail = (state: IAppState): boolean => {
  const eto = selectIssuerEto(state);

  if (eto) {
    return eto.allowRetailInvestors;
  }

  return false;
};

export const selectIssuerCompany = (state: IAppState): IBlCompanyEtoData | undefined => {
  const eto = selectIssuerEtoWithCompanyAndContract(state);

  if (eto) {
    return eto.company;
  }

  return undefined;
};

export const selectIssuerEtoLoading = (state: IAppState): boolean => state.etoFlow.loading;

export const selectCombinedEtoCompanyData = (
  state: IAppState,
): DeepPartial<IBlPublicEtoData & IBlCompanyEtoData> => {
  return {
    ...selectIssuerCompany(state),
    ...selectIssuerEto(state),
  };
};

export const selectIssuerEtoTemplates = (state: IAppState): TEtoDocumentTemplates | undefined => {
  const eto = selectIssuerEto(state);

  if (eto) {
    return eto.templates;
  }

  return undefined;
};

export const selectIssuerEtoDocuments = (state: IAppState): TEtoDocumentTemplates | undefined => {
  const eto = selectIssuerEto(state);

  if (eto) {
    return eto.documents;
  }

  return undefined;
};

export const selectIsTermSheetSubmitted = (state: IAppState): boolean | undefined => {
  const documents = selectIssuerEtoDocuments(state);

  if (documents) {
    return Object.keys(documents).some(key => documents[key].documentType === "signed_termsheet");
  }
  return undefined;
};

export const selectIsOfferingDocumentSubmitted = (state: IAppState): boolean | undefined => {
  const documents = selectIssuerEtoDocuments(state);

  if (documents) {
    return Object.keys(documents).some(
      key => documents[key].documentType === "approved_investor_offering_document",
    );
  }
  return undefined;
};

export const selectShouldEtoDataLoad = (state: IAppState): boolean =>
  selectKycRequestStatus(state) === ERequestStatus.ACCEPTED &&
  selectIsUserEmailVerified(state.auth);

export const selectIsGeneralEtoLoading = (state: IAppState): boolean =>
  selectIssuerEtoLoading(state) && selectEtoDocumentLoading(state.etoDocuments);

export const selectNewPreEtoStartDate = (state: IAppState): Date | undefined =>
  state.etoFlow.newStartDate;

export const selectPreEtoStartDateFromContract = (state: IAppState): Date | undefined => {
  //TODO remove dates from state
  const code = selectIssuerEtoPreviewCode(state);
  if (code) {
    const eto = selectEtoWithCompanyAndContract(state, code);
    return eto && eto.contract && eto.contract.startOfStates[EETOStateOnChain.Whitelist];
  }
};

export const selectPreEtoStartDate = (state: IAppState): Date | undefined =>
  selectNewPreEtoStartDate(state) || selectPreEtoStartDateFromContract(state); //TODO remove dates from state

export const selectCanChangePreEtoStartDate = (state: IAppState): boolean => {
  const constants = selectPlatformTermsConstants(state);
  const date = selectPreEtoStartDateFromContract(state);
  return !date || isValidEtoStartDate(date, constants.DATE_TO_WHITELIST_MIN_DURATION);
};

export const selectIsNewPreEtoStartDateValid = (state: IAppState): boolean => {
  const constants = selectPlatformTermsConstants(state);
  const date = selectNewPreEtoStartDate(state);
  return !!date && isValidEtoStartDate(date, constants.DATE_TO_WHITELIST_MIN_DURATION);
};
