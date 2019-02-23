import BigNumber from "bignumber.js";

import { IStateClaims } from "./interfaces";

export function deserializeClaims(claims: string): IStateClaims {
  const claimsN = new BigNumber(claims, 16);

  const isVerified = claimsN.mod(2).eq(1);
  const isSophisticatedInvestor = claimsN
    .dividedToIntegerBy(2)
    .mod(2)
    .eq(1);

  const hasBankAccount = claimsN
    .dividedToIntegerBy(4)
    .mod(2)
    .eq(1);

  const isAccountFrozen = claimsN
    .dividedToIntegerBy(8)
    .mod(2)
    .eq(1);

  return {
    isVerified,
    isSophisticatedInvestor,
    hasBankAccount,
    isAccountFrozen,
  };
}
