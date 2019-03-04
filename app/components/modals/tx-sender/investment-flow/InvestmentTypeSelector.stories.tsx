import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Container } from "reactstrap";

import { EInvestmentType } from "../../../../modules/investment-flow/reducer";
import { withModalBody } from "../../../../utils/storybookHelpers";
import { InvestmentTypeSelector, WalletSelectionData } from "./InvestmentTypeSelector";

export const wallets: WalletSelectionData[] = [
  {
    balanceEur: "32112",
    balanceEth: "30000000000000000000",
    type: EInvestmentType.ICBMEth,
    name: "ICBM Wallet",
  },
  {
    balanceNEuro: "45600000000000000000",
    balanceEur: "45600000000000000000",
    type: EInvestmentType.ICBMnEuro,
    name: "ICBM Wallet",
  },
  {
    balanceEth: "50000000000000000000",
    balanceEur: "45600000000000000000",
    type: EInvestmentType.Eth,
    name: "Investment Wallet",
  },
];

storiesOf("Investment/InvestmentTypeSelector", module)
  .addDecorator(withModalBody())
  .add("default", () => (
    <Container>
      <InvestmentTypeSelector
        wallets={wallets}
        currentType={EInvestmentType.Eth}
        onSelect={action("onSelect")}
      />
    </Container>
  ));
