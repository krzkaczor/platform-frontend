import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EUserType } from "../../../modules/auth/interfaces";
import { ERequestOutsourcedStatus, ERequestStatus } from "../../../modules/kyc/interfaces";
import { KycStatusWidgetComponent } from "./KycStatusWidget";

const commonProps = {
  isUserEmailVerified: true,
  backupCodesVerified: true,
  isLoading: false,
  error: undefined,
  step: 1,
  userType: EUserType.INVESTOR,
  onGoToKycHome: () => {},
  onGoToDashboard: () => {},
  cancelInstantId: () => {},
};

storiesOf("KYC/StatusWidget", module)
  .add("email-not-verified", () => (
    <KycStatusWidgetComponent
      {...commonProps}
      requestStatus={ERequestStatus.DRAFT}
      isUserEmailVerified={false}
    />
  ))
  .add("backup-codes-not-verified", () => (
    <KycStatusWidgetComponent
      {...commonProps}
      requestStatus={ERequestStatus.DRAFT}
      isUserEmailVerified={true}
      backupCodesVerified={false}
    />
  ))
  .add("draft", () => (
    <KycStatusWidgetComponent {...commonProps} requestStatus={ERequestStatus.DRAFT} />
  ))
  .add("pending", () => (
    <KycStatusWidgetComponent {...commonProps} requestStatus={ERequestStatus.PENDING} />
  ))
  .add("rejected", () => (
    <KycStatusWidgetComponent {...commonProps} requestStatus={ERequestStatus.REJECTED} />
  ))
  .add("accepted", () => (
    <KycStatusWidgetComponent {...commonProps} requestStatus={ERequestStatus.ACCEPTED} />
  ))
  .add("outsourced-started", () => (
    <KycStatusWidgetComponent
      {...commonProps}
      userType={EUserType.INVESTOR}
      requestStatus={ERequestStatus.OUTSOURCED}
      requestOutsourcedStatus={ERequestOutsourcedStatus.STARTED}
      externalKycUrl={"https://neufund.org"}
    />
  ))
  .add("outsourced-aborted", () => (
    <KycStatusWidgetComponent
      {...commonProps}
      userType={EUserType.INVESTOR}
      requestStatus={ERequestStatus.OUTSOURCED}
      requestOutsourcedStatus={ERequestOutsourcedStatus.ABORTED}
    />
  ))
  .add("outsourced-canceled", () => (
    <KycStatusWidgetComponent
      {...commonProps}
      userType={EUserType.INVESTOR}
      requestStatus={ERequestStatus.OUTSOURCED}
      requestOutsourcedStatus={ERequestOutsourcedStatus.CANCELED}
    />
  ))
  .add("outsourced-other", () => (
    <KycStatusWidgetComponent
      {...commonProps}
      userType={EUserType.INVESTOR}
      requestStatus={ERequestStatus.OUTSOURCED}
      requestOutsourcedStatus={ERequestOutsourcedStatus.OTHER}
    />
  ))
  .add("outsourced-review_pending", () => (
    <KycStatusWidgetComponent
      {...commonProps}
      userType={EUserType.INVESTOR}
      requestStatus={ERequestStatus.OUTSOURCED}
      requestOutsourcedStatus={ERequestOutsourcedStatus.REVIEW_PENDING}
    />
  ))
  .add("outsourced-success", () => (
    <KycStatusWidgetComponent
      {...commonProps}
      userType={EUserType.INVESTOR}
      requestStatus={ERequestStatus.OUTSOURCED}
      requestOutsourcedStatus={ERequestOutsourcedStatus.SUCCESS}
    />
  ))
  .add("outsourced-success-data-changed", () => (
    <KycStatusWidgetComponent
      {...commonProps}
      userType={EUserType.INVESTOR}
      requestStatus={ERequestStatus.OUTSOURCED}
      requestOutsourcedStatus={ERequestOutsourcedStatus.SUCCESS_DATA_CHANGED}
    />
  ))
  .add("error", () => (
    <KycStatusWidgetComponent
      {...commonProps}
      error="bla bla error"
      userType={EUserType.INVESTOR}
      requestStatus={ERequestStatus.OUTSOURCED}
      requestOutsourcedStatus={ERequestOutsourcedStatus.REVIEW_PENDING}
    />
  ))
  .add("loading", () => (
    <KycStatusWidgetComponent
      {...commonProps}
      isLoading={true}
      userType={EUserType.INVESTOR}
      requestStatus={ERequestStatus.OUTSOURCED}
      requestOutsourcedStatus={ERequestOutsourcedStatus.REVIEW_PENDING}
    />
  ));
