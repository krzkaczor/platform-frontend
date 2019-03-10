import * as React from "react";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { LayoutAuthorized } from "../../layouts/LayoutAuthorized";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryLayoutAuthorized } from "../../shared/errorBoundary/ErrorBoundaryLayoutAuthorized";
import { LoadingIndicator } from "../../shared/loading-indicator";

const EtoRegistrationPanel = React.lazy(() =>
  import("./EtoRegistrationPanel").then(imp => ({ default: imp.EtoRegistrationPanel })),
);

interface IStateProps {
  isLoading: boolean;
}

export const EtoRegisterComponent: React.FunctionComponent<IStateProps> = ({ isLoading }) => (
  <LayoutAuthorized>{isLoading ? <LoadingIndicator /> : <EtoRegistrationPanel />}</LayoutAuthorized>
);

export const EtoRegister = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryLayoutAuthorized),
  onEnterAction({ actionCreator: d => d(actions.etoFlow.loadIssuerEto()) }),
  appConnect<IStateProps>({
    stateToProps: s => ({
      isLoading: s.etoFlow.loading,
    }),
  }),
)(EtoRegisterComponent);
