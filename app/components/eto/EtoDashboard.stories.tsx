import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Row } from "reactstrap";

import { testEto } from "../../../test/fixtures";
import { mockedStore } from "../../../test/fixtures/mockedStore";
import { EEtoState } from "../../lib/api/eto/EtoApi.interfaces";
import { withStore } from "../../utils/storeDecorator";
import { EtoDashboardStateViewComponent } from "./EtoDashboard";

const statePreview = {
  etoState: EEtoState.PREVIEW,
  shouldViewSubmissionSection: true,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
};

const statePreviewNoSubmissionSection = {
  etoState: EEtoState.PREVIEW,
  shouldViewSubmissionSection: false,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
};

const statePending = {
  etoState: EEtoState.PENDING,
  shouldViewSubmissionSection: false,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
};

const stateListed_1 = {
  etoState: EEtoState.LISTED,
  shouldViewSubmissionSection: true,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
};

const stateListed_2 = {
  etoState: EEtoState.LISTED,
  shouldViewSubmissionSection: true,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: false,
  previewCode: testEto.previewCode,
  isRetailEto: true,
};

const stateListed_3 = {
  etoState: EEtoState.LISTED,
  shouldViewSubmissionSection: true,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: false,
  previewCode: testEto.previewCode,
  isRetailEto: false,
};

const stateProspectusApproved_1 = {
  etoState: EEtoState.PROSPECTUS_APPROVED,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  shouldViewSubmissionSection: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
};

const stateProspectusApproved_2 = {
  etoState: EEtoState.PROSPECTUS_APPROVED,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  shouldViewSubmissionSection: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
};

const stateOnChain = {
  etoState: EEtoState.ON_CHAIN,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  shouldViewSubmissionSection: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
};

storiesOf("ETO-Flow/Dashboard/StateView", module)
  .addDecorator(withStore(mockedStore))
  .add("State PREVIEW with submissionSection", () => (
    <Row className="row-gutter-top">
      <EtoDashboardStateViewComponent {...statePreview} />
    </Row>
  ))
  .add("State PREVIEW, no submissionSection", () => (
    <Row className="row-gutter-top">
      <EtoDashboardStateViewComponent {...statePreviewNoSubmissionSection} />
    </Row>
  ))
  .add("State PENDING", () => (
    <Row className="row-gutter-top">
      <EtoDashboardStateViewComponent {...statePending} />
    </Row>
  ))
  .add("State LISTED, retail eto, canEnableBookbuilding, eto submitted ", () => (
    <Row className="row-gutter-top">
      <EtoDashboardStateViewComponent {...stateListed_1} />
    </Row>
  ))
  .add("State LISTED, retail eto, eto not submitted", () => (
    <Row className="row-gutter-top">
      <EtoDashboardStateViewComponent {...stateListed_2} />
    </Row>
  ))
  .add("State LISTED, canEnableBookbuilding, eto not submitted", () => (
    <Row className="row-gutter-top">
      <EtoDashboardStateViewComponent {...stateListed_3} />
    </Row>
  ))
  .add("State PROSPECTUS_APPROVED", () => (
    <Row className="row-gutter-top">
      <EtoDashboardStateViewComponent {...stateProspectusApproved_1} />
    </Row>
  ))
  .add("State PROSPECTUS_APPROVED, canEnableBookbuilding", () => (
    <Row className="row-gutter-top">
      <EtoDashboardStateViewComponent {...stateProspectusApproved_2} />
    </Row>
  ))
  .add("State OnChain", () => (
    <Row className="row-gutter-top">
      <EtoDashboardStateViewComponent {...stateOnChain} />
    </Row>
  ));
