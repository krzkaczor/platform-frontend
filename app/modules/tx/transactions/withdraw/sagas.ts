import BigNumber from "bignumber.js";
import { put, select, take } from "redux-saga/effects";

import { Q18 } from "../../../../config/constants";
import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ITxData } from "../../../../lib/web3/types";
import { actions, TActionFromCreator } from "../../../actions";
import { selectStandardGasPriceWithOverHead } from "../../../gas/selectors";
import { neuCall } from "../../../sagasUtils";
import { selectEtherTokenBalanceAsBigNumber } from "../../../wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";
import { selectTxGasCostEthUlps } from "../../sender/selectors";
import { ETxSenderType, IWithdrawDraftType } from "../../types";
import { calculateGasLimitWithOverhead, EMPTY_DATA } from "../../utils";

const SIMPLE_WITHDRAW_TRANSACTION = "21000";

export function* generateEthWithdrawTransaction(
  { contractsService, web3Manager }: TGlobalDependencies,
  { to, value }: IWithdrawDraftType,
): any {
  const etherTokenBalance: BigNumber = yield select(selectEtherTokenBalanceAsBigNumber);
  const from: string = yield select(selectEthereumAddressWithChecksum);
  const gasPriceWithOverhead = yield select(selectStandardGasPriceWithOverHead);
  const weiValue = Q18.mul(value);

  if (etherTokenBalance.isZero()) {
    // transaction can be fully covered ether balance
    const txDetails: Partial<ITxData> = {
      to,
      from,
      data: EMPTY_DATA,
      value: weiValue.toString(),
      gasPrice: gasPriceWithOverhead,
      gas: calculateGasLimitWithOverhead(SIMPLE_WITHDRAW_TRANSACTION),
    };
    return txDetails;
  } else {
    // transaction can be fully covered by etherTokens
    const txInput = contractsService.etherToken.withdrawAndSendTx(to || "0x0", weiValue).getData();

    const difference = weiValue.sub(etherTokenBalance);

    const txDetails: Partial<ITxData> = {
      to: contractsService.etherToken.address,
      from,
      data: txInput,
      value: difference.comparedTo(0) > 0 ? difference.toString() : "0",
      gasPrice: gasPriceWithOverhead,
    };
    const estimatedGasWithOverhead = yield web3Manager.estimateGasWithOverhead(txDetails);
    return { ...txDetails, gas: estimatedGasWithOverhead };
  }
}

export function* ethWithdrawFlow(_: TGlobalDependencies): any {
  const action: TActionFromCreator<typeof actions.txSender.txSenderAcceptDraft> = yield take(
    actions.txSender.txSenderAcceptDraft,
  );

  if (!action.payload.txDraftData) return;

  const txDataFromUser = action.payload.txDraftData;
  const generatedTxDetails = yield neuCall(generateEthWithdrawTransaction, txDataFromUser);
  yield put(actions.txSender.setTransactionData(generatedTxDetails));

  // Internally we represent eth withdraw in two different modes (normal ether withdrawal and ether token withdrawal)
  // in case of ether token withdrawal `to` points to contract address and `value` is empty
  const additionalData = {
    value: Q18.mul(txDataFromUser.value!).toString(),
    to: txDataFromUser.to!,
    cost: yield select(selectTxGasCostEthUlps),
  };

  yield put(actions.txSender.txSenderContinueToSummary<ETxSenderType.WITHDRAW>(additionalData));
}
