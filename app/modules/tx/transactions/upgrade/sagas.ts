import { addHexPrefix } from "ethereumjs-util";
import { put, select } from "redux-saga/effects";

import BigNumber from "bignumber.js";
import { TGlobalDependencies } from "../../../../di/setupBindings";
import {EthereumAddress, NumericString} from "../../../../types";
import { actions } from "../../../actions";
import { selectStandardGasPriceWithOverHead } from "../../../gas/selectors";
import { neuCall } from "../../../sagasUtils";
import {
  selectIsEtherUpgradeTargetSet,
  selectIsEuroUpgradeTargetSet,
} from "../../../wallet/selectors";
import {IStateTxData} from "../../../web3/interfaces";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";
import { ETokenType } from "../../interfaces";

export function* generateEuroUpgradeTransaction({
  contractsService,
  web3Manager,
}: TGlobalDependencies): any {
  const userAddress:EthereumAddress = yield select(selectEthereumAddressWithChecksum);
  const gasPriceWithOverhead:BigNumber = yield select(selectStandardGasPriceWithOverHead);
  const migrationTarget:boolean = yield select(selectIsEuroUpgradeTargetSet);

  if (!migrationTarget) {
    throw new Error();
    // TODO: Add shouldn't hit migration target
  }

  const txData = contractsService.icbmEuroLock.migrateTx().getData();

  const txInitialDetails = {
    to: contractsService.icbmEuroLock.address,
    from: userAddress,
    data: txData,
    value: addHexPrefix("0") as NumericString,
    gasPrice: gasPriceWithOverhead.toString() as NumericString,
  };

  const estimatedGasWithOverhead:BigNumber = yield web3Manager.estimateGasWithOverhead(txInitialDetails);

  const txDetails: IStateTxData = {
    ...txInitialDetails,
    gas: estimatedGasWithOverhead.toString() as NumericString,
  };
  return txDetails;
}

export function* generateEtherUpgradeTransaction({
  contractsService,
  web3Manager,
}: TGlobalDependencies): any {
  const userAddress: EthereumAddress = yield select(selectEthereumAddressWithChecksum);
  const gasPriceWithOverhead:BigNumber = yield select(selectStandardGasPriceWithOverHead);
  const migrationTarget: boolean = yield select(selectIsEtherUpgradeTargetSet);

  if (!migrationTarget) {
    throw new Error();
    // TODO: Add no balance error
  }
  const txInput = contractsService.icbmEtherLock.migrateTx().getData();

  const txInitialDetails = {
    to: contractsService.icbmEtherLock.address,
    from: userAddress,
    data: txInput,
    value: "0" as NumericString,
    gasPrice: gasPriceWithOverhead.toString() as NumericString,
  };

  const estimatedGasWithOverhead = yield web3Manager.estimateGasWithOverhead(txInitialDetails);

  const txDetails: IStateTxData = {
    ...txInitialDetails,
    gas: estimatedGasWithOverhead,
  };

  return txDetails;
}

export function* upgradeTransactionFlow(_: TGlobalDependencies, tokenType: ETokenType): any {
  const transactionGenerator =
    tokenType === ETokenType.ETHER
      ? generateEtherUpgradeTransaction
      : generateEuroUpgradeTransaction;
  const generatedTxDetails: IStateTxData = yield neuCall(transactionGenerator);
  yield put(actions.txSender.setTransactionData(generatedTxDetails));
  yield put(
    actions.txSender.txSenderContinueToSummary({
      txData: generatedTxDetails,
      additionalData: { tokenType },
    }),
  );
}
