import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../modules/actions";
import { selectIssuerEtoWithCompanyAndContract } from "../../modules/eto-flow/selectors";
import { TBlEtoWithCompanyAndContract } from "../../modules/public-etos/interfaces/interfaces";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryLayoutAuthorized } from "../shared/errorBoundary/ErrorBoundaryLayoutAuthorized";
import { LoadingIndicator } from "../shared/loading-indicator";
import { EtoView } from "./shared/EtoView";

type TProps = {
  eto: TBlEtoWithCompanyAndContract;
};

type TStateProps = Partial<TProps>;

export const EtoIssuerView = compose<TProps, {}>(
  createErrorBoundary(ErrorBoundaryLayoutAuthorized),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.etoFlow.loadIssuerEto());
    },
  }),
  appConnect<TStateProps>({
    stateToProps: state => ({
      eto: selectIssuerEtoWithCompanyAndContract(state),
    }),
  }),
  withContainer(LayoutAuthorized),
  branch<TStateProps>(props => !props.eto, renderComponent(LoadingIndicator)),
)(EtoView);
