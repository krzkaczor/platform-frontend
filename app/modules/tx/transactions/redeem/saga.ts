import { put, select, take } from "redux-saga/effects";

import { Q18 } from "../../../../config/constants";
import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ITxData } from "../../../../lib/web3/types";
import { DeepReadonly } from "../../../../types";
import { actions } from "../../../actions";
import { selectBankFeeUlps } from "../../../bank-transfer-flow/selectors";
import { selectStandardGasPriceWithOverHead } from "../../../gas/selectors";
import { selectBankAccount } from "../../../kyc/selectors";
import { TBankAccount } from "../../../kyc/types";
import { neuCall } from "../../../sagasUtils";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";
import { TRedeemAdditionalDetails } from "./types";

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

  const bankAccount: DeepReadonly<TBankAccount> = yield select(selectBankAccount);
  if (!bankAccount.hasBankAccount) {
    throw new Error("During redeem process user should have bank account");
  }

  const bankFee: string = yield select(selectBankFeeUlps);

  const additionalDetails = {
    bankFee,
    amount: txDataFromUser.value,
    bankAccount: {
      bankName: bankAccount.details.bankName,
      accountNumberLast4: bankAccount.details.bankAccountNumberLast4,
    },
  };

  yield put(
    actions.txSender.txSenderContinueToSummary<TRedeemAdditionalDetails>(additionalDetails),
  );
}
