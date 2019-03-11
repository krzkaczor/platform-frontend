import * as React from "react";
import { Col, Row } from "reactstrap";
import { branch, renderComponent } from "recompose";
import { compose } from "redux";

import { actions } from "../../../../modules/actions";
import { selectIsUserFullyVerified } from "../../../../modules/auth/selectors";
import { EBankTransferType } from "../../../../modules/bank-transfer-flow/reducer";
import { ETokenType } from "../../../../modules/tx/types";
import {
  selectICBMLockedEtherBalance,
  selectICBMLockedEtherBalanceEuroAmount,
  selectICBMLockedEuroTokenBalance,
  selectICBMLockedEuroTotalAmount,
  selectICBMLockedWalletHasFunds,
  selectIsEtherUpgradeTargetSet,
  selectIsEuroUpgradeTargetSet,
  selectIsLoading,
  selectLiquidEtherBalance,
  selectLiquidEtherBalanceEuroAmount,
  selectLiquidEuroTokenBalance,
  selectLiquidEuroTotalAmount,
  selectLockedEtherBalance,
  selectLockedEtherBalanceEuroAmount,
  selectLockedEuroTokenBalance,
  selectLockedEuroTotalAmount,
  selectLockedWalletHasFunds,
  selectWalletError,
} from "../../../../modules/wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../../../../modules/web3/selectors";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { LoadingIndicator } from "../../../shared/loading-indicator";
import { ClaimedDividends } from "../../claimed-dividends/ClaimedDividends";
import { IcbmWallet, IIcbmWalletValues } from "../../wallet-balance/IcbmWallet";
import { LockedWallet } from "../../wallet-balance/LockedWallet";
import { UnlockedETHWallet } from "../../wallet-balance/UnlockedETHWallet";
import { UnlockedNEURWallet } from "../../wallet-balance/UnlockedNEURWallet";
import { IWalletValues } from "../../wallet-balance/WalletBalance";

const transactions: any[] = [];

interface IStateProps {
  error?: string;
  liquidWalletData: IWalletValues;
  lockedWalletData: IWalletValues & { hasFunds: boolean };
  icbmWalletData: IIcbmWalletValues;
  userAddress: string;
  isLoading: boolean;
  isUserFullyVerified: boolean;
}

interface IDispatchProps {
  depositEthUnlockedWallet: () => void;
  withdrawEthUnlockedWallet: () => void;
  upgradeWalletEtherToken: () => void;
  upgradeWalletEuroToken: () => void;
  purchaseNEur: () => void;
  verifyBankAccount: () => void;
  redeemNEur: () => void;
}

type TProps = IStateProps & IDispatchProps;

export const WalletStartComponent: React.FunctionComponent<TProps> = ({
  userAddress,
  liquidWalletData,
  lockedWalletData,
  icbmWalletData,
  depositEthUnlockedWallet,
  withdrawEthUnlockedWallet,
  upgradeWalletEuroToken,
  upgradeWalletEtherToken,
  purchaseNEur,
  verifyBankAccount,
  redeemNEur,
  isUserFullyVerified,
}) => (
  <>
    <Row className="row-gutter-top" data-test-id="wallet-start-container">
      <Col lg={6} xs={12}>
        <UnlockedETHWallet
          className="h-100"
          ethAmount={liquidWalletData.ethAmount}
          ethEuroAmount={liquidWalletData.ethEuroAmount}
          totalEuroAmount={liquidWalletData.totalEuroAmount}
          depositEth={depositEthUnlockedWallet}
          withdrawEth={withdrawEthUnlockedWallet}
          address={userAddress}
        />
      </Col>

      <Col lg={6} xs={12}>
        <UnlockedNEURWallet
          className="h-100"
          neuroAmount={liquidWalletData.neuroAmount}
          neuroEuroAmount={liquidWalletData.neuroEuroAmount}
          onPurchase={purchaseNEur}
          onRedeem={redeemNEur}
          onVerify={verifyBankAccount}
          isUserFullyVerified={isUserFullyVerified}
        />
      </Col>

      {lockedWalletData.hasFunds && (
        <Col lg={6} xs={12}>
          <LockedWallet className="h-100" data={lockedWalletData} />
        </Col>
      )}

      {icbmWalletData.hasFunds && (
        <Col lg={6} xs={12}>
          <IcbmWallet
            className="h-100"
            onUpgradeEuroClick={upgradeWalletEuroToken}
            onUpgradeEtherClick={upgradeWalletEtherToken}
            data={icbmWalletData}
          />
        </Col>
      )}
    </Row>

    {process.env.NF_WALLET_MY_PROCEEDS_VISIBLE === "1" && (
      <Row>
        <Col className="my-4">
          <ClaimedDividends className="h-100" totalEurValue="0" recentPayouts={transactions} />
        </Col>
      </Row>
    )}
  </>
);

export const WalletStart = compose<React.FunctionComponent>(
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.wallet.loadWalletData());

      dispatch(actions.kyc.loadBankAccountDetails());
    },
  }),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      userAddress: selectEthereumAddressWithChecksum(state),
      // Wallet Related State
      isLoading: selectIsLoading(state.wallet),
      error: selectWalletError(state.wallet),
      isUserFullyVerified: selectIsUserFullyVerified(state),
      liquidWalletData: {
        ethAmount: selectLiquidEtherBalance(state.wallet),
        ethEuroAmount: selectLiquidEtherBalanceEuroAmount(state),
        neuroAmount: selectLiquidEuroTokenBalance(state.wallet),
        neuroEuroAmount: selectLiquidEuroTokenBalance(state.wallet),
        totalEuroAmount: selectLiquidEuroTotalAmount(state),
      },
      lockedWalletData: {
        hasFunds: selectLockedWalletHasFunds(state),
        ethAmount: selectLockedEtherBalance(state),
        ethEuroAmount: selectLockedEtherBalanceEuroAmount(state),
        neuroAmount: selectLockedEuroTokenBalance(state.wallet),
        neuroEuroAmount: selectLockedEuroTokenBalance(state.wallet),
        totalEuroAmount: selectLockedEuroTotalAmount(state),
      },
      icbmWalletData: {
        hasFunds: selectICBMLockedWalletHasFunds(state),
        ethAmount: selectICBMLockedEtherBalance(state),
        ethEuroAmount: selectICBMLockedEtherBalanceEuroAmount(state),
        neuroAmount: selectICBMLockedEuroTokenBalance(state),
        neuroEuroAmount: selectICBMLockedEuroTokenBalance(state),
        totalEuroAmount: selectICBMLockedEuroTotalAmount(state),
        isEtherUpgradeTargetSet: selectIsEtherUpgradeTargetSet(state),
        isEuroUpgradeTargetSet: selectIsEuroUpgradeTargetSet(state),
      },
    }),
    dispatchToProps: dispatch => ({
      depositEthUnlockedWallet: () => dispatch(actions.depositEthModal.showDepositEthModal()),
      withdrawEthUnlockedWallet: () => dispatch(actions.txTransactions.startWithdrawEth()),
      upgradeWalletEuroToken: () => dispatch(actions.txTransactions.startUpgrade(ETokenType.EURO)),
      upgradeWalletEtherToken: () =>
        dispatch(actions.txTransactions.startUpgrade(ETokenType.ETHER)),
      purchaseNEur: () =>
        dispatch(actions.bankTransferFlow.startBankTransfer(EBankTransferType.PURCHASE)),
      verifyBankAccount: () =>
        dispatch(actions.bankTransferFlow.startBankTransfer(EBankTransferType.VERIFY)),
      redeemNEur: () => dispatch(actions.txTransactions.startWithdrawNEuro()),
    }),
  }),
  branch<IStateProps>(props => props.isLoading, renderComponent(LoadingIndicator)),
)(WalletStartComponent);
