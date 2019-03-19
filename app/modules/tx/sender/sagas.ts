import { call, Effect, put, race, select, take } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../di/setupBindings";
import { TPendingTxs, TxPendingWithMetadata } from "../../../lib/api/users/interfaces";
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
import { neuCall, neuRepeatIf, neuSpawn } from "../../sagasUtils";
import {
  createWatchTxChannel,
  deletePendingTransaction,
  markTransactionAsPending,
  updatePendingTxs,
} from "../monitor/sagas";
import { selectAreTherePendingTxs } from "../monitor/selectors";
import { EEventEmitterChannelEvents, TEventEmitterChannelEvents } from "../monitor/types";
import { UserCannotUnlockFunds } from "../transactions/unlock/errors";
import { ETxSenderType, TAdditionalDataByType } from "../types";
import { validateGas } from "../validator/sagas";
import { ETransactionErrorType, ETxSenderState } from "./reducer";
import { selectTxAdditionalData, selectTxDetails, selectTxType } from "./selectors";

export interface ITxSendParams {
  type: ETxSenderType;
  transactionFlowGenerator: any;
  extraParam?: any;
  // Design extraParam to be a tuple that handles any number of params
  // @see neuCall
}

export function* txTrySend(txSendParams: ITxSendParams): Iterator<any> {
  // Get latest pending transactions state before starting new transaction
  yield neuCall(updatePendingTxs);

  const areTherePendingTxs: boolean = yield select(selectAreTherePendingTxs);

  if (areTherePendingTxs) {
    // create new detached process
    yield neuSpawn(txMonitorSaga);

    // cancel current one
    throw new Error("There is already a pending transaction");
  } else {
    yield txSendSaga(txSendParams);
  }
}

function* txMonitorSaga(): any {
  const sendProcessEffect = neuCall(txMonitor);

  yield call(txControllerSaga, sendProcessEffect);
}
function* txMonitor(_: TGlobalDependencies): Iterable<any> {
  const txs: TPendingTxs = yield select((s: IAppState) => s.txMonitor.txs);

  if (txs.pendingTransaction) {
    const pendingTransaction = txs.pendingTransaction as TxPendingWithMetadata;

    const txHash = pendingTransaction.transaction.hash;

    yield put(
      actions.txSender.txSenderWatchPendingTxs({
        additionalData: pendingTransaction.transactionAdditionalData,
        error: pendingTransaction.transactionError,
        state: pendingTransaction.transactionStatus,
        txHash: txHash,
        type: pendingTransaction.transactionType as any,
      }),
    );

    // If transaction is still pending initiate watch process
    if (pendingTransaction.transactionStatus === ETxSenderState.MINING) {
      yield neuCall(watchTxSubSaga, txHash);
    }
  } else if (txs.oooTransactions[0]) {
    const oooTransaction = txs.oooTransactions[0];

    yield put(
      actions.txSender.txSenderWatchPendingTxs({
        type: oooTransaction.transactionType as any,
        state: ETxSenderState.MINING,
        additionalData: undefined,
      }),
    );

    yield neuCall(watchPendingOOOTxSubSaga, oooTransaction.transaction.txhash);
  }
}

function* txControllerSaga(controlledEffect: Iterator<Effect>): any {
  const gasPrice: IGasState = yield select(selectGasPrice);

  if (!gasPrice) {
    yield take("GAS_API_LOADED");
  }

  yield put(actions.txSender.txSenderShowModal());

  const { cancel } = yield race({
    result: controlledEffect,
    cancel: take("TX_SENDER_HIDE_MODAL"),
  });

  if (cancel) {
    throw new Error("TX_SENDING_CANCELLED");
  }

  // wait for user to close modal
  yield take("TX_SENDER_HIDE_MODAL");

  // when modal was closed delete transaction for pending list
  yield neuCall(deletePendingTransaction);

  yield put(actions.wallet.loadWalletData());
}

function* txSendSaga({ type, transactionFlowGenerator, extraParam }: ITxSendParams): any {
  const sendProcessEffect = neuCall(txSendProcess, type, transactionFlowGenerator, extraParam);

  yield call(txControllerSaga, sendProcessEffect);
}

function* txSendProcess(
  { logger }: TGlobalDependencies,
  transactionType: ETxSenderType,
  transactionFlowGenerator: any,
  extraParam?: any,
): any {
  try {
    yield put(actions.txSender.txSenderWatchPendingTxsDone(transactionType));

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
      yield put(actions.txSender.txSenderError(ETransactionErrorType.GAS_TOO_LOW));
    } else if (error instanceof LowNonceError) {
      yield put(actions.txSender.txSenderError(ETransactionErrorType.NONCE_TOO_LOW));
    } else if (error instanceof LongTransactionQueError) {
      yield put(actions.txSender.txSenderError(ETransactionErrorType.TOO_MANY_TX_IN_QUEUE));
    } else if (error instanceof InvalidRlpDataError) {
      yield put(actions.txSender.txSenderError(ETransactionErrorType.INVALID_RLP_TX));
    } else if (error instanceof InvalidChangeIdError) {
      yield put(actions.txSender.txSenderError(ETransactionErrorType.INVALID_CHAIN_ID));
    } else if (error instanceof NotEnoughEtherForGasError) {
      yield put(actions.txSender.txSenderError(ETransactionErrorType.NOT_ENOUGH_ETHER_FOR_GAS));
    } else if (error instanceof UnknownEthNodeError) {
      yield put(actions.txSender.txSenderError(ETransactionErrorType.UNKNOWN_ERROR));
    } else if (error instanceof SignerRejectConfirmationError) {
      yield put(actions.txSender.txSenderError(ETransactionErrorType.TX_WAS_REJECTED));
    } else if (error instanceof LedgerContractsDisabledError) {
      yield put(actions.txSender.txSenderError(ETransactionErrorType.LEDGER_CONTRACTS_DISABLED));
    } else if (error instanceof UserCannotUnlockFunds) {
      yield put(
        actions.txSender.txSenderError(ETransactionErrorType.NOT_ENOUGH_NEUMARKS_TO_UNLOCK),
      );
    } else {
      yield put(actions.txSender.txSenderError(ETransactionErrorType.UNKNOWN_ERROR));
    }
  }
}

function* sendTxSubSaga({ web3Manager }: TGlobalDependencies): any {
  const type: ETxSenderType = yield select(selectTxType);
  const txData: ITxData = yield select(selectTxDetails);
  const txAdditionalData: TAdditionalDataByType<typeof type> = yield select((state: IAppState) =>
    selectTxAdditionalData<typeof type>(state),
  );

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
  logger.info(`Watching for out of bound transaction: ${txHash}`);

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
  logger.info(`Watching for transaction: ${txHash}`);

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
        // Non terminal errors - Tx Mining should continue
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
