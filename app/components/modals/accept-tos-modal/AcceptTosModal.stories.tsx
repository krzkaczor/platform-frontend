import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../utils/storybookHelpers";
import { AcceptTosModalInner } from "./AcceptTosModal";

const data = {
  isOpen: true,
  onAccept: () => {},
  onDownloadTos: () => {},
  onLogout: () => {},
};

storiesOf("AcceptTosModal", module)
  .addDecorator(withModalBody())
  .add("Accept Tos", () => {
    const props = {
      ...data,
      agreementChanged: false,
    };
    return <AcceptTosModalInner {...props} />;
  })
  .add("Accept updated Tos", () => {
    const props = {
      ...data,
      agreementChanged: true,
    };
    return <AcceptTosModalInner {...props} />;
  });
