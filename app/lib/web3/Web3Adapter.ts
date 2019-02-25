import { BigNumber } from "bignumber.js";
import web3 from "web3";

import { makeEthereumAddressChecksummed } from "../../modules/web3/utils";
import { EthereumAddress, EthereumAddressWithChecksum, EthereumNetworkId } from "../../types";
import { delay } from "../../utils/delay";
import { promisify } from "bluebird";
import { Transaction, TransactionReceipt } from "web3-core/types";

class Web3Error extends Error {}
export class NotEnoughEtherForGasError extends Error {}
export class RevertedTransactionError extends Web3Error {}
export class OutOfGasError extends Web3Error {}
export class NotEnoughFundsError extends Web3Error {}

export class EthNodeError extends Error {}
export class LowGasNodeError extends EthNodeError {}
export class LowNonceError extends EthNodeError {}
export class LongTransactionQueError extends EthNodeError {}
export class InvalidRlpDataError extends EthNodeError {}
export class InvalidChangeIdError extends EthNodeError {}
export class UnknownEthNodeError extends EthNodeError {}

/**
 * Layer on top of raw Web3js. Simplifies API for common operations. Adds promise support.
 * Note that some methods may be not supported correctly by exact implementation of your client
 */
export class Web3Adapter {
  constructor(public readonly web3: web3) {}

  public async getNetworkId(): Promise<number> {
    return promisify(this.web3.eth.net.getId)();
  }

  public async getBalance(address: string): Promise<BigNumber> {
    return promisify(this.web3.eth.getBalance)(address) as any;
  }

  public async estimateGas(txData: Partial<Transaction>): Promise<number> {
    return promisify(this.web3.eth.estimateGas)(txData);
  }

  public async getAccountAddress(): Promise<EthereumAddress> {
    const getAccounts = promisify(this.web3.eth.getAccounts);
    const accounts = await getAccounts();
    return accounts[0] as EthereumAddress;
  }

  // returns mixed case checksummed ethereum address according to: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md
  public async getAccountAddressWithChecksum(): Promise<EthereumAddressWithChecksum> {
    const address = await this.getAccountAddress();
    return makeEthereumAddressChecksummed(address);
  }

  public async ethSign(
    address: EthereumAddress | EthereumAddressWithChecksum,
    data: string,
  ): Promise<string> {
    const sign = promisify(this.web3.eth.sign);
    return sign(address, data);
  }

  public async signTypedData(
    address: EthereumAddress | EthereumAddressWithChecksum,
    data: ITypedDataToSign[],
  ): Promise<string> {
    const send = promisify(this.web3.currentProvider.send.bind(this.web3.currentProvider)); // web3 typings are not accurate here

    const resultData = await send({
      method: "eth_signTypedData",
      params: [data, address as string],
      from: address as string,
    });

    if (resultData.error !== undefined) {
      /*
       Sane thing is to throw Error but here result.error contain object with message and code fields.
       We could create own error but here it's gonna get more complicated when we will support more browser wallets as
       those have different API's and returned objects may differ
      */
      throw resultData.error;
    }

    return resultData.result;
  }

  public async getTransactionReceipt(txHash: string): Promise<TransactionReceipt> {
    const getTransactionReceipt = promisify(
      this.web3.eth.getTransactionReceipt.bind(this.web3.eth),
    );
    return await getTransactionReceipt(txHash);
  }

  public async getTransactionByHash(txHash: string): Promise<Transaction> {
    const getTransactionByHash = promisify(
      this.web3.eth.getTransaction.bind(this.web3.eth),
    );
    return await getTransactionByHash(txHash);
  }

  public async getTransactionCount(address: string): Promise<number> {
    const getTransactionCount = promisify(
      this.web3.eth.getTransactionCount.bind(this.web3.eth),
    );
    return await getTransactionCount(address);
  }

  /**
   * This will ensure that txData has nonce value.
   */
  public async sendRawTransaction(txData: string): Promise<string> {
    const send = promisify(this.web3.eth.sendSignedTransaction.bind(this.web3.eth));
    return await send(txData);
  }

  /**
   * This will ensure that txData has nonce value.
   */
  public async sendTransaction(txData: Transaction): Promise<string> {
    const send = promisify(this.web3.eth.sendTransaction.bind(this.web3.eth));

    // we manually add nonce value if needed
    // later it's needed by backend
    if (txData.nonce === undefined) {
      const getTransactionCount = promisify(
        this.web3.eth.getTransactionCount.bind(this.web3.eth),
      );

      txData.nonce = await getTransactionCount(txData.from as string) as any;
    }

    return await send(txData);
  }

  public async waitForTx(options: IWaitForTxOptions): Promise<Transaction> {
    // TODO: Refactor Wait for TX
    const getTx = promisify(this.web3.eth.getTransaction);
    return new Promise<Transaction>((resolve, reject) => {
      this.watchNewBlock(async blockId => {
        try {
          if (options.onNewBlock) {
            await options.onNewBlock(blockId);
          }

          const tx = await getTx(options.txHash);
          const txReceipt = await this.getTransactionReceipt(options.txHash);
          // Both requests `getTx` and `getTransactionReceipt` can end up in two seperate nodes
          const isMined = tx && tx.blockNumber && txReceipt && txReceipt.blockNumber;
          if (!isMined) {
            return;
          }

          if (!txReceipt.status) {
            if (txReceipt.gasUsed === tx.gas) {
              // All gas is burned in this case
              throw new OutOfGasError();
            }
            throw new RevertedTransactionError();
          }

          resolve(tx);
          return true;
        } catch (e) {
          reject(e);
        }
      }).catch(reject);
    });
  }

  // onNewBlock should return true to finish observing
  public async watchNewBlock(
    onNewBlock: (blockId: number) => Promise<boolean | void>,
  ): Promise<void> {
    let lastBlockId = -1;

    while (true) {
      const currentBlockNo = await this.getBlockNumber();
      if (lastBlockId !== currentBlockNo) {
        lastBlockId = currentBlockNo;

        const isFinished = await onNewBlock(lastBlockId);

        if (isFinished) {
          break;
        }
      }

      await delay(3000);
    }
  }

  public async getBlockNumber(): Promise<number> {
    const getBlockNumber = promisify(this.web3.eth.getBlockNumber);

    return getBlockNumber();
  }
}

interface IWaitForTxOptions {
  txHash: string;
  onNewBlock?: (blockId: number) => Promise<void>;
}

interface ITypedDataToSign {
  type: string; // todo: here we could use more specific type. Something like "string" | "uint32" etc.
  name: string;
  value: string;
}
