import BigNumber from "bignumber.js";
import { put, select, take } from "redux-saga/effects";
import { Q18 } from "../../../../config/constants";
import { TAction } from "../../../actions";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import * as txInterfaces from "../../../../lib/web3/types";
import { actions } from "../../../actions";
import { selectStandardGasPriceWithOverHead } from "../../../gas/selectors";
import { neuCall } from "../../../sagasUtils";
import { selectEtherTokenBalanceAsBigNumber } from "../../../wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";
import { IWithdrawDraftType } from "../../interfaces";
import { calculateGasLimitWithOverhead, EMPTY_DATA } from "../../utils";
import {NumericString} from "../../../../types";
import {convert} from "../../../../components/eto/utils";

const SIMPLE_WITHDRAW_TRANSACTION = new BigNumber("21000");

export function* generateEthWithdrawTransaction(
  { contractsService, web3Manager }: TGlobalDependencies,
  payload: IWithdrawDraftType,
): any {
  // Typing purposes
  const { to, value } = payload;

  const etherTokenBalance: BigNumber = yield select(selectEtherTokenBalanceAsBigNumber);
  const from: string = yield select(selectEthereumAddressWithChecksum);
  const gasPriceWithOverhead:BigNumber = yield select(selectStandardGasPriceWithOverHead);
  const weiValue = Q18.mul(value);

  if (etherTokenBalance.isZero()) {
    // transaction can be fully covered ether balance
    const txDetails: Partial<txInterfaces.IBlTxData> = {
      to,
      from,
      data: EMPTY_DATA,
      value: weiValue,
      gasPrice: gasPriceWithOverhead,
      gas: calculateGasLimitWithOverhead(SIMPLE_WITHDRAW_TRANSACTION),
    };
    return txDetails;
  } else {
    // transaction can be fully covered by etherTokens
    const txInput = contractsService.etherToken.withdrawAndSendTx(to || "0x0", weiValue).getData();

    const difference = weiValue.sub(etherTokenBalance);

    const txDetails: Partial<txInterfaces.IBlTxData> = {
      to: contractsService.etherToken.address,
      from,
      data: txInput,
      value: (difference.comparedTo(0) > 0 ? difference : new BigNumber("0")),
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
  const generatedTxDetails:txInterfaces.IBlTxData = yield neuCall(generateEthWithdrawTransaction, txDataFromUser);
  yield put(actions.txSender.setTransactionData(convert(generatedTxDetails, txInterfaces.stateToBlConversionSpec)));
  yield put(
    actions.txSender.txSenderContinueToSummary({
      txData: {
        ...txDataFromUser,
        value: Q18.mul(txDataFromUser.value!).toString() as NumericString,
      },
    }),
  );
}
