import { put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ETOCommitment } from "../../../../lib/contracts/ETOCommitment";
import { ITxData } from "../../../../lib/web3/types";
import { IAppState } from "../../../../store";
import { actions } from "../../../actions";
import { selectStandardGasPriceWithOverHead } from "../../../gas/selectors";
import { selectMyInvestorTicketByEtoId } from "../../../investor-portfolio/selectors";
import { neuCall } from "../../../sagasUtils";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";
import { selectTxGasCostEthUlps } from "../../sender/selectors";
import { ETxSenderType } from "../../types";

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
    value: "0",
    gasPrice: gasPriceWithOverhead,
  };

  const estimatedGasWithOverhead = yield web3Manager.estimateGasWithOverhead(txInitialDetails);

  const txDetails: ITxData = {
    ...txInitialDetails,
    gas: estimatedGasWithOverhead,
  };

  return txDetails;
}

export function* startClaimGenerator(_: TGlobalDependencies, etoId: string): any {
  const generatedTxDetails: ITxData = yield neuCall(generateGetClaimTransaction, etoId);
  yield put(actions.txSender.setTransactionData(generatedTxDetails));

  const etoData = yield select((state: IAppState) => selectMyInvestorTicketByEtoId(state, etoId));
  yield put(
    actions.txSender.txSenderContinueToSummary<ETxSenderType.USER_CLAIM>({
      etoId,
      tokenName: etoData.equityTokenName,
      tokenQuantity: etoData.investorTicket.equityTokenInt.toString(),
      neuRewardUlps: etoData.investorTicket.rewardNmkUlps.toString(),
      costUlps: yield select(selectTxGasCostEthUlps),
    }),
  );
}
