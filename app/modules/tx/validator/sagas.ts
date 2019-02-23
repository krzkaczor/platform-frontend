import BigNumber from "bignumber.js";
import { fork, put, select } from "redux-saga/effects";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { NotEnoughEtherForGasError } from "../../../lib/web3/Web3Adapter";
import { actions, TAction } from "../../actions";
import { neuCall, neuTakeEvery } from "../../sagasUtils";
import { selectEtherBalance } from "../../wallet/selectors";
import {IBlTxData} from "../../web3/interfaces";
import { ETxSenderType } from "../interfaces";
import { EValidationState } from "../sender/interfaces";
import { generateInvestmentTransaction } from "../transactions/investment/sagas";
import { generateEthWithdrawTransaction } from "../transactions/withdraw/sagas";

export function* txValidateSaga({ logger }: TGlobalDependencies, action: TAction): any {
  if (action.type !== "TX_SENDER_VALIDATE_DRAFT") return;
  // reset validation
  yield put(actions.txValidator.setValidationState());

  let validationGenerator:any;
  switch (action.payload.type) {
    case ETxSenderType.WITHDRAW:
      validationGenerator = generateEthWithdrawTransaction;
      break;
    case ETxSenderType.INVEST:
      validationGenerator = generateInvestmentTransaction;
      break;
  }

  let generatedTxDetails: IBlTxData;

  try {
    generatedTxDetails = yield neuCall(validationGenerator, action.payload);
    yield validateGas(generatedTxDetails);
    yield put(actions.txValidator.setValidationState(EValidationState.VALIDATION_OK));

    return generatedTxDetails
  } catch (error) {
    if (error instanceof NotEnoughEtherForGasError) {
      logger.info(error);
      yield put(actions.txValidator.setValidationState(EValidationState.NOT_ENOUGH_ETHER_FOR_GAS));
    } else {
      logger.error(error);
    }
  }
}

export function* validateGas(txDetails: IBlTxData): any {
  const etherBalance: BigNumber = yield select(selectEtherBalance);

  if (
      txDetails.gasPrice.mul(txDetails.gas)
        .comparedTo(etherBalance.sub(txDetails.value)) > 0
  ) {
    throw new NotEnoughEtherForGasError("Not enough Ether to pay the Gas for this transaction");
  }
}

export const txValidatorSagasWatcher = function*(): Iterator<any> {
  yield fork(neuTakeEvery, "TX_SENDER_VALIDATE_DRAFT", txValidateSaga);
};
