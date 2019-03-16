import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/storybookHelpers";
import { InvestmentSummaryComponent } from "./Summary";

const data = {
  additionalData: {
    eto: {
      companyName: "X company",
      etoId: "0x123434562134asdf2412341234adf12341234",
      preMoneyValuationEur: 0,
      existingCompanyShares: 0,
      equityTokensPerShare: 0,
    },
    investmentEth: "12345678900000000000",
    investmentEur: "12345678900000000000000",
    gasCostEth: "2000000000000000",
    equityTokens: "500",
    estimatedReward: "40000000000000000000",
    etherPriceEur: "200",
    isIcbm: false,
  },
  onAccept: () => {},
  downloadAgreement: () => {},
  onChange: () => {},
};

const dataWithPriceDiscount = {
  ...data,
  additionalData: {
    ...data.additionalData,
    eto: {
      ...data.additionalData.eto,
      preMoneyValuationEur: 10000,
      existingCompanyShares: 10,
      equityTokensPerShare: 10,
    },
  },
};

const dataWithIcbm = {
  ...data,
  additionalData: {
    ...data.additionalData,
    isIcbm: true,
    estimatedReward: "0",
  },
};

storiesOf("Investment/InvestmentSummary", module)
  .addDecorator(withModalBody())
  .add("default", () => <InvestmentSummaryComponent {...data} />)
  .add("with token price discount", () => <InvestmentSummaryComponent {...dataWithPriceDiscount} />)
  .add("isIcbm", () => <InvestmentSummaryComponent {...dataWithIcbm} />);
