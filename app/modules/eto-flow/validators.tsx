import * as Yup from "yup";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import * as YupTS from "../../lib/yup-ts";
import {
  MIN_COMPANY_SHARES,
  MIN_EXISTING_COMPANY_SHARES, MIN_NEW_SHARES_TO_ISSUE,
  MIN_PRE_MONEY_VALUATION_EUR,
  MIN_SHARE_NOMINAL_VALUE_EUR, NEW_SHARES_TO_ISSUE_IN_FIXED_SLOTS, NEW_SHARES_TO_ISSUE_IN_WHITELIST
} from "../../config/constants";
import {dateSchema, percentage} from "../../lib/api/util/schemaHelpers";
import {StringSchema} from "yup";


const tagsType = YupTS.string();

export const EtoCompanyInformationValidator = YupTS.object({
  brandName: YupTS.string(),
  companyWebsite: YupTS.url(),
  companyOneliner: YupTS.string(),
  companyDescription: YupTS.string(),
  keyQuoteFounder: YupTS.string(),
  keyQuoteInvestor: YupTS.string().optional(),
  categories: YupTS.array(tagsType).optional(),
  companyLogo: YupTS.string().optional(),
  companyBanner: YupTS.string().optional(),
});

export const EtoEquityTokenInfoValidator = YupTS.object({
  equityTokenName: YupTS.string(),
  equityTokenSymbol: YupTS.string(),
  equityTokenImage: YupTS.string(),
});

export const EtoRiskAssessmentValidator = YupTS.object({
  riskNotRegulatedBusiness: YupTS.onlyTrue(),
  riskNoThirdPartyDependency: YupTS.onlyTrue(),
  riskNoLoansExist: YupTS.onlyTrue(),
  riskLiquidityDescription: YupTS.string().optional(),
  riskThirdPartyDescription: YupTS.string().optional(),
  riskThirdPartySharesFinancing: YupTS.string().optional(),
  riskBusinessModelDescription: YupTS.string().optional(),
  riskMaxDescription: YupTS.string().optional(),
});

export const EtoInvestmentTermsValidator = YupTS.object({
  equityTokensPerShare: YupTS.number(),
  shareNominalValueEur: YupTS.number().enhance(v => v.min(MIN_SHARE_NOMINAL_VALUE_EUR)),
  preMoneyValuationEur: YupTS.number().enhance(v => v.min(MIN_PRE_MONEY_VALUATION_EUR)),
  existingCompanyShares: YupTS.number().enhance(v => v.min(MIN_EXISTING_COMPANY_SHARES)),
  authorizedCapitalShares: YupTS.number().optional(),
  newSharesToIssue: YupTS.number().enhance(v =>
    v.when("minimumNewSharesToIssue", (value: number) =>
      v.min(value, (
        <FormattedMessage id="eto.form.section.investment-terms.error.maximum-new-shares-to-issue-less-than-minimum" />
      ) as any),
    ),
  ),
  minimumNewSharesToIssue: YupTS.number().enhance(v => v.min(MIN_NEW_SHARES_TO_ISSUE)),
  newSharesToIssueInWhitelist: YupTS.number()
    .optional()
    .enhance(v => v.min(NEW_SHARES_TO_ISSUE_IN_WHITELIST)),
  whitelistDiscountFraction: YupTS.number().optional(),
  publicDiscountFraction: YupTS.number().optional(),
  newSharesToIssueInFixedSlots: YupTS.number()
    .optional()
    .enhance(v => v.min(NEW_SHARES_TO_ISSUE_IN_FIXED_SLOTS)),
  fixedSlotsMaximumDiscountFraction: YupTS.number().optional(),
  discountScheme: YupTS.string().optional(),
});

export const EtoVotingRightsValidator = YupTS.object({
  nominee: YupTS.string(),
  liquidationPreferenceMultiplier: YupTS.number(),
  generalVotingRule: YupTS.string(),
});

const EtoCapitalListValidator = YupTS.object({
  description: YupTS.string().optional(),
  percent: YupTS.number()
    .optional()
    .enhance(() => percentage),
}).optional();

export const EtoPitchValidator = YupTS.object({
  problemSolved: YupTS.string().optional(),
  productVision: YupTS.string().optional(),
  inspiration: YupTS.string().optional(),
  roadmap: YupTS.string().optional(),
  useOfCapital: YupTS.string().optional(),
  useOfCapitalList: YupTS.array(EtoCapitalListValidator).optional(),
  customerGroup: YupTS.string().optional(),
  sellingProposition: YupTS.string().optional(),
  marketingApproach: YupTS.string().optional(),
  companyMission: YupTS.string().optional(),
  targetMarketAndIndustry: YupTS.string().optional(),
  keyBenefitsForInvestors: YupTS.string().optional(),
  keyCompetitors: YupTS.string().optional(),
  marketTraction: YupTS.string().optional(),
  businessModel: YupTS.string().optional(),
});

const marketingLinksValidator = YupTS.array(
  YupTS.object({
    title: YupTS.string().optional(),
    url: YupTS.url().optional(),
  }),
);

const companyNewsValidator = YupTS.array(
  YupTS.object({
    title: YupTS.string().optional(),
    url: YupTS.url().optional(),
    publication: YupTS.string().optional(),
  }),
);

const socialChannelsValidator = YupTS.array(
  YupTS.object({
    type: YupTS.string().optional(),
    url: YupTS.url().optional(),
  }),
);

export const EtoMediaValidator = YupTS.object({
  companyVideo: YupTS.object({
    title: YupTS.string().optional(), // optional in contrast to swagger, because filled in programmatically.
    url: YupTS.url().optional(),
  }).optional(),
  companySlideshare: YupTS.object({
    title: YupTS.string().optional(), // optional in contrast to swagger, because filled in programmatically.
    url: YupTS.url().optional(),
  }).optional(),

  socialChannels: socialChannelsValidator.optional(),
  companyNews: companyNewsValidator.optional(),
  marketingLinks: marketingLinksValidator.optional(),
  disableTwitterFeed: YupTS.boolean().optional(),
});

export const EtoLegalInformationValidator = YupTS.object({
  name: YupTS.string(),
  legalForm: YupTS.string(),
  street: YupTS.string(),
  country: YupTS.string(),
  vatNumber: YupTS.string().optional(),
  registrationNumber: YupTS.string(),
  foundingDate: YupTS.string().enhance((v: StringSchema) => dateSchema(v)),

  numberOfEmployees: YupTS.string().optional(),
  companyStage: YupTS.string().optional(),
  numberOfFounders: YupTS.number().optional(),
  lastFundingSizeEur: YupTS.number().optional(),
  companyShares: YupTS.number().enhance(v => v.min(MIN_COMPANY_SHARES)),
  shareholders: YupTS.array(
    YupTS.object({
      fullName: YupTS.string().optional(),
      shares: YupTS.number()
        .optional()
        .enhance(v => v.moreThan(0)),
    }).optional(),
  ).optional(),
});

export const EtoKeyIndividualValidator = YupTS.object({
  members: YupTS.array(
    YupTS.object({
      name: YupTS.string(),
      role: YupTS.string().optional(),
      image: YupTS.string().optional(),
      description: YupTS.string().optional(),
      website: YupTS.url().optional(),
      socialChannels: socialChannelsValidator.optional(),
    }),
  ).optional(),
});

export const EtoKeyIndividualsValidator = YupTS.object({
  team: EtoKeyIndividualValidator.optional(),
  advisors: EtoKeyIndividualValidator.optional(),
  boardMembers: EtoKeyIndividualValidator.optional(),
  notableInvestors: EtoKeyIndividualValidator.optional(),
  keyCustomers: EtoKeyIndividualValidator.optional(),
  partners: EtoKeyIndividualValidator.optional(),
  keyAlliances: EtoKeyIndividualValidator.optional(),
});

