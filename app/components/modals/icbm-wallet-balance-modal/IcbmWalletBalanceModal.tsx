import BigNumber from "bignumber.js";
import * as React from "react";
import { Modal } from "reactstrap";
import { compose } from "recompose";

import { actions } from "../../../modules/actions";
import { TWalletMigrationSteps } from "../../../modules/icbm-wallet-balance-modal/interfaces/intefaces";
import { IBlWalletMigrationData } from "../../../modules/icbm-wallet-balance-modal/interfaces/WalletMigrationData";
import {
  selectEtherBalanceIcbmModal,
  selectEtherNeumarksDueIcbmModal,
  selectIcbmModalIsFirstTransactionDone,
  selectIcbmModalIsMigrating,
  selectIcbmModalIsSecondTransactionDone,
  selectIcbmWalletEthAddress,
  selectWalletMigrationCurrentStep,
  selectWalletMigrationData,
} from "../../../modules/icbm-wallet-balance-modal/selectors";
import { SelectIsVerificationFullyDone } from "../../../modules/selectors";
import { ETokenType } from "../../../modules/tx/interfaces";
import {
  selectIsEtherUpgradeTargetSet,
  selectLockedWalletConnected,
} from "../../../modules/wallet/selectors";
import { appConnect } from "../../../store";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { ModalComponentBody } from "../ModalComponentBody";
import { BalanceModal } from "./BalanceModal";
import { MigrateModal } from "./MigrateModal";

import * as styles from "./IcbmWalletBalanceModal.module.scss";

interface IStateProps {
  isOpen: boolean;
  etherBalance: BigNumber;
  ethAddress?: string;
  neumarksDue: BigNumber;
  isLoading: boolean;
  walletMigrationData?: ReadonlyArray<IBlWalletMigrationData>;
  isVerificationFullyDone: boolean;
  lockedWalletConnected: boolean;
  currentMigrationStep: TWalletMigrationSteps;
  isEtherMigrationTargetSet: boolean;
  isWalletMigrating: boolean;
  isFirstTxDone: boolean;
  isSecondTxDone: boolean;
}

interface IDispatchProps {
  onCancel: () => void;
  onGotoWallet: () => void;
  startWalletMigration: () => void;
  goToNextStep: () => void;
  downloadICBMAgreement: () => void;
}

type IProps = IStateProps &
  IDispatchProps & {
    // For testing purpose and visual regression
    isMigrating?: boolean;
    success?: boolean;
  };

export const IcbmWalletBalanceComponentInner: React.FunctionComponent<IProps> = ({
  onGotoWallet,
  isVerificationFullyDone,
  walletMigrationData,
  ethAddress,
  neumarksDue,
  isEtherMigrationTargetSet,
  etherBalance,
  isLoading,
  startWalletMigration,
  isWalletMigrating,
  isFirstTxDone,
  isSecondTxDone,
  currentMigrationStep,
  goToNextStep,
  downloadICBMAgreement,
}) => (
  <div className={styles.content}>
    {!walletMigrationData || !ethAddress || isLoading ? (
      <LoadingIndicator />
    ) : isWalletMigrating ? (
      <MigrateModal
        walletMigrationData={walletMigrationData[currentMigrationStep - 1]}
        migrationStep={currentMigrationStep}
        onGotoWallet={onGotoWallet}
        goToNextStep={goToNextStep}
        success={
          (currentMigrationStep === 1 && isFirstTxDone) ||
          (currentMigrationStep === 2 && isSecondTxDone)
        }
        // TODO: Make better
      />
    ) : (
      <BalanceModal
        startMigration={startWalletMigration}
        isVerificationFullyDone={isVerificationFullyDone && isEtherMigrationTargetSet}
        ethAddress={ethAddress}
        neumarksDue={neumarksDue}
        etherBalance={etherBalance}
        downloadICBMAgreement={downloadICBMAgreement}
      />
    )}
  </div>
);

const IcbmWalletBalanceComponent: React.FunctionComponent<IProps> = (props: IProps) => {
  return (
    <Modal isOpen={props.isOpen} toggle={props.onCancel}>
      <ModalComponentBody onClose={props.onCancel}>
        <IcbmWalletBalanceComponentInner {...props} />
      </ModalComponentBody>
    </Modal>
  );
};

const IcbmWalletBalanceModal = compose<any, any>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      isOpen: state.icbmWalletBalanceModal.isOpen,
      isLoading: state.icbmWalletBalanceModal.loading,
      ethAddress: selectIcbmWalletEthAddress(state),
      neumarksDue: selectEtherNeumarksDueIcbmModal(state),
      etherBalance: selectEtherBalanceIcbmModal(state),
      isVerificationFullyDone: SelectIsVerificationFullyDone(state),
      walletMigrationData: selectWalletMigrationData(state.icbmWalletBalanceModal),
      lockedWalletConnected: selectLockedWalletConnected(state),
      currentMigrationStep: selectWalletMigrationCurrentStep(state),
      isEtherMigrationTargetSet: selectIsEtherUpgradeTargetSet(state),
      isWalletMigrating: selectIcbmModalIsMigrating(state),
      isFirstTxDone: selectIcbmModalIsFirstTransactionDone(state),
      isSecondTxDone: selectIcbmModalIsSecondTransactionDone(state),
    }),
    dispatchToProps: dispatch => ({
      onCancel: () => dispatch(actions.icbmWalletBalanceModal.hideIcbmWalletBalanceModal()),
      onGotoWallet: () => {
        dispatch(actions.icbmWalletBalanceModal.hideIcbmWalletBalanceModal());
        dispatch(actions.routing.goToWallet());
      },
      startWalletMigration: () => dispatch(actions.icbmWalletBalanceModal.startMigrationFlow()),
      goToNextStep: () => dispatch(actions.icbmWalletBalanceModal.setMigrationStepToNextStep()),
      downloadICBMAgreement: () =>
        dispatch(actions.icbmWalletBalanceModal.downloadICBMWalletAgreement(ETokenType.ETHER)),
    }),
  }),
)(IcbmWalletBalanceComponent);

export { IcbmWalletBalanceComponent, IcbmWalletBalanceModal };
