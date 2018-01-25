export const LedgerConnectorSymbol = "LedgerWallet";

import ledgerWalletProvider from "ledger-wallet-provider";
import * as semver from "semver";
import * as Web3 from "web3";
import * as Web3ProviderEngine from "web3-provider-engine";
// tslint:disable-next-line
import * as RpcSubprovider from "web3-provider-engine/subproviders/rpc";

import { delay } from "bluebird";
import { inject, injectable } from "inversify";
import { EthereumNetworkId } from "../../types";
import { IPersonalWallet, WalletSubType, WalletType } from "./PersonalWeb3";
import { IEthereumNetworkConfig, IEthereumNetworkConfigSymbol } from "./Web3Manager";

const CHECK_INTERVAL = 1000;

interface ILedgerConfig {
  version: string;
  arbitraryDataEnabled: boolean;
}

export interface IDerivationPathToAddress {
  [derivationPath: string]: string;
}

export class LedgerError extends Error {}
export class LedgerLockedError extends LedgerError {}
export class LedgerNotAvailableError extends LedgerError {}
export class LedgerNotSupportedVersionError extends LedgerError {}
export class LedgerInvalidDerivationPathError extends LedgerError {}
export class LedgerUnknownError extends LedgerError {}

@injectable()
export class LedgerWallet implements IPersonalWallet {
  public readonly type: WalletType.LEDGER;
  public readonly subType: WalletSubType.UNKNOWN;
  public web3: Web3;
  protected ledgerInstance: any | undefined;

  public constructor(
    @inject(IEthereumNetworkConfigSymbol) public readonly web3Config: IEthereumNetworkConfig,
  ) {}

  public async testConnection(): Promise<boolean> {
    try {
      await getLedgerConfig(this.ledgerInstance);
      return true;
    } catch {
      return false;
    }
  }

  public async connect(networkId: EthereumNetworkId): Promise<void> {
    try {
      const ledger = await connectToLedger(networkId, this.web3Config.rpcUrl);
      this.web3 = ledger.ledgerWeb3;
      this.ledgerInstance = ledger.ledgerInstance;
    } catch (e) {
      if (e instanceof LedgerError) {
        throw e;
      } else {
        throw new LedgerUnknownError();
      }
    }
  }

  public setDerivationPath(derivationPath: string): void {
    try {
      this.ledgerInstance.setDerivationPath(derivationPath);
    } catch (e) {
      throw new LedgerInvalidDerivationPathError();
    }
  }

  public async getMultipleAccounts(
    derivationPathPrefix: string,
    page: number,
    addressesPerPage: number,
  ): Promise<IDerivationPathToAddress> {
    const derivationPath = derivationPathPrefix + "0";

    return noSimultaneousConnectionsGuard(this.ledgerInstance, () => {
      return this.ledgerInstance.getMultipleAccounts(
        derivationPath,
        page * addressesPerPage,
        addressesPerPage,
      );
    });
  }
}

async function testIfUnlocked(ledgerInstance: any): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    ledgerInstance.getAccounts((err: Error | undefined, _accounts: string) => {
      if (!err) {
        resolve();
      } else {
        reject(new LedgerLockedError());
      }
    });
  });
}

async function getLedgerConfig(ledgerInstance: any): Promise<ILedgerConfig> {
  return new Promise<ILedgerConfig>(async (resolve, reject) => {
    noSimultaneousConnectionsGuard(ledgerInstance, () => {
      ledgerInstance.getAppConfig((error: any, data: ILedgerConfig) => {
        if (error) {
          if (error.message === "Timeout") {
            reject(new LedgerNotAvailableError());
          } else {
            reject(error);
          }
        } else {
          resolve(data);
        }
      }, CHECK_INTERVAL / 2);
    }).catch(reject);
  });
}

interface ILedgerOutput {
  ledgerInstance: any;
  ledgerWeb3: any;
}

async function createWeb3WithLedgerProvider(
  networkId: string,
  rpcUrl: string,
): Promise<ILedgerOutput> {
  const engine = new Web3ProviderEngine();
  const ledgerProvider = await ledgerWalletProvider(async () => networkId);

  const ledgerInstance = ledgerProvider.ledger;

  engine.addProvider(ledgerProvider);
  engine.addProvider(
    new RpcSubprovider({
      rpcUrl,
    }),
  );
  engine.start();

  return {
    ledgerInstance,
    ledgerWeb3: new Web3(engine),
  };
}

async function connectToLedger(networkId: string, rpcUrl: string): Promise<ILedgerOutput> {
  const { ledgerInstance, ledgerWeb3 } = await createWeb3WithLedgerProvider(networkId, rpcUrl);

  const ledgerConfig = await getLedgerConfig(ledgerInstance);
  if (semver.lt(ledgerConfig.version, "1.0.8")) {
    throw new LedgerNotSupportedVersionError(ledgerConfig.version);
  }

  await testIfUnlocked(ledgerInstance);

  return { ledgerInstance, ledgerWeb3 };
}

// right after callback needs to be used instead of awaiting for this function because promise resolving is async
async function noSimultaneousConnectionsGuard<T>(
  ledgerInstance: any,
  callRightAfter: () => T,
): Promise<T> {
  while (ledgerInstance.connectionOpened) {
    await delay(0);
  }
  return callRightAfter();
}