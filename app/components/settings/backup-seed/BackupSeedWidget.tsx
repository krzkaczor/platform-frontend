import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { selectBackupCodesVerified } from "../../../modules/auth/selectors";
import { appConnect } from "../../../store";
import { ButtonLink, EButtonLayout } from "../../shared/buttons";
import { Panel } from "../../shared/Panel";
import { profileRoutes } from "../routes";

import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as successIcon from "../../../assets/img/notifications/success.svg";
import * as warningIcon from "../../../assets/img/notifications/warning.svg";
import * as styles from "./BackupSeedWidget.module.scss";

interface IStateProps {
  backupCodesVerified?: boolean;
}

interface IOwnProps {
  step: number;
  layoutClass?: string;
}

const BackupSeedWidgetComponent: React.FunctionComponent<IStateProps & IOwnProps> = ({
  backupCodesVerified,
  layoutClass
}) => {
  return (
    <Panel
      className={cn("h-100", layoutClass)}
      headerText={<FormattedMessage id="settings.backup-seed-widget.header" />}
      rightComponent={
        backupCodesVerified ? (
          <img src={successIcon} className={styles.icon} aria-hidden="true" />
        ) : (
          <img src={warningIcon} className={styles.icon} aria-hidden="true" />
        )
      }
      data-test-id="profile.backup-seed-widget"
    >
      {backupCodesVerified ? (
        <section
          data-test-id="backup-seed-verified-section"
          className={cn(styles.section, "d-flex flex-wrap align-content-around")}
        >
          <p className={cn(styles.text, "pt-2")}>
            <FormattedMessage id="settings.backup-seed-widget.backed-up-seed" />
          </p>
          <ButtonLink
            to={profileRoutes.seedBackup}
            layout={EButtonLayout.SECONDARY}
            iconPosition="icon-after"
            svgIcon={arrowRight}
            data-test-id="backup-seed-verified-section.view-again"
          >
            <FormattedMessage id="settings.backup-seed-widget.view-again" />
          </ButtonLink>
        </section>
      ) : (
        <section
          data-test-id="backup-seed-unverified-section"
          className={cn(styles.section, "d-flex flex-wrap align-content-around")}
        >
          <p className={cn(styles.text, "pt-2")}>
            <FormattedMessage id="settings.backup-seed-widget.write-down-recovery-phrase" />
          </p>
          <ButtonLink
            to={profileRoutes.seedBackup}
            data-test-id="backup-seed-widget-link-button"
            layout={EButtonLayout.SECONDARY}
            iconPosition="icon-after"
            svgIcon={arrowRight}
          >
            <FormattedMessage id="settings.backup-seed-widget.backup-phrase" />
          </ButtonLink>
        </section>
      )}
    </Panel>
  );
};

const BackupSeedWidget = compose<React.FunctionComponent<IOwnProps>>(
  appConnect<IStateProps, IOwnProps>({
    stateToProps: s => ({
      backupCodesVerified: selectBackupCodesVerified(s),
    }),
  }),
)(BackupSeedWidgetComponent);

export { BackupSeedWidget, BackupSeedWidgetComponent };
