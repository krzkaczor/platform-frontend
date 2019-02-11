import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Container } from "reactstrap";

import { IBlTxData } from "../../../../lib/web3/types";
import { ETokenType } from "../../../../modules/tx/interfaces";
import { UpgradeSummaryComponent } from "./Summary";

const txData: IBlTxData = {
  to: "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359",
  value: "5500000000000000000",
  gas: "12000",
  gasPrice: "57000000000",
  from: "0x8e75544b848f0a32a1ab119e3916ec7138f3bed2",
};

storiesOf("Upgrade Summary", module).add("default", () => (
  <Container>
    <UpgradeSummaryComponent
      txData={txData}
      txCost={"123456"}
      onAccept={() => {}}
      downloadICBMAgreement={() => {}}
      additionalData={{ tokenType: ETokenType.ETHER }}
    />
  </Container>
));
