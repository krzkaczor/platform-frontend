import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { appRoutes } from "../../appRoutes";
import { DashboardLinkWidget } from "../../shared/dashboard-link-widget/DashboardLinkWidget";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryPanel } from "../../shared/errorBoundary/ErrorBoundaryPanel";

export const UploadTermSheetWidgetComponent: React.FunctionComponent<{ layoutClass?: string }> = ({
  layoutClass,
}) => (
  <DashboardLinkWidget
    title={<FormattedMessage id={"settings.upload-term-sheet.title"} />}
    text={<FormattedMessage id="settings.upload-term-sheet-please-upload-term-sheet" />}
    to={appRoutes.documents}
    buttonText={<FormattedMessage id="settings.upload-term-sheet.title" />}
    buttonTid="dashboard-upload-termsheet"
    layoutClass={layoutClass}
  />
);

export const UploadTermSheetWidget = compose(createErrorBoundary(ErrorBoundaryPanel))(
  UploadTermSheetWidgetComponent,
);
