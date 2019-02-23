import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Container } from "reactstrap";

import {
  EInvestmentErrorState,
  EInvestmentType,
} from "../../../../modules/investment-flow/interfaces";
import { EValidationState } from "../../../../modules/tx/sender/interfaces";
import { injectIntlHelpers } from "../../../../utils/injectIntlHelpers";
import { withModalBody } from "../../../../utils/storybookHelpers";
import { InvestmentSelectionComponent } from "./Investment";
import { wallets } from "./InvestmentTypeSelector.stories";
import BigNumber from "bignumber.js";

const Investment = injectIntlHelpers(InvestmentSelectionComponent);

storiesOf("Investment/Form", module)
  .addDecorator(withModalBody("47.5rem"))
  .add("default with error", () => (
    <Container>
      <Investment
        wallets={wallets}
        changeEthValue={() => {}}
        changeEuroValue={() => {}}
        changeInvestmentType={() => {}}
        equityTokenCount={new BigNumber("1234")}
        errorState={EInvestmentErrorState.ExceedsWalletBalance}
        ethValue={new BigNumber("1234123412341232341234")}
        // tslint:disable-next-line:no-object-literal-type-assertion
        eto={{ etoId: 11234 } as any}
        euroValue={new BigNumber("123412341234123412341234")}
        gasCostEth={new BigNumber("123412323412341234")}
        gasCostEuro={new BigNumber("12341234123412341234")}
        etherPriceEur={new BigNumber("123412341234123412341234")}
        eurPriceEther={new BigNumber("0.123412341234123412341234")}
        investEntireBalance={() => {}}
        investmentType={EInvestmentType.InvestmentWallet}
        minTicketEth={new BigNumber("12341234123412341234")}
        minTicketEur={new BigNumber("1234")}
        maxTicketEur={new BigNumber("123456")}
        readyToInvest={false}
        investNow={() => {}}
        showTokens={true}
        totalCostEth={new BigNumber("1234141234123412341234")}
        totalCostEur={new BigNumber("123412341234123412341234")}
        sendTransaction={() => {}}
        hasPreviouslyInvested={true}
        isWalletBalanceKnown={false}
      />
    </Container>
  ))
  .add("bank", () => (
    <Container>
      <Investment
        wallets={wallets}
        changeEthValue={() => {}}
        changeEuroValue={() => {}}
        changeInvestmentType={() => {}}
        equityTokenCount={new BigNumber("1234")}
        errorState={EValidationState.VALIDATION_OK}
        ethValue={new BigNumber("1234123412341232341234")}
        // tslint:disable-next-line:no-object-literal-type-assertion
        eto={{ etoId: "11234" } as any}
        euroValue={new BigNumber("123412341234123412341234")}
        gasCostEth={new BigNumber("0")}
        gasCostEuro={new BigNumber("0")}
        etherPriceEur={new BigNumber("123412341234123412341234")}
        eurPriceEther={new BigNumber("0.123412341234123412341234")}
        investEntireBalance={() => {}}
        investmentType={EInvestmentType.BankTransfer}
        isWalletBalanceKnown={true}
        minTicketEth={new BigNumber("12341234123412341234")}
        minTicketEur={new BigNumber("1234")}
        maxTicketEur={new BigNumber("123456")}
        readyToInvest={false}
        investNow={() => {}}
        showTokens={true}
        totalCostEth={new BigNumber("1234141234123412341234")}
        totalCostEur={new BigNumber("123412341234123412341234")}
        sendTransaction={() => {}}
      />
    </Container>
  ));
