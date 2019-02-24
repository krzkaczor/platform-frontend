import { storiesOf } from "@storybook/react";
import * as React from "react";

import BigNumber from "bignumber.js";
import { Q18 } from "../../../config/constants";
import { MyNeuWidget } from "./MyNeuWidget";

storiesOf("MyNeuWidget", module).add("with funds", () => (
  <MyNeuWidget
    balanceNeu={new BigNumber(`123${Q18.toString()}`)}
    balanceEur={new BigNumber("5947506")}
  />
));
