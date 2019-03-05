import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withMockedDate } from "../../utils/storybookHelpers";
import { Counter } from "./Counter";

const hour = 3600000;
const day = 24 * hour;

const dummyNow = new Date("2021-12-31T05:03:56.000Z");
const futureDate = new Date(dummyNow.valueOf() + 87 * day + 13.5 * hour);

storiesOf("Counter", module)
  .addDecorator(withMockedDate(dummyNow))
  .add("default", () => <Counter endDate={futureDate} />);
