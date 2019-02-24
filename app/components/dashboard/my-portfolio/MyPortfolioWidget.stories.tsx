import { storiesOf } from "@storybook/react";
import * as React from "react";

import BigNumber from "bignumber.js";
import { Q18 } from "../../../config/constants";
import { MyPortfolioWidgetComponent } from "./MyPortfolioWidget";

storiesOf("MyPortfolioWidget", module)
  .add("loading", () => (
    <MyPortfolioWidgetComponent
      isLoading
      isIncomingPayoutLoading
      isIncomingPayoutAvailable={false}
      {...{
        balanceEur: new BigNumber("12312352413"),
        balanceNeu: new BigNumber(Q18.mul(123)),
        isIcbmWalletConnected: true,
      }}
    />
  ))
  .add("loaded", () => (
    <MyPortfolioWidgetComponent
      isLoading={false}
      isIncomingPayoutLoading={false}
      isIncomingPayoutAvailable={false}
      {...{
        balanceEur: new BigNumber("12312352413"),
        balanceNeu: new BigNumber(Q18.mul(123)),
        isIcbmWalletConnected: true,
      }}
    />
  ))
  .add("loaded, no funds", () => (
    <MyPortfolioWidgetComponent
      isLoading={false}
      isIncomingPayoutLoading={false}
      isIncomingPayoutAvailable={false}
      {...{
        balanceEur: new BigNumber("0"),
        balanceNeu: new BigNumber("0"),
        isIcbmWalletConnected: true,
      }}
    />
  ))
  .add("error", () => (
    <MyPortfolioWidgetComponent
      isLoading={false}
      isIncomingPayoutLoading={false}
      isIncomingPayoutAvailable={false}
      error={"bla bla error"}
      {...{
        balanceEur: new BigNumber("0"),
        balanceNeu: new BigNumber("0"),
        isIcbmWalletConnected: true,
      }}
    />
  ));
