import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/storybookHelpers";
import { InvestorAcceptPayoutSuccessLayout } from "./AcceptSuccess";

storiesOf("InvestorPayout/AcceptSuccess", module)
  .addDecorator(withModalBody())
  .add("default", () => <InvestorAcceptPayoutSuccessLayout goToWallet={action("View Wallet")} />);
