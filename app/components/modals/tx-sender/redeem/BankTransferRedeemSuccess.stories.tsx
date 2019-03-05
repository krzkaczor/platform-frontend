import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/storybookHelpers";
import { BankTransferRedeemSuccessComponent } from "./BankTransferRedeemSuccess";

storiesOf("BankTransferRedeem/Success", module)
  .addDecorator(withModalBody())
  .add("default", () => (
    <BankTransferRedeemSuccessComponent
      txHash={"0xdb3c43a0cfc4e221ecb52655eab3c3b88ba521a"}
      goToWallet={action("GO_TO_WALLET")}
    />
  ));
