import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../utils/storybookHelpers";
import { BankTransferDetailsLayout } from "./BankTransferDetails";

const detailsData = {
  recipient: "Fifth Force GmbH",
  iban: "DE1250094039446384529400565",
  bic: "TLXXXXXXXXX",
  referenceCode: "NF AGHGCmR3u2SuxdyNPIksxTyAhKM REF 123456789011",
  minAmount: "123456781234567812345678",
  continueToSummary: action("continueToSummary"),
};

storiesOf("BankTransfer/Details", module)
  .addDecorator(withModalBody())
  .add("default", () => <BankTransferDetailsLayout {...detailsData} />);
