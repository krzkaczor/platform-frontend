import { RouterState } from "connected-react-router";
import { isString } from "lodash";
import * as queryString from "query-string";
import { createSelector } from "reselect";

import {ILightWalletMetadata, TWalletMetadata} from "../../lib/persistence/WalletMetadataObjectStorage";
import { IAppState } from "../../store";
import { EthereumAddress } from "../../types";
import { IConnectedWeb3State, IWalletPrivateData, IWeb3State, EWalletSubType, EWalletType } from "./interfaces";
import { makeEthereumAddressChecksummed } from "./utils";

export const selectConnectedWeb3State = (state: IWeb3State): IConnectedWeb3State => {
  if (!state.connected) {
    throw Error("Wallet not connected");
  }
  return state;
};

const selectEthereumAddress = (state: IAppState): EthereumAddress =>
  state.web3.connected ? state.web3.wallet.address : state.web3.previousConnectedWallet!.address;

export const selectEthereumAddressWithChecksum = createSelector(selectEthereumAddress, address => {
  return makeEthereumAddressChecksummed(address);
});

export const selectWalletPrivateData = (state: IWeb3State): IWalletPrivateData | undefined => {
  return (
    (state.connected &&
      state.walletPrivateData && {
        seed: state.walletPrivateData.seed.split(" "),
        privateKey: state.walletPrivateData.privateKey,
      }) ||
    undefined
  );
};

export const isLightWalletReadyToLogin = (state: IWeb3State): boolean =>
  !!(
    !state.connected &&
    state.previousConnectedWallet &&
    state.previousConnectedWallet.walletType === EWalletType.LIGHT &&
    (state.previousConnectedWallet as ILightWalletMetadata).email &&
    (state.previousConnectedWallet as ILightWalletMetadata).salt &&
    (state.previousConnectedWallet as ILightWalletMetadata).vault
  );

/**
 * Works both when wallet is connected or not.
 */
export const selectIsLightWallet = (state: IWeb3State): boolean => {
  return (
    (state.connected && state.wallet.walletType === EWalletType.LIGHT) ||
    isLightWalletReadyToLogin(state)
  );
};

export const selectIsExternalWallet = (state: IWeb3State): boolean => {
  const walletType = selectWalletType(state);

  return walletType === EWalletType.LEDGER || walletType === EWalletType.BROWSER;
};

export const selectWalletSubType = (state: IWeb3State): EWalletSubType | undefined =>
  state.connected
    ? (state.wallet.walletType === EWalletType.BROWSER && state.wallet.walletSubType) || undefined
    : (state.previousConnectedWallet &&
        (state.previousConnectedWallet.walletType === EWalletType.BROWSER &&
          state.previousConnectedWallet.walletSubType)) ||
      undefined;

export const selectWalletType = (state: IWeb3State): EWalletType | undefined =>
  state.connected
    ? state.wallet.walletType
    : state.previousConnectedWallet && state.previousConnectedWallet.walletType;

export const selectCurrentLightWalletSalt = (state: IAppState): string | undefined =>
  (state.web3.connected &&
    state.web3.wallet &&
    state.web3.wallet.walletType === EWalletType.LIGHT &&
    (state.web3.wallet.salt) ||
  undefined;

export const selectIsUnlocked = (state: IWeb3State): boolean => {
  return state.connected && state.isUnlocked;
};

export const selectPreviousLightWalletEmail = (state: IWeb3State): string | undefined =>
  (!state.connected &&
    state.previousConnectedWallet &&
    state.previousConnectedWallet.walletType === EWalletType.LIGHT &&
    (state.previousConnectedWallet as ILightWalletMetadata).email) ||
  undefined;

export const selectPreviousLightWalletSalt = (state: IAppState): string | undefined =>
  (!state.connected &&
    state.web3.previousConnectedWallet &&
    state.web3.previousConnectedWallet.walletType === EWalletType.LIGHT &&
    state.web3.previousConnectedWallet.salt) ||
  undefined;

export const selectLightWalletSalt = createSelector(
  selectCurrentLightWalletSalt,
  selectPreviousLightWalletSalt,
  (currentLightWalletSalt, previousLightWalletSalt) => {
    return currentLightWalletSalt || previousLightWalletSalt;
  },
);

export const selectPreviousConnectedWallet = (state: IWeb3State): TWalletMetadata | undefined =>
  (!state.connected && state.previousConnectedWallet) || undefined;

const getEmailFromQueryString = (query: string) => {
  const { email } = queryString.parse(query);

  return isString(email) ? email : undefined;
};

const getSaltFromQueryString = (query: string) => {
  const { salt } = queryString.parse(query);

  return isString(salt) ? salt : undefined;
};

const getCodeFromQueryString = (query: string) => {
  const { code } = queryString.parse(query);

  return isString(code) ? code : undefined;
};

export const selectLightWalletFromQueryString = (
  state: RouterState,
): { email: string; salt: string } | undefined => {
  if (!state.location) {
    return undefined;
  }

  const { redirect } = queryString.parse(state.location.search);

  const email =
    getEmailFromQueryString(state.location.search) ||
    (isString(redirect) ? getEmailFromQueryString(redirect) : undefined);
  const salt =
    getSaltFromQueryString(state.location.search) ||
    (isString(redirect) ? getSaltFromQueryString(redirect) : undefined);

  if (!email || !salt) {
    return undefined;
  }

  return {
    email,
    salt,
  };
};

export const selectActivationCodeFromQueryString = (
  state: RouterState,
): { verificationCode: string } | undefined => {
  if (!state.location) {
    return undefined;
  }

  const { redirect } = queryString.parse(state.location.search);
  const verificationCode =
    getCodeFromQueryString(state.location.search) ||
    (isString(redirect) ? getCodeFromQueryString(redirect) : undefined);

  if (!verificationCode) {
    return undefined;
  }

  return {
    verificationCode,
  };
};

export const selectLightWalletEmailFromQueryString = (state: RouterState): string | undefined => {
  const lightWallet = selectLightWalletFromQueryString(state);

  return lightWallet && lightWallet.email;
};

export const selectEmailFromQueryString = (state: RouterState): string | undefined => {
  if (!state.location) {
    return undefined;
  }

  return getEmailFromQueryString(state.location.search);
};
