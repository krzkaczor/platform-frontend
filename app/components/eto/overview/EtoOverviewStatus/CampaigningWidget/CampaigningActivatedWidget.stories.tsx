import { storiesOf } from "@storybook/react";
import * as React from "react";

import BigNumber from "bignumber.js";
import { EETOStateOnChain } from "../../../../../modules/public-etos/interfaces/interfaces";
import { withStore } from "../../../../../utils/storeDecorator";
import { CampaigningActivatedWidgetComponent } from "./CampaigningActivatedWidget";

storiesOf("ETO/CampaigningActivatedWidgetComponent", module)
  .addDecorator(withStore({}))
  .add("default", () => (
    <CampaigningActivatedWidgetComponent
      isInvestorsLimitReached={false}
      isWaitingForNextStateToStart={false}
      etoId="test"
      investorsLimit={new BigNumber(500)}
      minPledge={new BigNumber(10)}
      nextState={EETOStateOnChain.Claim}
      isActive={true}
      keyQuoteFounder="Quotes are like boats"
      pledgedAmount={new BigNumber(100)}
      investorsCount={new BigNumber(1)}
      isInvestor={true}
      isVerifiedInvestor={true}
    />
  ))
  .add("Investor Limit Reached", () => (
    <CampaigningActivatedWidgetComponent
      isInvestorsLimitReached={true}
      isWaitingForNextStateToStart={false}
      etoId="test"
      investorsLimit={new BigNumber(500)}
      minPledge={new BigNumber(10)}
      nextState={EETOStateOnChain.Claim}
      isActive={true}
      keyQuoteFounder="Quotes are like boats"
      pledgedAmount={new BigNumber(100)}
      investorsCount={new BigNumber(1)}
      isInvestor={true}
      isVerifiedInvestor={true}
    />
  ));
