import {
  EEtoDocumentLanguage,
  EEtoDocumentType,
  IEtoFiles,
  TEtoFormType
} from "../../app/modules/eto-documents/interfaces";

export const etoFilesData: IEtoFiles = {
  allTemplates: {
    companyTokenHolderAgreement: {
      documentType: EEtoDocumentType.COMPANY_TOKEN_HOLDER_AGREEMENT,
      form: "template" as TEtoFormType,
      ipfsHash: "QmVEJvxmo4M5ugvfSQfKzejW8cvXsWe8261MpGChov7DQt",
      language: EEtoDocumentLanguage.EN,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      name: "company_token_holder_agreement",
    },
    investmentAndShareholderAgreementTemplate: {
      documentType: EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT_TEMPLATE,
      form: "template" as TEtoFormType,
      ipfsHash: "QmYEGp8hoYnBptD2UUAuDrsx2jMRkf8Evgc3d5J5ZK9xQY",
      language: EEtoDocumentLanguage.EN,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      name: "investment_and_shareholder_agreement_template",
    },
    investmentMemorandumTemplate: {
      documentType: EEtoDocumentType.INVESTMENT_MEMORANDUM_TEMPLATE,
      form: "template" as TEtoFormType,
      ipfsHash: "QmUx5R5BsbwWAymRqN7QcZDSCZU7Sqvv1rDB4dYjVt8BRu",
      language: EEtoDocumentLanguage.EN,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      name: "investment_memorandum_template",
    },
    pamphletTemplate: {
      documentType: EEtoDocumentType.PAMPHLET_TEMPLATE,
      form: "template" as TEtoFormType,
      ipfsHash: "QmUbU1jFuJdpArXuPPPQBde2vg3p6LPy6CPK3e3Rw5ACoC",
      language: EEtoDocumentLanguage.DE,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      name: "pamphlet_template_de",
    },
    prospectusTemplate: {
      documentType: EEtoDocumentType.PROSPECTUS_TEMPLATE,
      form: "template" as TEtoFormType,
      ipfsHash: "QmQYWyx6WWwCYqBnJ74ruogTTHfKoscQRHU5eJFKDD22mT",
      language: EEtoDocumentLanguage.DE,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      name: "prospectus_template_de",
    },
    reservationAndAcquisitionAgreement: {
      documentType: EEtoDocumentType.RESERVATION_AND_ACQUISITION_AGREEMENT,
      form: "template" as TEtoFormType,
      ipfsHash: "QmYNq3z1gLhooZpXhYvBUf9b99H4NAFS6NRTpYaHqdYAV5",
      language: EEtoDocumentLanguage.EN,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      name: "reservation_and_acquisition_agreement",
    },
    termsheetTemplate: {
      documentType: EEtoDocumentType.TERMSHEET_TEMPLATE,
      form: "template" as TEtoFormType,
      ipfsHash: "QmRLwyTw4ux84KnYvhejTsUggi2SeewGqASuh3DrURtyot",
      language: EEtoDocumentLanguage.EN,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      name: "termsheet_template",
    },
  },
  stateInfo: {
    canDeleteInStates: {
      listed: [EEtoDocumentType.APPROVED_INVESTOR_OFFERING_DOCUMENT],
      onChain: [EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT],
      pending: [EEtoDocumentType.SIGNED_TERMSHEET],
      preview: [EEtoDocumentType.SIGNED_TERMSHEET],
      prospectusApproved: [],
    },
    canUploadInStates: {
      listed: [EEtoDocumentType.APPROVED_INVESTOR_OFFERING_DOCUMENT],
      onChain: [EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT],
      pending: [EEtoDocumentType.SIGNED_TERMSHEET],
      preview: [EEtoDocumentType.SIGNED_TERMSHEET],
      prospectusApproved: [],
    },
    uploadableDocuments: [
      "signed_termsheet",
      "approved_investor_offering_document",
      "investment_and_shareholder_agreement",
    ] as EEtoDocumentType[],
    requiredTemplates: [],
  },
};
