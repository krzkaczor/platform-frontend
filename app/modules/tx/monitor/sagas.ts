import { BigNumber } from "bignumber.js";
import { addHexPrefix } from "ethereumjs-util";
import { delay, END, eventChannel } from "redux-saga";
import { put, select } from "redux-saga/effects";
import * as Web3 from "web3";

import { TGlobalDependencies } from "../../../di/setupBindings";
import { TxWithMetadata } from "../../../lib/api/users/interfaces";
import { ITxData } from "../../../lib/web3/types";
import { OutOfGasError, RevertedTransactionError } from "../../../lib/web3/Web3Adapter";
import { actions } from "../../actions";
import { neuCall, neuTakeUntil } from "../../sagasUtils";
import { ETxSenderType } from "../types";
import { selectMonitoredPendingTransaction } from "./selectors";

const TX_MONITOR_DELAY = 60000;

export function* deletePendingTransaction({
  apiUserService,
  logger,
}: TGlobalDependencies): Iterable<any> {
  const pendingTransaction: TxWithMetadata | undefined = yield select(
    selectMonitoredPendingTransaction,
  );

  if (!pendingTransaction) {
    throw new Error("There should be pending transaction in the pool");
  }

  const txHash = pendingTransaction.transaction.hash;
  logger.info(`Removing pending transaction from list with hash ${txHash}`);

  yield apiUserService.deletePendingTx(txHash);
  yield put(actions.txMonitor.deletePendingTx());
}

export function* markTransactionAsPending(
  { apiUserService }: TGlobalDependencies,
  {
    txHash,
    type,
    txData,
    txAdditionalData,
  }: { txHash: string; type: ETxSenderType; txData: ITxData; txAdditionalData?: any },
): any {
  const txWithMetadata: TxWithMetadata = {
    transaction: {
      from: addHexPrefix(txData.from),
      gas: addHexPrefix(new BigNumber(txData.gas).toString(16)),
      gasPrice: addHexPrefix(new BigNumber(txData.gasPrice).toString(16)),
      hash: addHexPrefix(txHash),
      input: addHexPrefix(txData.data || "0x0"),
      nonce: addHexPrefix("0"),
      to: addHexPrefix(txData.to),
      value: addHexPrefix(new BigNumber(txData.value).toString(16)),
      blockHash: undefined,
      blockNumber: undefined,
      chainId: undefined,
      status: undefined,
      transactionIndex: undefined,
    },
    transactionType: type,
    transactionAdditionalData: txAdditionalData,
    transactionTimestamp: Date.now(),
  };

  yield apiUserService.addPendingTx(txWithMetadata);

  yield neuCall(updatePendingTxs);
}

export function* updatePendingTxs({ apiUserService }: TGlobalDependencies): any {
  const apiPendingTx = yield apiUserService.pendingTxs();

  yield put(actions.txMonitor.setPendingTxs(apiPendingTx));
}

function* txMonitor({ logger }: TGlobalDependencies): any {
  while (true) {
    logger.info("Querying for pending txs...");
    try {
      yield neuCall(updatePendingTxs);
    } catch (e) {
      logger.error("Error getting pending txs", e);
    }

    yield delay(TX_MONITOR_DELAY);
  }
}

export enum EEventEmitterChannelEvents {
  NEW_BLOCK = "NEW_BLOCK",
  TX_MINED = "TX_MINED",
  ERROR = "ERROR",
  REVERTED_TRANSACTION = "REVERTED_TRANSACTION",
  OUT_OF_GAS = "OUT_OF_GAS",
}

export type TEventEmitterChannelEvents =
  | {
      type: EEventEmitterChannelEvents.NEW_BLOCK;
      blockId: number;
    }
  | {
      type: EEventEmitterChannelEvents.TX_MINED;
      tx: Web3.Transaction;
    }
  | {
      type: EEventEmitterChannelEvents.ERROR;
      error: any;
    }
  | {
      type: EEventEmitterChannelEvents.REVERTED_TRANSACTION;
      error: any;
    }
  | {
      type: EEventEmitterChannelEvents.OUT_OF_GAS;
      error: any;
    };

export const createWatchTxChannel = ({ web3Manager }: TGlobalDependencies, txHash: string) =>
  eventChannel<TEventEmitterChannelEvents>(emitter => {
    web3Manager.internalWeb3Adapter
      .waitForTx({
        txHash,
        onNewBlock: async blockId => {
          emitter({ type: EEventEmitterChannelEvents.NEW_BLOCK, blockId });
        },
      })
      .then(tx => emitter({ type: EEventEmitterChannelEvents.TX_MINED, tx }))
      .catch(error => {
        if (error instanceof RevertedTransactionError) {
          emitter({ type: EEventEmitterChannelEvents.REVERTED_TRANSACTION, error });
        } else if (error instanceof OutOfGasError) {
          emitter({ type: EEventEmitterChannelEvents.OUT_OF_GAS, error });
        } else {
          emitter({ type: EEventEmitterChannelEvents.ERROR, error });
        }
      })
      .then(() => emitter(END));
    return () => {
      // @todo missing unsubscribe
    };
  });

export function* txMonitorSagas(): any {
  yield neuTakeUntil("AUTH_SET_USER", "AUTH_LOGOUT", txMonitor);
}
