import BigNumber from "bignumber.js";
import * as Web3Utils from "web3-utils";
import { ETHEREUM_ZERO_ADDRESS } from "../../config/constants";
import { IAppState } from "../../store";
import { selectEtherPriceEur, selectNeuPriceEur } from "../shared/tokenPrice/selectors";
import { selectTxGasCostEthUlps } from "../tx/sender/selectors";
import { IStateWallet } from "./interfaces";

/**
 * Simple State Selectors
 */
export const selectNeuBalanceEuroAmount = (state: IAppState): BigNumber =>
  selectNeuPriceEur(state).mul(selectNeuBalance(state.wallet));

export const selectNeuBalance = (state: IStateWallet): BigNumber =>
  new BigNumber((state.data && state.data.neuBalance) || "0");

export const selectEtherTokenBalance = (state: IAppState): BigNumber =>
  new BigNumber((state.wallet.data && state.wallet.data.etherTokenBalance) || "0");

export const selectEtherTokenBalanceAsBigNumber = (state: IAppState): BigNumber =>
  new BigNumber((state.wallet.data && state.wallet.data.etherTokenBalance) || "0");

export const selectEtherBalance = (state: IAppState): BigNumber =>
  new BigNumber((state.wallet.data && state.wallet.data.etherBalance) || "0");

/**
 * Liquid Assets
 */
export const selectLiquidEtherBalance = (state: IStateWallet): BigNumber =>
  (state.data &&
    new BigNumber(state.data.etherBalance).add(new BigNumber(state.data.etherTokenBalance))) ||
  new BigNumber("0");

export const selectLiquidEtherBalanceEuroAmount = (state: IAppState): BigNumber =>
  selectEtherPriceEur(state).mul(selectLiquidEtherBalance(state.wallet));

export const selectLiquidEuroTokenBalance = (state: IStateWallet): BigNumber =>
  new BigNumber((state.data && state.data.euroTokenBalance) || "0");

export const selectLiquidEuroTotalAmount = (state: IAppState): BigNumber =>
  selectLiquidEuroTokenBalance(state.wallet).add(selectLiquidEtherBalanceEuroAmount(state));

/**
 * Locked Wallet Assets
 */
export const selectLockedEtherBalance = (state: IStateWallet): BigNumber =>
  new BigNumber(
    (state.data &&
      state.data.etherTokenLockedWallet &&
      state.data.etherTokenLockedWallet.LockedBalance) ||
      "0",
  );

export const selectLockedEtherBalanceEuroAmount = (state: IAppState): BigNumber =>
  selectEtherPriceEur(state).mul(selectLockedEtherBalance(state.wallet));

export const selectLockedEuroTokenBalance = (state: IStateWallet): BigNumber =>
  new BigNumber(
    (state.data &&
      state.data.euroTokenLockedWallet &&
      state.data.euroTokenLockedWallet.LockedBalance) ||
      "0",
  );

export const selectLockedEuroTotalAmount = (state: IAppState): BigNumber =>
  selectLockedEtherBalanceEuroAmount(state).add(selectLockedEuroTokenBalance(state.wallet));

export const selectLockedWalletHasFunds = (state: IAppState): boolean =>
  selectLockedEuroTotalAmount(state).isZero();

/**
 * ICBM Wallet Assets
 */
export const selectICBMLockedEtherBalance = (state: IAppState): BigNumber =>
  new BigNumber(
    (state.wallet.data &&
      state.wallet.data.etherTokenICBMLockedWallet &&
      state.wallet.data.etherTokenICBMLockedWallet.LockedBalance) ||
      "0",
  );

export const selectICBMLockedEtherBalanceEuroAmount = (state: IAppState): BigNumber =>
  selectEtherPriceEur(state).mul(selectICBMLockedEtherBalance(state));

export const selectICBMLockedEuroTokenBalance = (state: IAppState): BigNumber =>
  new BigNumber(
    (state.wallet &&
      state.wallet.data &&
      state.wallet.data.euroTokenICBMLockedWallet &&
      state.wallet.data.euroTokenICBMLockedWallet.LockedBalance) ||
      "0",
  );

export const selectICBMLockedEuroTotalAmount = (state: IAppState): BigNumber =>
  selectICBMLockedEtherBalanceEuroAmount(state).add(selectICBMLockedEuroTokenBalance(state));

export const selectICBMLockedWalletHasFunds = (state: IAppState): boolean =>
  !selectICBMLockedEuroTokenBalance(state).isZero() ||
  !selectICBMLockedEtherBalance(state).isZero();

/**
 * Total wallet assets value
 */
export const selectTotalEtherBalance = (state: IAppState): BigNumber =>
  selectLiquidEtherBalance(state.wallet)
    .add(selectLockedEtherBalance(state.wallet))
    .add(selectICBMLockedEtherBalance(state));

export const selectTotalEtherBalanceEuroAmount = (state: IAppState): BigNumber =>
  selectLiquidEtherBalanceEuroAmount(state)
    .add(selectLockedEtherBalanceEuroAmount(state))
    .add(selectICBMLockedEtherBalanceEuroAmount(state));

export const selectTotalEuroTokenBalance = (state: IAppState): BigNumber =>
  selectLiquidEuroTokenBalance(state.wallet)
    .add(selectLockedEuroTokenBalance(state.wallet))
    .add(selectICBMLockedEuroTokenBalance(state));

export const selectTotalEuroBalance = (state: IAppState): BigNumber =>
  selectLiquidEuroTotalAmount(state)
    .add(selectLockedEuroTotalAmount(state))
    .add(selectICBMLockedEuroTotalAmount(state));

export const selectEtherNeumarksDue = (state: IStateWallet): BigNumber =>
  new BigNumber(
    (state.data &&
      state.data.etherTokenICBMLockedWallet &&
      state.data.etherTokenICBMLockedWallet.neumarksDue) ||
      "0",
  );

export const selectEurNeumarksDue = (state: IStateWallet): BigNumber =>
  new BigNumber(
    (state.data &&
      state.data.euroTokenICBMLockedWallet &&
      state.data.euroTokenICBMLockedWallet.neumarksDue) ||
      "0",
  );

export const selectIcbmWalletConnected = (state: IStateWallet): boolean =>
  !!(
    (state.data && state.data.etherTokenICBMLockedWallet.unlockDate !== "0") || //todo invalid/zero value should be null
    (state.data && state.data.euroTokenICBMLockedWallet.unlockDate !== "0")
  );

export const selectLockedWalletConnected = (state: IAppState): boolean =>
  !!(
    (state.wallet.data && state.wallet.data.etherTokenLockedWallet.unlockDate !== "0") || //todo invalid/zero value should be null
    (state.wallet.data && state.wallet.data.euroTokenLockedWallet.unlockDate !== "0")
  );

export const selectIsLoading = (state: IStateWallet): boolean => state.loading;

export const selectWalletError = (state: IStateWallet): string | undefined => state.error;

export const selectIsEtherUpgradeTargetSet = (state: IAppState): boolean =>
  state.wallet.data &&
  Web3Utils.isAddress(state.wallet.data.etherTokenUpgradeTarget) &&
  state.wallet.data.etherTokenUpgradeTarget! !== ETHEREUM_ZERO_ADDRESS;

export const selectIsEuroUpgradeTargetSet = (state: IAppState): boolean =>
  state.wallet.data &&
  Web3Utils.isAddress(state.wallet.data.euroTokenUpgradeTarget) &&
  state.wallet.data.euroTokenUpgradeTarget! !== ETHEREUM_ZERO_ADDRESS;

/**General State Selectors */
export const selectMaxAvailableEther = (state: IAppState): BigNumber =>
  selectLiquidEtherBalance(state.wallet).sub(selectTxGasCostEthUlps(state));
