import { storiesOf } from "@storybook/react";
import BigNumber from "bignumber.js";
import * as React from "react";

import { withModalBody } from "../../../../utils/storybookHelpers";
import { UserClaimSummaryComponent } from "./Summary";

storiesOf("User Claim Summary", module)
  .addDecorator(withModalBody())
  .add("default", () => (
    <UserClaimSummaryComponent
      additionalData={{
        etoId: "0xfaDa8f267C054f469b52Ccbeb08250ACAAeE65dc",
        costUlps: "1200000000000000000",
        neuRewardUlps: "5500000000000000000",
        tokenName: "Fifth Force",
        tokenQuantity: 100,
      }}
      onAccept={() => {}}
      generateTemplateByEtoId={() => {}}
      isPendingDownload={_ => false}
      etoData={
        {
          etoId: "0xfaDa8f267C054f469b52Ccbeb08250ACAAeE65dc",
          investorTicket: {
            equityTokenInt: new BigNumber(100),
            amountEth: new BigNumber(1),
            amountEurUlps: new BigNumber(40),
            equivEurUlps: new BigNumber(1),
            rewardNmkUlps: new BigNumber(1),
            sharesInt: new BigNumber(1),
            tokenPrice: new BigNumber(1),
            neuRate: new BigNumber(1),
            claimedOrRefunded: true,
            usedLockedAccount: true,
          },
        } as any
      }
      downloadDocument={() => {}}
    />
  ));
