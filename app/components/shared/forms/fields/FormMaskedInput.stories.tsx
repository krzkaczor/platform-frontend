import { storiesOf } from "@storybook/react";
import * as React from "react";
import { createNumberMask, emailMask } from "text-mask-addons";

import { FormMaskedInput } from "./FormMaskedInput";
import { formWrapper } from "./testingUtils";

const mask = createNumberMask({
  prefix: "",
  thousandsSeparatorSymbol: " ",
  allowDecimal: true,
  decimalLimit: 2,
  integerLimit: 13,
});

storiesOf("Form/MaskedInput", module)
  .add(
    "default",
    formWrapper({ name: 15532.33 })(() => <FormMaskedInput name="name" mask={mask} />),
  )
  .add(
    "with placeholder",
    formWrapper({})(() => <FormMaskedInput name="name" mask={mask} placeholder="Placeholder" />),
  )
  .add(
    "small",
    formWrapper({ name: 15532.33 })(() => (
      <FormMaskedInput name="name" mask={mask} placeholder="Placeholder" size="sm" />
    )),
  )
  .add(
    "with prefix",
    formWrapper({ name: 15532.33 })(() => (
      <FormMaskedInput name="name" mask={mask} prefix="Prefix" />
    )),
  )
  .add(
    "with suffix",
    formWrapper({ name: 15532.33 })(() => (
      <FormMaskedInput name="name" mask={mask} suffix="Suffix" />
    )),
  )
  .add(
    "guided",
    formWrapper({})(() => <FormMaskedInput name="name" mask={emailMask} guided={true} />),
  );
