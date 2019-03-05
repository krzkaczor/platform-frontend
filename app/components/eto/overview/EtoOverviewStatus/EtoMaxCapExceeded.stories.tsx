import { storiesOf } from "@storybook/react";
import BigNumber from "bignumber.js";
import * as React from "react";

import {
  EETOStateOnChain,
  TEtoWithCompanyAndContract,
} from "../../../../modules/public-etos/types";
import { withMockedDate } from "../../../../utils/storybookHelpers";
import { EtoMaxCapExceededComponent } from "./EtoMaxCapExceeded";

// tslint:disable-next-line:no-object-literal-type-assertion
const eto = {
  etoId: "0x123434562134asdf2412341234adf12341234",
  preMoneyValuationEur: 10000,
  existingCompanyShares: 10,
  equityTokensPerShare: 10,
  maxPledges: 500,
  maxTicketEur: 10000000,
  minTicketEur: 100,
  minimumNewSharesToIssue: 1000,
  newSharesToIssue: 3452,
  newSharesToIssueInWhitelist: 1534,
  company: {},
  contract: {
    timedState: EETOStateOnChain.Whitelist,
    totalInvestment: {
      totalInvestors: new BigNumber("123"),
      totalTokensInt: new BigNumber("34520"),
      totalEquivEurUlps: new BigNumber(1234),
    },
  },
} as TEtoWithCompanyAndContract;

storiesOf("ETO/MaxCapExceededWidget", module)
  .addDecorator(withMockedDate(new Date("1/1/2000")))
  .add("pre-eto", () => (
    <EtoMaxCapExceededComponent
      isPreEto={true}
      eto={eto}
      etherPriceEur={"100"}
      isWaitingForNextStateToStart={true}
      nextStateStartDate={new Date(new Date().getTime() + 24 * 60 * 60 * 1000)}
    />
  ))
  .add("public", () => (
    <EtoMaxCapExceededComponent
      isPreEto={false}
      eto={eto}
      etherPriceEur={"100"}
      isWaitingForNextStateToStart={false}
      nextStateStartDate={new Date("+1 day")}
    />
  ));
