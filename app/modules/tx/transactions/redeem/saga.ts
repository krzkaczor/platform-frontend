import { put, select, take } from "redux-saga/effects";

import { Q18 } from "../../../../config/constants";
import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ITxData } from "../../../../lib/web3/types";
import { actions } from "../../../actions";
import { selectStandardGasPriceWithOverHead } from "../../../gas/selectors";
import { neuCall } from "../../../sagasUtils";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";

export function* generateNeuWithdrawTransaction(
  { contractsService, web3Manager }: TGlobalDependencies,
  amount: string,
): any {
  const from: string = yield select(selectEthereumAddressWithChecksum);
  const gasPriceWithOverhead = yield select(selectStandardGasPriceWithOverHead);
  const amountUlps = Q18.mul(amount);

  const txInput = contractsService.euroToken.withdrawTx(amountUlps).getData();

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

  const generatedTxDetails: ITxData = yield neuCall(
    generateNeuWithdrawTransaction,
    txDataFromUser.value,
  );
  yield put(actions.txSender.setTransactionData(generatedTxDetails));
  yield put(
    actions.txSender.txSenderContinueToSummary({
      amount: txDataFromUser.value,
    }),
  );
}
