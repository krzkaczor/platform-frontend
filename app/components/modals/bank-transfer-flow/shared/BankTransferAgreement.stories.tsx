import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/storybookHelpers";
import { BankTransferVerifyAgreementLayout } from "./BankTransferAgreement";

const props = {
  goToSummary: action("goToSummary"),
  downloadNEurTokenAgreement: action("downloadNEurTokenAgreement"),
};

storiesOf("BankTransferVerifyAgreement", module)
  .addDecorator(withModalBody())
  .add("default", () => <BankTransferVerifyAgreementLayout {...props} />);
