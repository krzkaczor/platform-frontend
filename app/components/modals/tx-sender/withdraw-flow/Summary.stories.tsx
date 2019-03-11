import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/storybookHelpers";
import { WithdrawSummaryComponent } from "./Summary";

const txData = {
  to: "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359",
  value: "5500000000000000000",
  cost: "123123123123123123123123",
};

storiesOf("Withdraw summary", module)
  .addDecorator(withModalBody())
  .add("default", () => <WithdrawSummaryComponent txData={txData} onAccept={action("onAccept")} />);
