import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Row } from "reactstrap";

import { testEto } from "../../../test/fixtures";
import { mockedStore } from "../../../test/fixtures/mockedStore";
import { EEtoState } from "../../lib/api/eto/EtoApi.interfaces";
import { withStore } from "../../utils/storeDecorator";
import { EtoDashboardComponent } from "./EtoDashboard";

const statePreview = {
  etoState: EEtoState.PREVIEW,
  shouldViewSubmissionSection: true,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  isVerificationSectionDone: true
};
//
// etoState,
//   canEnableBookbuilding,
//   isTermSheetSubmitted,
//   shouldEtoDataLoad,
//   isOfferingDocumentSubmitted,
//   previewCode,
//   isRetailEto,
//   isVerificationSectionDone,
//   shouldViewSubmissionSection,

const statePreviewNoSubmissionSection = {
  etoState: EEtoState.PREVIEW,
  shouldViewSubmissionSection: false,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  isVerificationSectionDone: true
};

const statePending = {
  etoState: EEtoState.PENDING,
  shouldViewSubmissionSection: false,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  isVerificationSectionDone: true
};

const stateListed_1 = {
  etoState: EEtoState.LISTED,
  shouldViewSubmissionSection: true,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  isVerificationSectionDone: true
};

const stateListed_2 = {
  etoState: EEtoState.LISTED,
  shouldViewSubmissionSection: true,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: false,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  isVerificationSectionDone: true
};

const stateListed_3 = {
  etoState: EEtoState.LISTED,
  shouldViewSubmissionSection: true,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: false,
  previewCode: testEto.previewCode,
  isRetailEto: false,
  isVerificationSectionDone: true
};

const stateProspectusApproved_1 = {
  etoState: EEtoState.PROSPECTUS_APPROVED,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  shouldViewSubmissionSection: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  isVerificationSectionDone: true
};

const stateProspectusApproved_2 = {
  etoState: EEtoState.PROSPECTUS_APPROVED,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  shouldViewSubmissionSection: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  isVerificationSectionDone: true
};

const stateOnChain = {
  etoState: EEtoState.ON_CHAIN,
  canEnableBookbuilding: true,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  shouldViewSubmissionSection: true,
  previewCode: testEto.previewCode,
  isRetailEto: true,
  isVerificationSectionDone: true
};

storiesOf("ETO-Flow/Dashboard/StateView", module)
  .addDecorator(withStore(mockedStore))
  .addDecorator(story => <div style={{ padding: "30px" }}>{story()}</div>)

  .add("State PREVIEW with submissionSection", () => (
    <Row className="row-gutter-top">
      <EtoDashboardComponent {...statePreview} />
    </Row>
  ))
  .add("State PREVIEW, no submissionSection", () => (
    <Row className="row-gutter-top">
      <EtoDashboardComponent {...statePreviewNoSubmissionSection} />
    </Row>
  ))
  .add("State PENDING", () => (
    <Row className="row-gutter-top">
      <EtoDashboardComponent {...statePending} />
    </Row>
  ))
  .add("State LISTED, retail eto, canEnableBookbuilding, eto submitted ", () => (
    <Row className="row-gutter-top">
      <EtoDashboardComponent {...stateListed_1} />
    </Row>
  ))
  .add("State LISTED, retail eto, eto not submitted", () => (
    <Row className="row-gutter-top">
      <EtoDashboardComponent {...stateListed_2} />
    </Row>
  ))
  .add("State LISTED, canEnableBookbuilding, eto not submitted", () => (
    <Row className="row-gutter-top">
      <EtoDashboardComponent {...stateListed_3} />
    </Row>
  ))
  .add("State PROSPECTUS_APPROVED", () => (
    <Row className="row-gutter-top">
      <EtoDashboardComponent {...stateProspectusApproved_1} />
    </Row>
  ))
  .add("State PROSPECTUS_APPROVED, canEnableBookbuilding", () => (
    <Row className="row-gutter-top">
      <EtoDashboardComponent {...stateProspectusApproved_2} />
    </Row>
  ))
  .add("State OnChain", () => (
    <Row className="row-gutter-top">
      <EtoDashboardComponent {...stateOnChain} />
    </Row>
  ));
