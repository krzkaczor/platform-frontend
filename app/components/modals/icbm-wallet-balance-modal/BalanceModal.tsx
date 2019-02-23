import * as React from "react";

import { FormattedMessage } from "react-intl-phraseapp";
import { Button, EButtonLayout } from "../../shared/buttons";
import { DocumentTemplateButton } from "../../shared/DocumentLink";
import { HighlightedField } from "../../shared/HighlightedField";
import { ECurrency, Money } from "../../shared/Money";
import { SectionHeader } from "../../shared/SectionHeader";

import BigNumber from "bignumber.js";
import * as iconEth from "../../../assets/img/eth_icon.svg";
import * as iconNeu from "../../../assets/img/neu_icon.svg";
import * as styles from "./IcbmWalletBalanceModal.module.scss";

interface IBalanceModal {
  isVerificationFullyDone: boolean;
  startMigration: () => void;
  ethAddress: string;
  neumarksDue: BigNumber;
  etherBalance: BigNumber;
  downloadICBMAgreement: () => void;
}

const BalanceFooter: React.FunctionComponent<{
  startMigration: () => void;
  disabled?: boolean;
  downloadICBMAgreement: () => void;
}> = ({ startMigration, disabled, downloadICBMAgreement }) => {
  return (
    <div className="d-flex flex-column justify-content-center">
      {disabled && (
        <p className="text-center">
          <FormattedMessage id="settings.modal.icbm-wallet-balance.warning-message" />
        </p>
      )}
      {!disabled && (
        <p className="text-center">
          <DocumentTemplateButton
            onClick={() => downloadICBMAgreement()}
            title={<FormattedMessage id="wallet.icbm.reservation-agreement" />}
          />
        </p>
      )}
      <Button
        onClick={startMigration}
        disabled={disabled}
        layout={EButtonLayout.SECONDARY}
        data-test-id="modals.icbm-balance-modal.balance-footer.generate-transaction"
      >
        <FormattedMessage id="settings.modal.icbm-wallet-balance.button" />
      </Button>
    </div>
  );
};

export const BalanceModal: React.FunctionComponent<IBalanceModal> = ({
  isVerificationFullyDone,
  startMigration,
  ethAddress = "", //fixme invalid value
  neumarksDue = new BigNumber("0"),
  etherBalance = new BigNumber("0"),
  downloadICBMAgreement,
}) => {
  return (
    <>
      <SectionHeader className={styles.header}>
        <FormattedMessage id="settings.modal.icbm-wallet-balance.title.balance" />
      </SectionHeader>
      <HighlightedField
        label={
          <FormattedMessage id="settings.modal.icbm-wallet-balance.icbm-wallet-address.label" />
        }
        value={ethAddress}
      />
      <HighlightedField
        label={<FormattedMessage id="settings.modal.icbm-wallet-balance.neu-balance.label" />}
        dataTestId="profile.modal.icbm-wallet-balance.neu-balance"
        value={<Money currency={ECurrency.NEU} value={neumarksDue} />}
        icon={iconNeu}
      />
      <HighlightedField
        label={<FormattedMessage id="settings.modal.icbm-wallet-balance.eth-balance.label" />}
        dataTestId="profile.modal.icbm-wallet-balance.eth-balance"
        value={<Money value={etherBalance} currency={ECurrency.ETH} />}
        icon={iconEth}
      />
      <BalanceFooter
        disabled={!isVerificationFullyDone}
        startMigration={startMigration}
        downloadICBMAgreement={downloadICBMAgreement}
      />
    </>
  );
};
