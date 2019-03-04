import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { IIntlProps, injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { appRoutes } from "../../appRoutes";
import { DashboardLinkWidget } from "../../shared/dashboard-link-widget/DashboardLinkWidget";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryPanel } from "../../shared/errorBoundary/ErrorBoundaryPanel";

interface IExternalProps {
  layoutClass: string;
}

export const UploadInvestmentMemorandumLayout: React.FunctionComponent<
  IExternalProps & IIntlProps
> = ({ layoutClass, intl: { formatIntlMessage } }) => (
  <DashboardLinkWidget
    title={formatIntlMessage("settings.upload-investment-memorandum.title")}
    text={<FormattedMessage id="settings.upload-investment-memorandum-please-upload-prospectus" />}
    to={appRoutes.documents}
    buttonText={<FormattedMessage id="settings.upload-investment-button.title" />}
    layoutClass={layoutClass}
  />
);

export const UploadInvestmentMemorandum = compose<React.FunctionComponent<IExternalProps>>(
  createErrorBoundary(ErrorBoundaryPanel),
  injectIntlHelpers,
)(UploadInvestmentMemorandumLayout);
