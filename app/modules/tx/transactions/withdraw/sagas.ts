import BigNumber from "bignumber.js";
import { put, select, take } from "redux-saga/effects";
import { Q18 } from "../../../../config/constants";
import { TAction } from "../../../actions";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { IStateTxData} from "../../../../lib/web3/types";
import { actions } from "../../../actions";
import { selectStandardGasPriceWithOverHead } from "../../../gas/selectors";
import { neuCall } from "../../../sagasUtils";
import { selectEtherTokenBalanceAsBigNumber } from "../../../wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";
import { IWithdrawDraftType } from "../../interfaces";
import { calculateGasLimitWithOverhead, EMPTY_DATA } from "../../utils";
import {NumericString} from "../../../../types";

const SIMPLE_WITHDRAW_TRANSACTION = new BigNumber("21000");

export function* generateEthWithdrawTransaction(
  { contractsService, web3Manager }: TGlobalDependencies,
  payload: IWithdrawDraftType,
): any {
  // Typing purposes
  const { to, value } = payload;

  const etherTokenBalance: BigNumber = yield select(selectEtherTokenBalanceAsBigNumber);
  const from: string = yield select(selectEthereumAddressWithChecksum);
  const gasPriceWithOverhead = yield select(selectStandardGasPriceWithOverHead);
  const weiValue = Q18.mul(value);

  if (etherTokenBalance.isZero()) {
    // transaction can be fully covered ether balance
    const txDetails: Partial<IStateTxData> = {
      to,
      from,
      data: EMPTY_DATA,
      value: weiValue.toString() as NumericString,
      gasPrice: gasPriceWithOverhead,
      gas: calculateGasLimitWithOverhead(SIMPLE_WITHDRAW_TRANSACTION).toString() as NumericString,
    };
    return txDetails;
  } else {
    // transaction can be fully covered by etherTokens
    const txInput = contractsService.etherToken.withdrawAndSendTx(to || "0x0", weiValue).getData();

    const difference = weiValue.sub(etherTokenBalance);

    const txDetails: Partial<IStateTxData> = {
      to: contractsService.etherToken.address,
      from,
      data: txInput,
      value: (difference.comparedTo(0) > 0 ? difference.toString() : "0") as NumericString,
      gasPrice: gasPriceWithOverhead,
    };
    const estimatedGasWithOverhead = yield web3Manager.estimateGasWithOverhead(txDetails);
    return { ...txDetails, gas: estimatedGasWithOverhead };
  }
}

export function* ethWithdrawFlow(_: TGlobalDependencies): any {
  const action: TAction = yield take("TX_SENDER_ACCEPT_DRAFT");
  if (action.type !== "TX_SENDER_ACCEPT_DRAFT" || !action.payload.txDraftData) return;
  const txDataFromUser = action.payload.txDraftData;
  const generatedTxDetails = yield neuCall(generateEthWithdrawTransaction, txDataFromUser);
  yield put(actions.txSender.setTransactionData(generatedTxDetails));
  yield put(
    actions.txSender.txSenderContinueToSummary({
      txData: {
        ...txDataFromUser,
        value: Q18.mul(txDataFromUser.value!).toString() as NumericString,
      },
    }),
  );
}
