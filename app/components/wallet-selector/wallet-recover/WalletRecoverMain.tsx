import * as React from "react";
import { compose } from "redux";

import { withContainer } from "../../../utils/withContainer";
import { LayoutRegisterLogin } from "../../layouts/LayoutRegisterLogin";
import { LayoutUnauthorized } from "../../layouts/LayoutUnauthorized";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryLayoutUnauthorized } from "../../shared/errorBoundary/ErrorBoundaryLayoutUnauthorized";

const RecoverRouter = React.lazy(() =>
  import("./router/RecoverRouter").then(imp => ({ default: imp.RecoverRouter })),
);

export const WalletRecoverMainComponent: React.FunctionComponent = () => (
  <LayoutRegisterLogin>
    <RecoverRouter />
  </LayoutRegisterLogin>
);

export const WalletRecoverMain: React.FunctionComponent = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryLayoutUnauthorized),
  withContainer(LayoutUnauthorized),
)(WalletRecoverMainComponent);
