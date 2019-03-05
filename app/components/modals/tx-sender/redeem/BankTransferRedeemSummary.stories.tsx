import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Q18 } from "../../../../config/constants";
import { withModalBody } from "../../../../utils/storybookHelpers";
import { BankTransferRedeemSummaryLayout } from "./BankTransferRedeemSummary";

storiesOf("BankTransferRedeem/Summary", module)
  .addDecorator(withModalBody())
  .add("default", () => (
    <BankTransferRedeemSummaryLayout
      confirm={action("CONFIRM")}
      amount={"20.50"}
      bankFee={Q18.mul(0.005).toString()}
      bankAccount={{
        hasBankAccount: true,
        details: {
          bankAccountNumberLast4: "1234",
          bankName: "mBank",
          name: "Lorem Ipsum",
          isSepa: true,
          swiftCode: "33212",
        },
      }}
    />
  ));
