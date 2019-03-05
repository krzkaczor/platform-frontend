import { put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ETOCommitment } from "../../../../lib/contracts/ETOCommitment";
import { ITxData } from "../../../../lib/web3/types";
import { IAppState } from "../../../../store";
import { EthereumAddressWithChecksum } from "../../../../types";
import { actions } from "../../../actions";
import {
  selectIsNewPreEtoStartDateValid,
  selectIssuerEto,
  selectPreEtoStartDate,
} from "../../../eto-flow/selectors";
import { selectStandardGasPriceWithOverHead } from "../../../gas/selectors";
import { neuCall } from "../../../sagasUtils";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";

export function* generateSetStartDateTransaction({
  contractsService,
  web3Manager,
}: TGlobalDependencies): any {
  const state: IAppState = yield select();
  const userAddress = selectEthereumAddressWithChecksum(state);
  const gasPriceWithOverhead = selectStandardGasPriceWithOverHead(state);
  const eto = selectIssuerEto(state);

  if (!eto || !selectIsNewPreEtoStartDateValid(state)) return;

  const startDate = selectPreEtoStartDate(state)!;
  const contract: ETOCommitment = yield contractsService.getETOCommitmentContract(eto.etoId);
  const terms = yield contract.etoTerms;
  const token = yield contract.equityToken;
  const time = Math.round(startDate.getTime() / 1000);
  // timestamp needs to be set in seconds

  const txData = contract.setStartDateTx(terms, token, time).getData();

  const txInitialDetails = {
    to: contract.address,
    from: userAddress,
    data: txData,
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

export function* generateSignInvestmentAgreementTx(
  { contractsService, web3Manager }: TGlobalDependencies,
  extraParam: { etoId: string; agreementHash: string },
): any {
  const { etoId, agreementHash } = extraParam;
  const state: IAppState = yield select();

  if (etoId && agreementHash) {
    const userAddress: EthereumAddressWithChecksum = yield selectEthereumAddressWithChecksum(state);
    const gasPriceWithOverhead: string = yield selectStandardGasPriceWithOverHead(state);

    const contract: ETOCommitment = yield contractsService.getETOCommitmentContract(etoId);
    const txData: string = yield contract
      .companySignsInvestmentAgreementTx(`ifps:${agreementHash}`)
      .getData();

    const txInitialDetails = {
      to: contract.address,
      from: userAddress,
      data: txData,
      value: "0",
      gasPrice: gasPriceWithOverhead,
    };

    const estimatedGasWithOverhead: string = yield web3Manager.estimateGasWithOverhead(
      txInitialDetails,
    );

    const txDetails: ITxData = {
      ...txInitialDetails,
      gas: estimatedGasWithOverhead,
    };

    return txDetails;
  } else {
    throw new Error("cannot generate transaction, etoId or agreementUrl missing");
  }
}

export function* etoSetDateGenerator(_: TGlobalDependencies): any {
  const generatedTxDetails = yield neuCall(generateSetStartDateTransaction);
  yield put(actions.txSender.setTransactionData(generatedTxDetails));
  yield put(actions.txSender.txSenderContinueToSummary());
}

export function* etoSignInvestmentAgreementGenerator(
  _: TGlobalDependencies,
  extraParam: { etoId: string; agreementHash: string },
): any {
  const generatedTxDetails = yield neuCall(generateSignInvestmentAgreementTx, extraParam);
  yield put(actions.txSender.setTransactionData(generatedTxDetails));
  yield put(actions.txSender.txSenderContinueToSummary());
}
