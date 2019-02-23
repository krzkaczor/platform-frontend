import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import BigNumber from "bignumber.js";

import { withModalBody } from "../../../../utils/storybookHelpers";
import { BankTransferPurchaseLayout } from "./BankTransferPurchaseSummary";

const detailsData = {
  recipient: "Fifth Force GmbH",
  iban: "DE1250094039446384529400565",
  bic: "TLXXXXXXXXX",
  referenceCode: "NF AGHGCmR3u2SuxdyNPIksxTyAhKM REF 123456789011",
  minAmount: new BigNumber("123456781234567812345678"),
  continueToSummary: action("continueToSummary"),
};

storiesOf("BankTransferPurchaseLayout", module)
  .addDecorator(withModalBody())
  .add("default", () => <BankTransferPurchaseLayout {...detailsData} />);
