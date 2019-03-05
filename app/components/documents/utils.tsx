import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EEtoState, EtoStateToCamelcase } from "../../lib/api/eto/EtoApi.interfaces";
import {
  EEtoDocumentType,
  TEtoDocumentTemplates,
  TStateInfo,
} from "../../lib/api/eto/EtoFileApi.interfaces";
import { EETOStateOnChain } from "../../modules/public-etos/types";
import { DeepReadonly } from "../../types";

export const getDocumentTitles = (isRetailEto: boolean) => ({
  company_token_holder_agreement: <FormattedMessage id="eto.documents.tokenholder-agreement" />,
  reservation_and_acquisition_agreement: (
    <FormattedMessage id="eto.documents.reservation-and-acquisition-agreement" />
  ),
  investment_and_shareholder_agreement_template: (
    <FormattedMessage id="eto.documents.investment-and-shareholder-agreement" />
  ),
  pamphlet_template: <FormattedMessage id="eto.documents.pamphlet_template" />,
  prospectus_template: <FormattedMessage id="eto.documents.prospectus-template" />,
  termsheet_template: <FormattedMessage id="eto.documents.termsheet-template" />,
  investment_memorandum_template: (
    <FormattedMessage id="eto.documents.investment-memorandum-template" />
  ),
  // in document collection
  investment_and_shareholder_agreement: (
    <FormattedMessage id="eto.documents.signed-investment-and-shareholder-agreement" />
  ),
  signed_investment_and_shareholder_agreement: (
    <FormattedMessage id="eto.documents.signed-investment-and-shareholder-agreement" />
  ),
  approved_investor_offering_document: isRetailEto ? (
    <FormattedMessage id="eto.documents.approved-investor-prospectus-document" />
  ) : (
    <FormattedMessage id="eto.documents.approved-investment-memorandum-document" />
  ),
  signed_termsheet: <FormattedMessage id="eto.documents.signed-termsheet" />,
});

export const getDocumentTemplateTitles = (isRetailEto: boolean) => ({
  company_token_holder_agreement: (
    <FormattedMessage id="eto.documents.tokenholder-agreement-template" />
  ),
  reservation_and_acquisition_agreement: (
    <FormattedMessage id="eto.documents.reservation-and-acquisition-agreement-template" />
  ),
  investment_and_shareholder_agreement_template: (
    <FormattedMessage id="eto.documents.investment-and-shareholder-agreement-template" />
  ),
  pamphlet_template: <FormattedMessage id="eto.documents.pamphlet_template" />,
  prospectus_template: <FormattedMessage id="eto.documents.prospectus-template" />,
  termsheet_template: <FormattedMessage id="eto.documents.termsheet-template" />,
  investment_memorandum_template: (
    <FormattedMessage id="eto.documents.investment-memorandum-template" />
  ),
  // in document collection
  investment_and_shareholder_agreement: (
    <FormattedMessage id="eto.documents.signed-investment-and-shareholder-agreement-template" />
  ),
  approved_investor_offering_document: isRetailEto ? (
    <FormattedMessage id="eto.documents.investor-prospectus-document-template" />
  ) : (
    <FormattedMessage id="eto.documents.investment-memorandum-document-template" />
  ),
  signed_termsheet: null,
  signed_investment_and_shareholder_agreement: null,
});

//in Payout & Claim onChainState
// INVESTMENT_AND_SHAREHOLDER_AGREEMENT changes to SIGNED_INVESTMENT_AND_SHAREHOLDER_AGREEMENT
export const renameDocuments = (
  stateInfo: DeepReadonly<TStateInfo> | undefined,
  onChainState?: EETOStateOnChain,
) => {
  const documents = stateInfo ? [...stateInfo.uploadableDocuments] : [];

  if (
    (stateInfo && onChainState === EETOStateOnChain.Claim) ||
    onChainState === EETOStateOnChain.Payout
  ) {
    const i = documents.findIndex(x => x === EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT);
    documents[i] = EEtoDocumentType.SIGNED_INVESTMENT_AND_SHAREHOLDER_AGREEMENT;
  }

  return documents;
};

const canUploadInOnChainStates = (
  etoState: EEtoState,
  documentKey: EEtoDocumentType,
  onChainState?: EETOStateOnChain,
) =>
  etoState === EEtoState.ON_CHAIN
    ? onChainState === EETOStateOnChain.Signing &&
      documentKey === EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT
    : true;

//disable document tile and don't start the signing process if there's a transaction pending
const mayBeSignedNow = (documentKey: EEtoDocumentType, transactionPending: boolean) => {
  return documentKey === EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT
    ? !transactionPending
    : true;
};

//disable document tile if there's some activity under way
export const isBusy = (
  documentKey: EEtoDocumentType,
  transactionPending: boolean,
  documentUploading: boolean,
) => !mayBeSignedNow(documentKey, transactionPending) || documentUploading;

export const isFileUploaded = (
  etoDocuments: TEtoDocumentTemplates,
  documentKey: EEtoDocumentType,
) =>
  Object.keys(etoDocuments).some(
    uploadedKey => etoDocuments[uploadedKey].documentType === documentKey,
  );

//not all documents may be uploaded in all etoStates AND onChain states
export const uploadAllowed = (
  stateInfo: DeepReadonly<TStateInfo>,
  etoState: EEtoState,
  documentKey: EEtoDocumentType,
  onChainState?: EETOStateOnChain,
) =>
  stateInfo &&
  etoState &&
  stateInfo.canUploadInStates[EtoStateToCamelcase[etoState]].some(
    (fileName: string) => fileName === documentKey,
  ) &&
  canUploadInOnChainStates(etoState, documentKey, onChainState);
