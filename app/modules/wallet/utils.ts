import BigNumber from "bignumber.js";

import { PLATFORM_UNLOCK_FEE } from "../../config/constants";

export const getUnlockedWalletEtherAmountAfterFee = (
  etherLockedBalanceBN: BigNumber,
  unlockDateEther: number | string,
  currentUTCStamp: number | string,
): BigNumber => {
  return new BigNumber(currentUTCStamp).comparedTo(unlockDateEther) < 0
    ? etherLockedBalanceBN.minus(etherLockedBalanceBN.mul(PLATFORM_UNLOCK_FEE))
    : etherLockedBalanceBN;
};
