import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { RouteComponentProps, withRouter } from "react-router";
import { Col, Row } from "reactstrap";

import { IWalletPrivateData } from "../../../modules/web3/reducer";
import { TTranslatedString } from "../../../types";
import { HeaderProgressStepper } from "../../shared/HeaderProgressStepper";
import { Panel } from "../../shared/Panel";
import { BackupSeedDisplay } from "./BackupSeedDisplay";
import { BackupSeedIntro } from "./BackupSeedIntro";
import { BackupSeedVerify } from "./BackupSeedVerify";

enum EBackupStep {
  INTRO = 1,
  FIRST_HALF = 2,
  VERIFY = 3,
}

interface IProps {
  walletPrivateData: IWalletPrivateData;
  verifyBackupPhrase: () => void;
  onCancel: () => void;
  backupCodesVerified: boolean;
}

interface IState {
  backupStep: EBackupStep;
}

class BackupSeedFlowContainerLayout extends React.Component<
  IProps & RouteComponentProps<any>,
  IState
> {
  state = {
    backupStep: EBackupStep.INTRO,
  };

  onBack = () => {
    this.props.history.goBack();
  };

  onNext = () => {
    this.setState(s => ({
      backupStep: s.backupStep + 1,
    }));
  };

  renderBackupPage(backupStep: EBackupStep): React.ReactNode {
    const { backupCodesVerified } = this.props;

    switch (backupStep) {
      case EBackupStep.INTRO:
        return <BackupSeedIntro onBack={this.onBack} onNext={this.onNext} />;
      case EBackupStep.FIRST_HALF:
        return (
          <BackupSeedDisplay
            onBack={this.onBack}
            onNext={() => (backupCodesVerified ? this.props.onCancel() : this.onNext())}
            walletPrivateData={this.props.walletPrivateData}
          />
        );
      case EBackupStep.VERIFY:
        return (
          <BackupSeedVerify
            onBack={this.onBack}
            onNext={this.props.verifyBackupPhrase}
            words={this.props.walletPrivateData.seed}
          />
        );
      default:
        throw new Error("Backup step is unknown");
    }
  }

  renderDescriptionText(backupStep: EBackupStep): TTranslatedString {
    switch (backupStep) {
      case EBackupStep.INTRO:
        return <FormattedMessage id="settings.backup-seed-flow-container.follow-instructions" />;
      case EBackupStep.FIRST_HALF:
        return <FormattedMessage id="settings.backup-seed-flow-container.write-seed-on-paper" />;
      case EBackupStep.VERIFY:
        return (
          <FormattedHTMLMessage
            tagName="span"
            id="settings.backup-seed-flow-container.confirm-seed"
          />
        );
      default:
        throw new Error("Backup step is unknown");
    }
  }

  render(): React.ReactNode {
    const steps = this.props.backupCodesVerified ? 3 : 4;
    return (
      <Row>
        <Col md={12} lg={{ size: 10, offset: 1 }} xl={{ size: 8, offset: 2 }}>
          <Panel>
            <HeaderProgressStepper
              steps={steps}
              currentStep={this.state.backupStep}
              headerText={
                <FormattedMessage id="settings.backup-seed-flow-container.safety-message" />
              }
              descText={this.renderDescriptionText(this.state.backupStep)}
              warning
            />
            {this.renderBackupPage(this.state.backupStep)}
          </Panel>
        </Col>
      </Row>
    );
  }
}

const BackupSeedFlowContainer = withRouter(BackupSeedFlowContainerLayout);

export { BackupSeedFlowContainer };
