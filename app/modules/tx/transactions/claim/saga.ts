import { put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ETOCommitment } from "../../../../lib/contracts/ETOCommitment";
import {IStateTxData} from "../../../../modules/web3/interfaces";
import {NumericString} from "../../../../types";
import { actions } from "../../../actions";
import { selectStandardGasPriceWithOverHead } from "../../../gas/selectors";
import { neuCall } from "../../../sagasUtils";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";

export function* generateGetClaimTransaction(
  { contractsService, web3Manager }: TGlobalDependencies,
  etoId: string,
): any {
  const userAddress = yield select(selectEthereumAddressWithChecksum);
  const gasPriceWithOverhead = yield select(selectStandardGasPriceWithOverHead);

  const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(etoId);
  const txInput = etoContract.claimTx().getData();

  const txInitialDetails = {
    to: etoContract.address,
    from: userAddress,
    data: txInput,
    value: "0" as NumericString,
    gasPrice: gasPriceWithOverhead.toString() as NumericString,
  };

  const estimatedGasWithOverhead:string = yield web3Manager.estimateGasWithOverhead(txInitialDetails);

  const txDetails: IStateTxData = {
    ...txInitialDetails,
    gas: estimatedGasWithOverhead as NumericString,
  };

  return txDetails;
}

export function* startClaimGenerator(_: TGlobalDependencies, etoId: string): any {
  const generatedTxDetails: IStateTxData = yield neuCall(generateGetClaimTransaction, etoId);
  yield put(actions.txSender.setTransactionData(generatedTxDetails));
  yield put(
    actions.txSender.txSenderContinueToSummary({
      txData: generatedTxDetails,
      additionalData: etoId,
    }),
  );
}
