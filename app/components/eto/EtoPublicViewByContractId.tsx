import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../modules/actions";
import { EUserType } from "../../modules/auth/interfaces";
import { selectUserType } from "../../modules/auth/selectors";
import { TBlEtoWithCompanyAndContract } from "../../modules/public-etos/interfaces/interfaces";
import { selectEtoWithCompanyAndContractById } from "../../modules/public-etos/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { LayoutBase } from "../layouts/LayoutBase";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryLayoutAuthorized } from "../shared/errorBoundary/ErrorBoundaryLayoutAuthorized";
import { ErrorBoundaryLayoutBase } from "../shared/errorBoundary/ErrorBoundaryLayoutBase";
import { LoadingIndicator } from "../shared/loading-indicator";
import { EtoView } from "./shared/EtoView";

interface IStateProps {
  eto?: TBlEtoWithCompanyAndContract;
  userType?: EUserType;
}

interface IRouterParams {
  etoId: string;
}

interface IDispatchProps {
  loadEto: () => void;
}

type TProps = {
  eto: TBlEtoWithCompanyAndContract;
};

export const EtoPublicViewByContractId = compose<TProps, IRouterParams>(
  appConnect<IStateProps, IDispatchProps, IRouterParams>({
    stateToProps: (state, props) => ({
      userType: selectUserType(state),
      eto: selectEtoWithCompanyAndContractById(state, props.etoId),
    }),
  }),
  onEnterAction({
    actionCreator: (dispatch, props) => {
      dispatch(actions.publicEtos.loadEto(props.etoId));
    },
  }),
  branch<IStateProps>(
    props => props.userType === EUserType.INVESTOR,
    createErrorBoundary(ErrorBoundaryLayoutAuthorized),
    createErrorBoundary(ErrorBoundaryLayoutBase),
  ),
  branch<IStateProps>(
    props => props.userType === EUserType.INVESTOR,
    withContainer(LayoutAuthorized),
    withContainer(LayoutBase),
  ),
  branch<IStateProps>(props => !props.eto, renderComponent(LoadingIndicator)),
)(EtoView);
