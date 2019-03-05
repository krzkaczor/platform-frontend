import { RouterState } from "connected-react-router";
import { isString } from "lodash";
import * as queryString from "query-string";

import { EWalletType } from "../web3/types";

export const selectRedirectURLFromQueryString = (state: RouterState): string | undefined => {
  if (!(state.location && state.location.search)) {
    return undefined;
  }
  const { redirect } = queryString.parse(state.location.search);

  if (isString(redirect)) {
    return redirect;
  }

  return undefined;
};

export const selectWalletTypeFromQueryString = (state: RouterState): EWalletType => {
  if (!(state.location && state.location.search)) {
    return EWalletType.UNKNOWN;
  }

  const { wallet_type } = queryString.parse(state.location.search);

  const walletType: string | undefined = isString(wallet_type) ? wallet_type : undefined;

  switch (walletType) {
    case "ledger":
      return EWalletType.LEDGER;
    case "browser":
      return EWalletType.BROWSER;
    case "light":
      return EWalletType.LIGHT;
    default:
      return EWalletType.UNKNOWN;
  }
};
