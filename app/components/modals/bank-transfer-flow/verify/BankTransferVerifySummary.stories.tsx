import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import BigNumber from "bignumber.js";
import * as React from "react";

import { withModalBody } from "../../../../utils/storybookHelpers";
import { BankTransferVerifySummaryLayout } from "./BankTransferVerifySummary";

const detailsData = {
  recipient: "Fifth Force GmbH",
  iban: "DE1250094039446384529400565",
  bic: "TLXXXXXXXXX",
  referenceCode: "NF AGHGCmR3u2SuxdyNPIksxTyAhKM REF 123456789011",
  minAmount: new BigNumber("123456781234567812345678"),
  continueToSummary: action("continueToSummary"),
};

storiesOf("BankTransferVerifySummary", module)
  .addDecorator(withModalBody())
  .add("default", () => <BankTransferVerifySummaryLayout {...detailsData} />);
