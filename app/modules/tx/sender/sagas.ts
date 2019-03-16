import { call, put, race, select, take } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../di/setupBindings";
import { TPendingTxs } from "../../../lib/api/users/interfaces";
import { BrowserWalletError } from "../../../lib/web3/BrowserWallet";
import { LedgerContractsDisabledError, LedgerError } from "../../../lib/web3/ledger-wallet/errors";
import { LightError } from "../../../lib/web3/LightWallet";
import { ITxData } from "../../../lib/web3/types";
import {
  InvalidChangeIdError,
  InvalidRlpDataError,
  LongTransactionQueError,
  LowNonceError,
  NotEnoughEtherForGasError,
  OutOfGasError,
  UnknownEthNodeError,
} from "../../../lib/web3/Web3Adapter";
import { SignerError, SignerRejectConfirmationError } from "../../../lib/web3/Web3Manager";
import { IAppState } from "../../../store";
import { connectWallet } from "../../access-wallet/sagas";
import { actions } from "../../actions";
import { IGasState } from "../../gas/reducer";
import { selectGasPrice } from "../../gas/selectors";
import { neuCall, neuRepeatIf } from "../../sagasUtils";
import {
  createWatchTxChannel,
  EEventEmitterChannelEvents,
  markTransactionAsPending,
  TEventEmitterChannelEvents,
  updatePendingTxs,
} from "../monitor/sagas";
import { UserCannotUnlockFunds } from "../transactions/unlock/errors";
import { ETxSenderType } from "../types";
import { validateGas } from "../validator/sagas";
import { ETransactionErrorType } from "./reducer";
import { selectTxAdditionalData, selectTxDetails, selectTxType } from "./selectors";

export interface ITxSendParams {
  type: ETxSenderType;
  transactionFlowGenerator: any;
  extraParam?: any;
  // Design extraParam to be a tuple that handels any number of params
  // @see neuCall
}

export function* txSendSaga({ type, transactionFlowGenerator, extraParam }: ITxSendParams): any {
  const gasPrice: IGasState = yield select(selectGasPrice);

  if (!gasPrice) {
    yield take("GAS_API_LOADED");
  }

  yield put(actions.txSender.txSenderShowModal(type));

  const { result, cancel } = yield race({
    result: neuCall(txSendProcess, type, transactionFlowGenerator, extraParam),
    cancel: take("TX_SENDER_HIDE_MODAL"),
  });

  if (cancel) {
    throw new Error("TX_SENDING_CANCELLED");
  }

  // we need to wait for modal to close anyway
  yield take("TX_SENDER_HIDE_MODAL");
  yield put(actions.wallet.loadWalletData());

  return result;
}

export function* txSendProcess(
  { logger }: TGlobalDependencies,
  transactionType: ETxSenderType,
  transactionFlowGenerator: any,
  extraParam?: any,
): any {
  try {
    yield neuCall(ensureNoPendingTx, transactionType);

    yield neuRepeatIf("TX_SENDER_CHANGE", "TX_SENDER_ACCEPT", transactionFlowGenerator, extraParam);
    const txData = yield select(selectTxDetails);

    // Check if gas amount is correct
    yield validateGas(txData);

    // accept transaction on wallet
    yield call(connectWallet);
    yield put(actions.txSender.txSenderWalletPlugged());

    // send transaction
    const txHash = yield neuCall(sendTxSubSaga);

    yield neuCall(watchTxSubSaga, txHash);
  } catch (error) {
    logger.error(error);
    if (error instanceof OutOfGasError) {
      return yield put(actions.txSender.txSenderError(ETransactionErrorType.GAS_TOO_LOW));
    } else if (error instanceof LowNonceError) {
      return yield put(actions.txSender.txSenderError(ETransactionErrorType.NONCE_TOO_LOW));
    } else if (error instanceof LongTransactionQueError) {
      return yield put(actions.txSender.txSenderError(ETransactionErrorType.TOO_MANY_TX_IN_QUEUE));
    } else if (error instanceof InvalidRlpDataError) {
      return yield put(actions.txSender.txSenderError(ETransactionErrorType.INVALID_RLP_TX));
    } else if (error instanceof InvalidChangeIdError) {
      return yield put(actions.txSender.txSenderError(ETransactionErrorType.INVALID_CHAIN_ID));
    } else if (error instanceof NotEnoughEtherForGasError) {
      return yield put(
        actions.txSender.txSenderError(ETransactionErrorType.NOT_ENOUGH_ETHER_FOR_GAS),
      );
    } else if (error instanceof UnknownEthNodeError) {
      return yield put(actions.txSender.txSenderError(ETransactionErrorType.UNKNOWN_ERROR));
    } else if (error instanceof SignerRejectConfirmationError) {
      return yield put(actions.txSender.txSenderError(ETransactionErrorType.TX_WAS_REJECTED));
    } else if (error instanceof LedgerContractsDisabledError) {
      return yield put(
        actions.txSender.txSenderError(ETransactionErrorType.LEDGER_CONTRACTS_DISABLED),
      );
    } else if (error instanceof UserCannotUnlockFunds) {
      return yield put(
        actions.txSender.txSenderError(ETransactionErrorType.NOT_ENOUGH_NEUMARKS_TO_UNLOCK),
      );
    } else {
      return yield put(actions.txSender.txSenderError(ETransactionErrorType.UNKNOWN_ERROR));
    }
  }
}

function* ensureNoPendingTx({ logger }: TGlobalDependencies, type: ETxSenderType): any {
  while (true) {
    yield neuCall(updatePendingTxs);

    const txs: TPendingTxs = yield select((s: IAppState) => s.txMonitor.txs);

    if (!txs.pendingTransaction && txs.oooTransactions.length === 0) {
      yield put(actions.txSender.txSenderWatchPendingTxsDone(type));
      return;
    }

    if (txs.pendingTransaction) {
      const txHash = txs.pendingTransaction.transaction.hash;
      // go to miner
      yield put(
        actions.txSender.txSenderSigned(txHash, txs.pendingTransaction
          .transactionType as ETxSenderType),
      );
      yield neuCall(watchTxSubSaga, txHash);
      return;
    }

    if (txs.oooTransactions.length) {
      const txHash = txs.oooTransactions[0].hash;
      // go to miner
      yield put(actions.txSender.txSenderWatchPendingTxs(txHash));
      logger.info(`Waiting for out of bound transactions: ${txs.oooTransactions.length}`);
      yield neuCall(watchPendingOOOTxSubSaga, txHash);
    }
  }
}

function* sendTxSubSaga({ web3Manager }: TGlobalDependencies): any {
  const type = yield select(selectTxType);
  const txData: ITxData = yield select(selectTxDetails);
  const txAdditionalData: ITxData = yield select(selectTxAdditionalData);

  if (!txData) {
    throw new Error("Tx data is not defined");
  }

  try {
    yield validateGas(txData);

    const txHash: string = yield web3Manager.sendTransaction(txData);

    yield neuCall(markTransactionAsPending, { txHash, type, txData, txAdditionalData });

    yield put(actions.txSender.txSenderSigned(txHash, type));

    return txHash;
  } catch (error) {
    if (
      error instanceof LedgerError ||
      error instanceof LightError ||
      error instanceof BrowserWalletError ||
      error instanceof SignerError
    ) {
      throw error;
    }

    // @see https://github.com/paritytech/parity-ethereum/blob/61f4534e2a5f9c947661af0eaf4af5b76456efe0/rpc/src/v1/helpers/errors.rs#L304
    if (
      error.code === -32010 &&
      error.message.startsWith("Insufficient funds. The account you tried to send transaction")
    ) {
      return yield put(actions.txSender.txSenderError(ETransactionErrorType.NOT_ENOUGH_FUNDS));
    }

    if (
      (error.code === -32000 && error.message === "intrinsic gas too low") ||
      (error.code === -32010 &&
        error.message.startsWith("Transaction gas is too low. There is not enough")) ||
      (error.code === -32010 && error.message.startsWith("exceeds current gas limit"))
    ) {
      throw new OutOfGasError();
    }

    if (error.code === -32010 && error.message.startsWith("Transaction nonce is too low")) {
      throw new LowNonceError();
    }

    if (
      error.code === -32010 &&
      error.message.startsWith("There are too many transactions in the queue")
    ) {
      throw new LongTransactionQueError();
    }

    if (error.code === -32010 && error.message.startsWith("Invalid RLP data")) {
      throw new InvalidRlpDataError();
    }

    if (error.code === -32010 && error.message.startsWith("Invalid chain id")) {
      throw new InvalidChangeIdError();
    }

    throw new UnknownEthNodeError();
  }
}

function* watchPendingOOOTxSubSaga({ logger }: TGlobalDependencies, txHash: string): any {
  const watchTxChannel = yield neuCall(createWatchTxChannel, txHash);
  try {
    while (true) {
      const result: TEventEmitterChannelEvents = yield take(watchTxChannel);
      if (result.type === EEventEmitterChannelEvents.NEW_BLOCK) {
        yield put(actions.txSender.txSenderReportBlock(result.blockId));
      } else {
        if (result.type === EEventEmitterChannelEvents.ERROR) {
          logger.warn(`Error while watching pending Tx ${txHash}`, result.error);
        }
        return;
      }
    }
  } finally {
    watchTxChannel.close();
    logger.info("Stopped Watching for TX", { txHash });
  }
}

function* watchTxSubSaga({ logger }: TGlobalDependencies, txHash: string): any {
  const watchTxChannel = yield neuCall(createWatchTxChannel, txHash);
  try {
    while (true) {
      const result: TEventEmitterChannelEvents = yield take(watchTxChannel);
      switch (result.type) {
        case EEventEmitterChannelEvents.NEW_BLOCK:
          yield put(actions.txSender.txSenderReportBlock(result.blockId));
          break;
        case EEventEmitterChannelEvents.TX_MINED:
          yield neuCall(updatePendingTxs);
          return yield put(actions.txSender.txSenderTxMined());
        // // Non terminal errors - Tx Mining should continue
        case EEventEmitterChannelEvents.ERROR:
          logger.error("Error while tx watching: ", result.error, { txHash });
          break;
        // Terminal errors - Tx Mining should exit
        case EEventEmitterChannelEvents.OUT_OF_GAS:
          logger.warn("Error Transaction out of gas: ", result.error, { txHash });
          return yield put(actions.txSender.txSenderError(ETransactionErrorType.OUT_OF_GAS));
        case EEventEmitterChannelEvents.REVERTED_TRANSACTION:
          logger.warn("Error Transaction Reverted: ", result.error, { txHash });
          return yield put(actions.txSender.txSenderError(ETransactionErrorType.REVERTED_TX));
      }
    }
  } finally {
    watchTxChannel.close();
    logger.info("Stopped Watching for TXs", { txHash });
  }
}
