import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../utils/storybookHelpers";
import { BankTransferSuccessLayout } from "./BankTransferSuccess";

const summaryData = {
  goToWallet: action("goToWallet"),
};

storiesOf("BankTransferSuccess", module)
  .addDecorator(withModalBody())
  .add("default", () => <BankTransferSuccessLayout {...summaryData} />);
