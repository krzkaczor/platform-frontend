import { expect } from "chai";
import { EventEmitter } from "events";
import { delay } from "redux-saga";
import { expectSaga } from "redux-saga-test-plan";
import { call } from "redux-saga/effects";

import { createMock } from "../../../test/testUtils";
import { LIGHT_WALLET_PASSWORD_CACHE_TIME } from "../../config/constants";
import { noopLogger } from "../../lib/dependencies/logger";
import { NotificationCenter } from "../../lib/dependencies/NotificationCenter";
import { EWeb3ManagerEvents, Web3Manager } from "../../lib/web3/Web3Manager/Web3Manager";
import { IAppState } from "../../store";
import { dummyIntl } from "../../utils/injectIntlHelpers.fixtures";
import { actions } from "../actions";
import {
  getDummyBrowserWalletMetadata,
  getDummyLedgerWalletMetadata,
  getDummyLightWalletMetadata,
} from "./fixtures";
import { autoLockLightWallet, initWeb3ManagerEvents, personalWalletConnectionLost } from "./sagas";

describe("Web3 sagas", () => {
  describe("light wallet password", () => {
    it("should reset password after timeout", async () => {
      const personalWalletMock = {
        password: "some dummy pass",
      } as any;
      const web3ManagerMock = createMock(Web3Manager, {
        personalWallet: personalWalletMock,
      });

      await expectSaga(autoLockLightWallet as any, {
        web3Manager: web3ManagerMock,
        logger: noopLogger,
      })
        .put(actions.web3.walletLocked())
        .call(delay, LIGHT_WALLET_PASSWORD_CACHE_TIME)
        .provide([[call(delay, LIGHT_WALLET_PASSWORD_CACHE_TIME), undefined]])
        .run();

      expect(personalWalletMock.password).to.be.undefined;
    });
  });

  describe("personal walled connection lost", () => {
    it("should send notification if it's ledger wallet", async () => {
      const state: Partial<IAppState> = {
        web3: {
          connected: false,
          previousConnectedWallet: getDummyLedgerWalletMetadata(),
        },
      };

      const dummyNotificationCenter = createMock(NotificationCenter, {
        error: () => {},
      });

      await expectSaga(personalWalletConnectionLost, {
        notificationCenter: dummyNotificationCenter,
        intlWrapper: { intl: dummyIntl },
      })
        .withState(state)
        .put(actions.walletSelector.reset())
        .put(actions.walletSelector.ledgerReset())
        .put(actions.web3.personalWalletDisconnected())
        .run();

      expect(dummyNotificationCenter.error).to.be.calledOnce;
    });

    it("should send notification if it's browser wallet", async () => {
      const state: Partial<IAppState> = {
        web3: {
          connected: false,
          previousConnectedWallet: getDummyBrowserWalletMetadata(),
        },
      };

      const dummyNotificationCenter = createMock(NotificationCenter, {
        error: () => {},
      });

      await expectSaga(personalWalletConnectionLost, {
        notificationCenter: dummyNotificationCenter,
        intlWrapper: { intl: dummyIntl },
      })
        .withState(state)
        .run();

      expect(dummyNotificationCenter.error).to.be.calledOnce;
    });

    it("should not send notification if it's light wallet", async () => {
      const state: Partial<IAppState> = {
        web3: {
          connected: false,
          previousConnectedWallet: getDummyLightWalletMetadata(),
        },
      };
      const dummyNotificationCenter = createMock(NotificationCenter, {
        error: () => {},
      });

      await expectSaga(personalWalletConnectionLost, {
        notificationCenter: dummyNotificationCenter,
      })
        .withState(state)
        .run();

      expect(dummyNotificationCenter.error).not.to.be.called;
    });
  });

  describe("web3Manager events connection", () => {
    it("connects to event from web3Manager", () => {
      const web3ManagerMock = new EventEmitter();
      const eventPayload = {
        metaData: "foo",
        isUnlocked: true,
      };
      const promise = expectSaga(initWeb3ManagerEvents, {
        web3Manager: web3ManagerMock,
      })
        .put(
          actions.web3.newPersonalWalletPlugged(
            eventPayload.metaData as any,
            eventPayload.isUnlocked,
          ),
        )
        .put(actions.web3.personalWalletConnectionLost())
        .run();

      web3ManagerMock.emit(EWeb3ManagerEvents.PERSONAL_WALLET_CONNECTION_LOST);
      web3ManagerMock.emit(EWeb3ManagerEvents.NEW_PERSONAL_WALLET_PLUGGED, eventPayload);
      return promise;
    });
  });
});
