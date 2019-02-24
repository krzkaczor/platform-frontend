import { storiesOf } from "@storybook/react";
import * as React from "react";

import BigNumber from "bignumber.js";
import { BookBuildingWidgetComponent } from "./BookBuildingWidget";

const data = {
  startBookBuilding: () => {},
  stopBookBuilding: () => {},
  downloadCSV: () => {},
  bookBuildingEnabled: false,
  bookBuildingStats: { investorsCount: new BigNumber(0), pledgedAmount: new BigNumber(0) },
  maxPledges: new BigNumber(500),
  canEnableBookbuilding: true,
};

storiesOf("BookBuildingWidget", module)
  .add("bookbuilding disabled", () => {
    return <BookBuildingWidgetComponent {...data} canEnableBookbuilding={false} />;
  })
  .add("whitelisting not started", () => {
    return <BookBuildingWidgetComponent {...data} />;
  })
  .add("whitelisting started, no data yet", () => {
    const testData = {
      ...data,
      bookBuildingEnabled: true,
    };
    return <BookBuildingWidgetComponent {...testData} />;
  })
  .add("whitelisting started, there are pledges", () => {
    const testData = {
      ...data,
      bookBuildingEnabled: true,
      bookBuildingStats: {
        investorsCount: new BigNumber(2),
        pledgedAmount: new BigNumber(12545874),
      },
    };
    return <BookBuildingWidgetComponent {...testData} />;
  })
  .add("whitelisting paused", () => {
    const testData = {
      ...data,
      bookBuildingEnabled: false,
      bookBuildingStats: {
        investorsCount: new BigNumber(2),
        pledgedAmount: new BigNumber(1595848),
      },
    };
    return <BookBuildingWidgetComponent {...testData} />;
  });
