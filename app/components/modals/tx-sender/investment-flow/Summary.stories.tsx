import { storiesOf } from "@storybook/react";
import * as React from "react";

import BigNumber from "bignumber.js";
import { IBlPublicEtoData } from "../../../../modules/eto-flow/interfaces/PublicEtoData";
import { withModalBody } from "../../../../utils/storybookHelpers";
import { InvestmentSummaryComponent } from "./Summary";

// tslint:disable-next-line:no-object-literal-type-assertion
const eto = {
  etoId: "0x123434562134asdf2412341234adf12341234",
} as IBlPublicEtoData;

const etoWithDiscount = {
  ...eto,
  preMoneyValuationEur: new BigNumber(10000),
  existingCompanyShares: new BigNumber(10),
  equityTokensPerShare: new BigNumber(10),
};

const data = {
  eto,
  companyName: "X company",
  investmentEth: new BigNumber("12345678900000000000"),
  investmentEur: new BigNumber("12345678900000000000000"),
  gasCostEth: new BigNumber("2000000000000000"),
  equityTokens: new BigNumber("500"),
  estimatedReward: new BigNumber("40000000000000000000"),
  etherPriceEur: new BigNumber("200"),
  onAccept: () => {},
  downloadAgreement: () => {},
  onChange: () => {},
};

const dataWithPriceDiscount = {
  ...data,
  eto: etoWithDiscount,
};

storiesOf("Investment/InvestmentSummary", module)
  .addDecorator(withModalBody())
  .add("default", () => <InvestmentSummaryComponent {...data} />)
  .add("with token price discount", () => <InvestmentSummaryComponent {...dataWithPriceDiscount} />)
  .add("isIcbm", () => (
    <InvestmentSummaryComponent {...data} isIcbm={true} estimatedReward={new BigNumber("0")} />
  ));
