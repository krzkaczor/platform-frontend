import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import BigNumber from "bignumber.js";
import * as React from "react";

import { IBlTokenDisbursal } from "../../../../modules/investor-portfolio/interfaces/TokenDisbursal";
import { EthereumAddressWithChecksum } from "../../../../types";
import { withModalBody } from "../../../../utils/storybookHelpers";
import { ECurrency } from "../../../shared/Money";
import { InvestorAcceptPayoutSummaryLayout } from "./AcceptSummary";

const ethTokenDisbursal: IBlTokenDisbursal = {
  currency: ECurrency.ETH,
  amountToBeClaimed: new BigNumber("6.582870355588135389497e+21"),
  totalDisbursedAmount: new BigNumber("9.7154607e+22"),
  timeToFirstDisbursalRecycle: 1675401473000,
};

const nEurTokenDisbursal: IBlTokenDisbursal = {
  currency: ECurrency.EUR_TOKEN,
  amountToBeClaimed: new BigNumber("6.582870355588135389497e+21"),
  totalDisbursedAmount: new BigNumber("9.7154607e+22"),
  timeToFirstDisbursalRecycle: 1675401473000,
};

storiesOf("InvestorPayout/AcceptSummary", module)
  .addDecorator(withModalBody())
  .add("ETH", () => (
    <InvestorAcceptPayoutSummaryLayout
      walletAddress={"0x00b30CC2cc22c9820d47a4E0C9E1A54455bA0883" as EthereumAddressWithChecksum}
      tokensDisbursal={[ethTokenDisbursal]}
      onAccept={action("onAccept")}
    />
  ))
  .add("nEur", () => (
    <InvestorAcceptPayoutSummaryLayout
      walletAddress={"0x00b30CC2cc22c9820d47a4E0C9E1A54455bA0883" as EthereumAddressWithChecksum}
      tokensDisbursal={[nEurTokenDisbursal]}
      onAccept={action("onAccept")}
    />
  ))
  .add("all", () => (
    <InvestorAcceptPayoutSummaryLayout
      walletAddress={"0x00b30CC2cc22c9820d47a4E0C9E1A54455bA0883" as EthereumAddressWithChecksum}
      tokensDisbursal={[ethTokenDisbursal, nEurTokenDisbursal]}
      onAccept={action("onAccept")}
    />
  ));
