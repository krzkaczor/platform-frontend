import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Row } from "reactstrap";

import { mockedStore } from "../../../test/fixtures/mockedStore";
import { testEtoApi } from "../../../test/fixtures/testEtoApi";
import { EEtoState } from "../../modules/eto-flow/interfaces/interfaces";
import { withStore } from "../../utils/storeDecorator";
import { EtoDashboardStateViewComponent } from "./EtoDashboard";

const state = {
  etoState: EEtoState.ON_CHAIN,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  shouldViewSubmissionSection: true,
  previewCode: testEtoApi.previewCode,
  isRetailEto: true,
};

storiesOf("ETO-Flow/Dashboard/StateView", module)
  .addDecorator(withStore(mockedStore))
  .add("State OnChain", () => (
    <Row className="row-gutter-top">
      <EtoDashboardStateViewComponent {...state} />
    </Row>
  ));
