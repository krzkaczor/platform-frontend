import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/storybookHelpers";
import { WithdrawSummaryComponent } from "./Summary";

const props = {
  txHash: "0xdb3c43a0cfc4e221ecb52655eab3c3b88ba521a",
  additionalData: {
    to: "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359",
    value: "5500000000000000000",
    cost: "123123123123123123123123",
  },
  onAccept: action("onAccept"),
};

storiesOf("Withdraw summary", module)
  .addDecorator(withModalBody())
  .add("default", () => <WithdrawSummaryComponent {...props} />);
