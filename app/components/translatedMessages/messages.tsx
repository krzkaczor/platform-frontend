import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { externalRoutes } from "../../config/externalRoutes";
import { TTranslatedString } from "../../types";
import { TMessage } from "./utils";

interface ITranslationValues {
  [SignInUserErrorMessages: string]: string;
}

export type TranslatedMessageType =
  | BankTransferFlowMessage
  | GenericErrorMessage
  | GenericModalMessage
  | SignInUserErrorMessage
  | BrowserWalletErrorMessage
  | InvestorPortfolioMessage
  | LedgerErrorMessage
  | LightWalletErrorMessage
  | SignerErrorMessage
  | MismatchedWalletAddressErrorMessage
  | BackupRecoveryMessage
  | ToSMessage
  | BookbuildingFlowMessage
  | EtoDocumentsMessage
  | KycFlowMessage
  | AuthMessage
  | IpfsMessage
  | IcbmWalletMessage
  | ProfileMessage
  | PublicEtosMessage
  | FileUploadMessage
  | RemoteFileMessage
  | Web3Message
  | TestMessage;

export enum GenericErrorMessage {
  GENERIC_ERROR = "genericError",
  USER_ALREADY_EXISTS = "userAlreadyExists",
}

export enum GenericModalMessage {
  ERROR_TITLE = "errorTitle",
}

export enum SignInUserErrorMessage {
  MESSAGE_SIGNING_REJECTED = "messageSigningRejected",
  MESSAGE_SIGNING_TIMEOUT = "messageSigningTimeout",
  MESSAGE_SIGNING_SERVER_CONNECTION_FAILURE = "serverConnectionFailure",
}

export enum BrowserWalletErrorMessage {
  WALLET_IS_LOCKED = "walletIsLocked",
  WALLET_CONNECTED_TO_WRONG_NETWORK = "browserWalletConnectedToWrongNetwork",
  WALLET_NOT_ENABLED = "browserWalletNotEnabled",
  ACCOUNT_APPROVAL_REJECTED = "browserWalletAccountApprovalRejected",
  ACCOUNT_APPROVAL_PENDING = "browserWalletAccountApprovalPending",
  GENERIC_ERROR = "browserWalletGenericError",
}

export enum LedgerErrorMessage {
  LEDGER_LOCKED = "ledgerLocked",
  GENERIC_ERROR = "ledgerGenericError",
}

export enum LightWalletErrorMessage {
  WRONG_PASSWORD_SALT = "lightWalletWrongPasswordSalt",
  SIGN_MESSAGE = "lightWalletSignMessage",
  CREATION_ERROR = "lightWalletCreationError",
  DESERIALIZE = "lightWalletDeserialize",
  ENCRYPTION_ERROR = "lightWalletEncryptionError",
  WRONG_PASSWORD = "lightWalletWrongPassword",
  WRONG_MNEMONIC = "lightWalletWrongMnemonic",
  GENERIC_ERROR = "lightWalletGenericError",
}

export enum SignerErrorMessage {
  CONFIRMATION_REJECTED = "signerRejectedConfirmation",
  TIMEOUT = "signerTimeout",
  GENERIC_ERROR = "signerGenericError",
}

export enum MismatchedWalletAddressErrorMessage {
  MISMATCHED_WALLET_ADDRESS = "mismatchedWalletAddress",
}

export enum BackupRecoveryMessage {
  BACKUP_SUCCESS_TITLE = "backupSuccessTitle",
  BACKUP_SUCCESS_DESCRIPTION = "backupSuccessDescription",
}

export enum ToSMessage {
  TOS_ACCEPT_PERMISSION_TITLE = "tosAcceptPermissionTitle",
  TOS_ACCEPT_PERMISSION_TEXT = "tosAcceptPermissionText",
}

export enum BankTransferFlowMessage {
  BANK_TRANSFER_FLOW_ERROR = "bankTransferFlowError",
}

export enum BookbuildingFlowMessage {
  PLEDGE_FLOW_CONFIRM_PLEDGE = "pledgeFlowConfirmPledge",
  PLEDGE_FLOW_PLEDGE_DESCRIPTION = "pledgeFlowPledgeDescription",
  PLEDGE_FLOW_FAILED_TO_SAVE_PLEDGE = "pledgeFlowFailedToSavePledge",
  PLEDGE_FLOW_CONFIRM_PLEDGE_REMOVAL = "pledgeFlowConfirmPledgeRemoval",
  PLEDGE_FLOW_CONFIRM_PLEDGE_REMOVAL_DESCRIPTION = "pledgeFlowConfirmPledgeRemovalDescription",
  PLEDGE_FLOW_PLEDGE_REMOVAL_FAILED = "pledgeFlowPledgeRemovalFailed",
  PLEDGE_FLOW_FAILED_TO_GET_BOOKBUILDING_STATS = "pledgeFlowFailedToGetBookbuildingStats",
  PLEDGE_FLOW_FAILED_TO_LOAD_PLEDGE = "pledgeFlowFailedToLoadPledge",
}

export enum InvestorPortfolioMessage {
  INVESTOR_PORTFOLIO_FAILED_TO_LOAD_CLAIMABLES,
  INVESTOR_PORTFOLIO_FAILED_TO_LOAD_INCOMING_PAYOUTS,
}

export enum EtoDocumentsMessage {
  ETO_DOCUMENTS_CONFIRM_UPLOAD_DOCUMENT_TITLE = "etoDocumentsConfirmUploadDocumentTitle",
  ETO_DOCUMENTS_CONFIRM_UPLOAD_DOCUMENT_DESCRIPTION = "etoDocumentsConfirmUploadDocumentDescription",
  ETO_DOCUMENTS_FILE_UPLOADED = "etoDocumentsFileUploaded",
  ETO_DOCUMENTS_FILE_EXISTS = "etoDocumentsFileExists",
  ETO_DOCUMENTS_FILE_UPLOAD_FAILED = "etoDocumentsFileUploadFailed",
  ETO_DOCUMENTS_FAILED_TO_DOWNLOAD_FILE = "etoDocumentsFailedToDownloadFile",
  ETO_DOCUMENTS_FAILED_TO_ACCESS_ETO_FILES_DATA = "etoDocumentsFailedToAccessEtoFilesData",
  ETO_DOCUMENTS_CONFIRM_START_BOOKBUILDING = "etoDocumentsConfirmStartBookbuilding",
  ETO_DOCUMENTS_CONFIRM_STOP_BOOKBUILDING = "etoDocumentsConfirmStopBookbuilding",
  ETO_DOCUMENTS_FAILED_TO_SEND_ETO_DATA = "etoDocumentsFailedToSendEtoData",
  ETO_DOCUMENTS_FAILED_TO_GET_BOOKBUILDING_STATS = "pledgeFlowFailedToGetBookbuildingStats",
  ETO_DOCUMENTS_SUBMIT_ETO_TITLE = "etoDocumentsSubmitEtoTitle",
  ETO_DOCUMENTS_SUBMIT_ETO_DESCRIPTION = "etoDocumentsSubmitEtoDescription",
  ETO_SUBMIT_SUCCESS = "etoSubmitSuccess",
}

export enum PublicEtosMessage {
  COULD_NOT_LOAD_ETO_PREVIEW = "couldNotLoadEtoPreview",
  COULD_NOT_LOAD_ETO = "couldNotLoadEto",
}

export enum IpfsMessage {
  IPFS_FAILED_TO_DOWNLOAD_IPFS_FILE = "ipfsFailedToDownloadIpfsFile",
}

export enum FileUploadMessage {
  FILE_UPLOAD_ERROR,
}

export enum RemoteFileMessage {
  GET_FILES_DETAILS_ERROR = "GET_FILES_DETAILS_ERROR",
}

export enum KycFlowMessage {
  KYC_PROBLEM_SAVING_DATA = "kycProblemSavingData",
  KYC_PROBLEM_SENDING_DATA = "kycProblemSendingData",
  KYC_UPLOAD_SUCCESSFUL = "kycUploadSuccessful",
  KYC_UPLOAD_FAILED = "kycUploadFailed",
  KYC_SUBMIT_FAILED = "kycSubmitFailed",
  KYC_SUBMIT_TITLE = "kycSubmitTitle",
  KYC_SUBMIT_DESCRIPTION = "kycSubmitDescription",
  KYC_VERIFICATION_TITLE = "kycVerificationTitle",
  KYC_VERIFICATION_DESCRIPTION = "kycVerificationDescription",
  KYC_SETTINGS_BUTTON = "kycSettingsButton",
  KYC_ERROR = "kycError",
  KYC_BENEFICIAL_OWNERS = "kycBeneficialOwners",
  KYC_PROBLEM_LOADING_BANK_DETAILS = "kycProblemLoadingBankDetails",
}

export enum AuthMessage {
  AUTH_EMAIL_ALREADY_VERIFIED = "authEmailAlreadyVeryfied",
  AUTH_EMAIL_VERIFIED = "authEmailVerified",
  AUTH_EMAIL_ALREADY_EXISTS = "authEmailAlreadyExists",
  AUTH_EMAIL_VERIFICATION_FAILED = "authEmailVerificationFailed",
  AUTH_TOC_ACCEPT_ERROR = "authTocAcceptError",
  AUTH_TOC_FILENAME = "authTocFilename",
}

export enum IcbmWalletMessage {
  ICBM_RESERVATION_AGREEMENT = "icbmReservationAgreement",
  ICBM_FAILED_TO_DOWNLOAD_AGREEMENT = "icbmFailedToDownloadAgreement",
  ICBM_COULD_NOT_FIND_ADDRESS = "icbmCouldNotFindAdress",
  ICBM_WALLET_AND_ICBM_ADDRESSES_ARE_THE_SAME = "icbmWalletAndIcbmAdressesAreTheSame",
  ICBM_COULD_NOT_LOAD_WALLET_DATA = "icbmCouldNotLoadWalletData",
  ICBM_ERROR_RUNNING_MIGRATION_TOOL = "icmbErrorRunningMigrationTool",
}

export enum ProfileMessage {
  PROFILE_UPDATE_EMAIL_TITLE = "profileUpdateEmailTitle",
  PROFILE_ADD_EMAIL_TITLE = "profileAddEmailTitle",
  PROFILE_ADD_EMAIL_CONFIRM = "profileAddEmailConfirm",
  PROFILE_NEW_EMAIL_ADDED = "profileNewEmailAdded",
  PROFILE_EMAIL_ALREADY_EXISTS = "profileEmailAlreadyExists",
  PROFILE_ADD_EMAIL_ERROR = "profileAddEmailError",
  PROFILE_RESEND_EMAIL_LINK_CONFIRMATION_TITLE = "profileResendEmailLinkConfirmationTitle",
  PROFILE_RESEND_EMAIL_LINK_CONFIRMATION_DESCRIPTION = "profileResendEmailLinkConfirmationTitle",
  PROFILE_EMAIL_VERIFICATION_SENT = "profileEmailVerificationSent",
  PROFILE_EMAIL_VERIFICATION_SENDING_FAILED = "profileEmailVerificationSendingFailed",
  PROFILE_ACCESS_RECOVERY_PHRASE_TITLE = "profileAccessRecoveryPhraseTitle",
  PROFILE_ACCESS_RECOVERY_PHRASE_DESCRIPTION = "profileAccessRecoveryPhraseDescription",
}

export enum Web3Message {
  WEB3_ERROR_BROWSER = "web3ErrorBrowser",
  WEB3_ERROR_LEDGER = "web3ErrorLedger",
}

export enum TestMessage {
  TEST_MESSAGE = "testMessage",
}

const getMessageTranslation = ({ messageType, messageData }: TMessage): TTranslatedString => {
  switch (messageType) {
    case BackupRecoveryMessage.BACKUP_SUCCESS_TITLE:
      return <FormattedMessage id="modules.wallet-selector.light-wizard.sagas.backup-recovery" />;
    case BackupRecoveryMessage.BACKUP_SUCCESS_DESCRIPTION:
      return (
        <FormattedMessage id="modules.wallet-selector.light-wizard.sagas.successfully.backed-up" />
      );

    case GenericErrorMessage.GENERIC_ERROR:
      return <FormattedMessage id="error-message.generic-error" />;
    case GenericErrorMessage.USER_ALREADY_EXISTS:
      return <FormattedMessage id="modules.auth.sagas.sign-in-user.email-already-exists" />;
    case SignInUserErrorMessage.MESSAGE_SIGNING_REJECTED:
      return <FormattedMessage id="modules.auth.sagas.sign-in-user.message-signing-was-rejected" />;
    case SignInUserErrorMessage.MESSAGE_SIGNING_TIMEOUT:
      return <FormattedMessage id="modules.auth.sagas.sign-in-user.message-signing-timeout" />;
    case SignInUserErrorMessage.MESSAGE_SIGNING_SERVER_CONNECTION_FAILURE:
      return (
        <FormattedHTMLMessage
          tagName="span"
          id="modules.auth.sagas.sign-in-user.error-our-servers-are-having-problems"
          values={{ url: `${externalRoutes.neufundSupport}/home` }}
        />
      );

    case GenericModalMessage.ERROR_TITLE:
      return <FormattedMessage id="modal.generic.title.error" />;

    case BankTransferFlowMessage.BANK_TRANSFER_FLOW_ERROR:
      return <FormattedMessage id="bank-transfer-flow.failed-to-start" />;

    case BrowserWalletErrorMessage.WALLET_IS_LOCKED:
      return <FormattedMessage id="error-message.browser-wallet.wallet-locked" />;
    case BrowserWalletErrorMessage.WALLET_CONNECTED_TO_WRONG_NETWORK:
      return (
        <FormattedMessage id="error-message.browser-wallet.wallet-connected-to-wrong-network" />
      );
    case BrowserWalletErrorMessage.WALLET_NOT_ENABLED:
      return <FormattedMessage id="error-message.browser-wallet.wallet-not-enabled" />;
    case BrowserWalletErrorMessage.ACCOUNT_APPROVAL_REJECTED:
      return <FormattedMessage id="error-message.browser-wallet.account-approval-rejected" />;
    case BrowserWalletErrorMessage.ACCOUNT_APPROVAL_PENDING:
      return <FormattedMessage id="error-message.browser-wallet.account-approval-pending" />;
    case BrowserWalletErrorMessage.GENERIC_ERROR:
      return <FormattedMessage id="error-message.browser-wallet.generic-error" />;

    case LedgerErrorMessage.LEDGER_LOCKED:
      return <FormattedMessage id="error-message.ledger.ledger-locked" />;
    case LedgerErrorMessage.GENERIC_ERROR:
      return <FormattedMessage id="error-message.ledger.generic-error" />;

    case LightWalletErrorMessage.WRONG_PASSWORD_SALT:
      return <FormattedMessage id="error-message.light-wallet.wrong-password-salt" />;
    case LightWalletErrorMessage.SIGN_MESSAGE:
      return <FormattedMessage id="error-message.light-wallet.sign-message" />;
    case LightWalletErrorMessage.CREATION_ERROR:
      return <FormattedMessage id="error-message.light-wallet.creation-error" />;
    case LightWalletErrorMessage.DESERIALIZE:
      return <FormattedMessage id="error-message.light-wallet.deserialize" />;
    case LightWalletErrorMessage.ENCRYPTION_ERROR:
      return <FormattedMessage id="error-message.light-wallet.encryption-error" />;
    case LightWalletErrorMessage.WRONG_PASSWORD:
      return <FormattedMessage id="error-message.light-wallet.wrong-password" />;
    case LightWalletErrorMessage.WRONG_MNEMONIC:
      return <FormattedMessage id="error-message.light-wallet.wrong-mnemonic" />;
    case LightWalletErrorMessage.GENERIC_ERROR:
      return <FormattedMessage id="error-message.light-wallet.generic-error" />;

    case SignerErrorMessage.CONFIRMATION_REJECTED:
      return <FormattedMessage id="error-message.signer.signer-rejected-confirmation" />;
    case SignerErrorMessage.TIMEOUT:
      return <FormattedMessage id="error-message.signer.timeout" />;
    case SignerErrorMessage.GENERIC_ERROR:
      return <FormattedMessage id="error-message.signer.generic-error" />;

    case MismatchedWalletAddressErrorMessage.MISMATCHED_WALLET_ADDRESS:
      return (
        <FormattedMessage
          id="error-message.mismatched-wallet-address"
          values={messageData as ITranslationValues}
        />
      );

    case InvestorPortfolioMessage.INVESTOR_PORTFOLIO_FAILED_TO_LOAD_CLAIMABLES:
      return (
        <FormattedMessage id="portfolio.asset.payouts-from-neu.notification.failed-to-load-payouts" />
      );
    case InvestorPortfolioMessage.INVESTOR_PORTFOLIO_FAILED_TO_LOAD_INCOMING_PAYOUTS:
      return (
        <FormattedMessage id="portfolio.asset.payouts-from-neu.notification.failed-to-load-incoming-payouts" />
      );

    case ToSMessage.TOS_ACCEPT_PERMISSION_TITLE:
      return <FormattedMessage id="settings.modal.accept-tos.permission.title" />;
    case ToSMessage.TOS_ACCEPT_PERMISSION_TEXT:
      return <FormattedMessage id="settings.modal.accept-tos.permission.text" />;

    case BookbuildingFlowMessage.PLEDGE_FLOW_CONFIRM_PLEDGE:
      return <FormattedMessage id="eto.overview.permission-modal.confirm-pledge" />;
    case BookbuildingFlowMessage.PLEDGE_FLOW_PLEDGE_DESCRIPTION:
      return <FormattedMessage id="eto.overview.permission-modal.confirm-pledge-description" />;
    case BookbuildingFlowMessage.PLEDGE_FLOW_FAILED_TO_SAVE_PLEDGE:
      return <FormattedMessage id="eto.overview.error-notification.failed-to-save-pledge" />;
    case BookbuildingFlowMessage.PLEDGE_FLOW_CONFIRM_PLEDGE_REMOVAL:
      return <FormattedMessage id="eto.overview.permission-modal.confirm-pledge-removal" />;
    case BookbuildingFlowMessage.PLEDGE_FLOW_CONFIRM_PLEDGE_REMOVAL_DESCRIPTION:
      return (
        <FormattedMessage id="eto.overview.permission-modal.confirm-pledge-description-removal" />
      );
    case BookbuildingFlowMessage.PLEDGE_FLOW_PLEDGE_REMOVAL_FAILED:
      return <FormattedMessage id="eto.overview.error-notification.failed-to-delete-pledge" />;
    case BookbuildingFlowMessage.PLEDGE_FLOW_FAILED_TO_GET_BOOKBUILDING_STATS:
      return <FormattedMessage id="eto.overview.error-notification.failed-to-bookbuilding-stats" />;
    case BookbuildingFlowMessage.PLEDGE_FLOW_FAILED_TO_LOAD_PLEDGE:
      return <FormattedMessage id="eto.overview.error-notification.failed-to-load-pledge" />;

    case EtoDocumentsMessage.ETO_DOCUMENTS_CONFIRM_UPLOAD_DOCUMENT_TITLE:
      return <FormattedMessage id="eto.modal.confirm-upload-document-title" />;
    case EtoDocumentsMessage.ETO_DOCUMENTS_CONFIRM_UPLOAD_DOCUMENT_DESCRIPTION:
      return <FormattedMessage id="eto.modal.confirm-upload-document-description" />;
    case EtoDocumentsMessage.ETO_DOCUMENTS_FILE_UPLOADED:
      return <FormattedMessage id="eto.modal.file-uploaded" />;
    case EtoDocumentsMessage.ETO_DOCUMENTS_FILE_EXISTS:
      return <FormattedMessage id="eto.modal.file-already-exists" />;
    case EtoDocumentsMessage.ETO_DOCUMENTS_FILE_UPLOAD_FAILED:
      return <FormattedMessage id="eto.modal.file-upload-failed" />;
    case EtoDocumentsMessage.ETO_DOCUMENTS_FAILED_TO_DOWNLOAD_FILE:
      return <FormattedMessage id="eto.modal.file-download-failed" />;
    case EtoDocumentsMessage.ETO_DOCUMENTS_FAILED_TO_ACCESS_ETO_FILES_DATA:
      return <FormattedMessage id="eto.modal.could-not-access-eto-files" />;
    case EtoDocumentsMessage.ETO_DOCUMENTS_CONFIRM_START_BOOKBUILDING:
      return <FormattedMessage id="eto.modal.confirm-start-bookbuilding-title" />;
    case EtoDocumentsMessage.ETO_DOCUMENTS_CONFIRM_STOP_BOOKBUILDING:
      return <FormattedMessage id="eto.modal.confirm-stop-bookbuilding-title" />;
    case EtoDocumentsMessage.ETO_DOCUMENTS_FAILED_TO_SEND_ETO_DATA:
      return <FormattedMessage id="eto.modal.failed-to-send-eto-data" />;
    case EtoDocumentsMessage.ETO_DOCUMENTS_FAILED_TO_GET_BOOKBUILDING_STATS:
      return <FormattedMessage id="eto.overview.error-notification.failed-to-bookbuilding-stats" />;
    case EtoDocumentsMessage.ETO_DOCUMENTS_SUBMIT_ETO_TITLE:
      return <FormattedMessage id="eto.modal.submit-title" />;
    case EtoDocumentsMessage.ETO_DOCUMENTS_SUBMIT_ETO_DESCRIPTION:
      return <FormattedMessage id="eto.modal.submit-description" />;
    case EtoDocumentsMessage.ETO_SUBMIT_SUCCESS:
      return <FormattedMessage id="eto.submit-success" />;

    case PublicEtosMessage.COULD_NOT_LOAD_ETO_PREVIEW:
      return <FormattedMessage id="eto.public-view.could-not-load-eto-preview" />;
    case PublicEtosMessage.COULD_NOT_LOAD_ETO:
      return <FormattedMessage id="eto.public-view.could-not-load-eto" />;

    case IpfsMessage.IPFS_FAILED_TO_DOWNLOAD_IPFS_FILE:
      return <FormattedMessage id="ipfs-failed-to-download-file" />;

    case FileUploadMessage.FILE_UPLOAD_ERROR:
      return <FormattedMessage id="form.single-file-upload-error" />;

    case RemoteFileMessage.GET_FILES_DETAILS_ERROR:
      return <FormattedMessage id="remote.file.details-error" />;

    case KycFlowMessage.KYC_PROBLEM_SAVING_DATA:
      return <FormattedMessage id="module.kyc.sagas.problem-saving-data" />;
    case KycFlowMessage.KYC_PROBLEM_SENDING_DATA:
      return <FormattedMessage id="module.kyc.sagas.problem-sending-data" />;
    case KycFlowMessage.KYC_UPLOAD_SUCCESSFUL:
      return <FormattedMessage id="module.kyc.sagas.successfully-uploaded" />;
    case KycFlowMessage.KYC_UPLOAD_FAILED:
      return <FormattedMessage id="module.kyc.sagas.problem-uploading" />;
    case KycFlowMessage.KYC_SUBMIT_FAILED:
      return <FormattedMessage id="module.kyc.sagas.problem.submitting" />;
    case KycFlowMessage.KYC_SUBMIT_TITLE:
      return <FormattedMessage id="kyc.modal.submit-title" />;
    case KycFlowMessage.KYC_SUBMIT_DESCRIPTION:
      return <FormattedMessage id="kyc.modal.submit-description" />;
    case KycFlowMessage.KYC_VERIFICATION_TITLE:
      return <FormattedMessage id="kyc.modal.verification.title" />;
    case KycFlowMessage.KYC_VERIFICATION_DESCRIPTION:
      return <FormattedMessage id="kyc.modal.verification.description" />;
    case KycFlowMessage.KYC_SETTINGS_BUTTON:
      return <FormattedMessage id="kyc.modal.verification.settings-button" />;
    case KycFlowMessage.KYC_ERROR:
      return <FormattedMessage id="module.kyc.sagas.error" />;
    case KycFlowMessage.KYC_BENEFICIAL_OWNERS:
      return <FormattedMessage id="module.kyc.sagas.beneficial-owners" />;
    case KycFlowMessage.KYC_PROBLEM_LOADING_BANK_DETAILS:
      return <FormattedMessage id="module.kyc.sagas.problem-loading-bank-details" />;

    case AuthMessage.AUTH_EMAIL_ALREADY_VERIFIED:
      return (
        <FormattedMessage id="modules.auth.sagas.verify-user-email-promise.email-already-verified" />
      );
    case AuthMessage.AUTH_EMAIL_VERIFIED:
      return <FormattedMessage id="modules.auth.sagas.verify-user-email-promise.email-verified" />;
    case AuthMessage.AUTH_EMAIL_ALREADY_EXISTS:
      return <FormattedMessage id="modules.auth.sagas.sign-in-user.email-already-exists" />;
    case AuthMessage.AUTH_EMAIL_VERIFICATION_FAILED:
      return (
        <FormattedMessage id="modules.auth.sagas.verify-user-email-promise.failed-email-verify" />
      );
    case AuthMessage.AUTH_TOC_ACCEPT_ERROR:
      return <FormattedMessage id="settings.modal.accept-tos.failure" />;
    case AuthMessage.AUTH_TOC_FILENAME:
      return "neufund_terms_of_use";

    case IcbmWalletMessage.ICBM_RESERVATION_AGREEMENT:
      //TODO We need a plain string here, but FormattedMessage doesn't work outside of components now.
      // Need to figure out how to do this.
      return "Amended ICBM Reservation Agreement"; //<FormattedMessage id="wallet.icbm.reservation-agreement" />;
    case IcbmWalletMessage.ICBM_FAILED_TO_DOWNLOAD_AGREEMENT:
      return <FormattedMessage id="wallet.icbm.failed-to-download-reservation-agreement" />;
    case IcbmWalletMessage.ICBM_COULD_NOT_FIND_ADDRESS:
      return <FormattedMessage id="wallet.icbm.wallet-not-found" />;
    case IcbmWalletMessage.ICBM_WALLET_AND_ICBM_ADDRESSES_ARE_THE_SAME:
      return <FormattedMessage id="wallet.icbm.wallet-and-icbm-addresses-are-the-same" />;
    case IcbmWalletMessage.ICBM_COULD_NOT_LOAD_WALLET_DATA:
      return <FormattedMessage id="wallet.icbm.error-loading-icbm-wallet-data" />;
    case IcbmWalletMessage.ICBM_ERROR_RUNNING_MIGRATION_TOOL:
      return <FormattedMessage id="wallet.icbm.error-running-migration-tool" />;

    case ProfileMessage.PROFILE_UPDATE_EMAIL_TITLE:
      return <FormattedMessage id="modules.settings.sagas.add-new-email.update-title" />;
    case ProfileMessage.PROFILE_ADD_EMAIL_TITLE:
      return <FormattedMessage id="modules.settings.sagas.add-new-email.add-title" />;
    case ProfileMessage.PROFILE_ADD_EMAIL_CONFIRM:
      return <FormattedMessage id="modules.settings.sagas.add-new-email.confirm-description" />;
    case ProfileMessage.PROFILE_NEW_EMAIL_ADDED:
      return <FormattedMessage id="modules.settings.sagas.add-new-email.new-email-added" />;
    case ProfileMessage.PROFILE_EMAIL_ALREADY_EXISTS:
      return <FormattedMessage id="modules.auth.sagas.sign-in-user.email-already-exists" />;
    case ProfileMessage.PROFILE_ADD_EMAIL_ERROR:
      return <FormattedMessage id="modules.settings.sagas.add-new-email.error" />;
    case ProfileMessage.PROFILE_RESEND_EMAIL_LINK_CONFIRMATION_TITLE:
      return <FormattedMessage id="modules.settings.sagas.resend-email.confirmation" />;
    case ProfileMessage.PROFILE_RESEND_EMAIL_LINK_CONFIRMATION_DESCRIPTION:
      return <FormattedMessage id="modules.settings.sagas.resend-email.confirmation-description" />;
    case ProfileMessage.PROFILE_EMAIL_VERIFICATION_SENT:
      return <FormattedMessage id="modules.settings.sagas.resend-email.sent" />;
    case ProfileMessage.PROFILE_EMAIL_VERIFICATION_SENDING_FAILED:
      return <FormattedMessage id="modules.settings.sagas.resend-email.failed" />;
    case ProfileMessage.PROFILE_ACCESS_RECOVERY_PHRASE_TITLE:
      return (
        <FormattedMessage id="modules.settings.sagas.load-seed-return-settings.access-recovery-phrase-title" />
      );
    case ProfileMessage.PROFILE_ACCESS_RECOVERY_PHRASE_DESCRIPTION:
      return (
        <FormattedMessage id="modules.settings.sagas.load-seed-return-settings.access-recovery-phrase-description" />
      );

    case Web3Message.WEB3_ERROR_BROWSER:
      return <FormattedMessage id="modules.web3.flows.web3-error.browser" />;
    case Web3Message.WEB3_ERROR_LEDGER:
      return <FormattedMessage id="modules.web3.flows.web3-error.ledger" />;

    // NEVER DO THIS!
    // THIS IS a misuse! It's only for tests, so that we don't bloat locales.json with test strings!
    case TestMessage.TEST_MESSAGE:
      return (messageData as any).message as TTranslatedString;
  }
};

export { getMessageTranslation };
