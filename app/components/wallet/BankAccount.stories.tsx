import { storiesOf } from "@storybook/react";
import * as React from "react";
import { BankAccount } from "./BankAccount";

storiesOf("BankAccount", module).add("default", () => (
  <BankAccount details={{ bankAccountNumberLast4: "1234", holderName: "Lorem Ipsum" }} />
));
