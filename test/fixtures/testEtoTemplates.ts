import {
  EEtoDocumentLanguage,
  EEtoDocumentType,
  TEtoDocumentTemplates,
  TEtoFormType,
} from "../../app/modules/eto-documents/interfaces";

export const etoTemplates: TEtoDocumentTemplates = {
  companyTokenHolderAgreement: {
    documentType: EEtoDocumentType.COMPANY_TOKEN_HOLDER_AGREEMENT,
    form: "template" as TEtoFormType,
    ipfsHash: "QmbKpkoqJsdf7yqh7bA4RXBS7hDMCFQPigeMuMQNude8cN",
    language: EEtoDocumentLanguage.EN,
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    name: "company_token_holder_agreement",
  },
  investmentAndShareholderAgreementTemplate: {
    documentType: EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT_TEMPLATE,
    form: "template" as TEtoFormType,
    ipfsHash: "QmRTdEqegYu3eh4qbzQsS16idRaNsdiSn4uGbbjERWWNKV",
    language: EEtoDocumentLanguage.EN,
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    name: "investment_and_shareholder_agreement_template",
  },
  prospectusTemplate: {
    documentType: EEtoDocumentType.PROSPECTUS_TEMPLATE,
    form: "template",
    ipfsHash: "QmQYWyx6WWwCYqBnJ74ruogTTHfKoscQRHU5eJFKDD22mT",
    language: EEtoDocumentLanguage.DE,
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    name: "prospectus_template_de",
  },
  reservationAndAcquisitionAgreement: {
    documentType: EEtoDocumentType.RESERVATION_AND_ACQUISITION_AGREEMENT,
    form: "template" as TEtoFormType,
    ipfsHash: "QmU33GZ1dhrW8u7qeZZfjTPBBnmYsF1ZqhoQRhSqhXqVBq",
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
};
