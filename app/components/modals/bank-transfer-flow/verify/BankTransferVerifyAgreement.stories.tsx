import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { convertToBigInt } from "../../../../utils/Number.utils";
import { withModalBody } from "../../../../utils/storybookHelpers";
import { BankTransferVerifyInfoLayout } from "./BankTransferVerifyAgreement";

const props = {
  goToAgreement: action("goToAgreement"),
  minEuroUlps: convertToBigInt(1),
};

storiesOf("BankTransferVerifyAgreement", module)
  .addDecorator(withModalBody())
  .add("default", () => <BankTransferVerifyInfoLayout {...props} />);
