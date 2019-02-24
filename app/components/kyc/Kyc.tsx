import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Redirect } from "react-router";
import { branch, renderComponent } from "recompose";
import { compose } from "redux";

import { actions } from "../../modules/actions";
import { EUserType } from "../../modules/auth/interfaces";
import { selectIsUserEmailVerified, selectUserType } from "../../modules/auth/selectors";
import { EKycRequestType, ERequestStatus } from "../../modules/kyc/interfaces";
import {
  selectKycOutSourcedURL,
  selectKycRequestStatus,
  selectPendingKycRequestType,
} from "../../modules/kyc/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { appRoutes } from "../appRoutes";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { Button, EButtonLayout } from "../shared/buttons";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryLayoutAuthorized } from "../shared/errorBoundary/ErrorBoundaryLayoutAuthorized";
import { KycPanel } from "./KycPanel";
import { KycRouter } from "./Router";
import { KYCAddDocuments } from "./shared/AddDocuments";

import * as addFile from "../../assets/img/inline_icons/add_file.svg";
import * as arrowLeft from "../../assets/img/inline_icons/arrow_left.svg";

export const personalSteps = [
  {
    label: <FormattedMessage id="kyc.steps.representation" />,
    isChecked: true,
  },
  {
    label: <FormattedMessage id="kyc.steps.personal-details" />,
    isChecked: true,
  },
  {
    label: <FormattedMessage id="kyc.steps.documents-verification" />,
    isChecked: true,
  },
  {
    label: <FormattedMessage id="kyc.steps.review" />,
    isChecked: true,
  },
];

export const businessSteps = [
  {
    label: <FormattedMessage id="kyc.steps.representation" />,
    isChecked: true,
  },
  {
    label: <FormattedMessage id="kyc.steps.company-details" />,
    isChecked: true,
  },
  {
    label: <FormattedMessage id="kyc.steps.legal-representation" />,
    isChecked: true,
  },
  {
    label: <FormattedMessage id="kyc.steps.review" />,
    isChecked: true,
  },
];

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

type IProps = IStateProps & IDispatchProps;

interface IState {
  showAdditionalFileUpload: boolean;
}

class RequestStateInfo extends React.Component<IProps, IState> {
  state = {
    showAdditionalFileUpload: false,
  };

  render(): React.ReactNode {
    const steps =
      this.props.pendingRequestType === EKycRequestType.BUSINESS ? businessSteps : personalSteps;
    const settingsButton = (
      <div className="p-4 text-center">
        <Button
          layout={EButtonLayout.SECONDARY}
          iconPosition="icon-before"
          svgIcon={arrowLeft}
          onClick={this.props.goToProfile}
        >
          <FormattedMessage id="kyc.request-state.go-to-profile" />
        </Button>
      </div>
    );
    if (!this.props.requestStatus) {
      return (
        <KycPanel
          steps={steps}
          description={<FormattedMessage id="kyc.request-state.description" />}
        >
          {settingsButton}
        </KycPanel>
      );
    }
    if (this.props.requestStatus === ERequestStatus.PENDING) {
      return (
        <KycPanel
          title={<FormattedMessage id="kyc.request-state.pending.title" />}
          steps={steps}
          description={<FormattedMessage id="kyc.request-state.pending.description" />}
          testId="kyc-panel-pending"
        >
          {!this.state.showAdditionalFileUpload && (
            <Button
              layout={EButtonLayout.SECONDARY}
              iconPosition="icon-before"
              svgIcon={addFile}
              onClick={() => this.setState({ showAdditionalFileUpload: true })}
            >
              <FormattedMessage id="kyc.request-state.pending.add-files-button" />
            </Button>
          )}
          {this.props.pendingRequestType &&
            this.state.showAdditionalFileUpload && (
              <KYCAddDocuments uploadType={this.props.pendingRequestType} />
            )}
          <br /> <br />
          {settingsButton}
        </KycPanel>
      );
    }
    if (this.props.requestStatus === ERequestStatus.ACCEPTED) {
      return (
        <KycPanel
          title={<FormattedMessage id="kyc.request-state.accepted.title" />}
          steps={steps}
          description={<FormattedMessage id="kyc.request-state.accepted.description" />}
        >
          {settingsButton}
        </KycPanel>
      );
    }
    if (this.props.requestStatus === ERequestStatus.REJECTED) {
      return (
        <KycPanel
          title={<FormattedMessage id="kyc.request-state.rejected.title" />}
          steps={steps}
          description={<FormattedMessage id="kyc.request-state.rejected.description" />}
        >
          {settingsButton}
        </KycPanel>
      );
    }
    if (this.props.requestStatus === ERequestStatus.OUTSOURCED) {
      return (
        <KycPanel
          title={<FormattedMessage id="kyc.request-state.outsourced.title" />}
          steps={steps}
          testId="kyc-panel-outsourced"
          description={<FormattedMessage id="kyc.request-state.outsourced.description" />}
        >
          <div className="p-4 text-center">
            <a href={this.props.redirectUrl}>
              <FormattedMessage id="kyc.request-state.click-here-to-continue" />
            </a>
          </div>
        </KycPanel>
      );
    }
    return <div />;
  }
}

export const KycComponent: React.FunctionComponent<IProps> = props => {
  const router = props.requestStatus === ERequestStatus.DRAFT ? <KycRouter /> : null;

  return (
    <LayoutAuthorized>
      <RequestStateInfo {...props} />
      {router}
    </LayoutAuthorized>
  );
};

export const Kyc = compose<React.FunctionComponent>(
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
)(KycComponent);
