import { fork, put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../di/setupBindings";
import { ITxData } from "../../../lib/web3/types";
import { NotEnoughEtherForGasError } from "../../../lib/web3/Web3Adapter";
import {
  compareBigNumbers,
  multiplyBigNumbers,
  subtractBigNumbers,
} from "../../../utils/BigNumberUtils";
import { actions, TAction } from "../../actions";
import { neuCall, neuTakeEvery } from "../../sagasUtils";
import { selectEtherBalance } from "../../wallet/selectors";
import { ETxSenderType } from "../interfaces";
import { EValidationState } from "../sender/reducer";
import { generateInvestmentTransaction } from "../transactions/investment/sagas";
import { generateEthWithdrawTransaction } from "../transactions/withdraw/sagas";

export function* txValidateSaga({ logger }: TGlobalDependencies, action: TAction): any {
  if (action.type !== "TX_SENDER_VALIDATE_DRAFT") return;
  // reset validation
  yield put(actions.txValidator.setValidationState());

  let validationGenerator: any;
  switch (action.payload.type) {
    case ETxSenderType.WITHDRAW:
      validationGenerator = generateEthWithdrawTransaction;
      break;
    case ETxSenderType.INVEST:
      validationGenerator = generateInvestmentTransaction;
      break;
  }

  let generatedTxDetails: ITxData | undefined;

  try {
    generatedTxDetails = yield neuCall(validationGenerator, action.payload);
    yield validateGas(generatedTxDetails as ITxData);
    yield put(actions.txValidator.setValidationState(EValidationState.VALIDATION_OK));
  } catch (error) {
    if (error instanceof NotEnoughEtherForGasError) {
      logger.info(error);
      yield put(actions.txValidator.setValidationState(EValidationState.NOT_ENOUGH_ETHER_FOR_GAS));
    } else {
      logger.error(error);
    }
  }

  return generatedTxDetails;
}

export function* validateGas(txDetails: ITxData): any {
  const etherBalance: string | undefined = yield select(selectEtherBalance);
  if (!etherBalance) {
    throw new Error("Ether Balance is undefined");
  }

  if (
    compareBigNumbers(
      multiplyBigNumbers([txDetails.gasPrice, txDetails.gas]),
      subtractBigNumbers([etherBalance, txDetails.value.toString()]),
    ) > 0
  ) {
    throw new NotEnoughEtherForGasError("Not enough Ether to pay the Gas for this transaction");
  }
}

export const txValidatorSagasWatcher = function*(): Iterator<any> {
  yield fork(neuTakeEvery, "TX_SENDER_VALIDATE_DRAFT", txValidateSaga);
};
