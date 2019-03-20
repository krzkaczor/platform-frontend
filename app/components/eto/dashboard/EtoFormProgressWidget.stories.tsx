import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EtoFormProgressWidgetLayout } from "./EtoFormProgressWidget";

storiesOf("EtoFormProgressWidget", module)
  .add("loading", () => (
    <EtoFormProgressWidgetLayout
      to="/test"
      name="test long name"
      isLoading={true}
      disabled={false}
      readonly={false}
      progress={1}
    />
  ))
  .add("edit", () => (
    <EtoFormProgressWidgetLayout
      to="/test"
      name="test long name"
      isLoading={false}
      readonly={false}
      disabled={false}
      progress={1}
    />
  ))
  .add("complete", () => (
    <EtoFormProgressWidgetLayout
      to="/test"
      name="test long name"
      progress={0.88}
      isLoading={false}
      disabled={false}
      readonly={false}
    />
  ))
  .add("readonly", () => (
    <EtoFormProgressWidgetLayout
      to="/test"
      name="test long name"
      progress={0.88}
      isLoading={false}
      disabled={false}
      readonly={true}
    />
  ));
