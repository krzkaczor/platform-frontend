import * as React from "react";
import { Redirect } from "react-router";
import { branch, compose, renderComponent } from "recompose";

import { EKycRequestType, ERequestStatus } from "../../lib/api/KycApi.interfaces";
import { EUserType } from "../../lib/api/users/interfaces";
import { actions } from "../../modules/actions";
import { selectIsUserEmailVerified, selectUserType } from "../../modules/auth/selectors";
import {
  selectKycOutSourcedURL,
  selectKycRequestStatus,
  selectPendingKycRequestType,
} from "../../modules/kyc/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer";
import { appRoutes } from "../appRoutes";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryLayoutAuthorized } from "../shared/errorBoundary/ErrorBoundaryLayoutAuthorized";

const KycLayout = React.lazy(() => import("./KycLayout").then(imp => ({ default: imp.KycLayout })));

interface IStateProps {
  requestLoading?: boolean;
  userType: EUserType;
  requestStatus?: ERequestStatus;
  redirectUrl: string;
  pendingRequestType: EKycRequestType | undefined;
  hasVerifiedEmail: boolean;
}

interface IDispatchProps {
  reopenRequest: () => void;
  goToProfile: () => void;
  goToDashboard: () => void;
}

const Kyc = compose<IStateProps & IDispatchProps, {}>(
  createErrorBoundary(ErrorBoundaryLayoutAuthorized),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      requestLoading:
        state.kyc.individualRequestStateLoading || state.kyc.businessRequestStateLoading,
      requestStatus: selectKycRequestStatus(state),
      redirectUrl: selectKycOutSourcedURL(state.kyc),
      pendingRequestType: selectPendingKycRequestType(state.kyc),
      userType: selectUserType(state)!,
      hasVerifiedEmail: selectIsUserEmailVerified(state.auth),
    }),
    dispatchToProps: dispatch => ({
      reopenRequest: () => {},
      goToProfile: () => dispatch(actions.routing.goToProfile()),
      goToDashboard: () => dispatch(actions.routing.goToDashboard()),
    }),
    options: { pure: false },
  }),
  branch(
    (props: IStateProps) => !props.hasVerifiedEmail,
    renderComponent(() => <Redirect to={appRoutes.profile} />),
  ),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.kyc.kycLoadIndividualRequest());
      dispatch(actions.kyc.kycLoadBusinessRequest());
    },
  }),
  withContainer(LayoutAuthorized),
)(KycLayout);

export { Kyc };
