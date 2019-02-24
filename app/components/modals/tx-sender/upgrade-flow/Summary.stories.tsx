import { storiesOf } from "@storybook/react";
import BigNumber from "bignumber.js";
import * as React from "react";

import { ETokenType } from "../../../../modules/tx/interfaces";
import { IBlTxData } from "../../../../modules/web3/interfaces";
import { withModalBody } from "../../../../utils/storybookHelpers";
import { UpgradeSummaryComponent } from "./Summary";

const txData: IBlTxData = {
  to: "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359",
  value: new BigNumber("5500000000000000000"),
  gas: new BigNumber("12000"),
  gasPrice: new BigNumber("57000000000"),
  from: "0x8e75544b848f0a32a1ab119e3916ec7138f3bed2",
};

storiesOf("Upgrade Summary", module)
  .addDecorator(withModalBody())
  .add("default", () => (
    <UpgradeSummaryComponent
      txData={txData}
      txCost={new BigNumber("123456")}
      onAccept={() => {}}
      downloadICBMAgreement={() => {}}
      additionalData={{ tokenType: ETokenType.ETHER }}
    />
  ));
