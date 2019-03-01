import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { appRoutes } from "../../appRoutes";
import { DashboardLinkWidget } from "../../shared/dashboard-link-widget/DashboardLinkWidget";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryPanel } from "../../shared/errorBoundary/ErrorBoundaryPanel";

interface IExternalProps {
  layoutClass?: string;
}

export const UploadProspectusWidgetComponent: React.FunctionComponent<IExternalProps> = ({layoutClass}) => (
  <DashboardLinkWidget
    title={<FormattedMessage id={"settings.upload-prospectus.title"} />}
    text={<FormattedMessage id="settings.upload-prospectus-please-upload-prospectus" />}
    to={appRoutes.documents}
    buttonText={<FormattedMessage id="settings.upload-prospectus.title" />}
    layoutClass={layoutClass}
  />
);

export const UploadProspectusWidget = compose<React.FunctionComponent<IExternalProps>>(createErrorBoundary(ErrorBoundaryPanel))(
  UploadProspectusWidgetComponent,
);
