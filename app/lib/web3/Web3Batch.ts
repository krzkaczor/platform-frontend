import { interfaces } from "inversify";
import Web3 from "web3";
import { JsonRpcPayload, provider } from 'web3-providers/types';


import { symbols } from "../../di/symbols";
import { SelectPropertyNames } from "../../types";
import { ILogger } from "../dependencies/logger";
import { Eth } from 'web3-eth/types';
import { Network } from 'web3-net/types';

/**
 * Wrapper on top of web3 Batch API to execute batch request on the next event loop cycle
 */
class Web3AutoExecuteBatch {
  // TODO: Add correct typings when available in `web3-typescript-typings`
  private web3Batch: any;

  constructor(private web3: Web3, private logger: ILogger) {}

  add(request: JsonRpcPayload): any {
    if (this.web3Batch === undefined) {
      this.web3Batch = (this.web3 as any).createBatch();
      // execute batch request on the next event loop
      setTimeout(this.execute, 0);
    }

    this.web3Batch.add(request);
  }

  private execute = () => {
    this.logger.info(`Number of web3 node rpc request batched: ${this.web3Batch.requests.length}`);

    this.web3Batch.execute();
    this.web3Batch = undefined;
  };
}

type Web3VersionMethodNames = SelectPropertyNames<Network, Function>;
type Web3VersionMethod = Network[Web3VersionMethodNames];

type Web3EthMethodNames = SelectPropertyNames<Eth, Function>;
type Web3EthMethod = Eth[Web3EthMethodNames];

/**
 * Extends Web3 by auto batching common ethereum RPC requests
 */
class Web3Batch extends Web3 {
  batch: Web3AutoExecuteBatch;

  constructor(provider: provider, batchFactory: Web3BatchFactoryType, logger: ILogger) {
    super(provider);

    this.batch = batchFactory(this);

    /* // List of web3.version methods which calls should be batched in one request when possible
    const versionMethods: Web3VersionMethodNames[] = ["getId"];
    versionMethods.forEach(
      method => (this.[method] = this.forceBatchExecution(this.version[method])),
    ); */

    // List of web3.eth methods which calls should be batched in one request when possible
    const ethMethods: Web3EthMethodNames[] = ["call", "getCode", "getBalance"];
    ethMethods.forEach(method => (this.eth[method] = this.forceBatchExecution(this.eth[method])));

    logger.info("Web3 node rpc requests auto batching enabled");
  }

  private forceBatchExecution = (method: Web3EthMethod | Web3VersionMethod) => (...args: any[]) =>
    this.batch.add((method as any).request(...args));
}

type Web3BatchFactoryType = (web3: Web3) => Web3AutoExecuteBatch;

const web3BatchFactory: (context: interfaces.Context) => Web3BatchFactoryType = context => {
  const logger = context.container.get<ILogger>(symbols.logger);
  return (web3: Web3) => new Web3AutoExecuteBatch(web3, logger);
};

type Web3FactoryType = (provider: provider) => Web3;

const web3Factory: (context: interfaces.Context) => Web3FactoryType = context => {
  const logger = context.container.get<ILogger>(symbols.logger);
  const batchFactory = context.container.get<Web3BatchFactoryType>(symbols.web3BatchFactory);
  return (provider: provider) => new Web3Batch(provider, batchFactory, logger);
};

export {
  Web3AutoExecuteBatch,
  web3Factory,
  Web3FactoryType,
  web3BatchFactory,
  Web3BatchFactoryType,
};
