import { storiesOf } from "@storybook/react";
import BigNumber from "bignumber.js";
import * as React from "react";

import { withStore } from "../../utils/storeDecorator";
import { ECurrency } from "../shared/Money";
import { PortfolioLayout, TPortfolioLayoutProps } from "./PortfolioLayout";

const data: TPortfolioLayoutProps = {
  myAssets: [],
  pendingAssets: [],
  isRetailEto: false,
  walletAddress: "0x00000",
  isVerifiedInvestor: true,
  tokensDisbursal: [
    {
      currency: ECurrency.EUR_TOKEN,
      amountToBeClaimed: new BigNumber("11200657227385184"),
      timeToFirstDisbursalRecycle: 1675062154000,
      totalDisbursedAmount: new BigNumber("364458900000000000"),
    },
    {
      currency: ECurrency.ETH,
      amountToBeClaimed: new BigNumber("01200657227385184"),
      timeToFirstDisbursalRecycle: 1675062154000,
      totalDisbursedAmount: new BigNumber("064458900000000000"),
    },
  ],
};

storiesOf("Portfolio/PortfolioLayout", module)
  .addDecorator(withStore({}))
  .add("default", () => <PortfolioLayout {...data} />);
