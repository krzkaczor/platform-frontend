import { storiesOf } from "@storybook/react";
import * as React from "react";

import BigNumber from "bignumber.js";
import { MyWalletWidgetComponent } from "./MyWalletWidget";

const props = {
  isLoading: false,
  data: {
    euroTokenAmount: new BigNumber("100"),
    ethAmount: new BigNumber("100"),
    ethEuroAmount: new BigNumber("100"),
    totalAmount: new BigNumber("100"),
    isIcbmWalletConnected: false,
    isLockedWalletConnected: false,
  },
};

storiesOf("MyWalletWidget", module)
  .add("loading", () => {
    const testData = {
      ...props,
      isLoading: true,
    };
    return <MyWalletWidgetComponent {...testData} />;
  })
  .add("default", () => <MyWalletWidgetComponent {...props} />)
  .add("error", () => {
    const testData = {
      ...props,
      error: "some placeholder long very long error string",
    };
    return <MyWalletWidgetComponent {...testData} />;
  })
  .add("with icbm wallet", () => {
    const testData = {
      ...props,
      data: {
        ...props.data,
        isIcbmWalletConnected: true,
        isLockedWalletConnected: false,
      },
    };
    return <MyWalletWidgetComponent {...testData} />;
  });
