import { storiesOf } from "@storybook/react";
import BigNumber from "bignumber.js";
import * as React from "react";

import { IBlTxData } from "../../../../modules/web3/interfaces";
import { withModalBody } from "../../../../utils/storybookHelpers";
import { WithdrawSummaryComponent } from "./Summary";

const txData: IBlTxData = {
  to: "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359",
  value: new BigNumber("5500000000000000000"),
  gas: new BigNumber("12000"),
  gasPrice: new BigNumber("57000000000"),
  from: "0x8e75544b848f0a32a1ab119e3916ec7138f3bed2",
};

storiesOf("Withdraw summary", module)
  .addDecorator(withModalBody())
  .add("default", () => (
    <WithdrawSummaryComponent
      txData={txData}
      txCost={new BigNumber("123123123123123123123123")}
      onAccept={() => {}}
    />
  ));
