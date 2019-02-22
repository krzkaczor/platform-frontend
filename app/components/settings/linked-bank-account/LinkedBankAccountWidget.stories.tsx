import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { LinkedBankAccountComponent } from "./LinkedBankAccountWidget";

storiesOf("LinkedBankAccountWidget", module)
  .add("not verified", () => (
    <LinkedBankAccountComponent verifyBankAccount={action("verify")} isVerified={false} />
  ))
  .add("verified", () => (
    <LinkedBankAccountComponent
      isVerified={true}
      verifyBankAccount={action("verify")}
      bankAccount={{
        hasBankAccount: true,
        details: { bankAccountNumberLast4: "1234", holderName: "Lorem Ipsum" },
      }}
    />
  ));
