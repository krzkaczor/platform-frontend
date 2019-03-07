import BigNumber from "bignumber.js";
import { put, select, take } from "redux-saga/effects";

import { MONEY_DECIMALS } from "../../../../config/constants";
import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ITxData } from "../../../../lib/web3/types";
import { IAppState } from "../../../../store";
import { compareBigNumbers } from "../../../../utils/BigNumberUtils";
import { ERoundingMode, formatMoney } from "../../../../utils/Money.utils";
import { convertToBigInt } from "../../../../utils/Number.utils";
import { actions } from "../../../actions";
import { selectStandardGasPriceWithOverHead } from "../../../gas/selectors";
import { neuCall } from "../../../sagasUtils";
import { selectLiquidEuroTokenBalance } from "../../../wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";

export function* generateNeuWithdrawTransaction(
  { contractsService, web3Manager }: TGlobalDependencies,
  amountUlps: string,
): any {
  const from: string = yield select(selectEthereumAddressWithChecksum);
  const gasPriceWithOverhead = yield select(selectStandardGasPriceWithOverHead);

  const txInput = contractsService.euroToken.withdrawTx(new BigNumber(amountUlps)).getData();

  const txDetails: Partial<ITxData> = {
    to: contractsService.euroToken.address,
    from,
    data: txInput,
    value: "0",
    gasPrice: gasPriceWithOverhead,
  };
  const estimatedGasWithOverhead = yield web3Manager.estimateGasWithOverhead(txDetails);
  return { ...txDetails, gas: estimatedGasWithOverhead };
}

export function* startNEuroRedeemGenerator(_: TGlobalDependencies): any {
  // Wait for withdraw confirmation
  const action = yield take(actions.txSender.txSenderAcceptDraft);
  const txDataFromUser = action.payload.txDraftData;

  const nEURBalanceUlps = yield select((state: IAppState) =>
    selectLiquidEuroTokenBalance(state.wallet),
  );
  const nEURBalance = formatMoney(nEURBalanceUlps, MONEY_DECIMALS, 2, ERoundingMode.DOWN);
  const selectedAmountUlps = convertToBigInt(txDataFromUser.value);

  // Whole precision number should be passed when there is whole balance redeemed
  const redeemAmountUlps =
    compareBigNumbers(selectedAmountUlps, convertToBigInt(nEURBalance)) === 0
      ? nEURBalanceUlps
      : selectedAmountUlps;

  const generatedTxDetails: ITxData = yield neuCall(
    generateNeuWithdrawTransaction,
    redeemAmountUlps,
  );
  yield put(actions.txSender.setTransactionData(generatedTxDetails));
  yield put(
    actions.txSender.txSenderContinueToSummary({
      txData: generatedTxDetails,
      additionalData: { amount: txDataFromUser.value },
    }),
  );
}
