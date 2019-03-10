import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EKycRequestType, ERequestStatus } from "../../lib/api/KycApi.interfaces";
import { EUserType } from "../../lib/api/users/interfaces";
import { Button, EButtonLayout } from "../shared/buttons/Button";
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

type IProps = {
  requestLoading?: boolean;
  userType: EUserType;
  requestStatus?: ERequestStatus;
  redirectUrl: string;
  pendingRequestType: EKycRequestType | undefined;
  hasVerifiedEmail: boolean;
  reopenRequest: () => void;
  goToProfile: () => void;
  goToDashboard: () => void;
};

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

const KycLayout: React.FunctionComponent<IProps> = props => {
  const router = props.requestStatus === ERequestStatus.DRAFT ? <KycRouter /> : null;

  return (
    <>
      <RequestStateInfo {...props} />
      {router}
    </>
  );
};

export { KycLayout };
