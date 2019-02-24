import { expect } from "chai";
import { spy } from "sinon";
import * as Web3 from "web3";

import { dummyConfig, dummyEthereumAddress, dummyNetworkId } from "../../../test/fixtures/fixtures";
import { setupFakeClock } from "../../../test/integrationTestUtils";
import { createMock, expectToBeRejected } from "../../../test/testUtils";
import { EWalletSubType, EWalletType } from "../../modules/web3/interfaces";
import {
  AsyncIntervalScheduler,
  AsyncIntervalSchedulerFactoryType,
} from "../../utils/AsyncIntervalScheduler";
import { delay } from "../../utils/delay";
import { noopLogger } from "../dependencies/logger";
import { ILedgerWalletMetadata } from "../persistence/WalletMetadataObjectStorage";
import { LedgerWallet } from "./LedgerWallet";
import {
  EWeb3ManagerEvents,
  WalletNotConnectedError,
  WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL,
  Web3Manager,
} from "./Web3Manager";

describe("Web3Manager", () => {
  const expectedNetworkId = dummyNetworkId;

  const clock = setupFakeClock();

  it("should plug personal wallet when connection works", async () => {
    const expectedDerivationPath = "44'/60'/0'/1";
    const pluggedListener = spy();
    const disconnectListener = spy();
    const ledgerWalletMock = createMock(LedgerWallet, {
      ethereumAddress: dummyEthereumAddress,
      testConnection: async () => true,
      walletType: EWalletType.LEDGER,
      walletSubType: EWalletSubType.UNKNOWN,
      derivationPath: expectedDerivationPath,
      getMetadata: (): ILedgerWalletMetadata => ({
        walletType: EWalletType.LEDGER,
        walletSubType: EWalletSubType.UNKNOWN,
        derivationPath: expectedDerivationPath,
        address: dummyEthereumAddress,
      }),
    });
    const asyncIntervalSchedulerMock = createMock(AsyncIntervalScheduler, {
      start: () => {},
    });
    const asyncIntervalSchedulerFactoryMock = () => asyncIntervalSchedulerMock;

    const web3FactoryMock = (...args: any[]) => new Web3(...args);

    const web3Manager = new Web3Manager(
      dummyConfig.ethereumNetwork,
      noopLogger,
      asyncIntervalSchedulerFactoryMock,
      web3FactoryMock,
    );
    web3Manager.networkId = expectedNetworkId;
    web3Manager.on(EWeb3ManagerEvents.NEW_PERSONAL_WALLET_PLUGGED, pluggedListener);
    web3Manager.on(EWeb3ManagerEvents.PERSONAL_WALLET_CONNECTION_LOST, disconnectListener);

    await web3Manager.plugPersonalWallet(ledgerWalletMock);

    expect(web3Manager.personalWallet).to.be.eq(ledgerWalletMock);
    expect(ledgerWalletMock.testConnection).to.be.calledWithExactly(expectedNetworkId);
    expect(pluggedListener).to.be.calledWithExactly({
      metaData: {
        address: dummyEthereumAddress,
        walletType: EWalletType.LEDGER,
        walletSubType: EWalletSubType.UNKNOWN,
        derivationPath: expectedDerivationPath,
      },
      isUnlocked: true,
    });
    expect(disconnectListener).to.not.be.called;
    expect(asyncIntervalSchedulerMock.start).to.be.calledOnce;
  });

  it("should throw when plugging not connected wallet", async () => {
    const ledgerWalletMock = createMock(LedgerWallet, {
      testConnection: async () => false,
      getMetadata: () =>
        ({
          walletType: EWalletType.LEDGER,
        } as any),
    });
    const asyncIntervalSchedulerMock = createMock(AsyncIntervalScheduler, {
      start: () => {},
    });
    const asyncIntervalSchedulerFactoryMock = () => asyncIntervalSchedulerMock;

    const web3FactoryMock = (...args: any[]) => new Web3(...args);

    const web3Manager = new Web3Manager(
      dummyConfig.ethereumNetwork,
      noopLogger,
      asyncIntervalSchedulerFactoryMock,
      web3FactoryMock,
    );
    web3Manager.networkId = expectedNetworkId;

    await expectToBeRejected(
      () => web3Manager.plugPersonalWallet(ledgerWalletMock),
      new WalletNotConnectedError(ledgerWalletMock),
    );

    expect(web3Manager.personalWallet).to.be.eq(undefined);
    expect(ledgerWalletMock.testConnection).to.be.calledWithExactly(expectedNetworkId);
  });

  it("should watch connection status", async () => {
    const disconnectListener = spy();
    const ledgerWalletMock = createMock(LedgerWallet, {
      testConnection: async () => true,
      getMetadata: () =>
        ({
          walletType: EWalletType.LEDGER,
        } as any),
    });
    const asyncIntervalSchedulerFactory: AsyncIntervalSchedulerFactoryType = (cb, interval) =>
      new AsyncIntervalScheduler(noopLogger, cb, interval);

    const web3FactoryMock = (...args: any[]) => new Web3(...args);

    const web3Manager = new Web3Manager(
      dummyConfig.ethereumNetwork,
      noopLogger,
      asyncIntervalSchedulerFactory,
      web3FactoryMock,
    );
    web3Manager.networkId = expectedNetworkId;
    web3Manager.on(EWeb3ManagerEvents.PERSONAL_WALLET_CONNECTION_LOST, disconnectListener);

    await web3Manager.plugPersonalWallet(ledgerWalletMock);

    expect(ledgerWalletMock.testConnection).to.be.calledOnce;

    await clock.fakeClock.tickAsync(WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL);
    expect(ledgerWalletMock.testConnection).to.be.calledTwice;

    ledgerWalletMock.reMock({
      testConnection: async () => false,
    });
    await clock.fakeClock.tickAsync(WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL);
    expect(ledgerWalletMock.testConnection).to.be.calledOnce; // remocking resets counter
    expect(disconnectListener).to.be.calledWithExactly();
  });

  it("should fail on connection timeout", async () => {
    const pluggedListener = spy();
    const disconnectListener = spy();
    const ledgerWalletConnectionMock = createMock(LedgerWallet, {
      testConnection: async () => true,
      getMetadata: () =>
        ({
          walletType: EWalletType.LEDGER,
        } as any),
    });
    const asyncIntervalSchedulerFactory: AsyncIntervalSchedulerFactoryType = (cb, interval) =>
      new AsyncIntervalScheduler(noopLogger, cb, interval);

    const web3FactoryMock = (...args: any[]) => new Web3(...args);

    const web3Manager = new Web3Manager(
      dummyConfig.ethereumNetwork,
      noopLogger,
      asyncIntervalSchedulerFactory,
      web3FactoryMock,
    );
    web3Manager.networkId = expectedNetworkId;

    web3Manager.on(EWeb3ManagerEvents.NEW_PERSONAL_WALLET_PLUGGED, pluggedListener);
    web3Manager.on(EWeb3ManagerEvents.PERSONAL_WALLET_CONNECTION_LOST, disconnectListener);

    await web3Manager.plugPersonalWallet(ledgerWalletConnectionMock);

    expect(ledgerWalletConnectionMock.testConnection).to.be.calledOnce;

    await clock.fakeClock.tickAsync(WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL);
    expect(ledgerWalletConnectionMock.testConnection).to.be.calledTwice;

    // make personal wallet timeout
    ledgerWalletConnectionMock.reMock({
      testConnection: async () => {
        await delay(WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL * 2);
        return false;
      },
    });

    // run testConnection again
    await clock.fakeClock.tickAsync(WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL);
    // wait until timeout
    await clock.fakeClock.tickAsync(WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL);

    expect(ledgerWalletConnectionMock.testConnection).to.be.calledOnce;
    expect(pluggedListener).to.be.calledOnce;
    expect(disconnectListener).to.be.calledOnce;
  });
});
