import * as React from "react";

import { ERequestStatus } from "../../../lib/api/KycApi.interfaces";
import { BackupSeedWidget } from "../backup-seed/BackupSeedWidget";
import { KycStatusWidget } from "../kyc-states/KycStatusWidget";
import { VerifyEmailWidget } from "../verify-email/VerifyEmailWidget";

interface IProps {
  isDynamic: boolean;
  isLightWallet?: boolean;
  verifiedEmail?: string;
  backupCodesVerified?: boolean;
  requestStatus?: ERequestStatus;
  layoutClass?:string;
}

export const SettingsWidgets: React.FunctionComponent<IProps> = ({
  isLightWallet,
  backupCodesVerified,
  verifiedEmail,
  isDynamic,
  requestStatus,
  layoutClass
}) => {
  let settingsStepCounter = 0;

  return (
    <>
      {(!isDynamic || !verifiedEmail) && (
          <VerifyEmailWidget step={++settingsStepCounter} layoutClass={layoutClass}/>
      )}
      {(!isDynamic || !backupCodesVerified) &&
        isLightWallet && (
            <BackupSeedWidget step={++settingsStepCounter} layoutClass={layoutClass}/>
        )}
      {(!isDynamic || requestStatus !== ERequestStatus.ACCEPTED) && (
          <KycStatusWidget step={++settingsStepCounter}  layoutClass={layoutClass}/>
      )}
    </>
  );
};
