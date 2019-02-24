import { BigNumber } from "bignumber.js";
import { EEtoDocumentLanguage, EEtoDocumentType } from "../../app/modules/eto-documents/interfaces";
import { EEtoState } from "../../app/modules/eto-flow/interfaces/interfaces";
import { TBlEtoWithCompanyAndContract } from "../../app/modules/public-etos/interfaces/interfaces";
import { etoDocuments } from "./fixtures";
import { testCompanyBl } from "./testCompanyBl";

export const testEtoBl: TBlEtoWithCompanyAndContract = {
  additionalTerms: undefined,
  authorizedCapitalShares: new BigNumber("0"),
  newSharesToIssueInFixedSlots: new BigNumber("10"),
  allowRetailInvestors: true,
  canEnableBookbuilding: false,
  companyId: "0xC8f867Cf4Ed30b4fF0Aa4c4c8c6b684397B219B0",
  currencies: ["eth", "eur_t"],
  discountScheme: "40%",
  documents: etoDocuments,
  enableTransferOnSuccess: false,
  equityTokenImage:
    "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/a03810cf-7e99-4264-8a94-24303dce4e3b.png",
  equityTokenName: "Quintessence",
  equityTokenSymbol: "QTT",
  equityTokensPerShare: new BigNumber(10000),
  etoId: "0xfaDa8f267C054f469b52Ccbeb08250ACAAeE65dc",
  existingCompanyShares: new BigNumber(40976),
  fixedSlotsMaximumDiscountFraction: new BigNumber(0.5),
  generalVotingRule: "positive",
  isBookbuilding: false,
  liquidationPreferenceMultiplier: new BigNumber(0.5),
  maxPledges: new BigNumber(500),
  maxTicketEur: new BigNumber(10000000),
  minTicketEur: new BigNumber(100),
  minimumNewSharesToIssue: new BigNumber(1000),
  newSharesToIssue: new BigNumber(3452),
  newSharesToIssueInWhitelist: new BigNumber(1534),
  nominee: "0xCB6470fa4b5D56C8f494e7c1CE56B28c548931a6",
  notUnderCrowdfundingRegulations: true,
  preMoneyValuationEur: new BigNumber(132664672.0464),
  previewCode: "deabb8a4-d081-4d15-87a7-737a09e6a87c",
  prospectusLanguage: "de",
  publicDiscountFraction: new BigNumber(0),
  publicDurationDays: 14,
  shareNominalValueEur: new BigNumber(1),
  signingDurationDays: 14,
  startDate: "2018-11-16T05:03:56+00:00",
  state: "on_chain" as EEtoState,
  templates: {
    companyTokenHolderAgreement: {
      documentType: "company_token_holder_agreement" as EEtoDocumentType,
      form: "template",
      ipfsHash: "QmPKDB129q8AxxtTiX5eh9MPF6K1da5sHfqMv1a788BbuM",
      language: EEtoDocumentLanguage.EN,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      name: "company_token_holder_agreement",
    },
    investmentAndShareholderAgreementTemplate: {
      documentType: "investment_and_shareholder_agreement_template" as EEtoDocumentType,
      form: "template",
      ipfsHash: "QmUktiTT9ap8UuMUMZNmgrz7fabHMkrosycuTPUtX3rydQ",
      language: EEtoDocumentLanguage.EN,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      name: "investment_and_shareholder_agreement_template",
    },
    prospectusTemplate: {
      documentType: "prospectus_template" as EEtoDocumentType,
      form: "template",
      ipfsHash: "QmQYWyx6WWwCYqBnJ74ruogTTHfKoscQRHU5eJFKDD22mT",
      language: EEtoDocumentLanguage.DE,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      name: "prospectus_template_de",
    },
    reservationAndAcquisitionAgreement: {
      documentType: "reservation_and_acquisition_agreement" as EEtoDocumentType,
      form: "template",
      ipfsHash: "QmekA9D4pa5Tsmd2krzUFFREGAduDDkbpNyoin4wX7aaob",
      language: EEtoDocumentLanguage.EN,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      name: "reservation_and_acquisition_agreement",
    },
    termsheetTemplate: {
      documentType: "termsheet_template" as EEtoDocumentType,
      form: "template",
      ipfsHash: "QmRLwyTw4ux84KnYvhejTsUggi2SeewGqASuh3DrURtyot",
      language: EEtoDocumentLanguage.EN,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      name: "termsheet_template",
    },
  },

  whitelistDiscountFraction: new BigNumber(0.3),
  whitelistDurationDays: 7,
  company: testCompanyBl,
  contract: {
    timedState: 3,
    totalInvestment: {
      totalEquivEurUlps: new BigNumber("3.240447910281246044e+24"),
      totalTokensInt: new BigNumber("10010705"),
      totalInvestors: new BigNumber("3"),
      euroTokenBalance: new BigNumber("3.2374649e+24"),
      etherTokenBalance: new BigNumber("5432420000000000000"),
    },
    startOfStates: {
      0: undefined,
      1: new Date("2018-11-16T05:03:56.000Z"),
      2: new Date("2018-11-23T05:03:56.000Z"),
      3: new Date("2018-12-07T05:03:56.000Z"),
      4: new Date("2018-12-21T05:03:56.000Z"),
      5: new Date("2018-12-31T05:03:56.000Z"),
      6: undefined,
    },
    etoCommitmentAddress: "0x234234234234",
    equityTokenAddress: "0xbAb1B125ba8b4A3161b7543a4cAA38De7f9c9b2D",
    etoTermsAddress: "0x948f07847e19E7dBb98DdfFdCA4b2eDF71f3E3B5",
  },
};
