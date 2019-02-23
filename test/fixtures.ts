import { BigNumber } from "bignumber.js";
import { createStore, Store } from "redux";

import { IConfig } from "../app/config/getConfig";
import {
  EEtoDocumentLanguage,
  EEtoDocumentType,
  IEtoFiles,
  TEtoDocumentTemplates,
  TEtoFormType,
} from "../app/modules/eto-documents/interfaces";
import {
  IApiCompanyEtoData,
  IBlCompanyEtoData,
  IStateCompanyEtoData
} from "../app/modules/eto-flow/interfaces/CompanyEtoData";
import { EEtoState } from "../app/modules/eto-flow/interfaces/interfaces";
import {
  EETOStateOnChain,
  TApiEtoWithCompanyAndContract,
  TBlEtoWithCompanyAndContract,
  TStateEtoWithCompanyAndContract
} from "../app/modules/public-etos/interfaces/interfaces";
import {EthereumAddress, EthereumAddressWithChecksum, EthereumNetworkId, NumericString} from "../app/types";

export const dummyConfig: IConfig = {
  ethereumNetwork: {
    rpcUrl: "https://localhost:8080",
  },
  contractsAddresses: {
    universeContractAddress: "UNIVERSE_ADDRESS",
  },
  bankTransferDetails: {
    recipient: "Fifth Force GmbH",
    iban: "DE1250094039446384529400565",
    bic: "TLXXXXXXXXX",
  },
};

export const dummyNetworkId: EthereumNetworkId = "5" as EthereumNetworkId;

export function createDummyStore(): Store<any> {
  return createStore(() => {});
}

export const dummyEthereumAddress = "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359" as EthereumAddress;
export const dummyEthereumAddressWithChecksum = "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359" as EthereumAddressWithChecksum;

export const testCompanyApi: IApiCompanyEtoData = {
  businessModel: "sample text",
  companyBanner: "sample text",
  companyMission: "sample text",
  companyStage: "sample text",
  customerGroup: "sample text",
  inspiration: "sample text",
  keyBenefitsForInvestors: "sample text",
  keyCompetitors: "sample text",
  keyQuoteInvestor: "sample text",
  marketTraction: "sample text",
  marketingApproach: "sample text",
  problemSolved: "sample text",
  riskBusinessModelDescription: "sample text",
  riskLiquidityDescription: "sample text",
  riskMaxDescription: "sample text",
  riskThirdPartyDescription: "sample text",
  riskThirdPartySharesFinancing: "sample text",
  roadmap: "sample text",
  targetMarketAndIndustry: "sample text",
  useOfCapital: "sample text",
  advisors: {
    members: [
      {
        description:
          "André Eggert is a partner at LACORE. He advises companies and entrepreneurs as well as investors. One of his core activities is the support of M&A and financing transactions.",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/9859a896-513d-42bd-a17b-2b020b7e5c1f.jpg",
        name: "André Eggert",
        role: "Legal Architect",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
        ],
      },
    ],
  },
  boardMembers: {
    members: [
      {
        description: "",
        image: "",
        name: "",
        role: "",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
        ],
      },
    ],
  },
  brandName: "Neufund",
  categories: ["Technology", "Blockchain", "Fintech"],
  companyDescription:
    "Blockchain based equity fundraising platform, ecosystem of smart contracts operating on the Ethereum blockchain. The Company’s key expertise lies in legal-tech and reg-tech. Neufund is a Blockchain protocol for securities’ tokenization and issuance.",
  companyId: "0xC8f867Cf4Ed30b4fF0Aa4c4c8c6b684397B219B0",
  companyLogo:
    "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/ccaf9ab7-fae1-41df-aa72-cf931abd5931.png",
  companyNews: [
    {
      publication: "Econotimes",
      title:
        "Neufund joins Malta Stock-Exchange and Binance to build blockchain-based exchange for equity tokens",
      url:
        "https://www.econotimes.com/Neufund-joins-Malta-Stock-Exchange-and-Binance-to-build-blockchain-based-exchange-for-equity-tokens-1405589",
    },
    {
      publication: "Neufund",
      title: "ETO with Neufund",
      url: "https://neufund.org/cms_resources/fundraising-process-with-neufund.pdf%C2%A0",
    },
  ],
  companyOneliner: "Equity Fundraising on Blockchain",
  companyShares: 40859,
  companySlideshare: {
    title: "",
    url: "",
  },
  companyVideo: {
    title: "",
    url: "https://www.youtube.com/watch?v=M0Hhl27TPR4",
  },
  disableTwitterFeed: true,
  companyWebsite: "https://neufund.org",
  country: "DE",
  foundingDate: "2016-08-18",
  //jurisdiction: "DE",
  keyAlliances: {
    members: [
      {
        description: "",
        image: "",
        name: "",
        role: "",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
        ],
      },
    ],
  },
  keyCustomers: {
    members: [
      {
        description: "",
        image: "",
        name: "",
        role: "",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
        ],
      },
    ],
  },
  lastFundingSizeEur: 8000000,
  keyQuoteFounder:
    "'Neufunds ETOs are changing the space by offering direct, transparent and, most importantly, legally binding investment rounds on the blockchain, which is an attractive proposition to both companies and investors. - Frank Thelen, Freigeist VC'",
  legalForm: "Company Legal Form",
  marketingLinks: [
    {
      title: "Pitch Deck",
      url:
        "https://docs.google.com/presentation/d/14mRlEDSNAMWybfgYFJUJyE8oEps0VJPIoaYfmmpZTmw/edit#slide=id.g3e534cab92_0_70",
    },
  ],
  name: "Company Name ISSUER_SIGNING",
  notableInvestors: {
    members: [
      {
        description:
          "Frank Thelen is a European serial founder, tech investor and TV personality. As the Founder & CEO of Venture capitalist Freigeist Capital, he focuses on seed investments like Lilium Aviation, Wunderlist, myTaxi, kaufDA and Little Lunch.",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/7c1886da-75cb-47cd-a870-bd3b0cd2f28e.jpg",
        name: "Frank Thelen",
        role: "CEO at Freigeist Capital",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "https://medium.com/@frank_thelen",
          },
          {
            type: "twitter",
            url: "https://twitter.com/frank_thelen",
          },
          {
            type: "linkedin",
            url: "https://www.linkedin.com/in/frank-thelen/",
          },
        ],
      },
    ],
  },
  numberOfEmployees: "10-99",
  numberOfFounders: 2,
  partners: {
    members: [
      {
        description:
          "Binance is a blockchain ecosystem comprised of Exchange, Labs, Launchpad, Info and Charity Foundation. Binance Exchange is one of the fastest growing and most popular cryptocurrency exchanges in the world.",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/3ed7489d-399f-46c7-a038-e423b7a94244.png",
        name: "Binance",
        role: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "https://twitter.com/binance",
          },
          {
            type: "linkedin",
            url: "",
          },
        ],
        website: "https://www.binance.com/",
      },
      {
        description:
          "The Malta Stock Exchange became a reality upon enactment of the Malta Stock Exchange Act in 1990, and commenced its trading operations on 8 January 1992.",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/3405980f-3bcd-48d6-aeb7-ae9cc272b984.jpg",
        name: "Malta Stock Exchange",
        role: "",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "https://twitter.com/MaltaStockExch",
          },
          {
            type: "linkedin",
            url: "",
          },
        ],
      },
    ],
  },
  productVision:
    "Neufund is a blockchain based equity fundraising platform, an ecosystem of smart contracts operating on the Ethereum blockchain. The Company’s key expertise lies in legal-tech and reg-tech. At its technological core, Neufund is a Blockchain protocol for securities’ tokenization and issuance - it allows for any type of security or financial product to be issued as a token on a Blockchain, and Equity Tokens are just one of many types.",
  registrationNumber: "1234",
  riskNoLoansExist: true,
  riskNoThirdPartyDependency: true,
  riskNotRegulatedBusiness: true,
  // schemaVersion: 1,
  sellingProposition:
    "Neufund’s Equity Token Offering (ETO) is a novel way of fundraising, which allows any kind of company (blockchain-based or not) to issue equity tokens on a Blockchain, in a public or private placement. An ETO is a hybrid investment model combining advantages of an IPO, an ICO, and a VC round. Typically it is accompanied by a campaign or a roadshow which informs investors about the offering. Thus, an ETO is an ideal way to build a clients’ ecosystem around the company or a product.",
  shareholders: [
    {
      fullName: "Miau Capital GmbH",
      shares: 14000,
    },
    {
      fullName: "Rudolfix Software Insights UG",
      shares: 14000,
    },
    {
      fullName: "Triotor Beteiligungs GmbH",
      shares: 2000,
    },
    {
      fullName: "Atlantic Labs",
      shares: 5000,
    },
    {
      fullName: "Freigeist Capital I",
      shares: 5500,
    },
  ],
  socialChannels: [
    {
      type: "twitter",
      url: "https://twitter.com/neufundorg",
    },
    {
      type: "facebook",
      url: "https://www.facebook.com/neufundorg/",
    },
    {
      type: "linkedin",
      url: "https://www.linkedin.com/company/neufund/",
    },
    {
      type: "slack",
      url: "",
    },
    {
      type: "medium",
      url: "https://blog.neufund.org",
    },
    {
      type: "reddit",
      url: "https://www.reddit.com/r/neufund",
    },
    {
      type: "telegram",
      url: "https://t.me/neufund",
    },
    {
      type: "github",
      url: "https://github.com/Neufund/",
    },
    {
      type: "instagram",
      url: "",
    },
    {
      type: "gplus",
      url: "",
    },
    {
      type: "youtube",
      url: "",
    },
    {
      type: "xing",
      url: "",
    },
    {
      type: "bitcointalk",
      url: "",
    },
  ],
  street: "Cuvrystr 6",
  team: {
    members: [
      {
        description:
          "Being a Blockchain regulatory & security tokens experts Zoe actively advises to German and Maltese governments on DLT frameworks. Former Co-founder and CEO at Xyologic Mobile Analysis GmbH. Occasional angel investor. Mentor at Gaza Sky Geeks.",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/11b3ec40-5bef-46fd-8e0a-b18e68a0a0fc.jpg",
        name: "Zoe Adamovicz",
        role: "CEO & Co-Founder",
        socialChannels: [
          {
            type: "medium",
            url: "https://medium.com/@ZoeAdamovicz",
          },
          {
            type: "twitter",
            url: "https://twitter.com/zoeadamovicz",
          },
          {
            type: "linkedin",
            url: "https://www.linkedin.com/in/zoeadamovicz/",
          },
        ],
        website: "https://technologiaizycie.pl/",
      },
      {
        description:
          "Serial CTO and founder. Co-founder and CTO at Xyologic Mobile Analysis GmbH (exit: Digital Turbine Inc.), Head of Group Technology at Digital Turbine. Experienced in tech, from coding in assembly to managing tech teams in companies such as H&P.",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/c520447a-90d8-490f-af27-16625f380b07.jpg",
        name: "Marcin Rudolf",
        role: "CTO & Co-Founder",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "https://medium.com/@rudolfix",
          },
          {
            type: "twitter",
            url: "https://twitter.com/rudolfix",
          },
          {
            type: "linkedin",
            url: "https://www.linkedin.com/in/marcinrudolf/",
          },
        ],
      },
      {
        description: "",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/64f2b86f-1daf-45c3-9168-b0271a6d19c0.jpg",
        name: "Agnieszka Sarnecka",
        role: "VP Ventures",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
          {
            type: "slack",
            url: "",
          },
          {
            type: "medium",
            url: "https://blog.neufund.org",
          },
          {
            type: "reddit",
            url: "https://www.reddit.com/r/neufund",
          },
          {
            type: "telegram",
            url: "https://t.me/neufund",
          },
          {
            type: "github",
            url: "https://github.com/Neufund/",
          },
          {
            type: "instagram",
            url: "",
          },
          {
            type: "gplus",
            url: "",
          },
          {
            type: "youtube",
            url: "",
          },
          {
            type: "xing",
            url: "",
          },
          {
            type: "bitcointalk",
            url: "",
          },
        ],
      },
      {
        description: "",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/2f99640f-3a3f-4f31-85fc-a11ee2dbe084.jpg",
        name: "Sergiej Rewiakin",
        role: "VP Engineering",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
          {
            type: "slack",
            url: "",
          },
          {
            type: "medium",
            url: "https://blog.neufund.org",
          },
          {
            type: "reddit",
            url: "https://www.reddit.com/r/neufund",
          },
          {
            type: "telegram",
            url: "https://t.me/neufund",
          },
          {
            type: "github",
            url: "https://github.com/Neufund/",
          },
          {
            type: "instagram",
            url: "",
          },
          {
            type: "gplus",
            url: "",
          },
          {
            type: "youtube",
            url: "",
          },
          {
            type: "xing",
            url: "",
          },
          {
            type: "bitcointalk",
            url: "",
          },
        ],
        website: "http://sergiej.com",
      },
      {
        description: "",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/301abd44-1775-4991-b616-536069408fe1.jpg",
        name: "Piotr Panorski",
        role: "VP Trading",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
          {
            type: "slack",
            url: "",
          },
          {
            type: "medium",
            url: "https://blog.neufund.org",
          },
          {
            type: "reddit",
            url: "https://www.reddit.com/r/neufund",
          },
          {
            type: "telegram",
            url: "https://t.me/neufund",
          },
          {
            type: "github",
            url: "https://github.com/Neufund/",
          },
          {
            type: "instagram",
            url: "",
          },
          {
            type: "gplus",
            url: "",
          },
          {
            type: "youtube",
            url: "",
          },
          {
            type: "xing",
            url: "",
          },
          {
            type: "bitcointalk",
            url: "",
          },
        ],
      },
      {
        description: "",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/8fea024d-97e0-4878-bcbf-3d6538aac924.jpg",
        name: "Ula Lachowicz",
        role: "VP Marketing",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
          {
            type: "slack",
            url: "",
          },
          {
            type: "medium",
            url: "https://blog.neufund.org",
          },
          {
            type: "reddit",
            url: "https://www.reddit.com/r/neufund",
          },
          {
            type: "telegram",
            url: "https://t.me/neufund",
          },
          {
            type: "github",
            url: "https://github.com/Neufund/",
          },
          {
            type: "instagram",
            url: "",
          },
          {
            type: "gplus",
            url: "",
          },
          {
            type: "youtube",
            url: "",
          },
          {
            type: "xing",
            url: "",
          },
          {
            type: "bitcointalk",
            url: "",
          },
        ],
      },
    ],
  },
  useOfCapitalList: [
    {
      description: "Development",
      percent: 0.4,
    },
    {
      description: "Legal",
      percent: 0.3,
    },
    {
      description: "Marketing",
      percent: 0.2,
    },
    {
      description: "Operations",
      percent: 0.1,
    },
  ],
  vatNumber: "18.08.2016",
  //zipCode: "12345",
};

export const testCompanyBl: IBlCompanyEtoData = {
  businessModel: "bla",
  companyBanner: "bla",
  companyMission: "sample text",
  companyStage: "sample text",
  customerGroup: "sample text",
  inspiration: "sample text",
  keyBenefitsForInvestors: "sample text",
  keyCompetitors: "sample text",
  keyQuoteInvestor: "sample text",
  marketTraction: "sample text",
  marketingApproach: "sample text",
  problemSolved: "sample text",
  riskBusinessModelDescription: "sample text",
  riskLiquidityDescription: "sample text",
  riskMaxDescription: "sample text",
  riskThirdPartyDescription: "sample text",
  riskThirdPartySharesFinancing: "sample text",
  roadmap: "sample text",
  targetMarketAndIndustry: "sample text",
  useOfCapital: "sample text",
  advisors: {
    members: [
      {
        description:
          "André Eggert is a partner at LACORE. He advises companies and entrepreneurs as well as investors. One of his core activities is the support of M&A and financing transactions.",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/9859a896-513d-42bd-a17b-2b020b7e5c1f.jpg",
        name: "André Eggert",
        role: "Legal Architect",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
        ],
      },
    ],
  },
  boardMembers: {
    members: [
      {
        description: "",
        image: "",
        name: "",
        role: "",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
        ],
      },
    ],
  },
  brandName: "Neufund",
  categories: ["Technology", "Blockchain", "Fintech"],
  companyDescription:
    "Blockchain based equity fundraising platform, ecosystem of smart contracts operating on the Ethereum blockchain. The Company’s key expertise lies in legal-tech and reg-tech. Neufund is a Blockchain protocol for securities’ tokenization and issuance.",
  companyId: "0xC8f867Cf4Ed30b4fF0Aa4c4c8c6b684397B219B0",
  companyLogo:
    "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/ccaf9ab7-fae1-41df-aa72-cf931abd5931.png",
  companyNews: [
    {
      publication: "Econotimes",
      title:
        "Neufund joins Malta Stock-Exchange and Binance to build blockchain-based exchange for equity tokens",
      url:
        "https://www.econotimes.com/Neufund-joins-Malta-Stock-Exchange-and-Binance-to-build-blockchain-based-exchange-for-equity-tokens-1405589",
    },
    {
      publication: "Neufund",
      title: "ETO with Neufund",
      url: "https://neufund.org/cms_resources/fundraising-process-with-neufund.pdf%C2%A0",
    },
  ],
  companyOneliner: "Equity Fundraising on Blockchain",
  companyShares: new BigNumber(40859),
  companySlideshare: {
    title: "",
    url: "",
  },
  companyVideo: {
    title: "",
    url: "https://www.youtube.com/watch?v=M0Hhl27TPR4",
  },
  disableTwitterFeed: true,
  companyWebsite: "https://neufund.org",
  country: "DE",
  foundingDate: "2016-08-18",
  //jurisdiction: "DE",
  keyAlliances: {
    members: [
      {
        description: "",
        image: "",
        name: "",
        role: "",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
        ],
      },
    ],
  },
  keyCustomers: {
    members: [
      {
        description: "",
        image: "",
        name: "",
        role: "",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
        ],
      },
    ],
  },
  lastFundingSizeEur: new BigNumber(8000000),
  keyQuoteFounder:
    "'Neufunds ETOs are changing the space by offering direct, transparent and, most importantly, legally binding investment rounds on the blockchain, which is an attractive proposition to both companies and investors. - Frank Thelen, Freigeist VC'",
  legalForm: "Company Legal Form",
  marketingLinks: [
    {
      title: "Pitch Deck",
      url:
        "https://docs.google.com/presentation/d/14mRlEDSNAMWybfgYFJUJyE8oEps0VJPIoaYfmmpZTmw/edit#slide=id.g3e534cab92_0_70",
    },
  ],
  name: "Company Name ISSUER_SIGNING",
  notableInvestors: {
    members: [
      {
        description:
          "Frank Thelen is a European serial founder, tech investor and TV personality. As the Founder & CEO of Venture capitalist Freigeist Capital, he focuses on seed investments like Lilium Aviation, Wunderlist, myTaxi, kaufDA and Little Lunch.",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/7c1886da-75cb-47cd-a870-bd3b0cd2f28e.jpg",
        name: "Frank Thelen",
        role: "CEO at Freigeist Capital",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "https://medium.com/@frank_thelen",
          },
          {
            type: "twitter",
            url: "https://twitter.com/frank_thelen",
          },
          {
            type: "linkedin",
            url: "https://www.linkedin.com/in/frank-thelen/",
          },
        ],
      },
    ],
  },
  numberOfEmployees: "10-99",
  numberOfFounders: 2,
  partners: {
    members: [
      {
        description:
          "Binance is a blockchain ecosystem comprised of Exchange, Labs, Launchpad, Info and Charity Foundation. Binance Exchange is one of the fastest growing and most popular cryptocurrency exchanges in the world.",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/3ed7489d-399f-46c7-a038-e423b7a94244.png",
        name: "Binance",
        role: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "https://twitter.com/binance",
          },
          {
            type: "linkedin",
            url: "",
          },
        ],
        website: "https://www.binance.com/",
      },
      {
        description:
          "The Malta Stock Exchange became a reality upon enactment of the Malta Stock Exchange Act in 1990, and commenced its trading operations on 8 January 1992.",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/3405980f-3bcd-48d6-aeb7-ae9cc272b984.jpg",
        name: "Malta Stock Exchange",
        role: "",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "https://twitter.com/MaltaStockExch",
          },
          {
            type: "linkedin",
            url: "",
          },
        ],
      },
    ],
  },
  productVision:
    "Neufund is a blockchain based equity fundraising platform, an ecosystem of smart contracts operating on the Ethereum blockchain. The Company’s key expertise lies in legal-tech and reg-tech. At its technological core, Neufund is a Blockchain protocol for securities’ tokenization and issuance - it allows for any type of security or financial product to be issued as a token on a Blockchain, and Equity Tokens are just one of many types.",
  registrationNumber: "1234",
  riskNoLoansExist: true,
  riskNoThirdPartyDependency: true,
  riskNotRegulatedBusiness: true,
  // schemaVersion: 1,
  sellingProposition:
    "Neufund’s Equity Token Offering (ETO) is a novel way of fundraising, which allows any kind of company (blockchain-based or not) to issue equity tokens on a Blockchain, in a public or private placement. An ETO is a hybrid investment model combining advantages of an IPO, an ICO, and a VC round. Typically it is accompanied by a campaign or a roadshow which informs investors about the offering. Thus, an ETO is an ideal way to build a clients’ ecosystem around the company or a product.",
  shareholders: [
    {
      fullName: "Miau Capital GmbH",
      shares: new BigNumber(14000),
    },
    {
      fullName: "Rudolfix Software Insights UG",
      shares: new BigNumber(14000),
    },
    {
      fullName: "Triotor Beteiligungs GmbH",
      shares: new BigNumber(2000),
    },
    {
      fullName: "Atlantic Labs",
      shares: new BigNumber(5000),
    },
    {
      fullName: "Freigeist Capital I",
      shares: new BigNumber(5500),
    },
  ],
  socialChannels: [
    {
      type: "twitter",
      url: "https://twitter.com/neufundorg",
    },
    {
      type: "facebook",
      url: "https://www.facebook.com/neufundorg/",
    },
    {
      type: "linkedin",
      url: "https://www.linkedin.com/company/neufund/",
    },
    {
      type: "slack",
      url: "",
    },
    {
      type: "medium",
      url: "https://blog.neufund.org",
    },
    {
      type: "reddit",
      url: "https://www.reddit.com/r/neufund",
    },
    {
      type: "telegram",
      url: "https://t.me/neufund",
    },
    {
      type: "github",
      url: "https://github.com/Neufund/",
    },
    {
      type: "instagram",
      url: "",
    },
    {
      type: "gplus",
      url: "",
    },
    {
      type: "youtube",
      url: "",
    },
    {
      type: "xing",
      url: "",
    },
    {
      type: "bitcointalk",
      url: "",
    },
  ],
  street: "Cuvrystr 6",
  team: {
    members: [
      {
        description:
          "Being a Blockchain regulatory & security tokens experts Zoe actively advises to German and Maltese governments on DLT frameworks. Former Co-founder and CEO at Xyologic Mobile Analysis GmbH. Occasional angel investor. Mentor at Gaza Sky Geeks.",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/11b3ec40-5bef-46fd-8e0a-b18e68a0a0fc.jpg",
        name: "Zoe Adamovicz",
        role: "CEO & Co-Founder",
        socialChannels: [
          {
            type: "medium",
            url: "https://medium.com/@ZoeAdamovicz",
          },
          {
            type: "twitter",
            url: "https://twitter.com/zoeadamovicz",
          },
          {
            type: "linkedin",
            url: "https://www.linkedin.com/in/zoeadamovicz/",
          },
        ],
        website: "https://technologiaizycie.pl/",
      },
      {
        description:
          "Serial CTO and founder. Co-founder and CTO at Xyologic Mobile Analysis GmbH (exit: Digital Turbine Inc.), Head of Group Technology at Digital Turbine. Experienced in tech, from coding in assembly to managing tech teams in companies such as H&P.",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/c520447a-90d8-490f-af27-16625f380b07.jpg",
        name: "Marcin Rudolf",
        role: "CTO & Co-Founder",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "https://medium.com/@rudolfix",
          },
          {
            type: "twitter",
            url: "https://twitter.com/rudolfix",
          },
          {
            type: "linkedin",
            url: "https://www.linkedin.com/in/marcinrudolf/",
          },
        ],
      },
      {
        description: "",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/64f2b86f-1daf-45c3-9168-b0271a6d19c0.jpg",
        name: "Agnieszka Sarnecka",
        role: "VP Ventures",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
          {
            type: "slack",
            url: "",
          },
          {
            type: "medium",
            url: "https://blog.neufund.org",
          },
          {
            type: "reddit",
            url: "https://www.reddit.com/r/neufund",
          },
          {
            type: "telegram",
            url: "https://t.me/neufund",
          },
          {
            type: "github",
            url: "https://github.com/Neufund/",
          },
          {
            type: "instagram",
            url: "",
          },
          {
            type: "gplus",
            url: "",
          },
          {
            type: "youtube",
            url: "",
          },
          {
            type: "xing",
            url: "",
          },
          {
            type: "bitcointalk",
            url: "",
          },
        ],
      },
      {
        description: "",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/2f99640f-3a3f-4f31-85fc-a11ee2dbe084.jpg",
        name: "Sergiej Rewiakin",
        role: "VP Engineering",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
          {
            type: "slack",
            url: "",
          },
          {
            type: "medium",
            url: "https://blog.neufund.org",
          },
          {
            type: "reddit",
            url: "https://www.reddit.com/r/neufund",
          },
          {
            type: "telegram",
            url: "https://t.me/neufund",
          },
          {
            type: "github",
            url: "https://github.com/Neufund/",
          },
          {
            type: "instagram",
            url: "",
          },
          {
            type: "gplus",
            url: "",
          },
          {
            type: "youtube",
            url: "",
          },
          {
            type: "xing",
            url: "",
          },
          {
            type: "bitcointalk",
            url: "",
          },
        ],
        website: "http://sergiej.com",
      },
      {
        description: "",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/301abd44-1775-4991-b616-536069408fe1.jpg",
        name: "Piotr Panorski",
        role: "VP Trading",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
          {
            type: "slack",
            url: "",
          },
          {
            type: "medium",
            url: "https://blog.neufund.org",
          },
          {
            type: "reddit",
            url: "https://www.reddit.com/r/neufund",
          },
          {
            type: "telegram",
            url: "https://t.me/neufund",
          },
          {
            type: "github",
            url: "https://github.com/Neufund/",
          },
          {
            type: "instagram",
            url: "",
          },
          {
            type: "gplus",
            url: "",
          },
          {
            type: "youtube",
            url: "",
          },
          {
            type: "xing",
            url: "",
          },
          {
            type: "bitcointalk",
            url: "",
          },
        ],
      },
      {
        description: "",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/8fea024d-97e0-4878-bcbf-3d6538aac924.jpg",
        name: "Ula Lachowicz",
        role: "VP Marketing",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
          {
            type: "slack",
            url: "",
          },
          {
            type: "medium",
            url: "https://blog.neufund.org",
          },
          {
            type: "reddit",
            url: "https://www.reddit.com/r/neufund",
          },
          {
            type: "telegram",
            url: "https://t.me/neufund",
          },
          {
            type: "github",
            url: "https://github.com/Neufund/",
          },
          {
            type: "instagram",
            url: "",
          },
          {
            type: "gplus",
            url: "",
          },
          {
            type: "youtube",
            url: "",
          },
          {
            type: "xing",
            url: "",
          },
          {
            type: "bitcointalk",
            url: "",
          },
        ],
      },
    ],
  },
  useOfCapitalList: [
    {
      description: "Development",
      percent: new BigNumber(0.4),
    },
    {
      description: "Legal",
      percent: new BigNumber(0.3),
    },
    {
      description: "Marketing",
      percent: new BigNumber(0.2),
    },
    {
      description: "Operations",
      percent: new BigNumber(0.1),
    },
  ],
  vatNumber: "18.08.2016",
  //zipCode: "12345",
};

export const testCompanyState: IStateCompanyEtoData = {
  businessModel: "sample text",
  companyBanner: "sample text",
  companyMission: "sample text",
  companyStage: "sample text",
  customerGroup: "sample text",
  inspiration: "sample text",
  keyBenefitsForInvestors: "sample text",
  keyCompetitors: "sample text",
  keyQuoteInvestor: "sample text",
  marketTraction: "sample text",
  marketingApproach: "sample text",
  problemSolved: "sample text",
  riskBusinessModelDescription: "sample text",
  riskLiquidityDescription: "sample text",
  riskMaxDescription: "sample text",
  riskThirdPartyDescription: "sample text",
  riskThirdPartySharesFinancing: "sample text",
  roadmap: "sample text",
  targetMarketAndIndustry: "sample text",
  useOfCapital: "sample text",
  advisors: {
    members: [
      {
        description:
          "André Eggert is a partner at LACORE. He advises companies and entrepreneurs as well as investors. One of his core activities is the support of M&A and financing transactions.",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/9859a896-513d-42bd-a17b-2b020b7e5c1f.jpg",
        name: "André Eggert",
        role: "Legal Architect",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
        ],
      },
    ],
  },
  boardMembers: {
    members: [
      {
        description: "",
        image: "",
        name: "",
        role: "",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
        ],
      },
    ],
  },
  brandName: "Neufund",
  categories: ["Technology", "Blockchain", "Fintech"],
  companyDescription:
    "Blockchain based equity fundraising platform, ecosystem of smart contracts operating on the Ethereum blockchain. The Company’s key expertise lies in legal-tech and reg-tech. Neufund is a Blockchain protocol for securities’ tokenization and issuance.",
  companyId: "0xC8f867Cf4Ed30b4fF0Aa4c4c8c6b684397B219B0",
  companyLogo:
    "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/ccaf9ab7-fae1-41df-aa72-cf931abd5931.png",
  companyNews: [
    {
      publication: "Econotimes",
      title:
        "Neufund joins Malta Stock-Exchange and Binance to build blockchain-based exchange for equity tokens",
      url:
        "https://www.econotimes.com/Neufund-joins-Malta-Stock-Exchange-and-Binance-to-build-blockchain-based-exchange-for-equity-tokens-1405589",
    },
    {
      publication: "Neufund",
      title: "ETO with Neufund",
      url: "https://neufund.org/cms_resources/fundraising-process-with-neufund.pdf%C2%A0",
    },
  ],
  companyOneliner: "Equity Fundraising on Blockchain",
  companyShares: "40859" as NumericString as NumericString as NumericString,
  companySlideshare: {
    title: "",
    url: "",
  },
  companyVideo: {
    title: "",
    url: "https://www.youtube.com/watch?v=M0Hhl27TPR4",
  },
  disableTwitterFeed: true,
  companyWebsite: "https://neufund.org",
  country: "DE",
  foundingDate: "2016-08-18",
  //jurisdiction: "DE",
  keyAlliances: {
    members: [
      {
        description: "",
        image: "",
        name: "",
        role: "",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
        ],
      },
    ],
  },
  keyCustomers: {
    members: [
      {
        description: "",
        image: "",
        name: "",
        role: "",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
        ],
      },
    ],
  },
  lastFundingSizeEur: "8000000" as NumericString as NumericString,
  keyQuoteFounder:
    "'Neufunds ETOs are changing the space by offering direct, transparent and, most importantly, legally binding investment rounds on the blockchain, which is an attractive proposition to both companies and investors. - Frank Thelen, Freigeist VC'",
  legalForm: "Company Legal Form",
  marketingLinks: [
    {
      title: "Pitch Deck",
      url:
        "https://docs.google.com/presentation/d/14mRlEDSNAMWybfgYFJUJyE8oEps0VJPIoaYfmmpZTmw/edit#slide=id.g3e534cab92_0_70",
    },
  ],
  name: "Company Name ISSUER_SIGNING",
  notableInvestors: {
    members: [
      {
        description:
          "Frank Thelen is a European serial founder, tech investor and TV personality. As the Founder & CEO of Venture capitalist Freigeist Capital, he focuses on seed investments like Lilium Aviation, Wunderlist, myTaxi, kaufDA and Little Lunch.",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/7c1886da-75cb-47cd-a870-bd3b0cd2f28e.jpg",
        name: "Frank Thelen",
        role: "CEO at Freigeist Capital",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "https://medium.com/@frank_thelen",
          },
          {
            type: "twitter",
            url: "https://twitter.com/frank_thelen",
          },
          {
            type: "linkedin",
            url: "https://www.linkedin.com/in/frank-thelen/",
          },
        ],
      },
    ],
  },
  numberOfEmployees: "10-99",
  numberOfFounders: 2,
  partners: {
    members: [
      {
        description:
          "Binance is a blockchain ecosystem comprised of Exchange, Labs, Launchpad, Info and Charity Foundation. Binance Exchange is one of the fastest growing and most popular cryptocurrency exchanges in the world.",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/3ed7489d-399f-46c7-a038-e423b7a94244.png",
        name: "Binance",
        role: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "https://twitter.com/binance",
          },
          {
            type: "linkedin",
            url: "",
          },
        ],
        website: "https://www.binance.com/",
      },
      {
        description:
          "The Malta Stock Exchange became a reality upon enactment of the Malta Stock Exchange Act in 1990, and commenced its trading operations on 8 January 1992.",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/3405980f-3bcd-48d6-aeb7-ae9cc272b984.jpg",
        name: "Malta Stock Exchange",
        role: "",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "https://twitter.com/MaltaStockExch",
          },
          {
            type: "linkedin",
            url: "",
          },
        ],
      },
    ],
  },
  productVision:
    "Neufund is a blockchain based equity fundraising platform, an ecosystem of smart contracts operating on the Ethereum blockchain. The Company’s key expertise lies in legal-tech and reg-tech. At its technological core, Neufund is a Blockchain protocol for securities’ tokenization and issuance - it allows for any type of security or financial product to be issued as a token on a Blockchain, and Equity Tokens are just one of many types.",
  registrationNumber: "1234",
  riskNoLoansExist: true,
  riskNoThirdPartyDependency: true,
  riskNotRegulatedBusiness: true,
  // schemaVersion: 1,
  sellingProposition:
    "Neufund’s Equity Token Offering (ETO) is a novel way of fundraising, which allows any kind of company (blockchain-based or not) to issue equity tokens on a Blockchain, in a public or private placement. An ETO is a hybrid investment model combining advantages of an IPO, an ICO, and a VC round. Typically it is accompanied by a campaign or a roadshow which informs investors about the offering. Thus, an ETO is an ideal way to build a clients’ ecosystem around the company or a product.",
  shareholders: [
    {
      fullName: "Miau Capital GmbH",
      shares: "14000" as NumericString as NumericString,
    },
    {
      fullName: "Rudolfix Software Insights UG",
      shares: "14000" as NumericString as NumericString,
    },
    {
      fullName: "Triotor Beteiligungs GmbH",
      shares: "2000" as NumericString as NumericString,
    },
    {
      fullName: "Atlantic Labs",
      shares: "5000" as NumericString as NumericString,
    },
    {
      fullName: "Freigeist Capital I",
      shares: "5500" as NumericString as NumericString,
    },
  ],
  socialChannels: [
    {
      type: "twitter",
      url: "https://twitter.com/neufundorg",
    },
    {
      type: "facebook",
      url: "https://www.facebook.com/neufundorg/",
    },
    {
      type: "linkedin",
      url: "https://www.linkedin.com/company/neufund/",
    },
    {
      type: "slack",
      url: "",
    },
    {
      type: "medium",
      url: "https://blog.neufund.org",
    },
    {
      type: "reddit",
      url: "https://www.reddit.com/r/neufund",
    },
    {
      type: "telegram",
      url: "https://t.me/neufund",
    },
    {
      type: "github",
      url: "https://github.com/Neufund/",
    },
    {
      type: "instagram",
      url: "",
    },
    {
      type: "gplus",
      url: "",
    },
    {
      type: "youtube",
      url: "",
    },
    {
      type: "xing",
      url: "",
    },
    {
      type: "bitcointalk",
      url: "",
    },
  ],
  street: "Cuvrystr 6",
  team: {
    members: [
      {
        description:
          "Being a Blockchain regulatory & security tokens experts Zoe actively advises to German and Maltese governments on DLT frameworks. Former Co-founder and CEO at Xyologic Mobile Analysis GmbH. Occasional angel investor. Mentor at Gaza Sky Geeks.",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/11b3ec40-5bef-46fd-8e0a-b18e68a0a0fc.jpg",
        name: "Zoe Adamovicz",
        role: "CEO & Co-Founder",
        socialChannels: [
          {
            type: "medium",
            url: "https://medium.com/@ZoeAdamovicz",
          },
          {
            type: "twitter",
            url: "https://twitter.com/zoeadamovicz",
          },
          {
            type: "linkedin",
            url: "https://www.linkedin.com/in/zoeadamovicz/",
          },
        ],
        website: "https://technologiaizycie.pl/",
      },
      {
        description:
          "Serial CTO and founder. Co-founder and CTO at Xyologic Mobile Analysis GmbH (exit: Digital Turbine Inc.), Head of Group Technology at Digital Turbine. Experienced in tech, from coding in assembly to managing tech teams in companies such as H&P.",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/c520447a-90d8-490f-af27-16625f380b07.jpg",
        name: "Marcin Rudolf",
        role: "CTO & Co-Founder",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "https://medium.com/@rudolfix",
          },
          {
            type: "twitter",
            url: "https://twitter.com/rudolfix",
          },
          {
            type: "linkedin",
            url: "https://www.linkedin.com/in/marcinrudolf/",
          },
        ],
      },
      {
        description: "",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/64f2b86f-1daf-45c3-9168-b0271a6d19c0.jpg",
        name: "Agnieszka Sarnecka",
        role: "VP Ventures",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
          {
            type: "slack",
            url: "",
          },
          {
            type: "medium",
            url: "https://blog.neufund.org",
          },
          {
            type: "reddit",
            url: "https://www.reddit.com/r/neufund",
          },
          {
            type: "telegram",
            url: "https://t.me/neufund",
          },
          {
            type: "github",
            url: "https://github.com/Neufund/",
          },
          {
            type: "instagram",
            url: "",
          },
          {
            type: "gplus",
            url: "",
          },
          {
            type: "youtube",
            url: "",
          },
          {
            type: "xing",
            url: "",
          },
          {
            type: "bitcointalk",
            url: "",
          },
        ],
      },
      {
        description: "",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/2f99640f-3a3f-4f31-85fc-a11ee2dbe084.jpg",
        name: "Sergiej Rewiakin",
        role: "VP Engineering",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
          {
            type: "slack",
            url: "",
          },
          {
            type: "medium",
            url: "https://blog.neufund.org",
          },
          {
            type: "reddit",
            url: "https://www.reddit.com/r/neufund",
          },
          {
            type: "telegram",
            url: "https://t.me/neufund",
          },
          {
            type: "github",
            url: "https://github.com/Neufund/",
          },
          {
            type: "instagram",
            url: "",
          },
          {
            type: "gplus",
            url: "",
          },
          {
            type: "youtube",
            url: "",
          },
          {
            type: "xing",
            url: "",
          },
          {
            type: "bitcointalk",
            url: "",
          },
        ],
        website: "http://sergiej.com",
      },
      {
        description: "",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/301abd44-1775-4991-b616-536069408fe1.jpg",
        name: "Piotr Panorski",
        role: "VP Trading",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
          {
            type: "slack",
            url: "",
          },
          {
            type: "medium",
            url: "https://blog.neufund.org",
          },
          {
            type: "reddit",
            url: "https://www.reddit.com/r/neufund",
          },
          {
            type: "telegram",
            url: "https://t.me/neufund",
          },
          {
            type: "github",
            url: "https://github.com/Neufund/",
          },
          {
            type: "instagram",
            url: "",
          },
          {
            type: "gplus",
            url: "",
          },
          {
            type: "youtube",
            url: "",
          },
          {
            type: "xing",
            url: "",
          },
          {
            type: "bitcointalk",
            url: "",
          },
        ],
      },
      {
        description: "",
        image:
          "https://documents.neufund.io/0x64Ee2B334454A920cE99f39Cc7557b428db8D5B8/8fea024d-97e0-4878-bcbf-3d6538aac924.jpg",
        name: "Ula Lachowicz",
        role: "VP Marketing",
        website: "",
        socialChannels: [
          {
            type: "medium",
            url: "",
          },
          {
            type: "twitter",
            url: "",
          },
          {
            type: "linkedin",
            url: "",
          },
          {
            type: "slack",
            url: "",
          },
          {
            type: "medium",
            url: "https://blog.neufund.org",
          },
          {
            type: "reddit",
            url: "https://www.reddit.com/r/neufund",
          },
          {
            type: "telegram",
            url: "https://t.me/neufund",
          },
          {
            type: "github",
            url: "https://github.com/Neufund/",
          },
          {
            type: "instagram",
            url: "",
          },
          {
            type: "gplus",
            url: "",
          },
          {
            type: "youtube",
            url: "",
          },
          {
            type: "xing",
            url: "",
          },
          {
            type: "bitcointalk",
            url: "",
          },
        ],
      },
    ],
  },
  useOfCapitalList: [
    {
      description: "Development",
      percent: "0.4" as NumericString,
    },
    {
      description: "Legal",
      percent: "0.3" as NumericString,
    },
    {
      description: "Marketing",
      percent: "0.2" as NumericString,
    },
    {
      description: "Operations",
      percent: "0.1" as NumericString,
    },
  ],
  vatNumber: "18.08.2016",
  //zipCode: "12345",
};

export const etoDocuments: TEtoDocumentTemplates = {
  qmWKa6ZVZjZu3X2CtJnSnthUwWMeAcyfv9IZDnoawmULeT: {
    documentType: EEtoDocumentType.APPROVED_INVESTOR_OFFERING_DOCUMENT,
    form: "document" as TEtoFormType,
    ipfsHash: "QmWKa6zVZjZu3x2CtJnSNTHUwWMeAcyfv9iZDnoawmULeT",
    mimeType: "application/pdf",
    language: EEtoDocumentLanguage.EN,
    name: "./dev_fixtures/eto_fixtures/ETOInPublicState/investor_offering_document.pdf",
  },
  qmc4RZuxqKkvRahSuhs6QaeRq2VoqDiMXbiHwhZTfwXUdK: {
    documentType: EEtoDocumentType.SIGNED_TERMSHEET,
    form: "document" as TEtoFormType,
    ipfsHash: "Qmc4rZUXQKkvRahSUHS6qaeRq2voqDiMXbiHwhZTfwXUdK",
    mimeType: "application/pdf",
    language: EEtoDocumentLanguage.EN,
    name: "./dev_fixtures/eto_fixtures/ETOInPublicState/signed_termsheet.pdf",
  },
};

export const testEtoApi: TApiEtoWithCompanyAndContract = {
  additionalTerms: undefined,
  authorizedCapitalShares: 0,
  newSharesToIssueInFixedSlots: 10,
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
  equityTokensPerShare: 10000,
  etoId: "0xfaDa8f267C054f469b52Ccbeb08250ACAAeE65dc",
  existingCompanyShares: 40976,
  fixedSlotsMaximumDiscountFraction: 0.5,
  generalVotingRule: "positive",
  isBookbuilding: false,
  liquidationPreferenceMultiplier: 0.5,
  maxPledges: 500,
  maxTicketEur: 10000000,
  minTicketEur: 100,
  minimumNewSharesToIssue: 1000,
  newSharesToIssue: 3452,
  newSharesToIssueInWhitelist: 1534,
  nominee: "0xCB6470fa4b5D56C8f494e7c1CE56B28c548931a6",
  notUnderCrowdfundingRegulations: true,
  preMoneyValuationEur: 132664672.0464,
  previewCode: "deabb8a4-d081-4d15-87a7-737a09e6a87c",
  prospectusLanguage: "de",
  publicDiscountFraction: 0,
  publicDurationDays: 14,
  shareNominalValueEur: 1,
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

  whitelistDiscountFraction: 0.3,
  whitelistDurationDays: 7,
  company: testCompanyApi,
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
      [EETOStateOnChain.Setup]: undefined,
      [EETOStateOnChain.Whitelist]: new Date("2018-11-16T05:03:56.000Z"),
      [EETOStateOnChain.Public]: new Date("2018-11-23T05:03:56.000Z"),
      [EETOStateOnChain.Signing]: new Date("2018-12-07T05:03:56.000Z"),
      [EETOStateOnChain.Claim]: new Date("2018-12-21T05:03:56.000Z"),
      [EETOStateOnChain.Payout]: new Date("2018-12-31T05:03:56.000Z"),
      [EETOStateOnChain.Refund]: undefined,
    },
    etoCommitmentAddress: "0x234234234234",
    equityTokenAddress: "0xbAb1B125ba8b4A3161b7543a4cAA38De7f9c9b2D",
    etoTermsAddress: "0x948f07847e19E7dBb98DdfFdCA4b2eDF71f3E3B5",
  },
};

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

export const testEtoState: TStateEtoWithCompanyAndContract = {
  additionalTerms: undefined,
  authorizedCapitalShares: "0" as NumericString,
  newSharesToIssueInFixedSlots: "10" as NumericString,
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
  equityTokensPerShare: "10000" as NumericString,
  etoId: "0xfaDa8f267C054f469b52Ccbeb08250ACAAeE65dc",
  existingCompanyShares: "40976" as NumericString,
  fixedSlotsMaximumDiscountFraction: "0.5" as NumericString,
  generalVotingRule: "positive",
  isBookbuilding: false,
  liquidationPreferenceMultiplier: "0.5" as NumericString,
  maxPledges: "500" as NumericString,
  maxTicketEur: "10000000" as NumericString,
  minTicketEur: "100" as NumericString,
  minimumNewSharesToIssue: "1000" as NumericString,
  newSharesToIssue: "3452" as NumericString,
  newSharesToIssueInWhitelist: "1534" as NumericString,
  nominee: "0xCB6470fa4b5D56C8f494e7c1CE56B28c548931a6",
  notUnderCrowdfundingRegulations: true,
  preMoneyValuationEur: "132664672.0464" as NumericString,
  previewCode: "deabb8a4-d081-4d15-87a7-737a09e6a87c",
  prospectusLanguage: "de",
  publicDiscountFraction: "0" as NumericString,
  publicDurationDays: 14,
  shareNominalValueEur: "1" as NumericString,
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

  whitelistDiscountFraction: "0.3" as NumericString,
  whitelistDurationDays: 7,
  company: testCompanyState,
  contract: {
    timedState: 3,
    totalInvestment: {
      totalEquivEurUlps: "3.240447910281246044e+24" as NumericString,
      totalTokensInt: "10010705" as NumericString,
      totalInvestors: "3" as NumericString,
      euroTokenBalance: "3.2374649e+24" as NumericString,
      etherTokenBalance: "5432420000000000000" as NumericString,
    },
    startOfStates: {
      [EETOStateOnChain.Setup]: undefined,
      [EETOStateOnChain.Whitelist]: new Date("2018-11-16T05:03:56.000Z"),
      [EETOStateOnChain.Public]: new Date("2018-11-23T05:03:56.000Z"),
      [EETOStateOnChain.Signing]: new Date("2018-12-07T05:03:56.000Z"),
      [EETOStateOnChain.Claim]: new Date("2018-12-21T05:03:56.000Z"),
      [EETOStateOnChain.Payout]: new Date("2018-12-31T05:03:56.000Z"),
      [EETOStateOnChain.Refund]: undefined,
    },
    etoCommitmentAddress: "0x234234234234",
    equityTokenAddress: "0xbAb1B125ba8b4A3161b7543a4cAA38De7f9c9b2D",
    etoTermsAddress: "0x948f07847e19E7dBb98DdfFdCA4b2eDF71f3E3B5",
  },
};


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
