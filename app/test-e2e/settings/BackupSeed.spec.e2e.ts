import { LIGHT_WALLET_PRIVATE_DATA_CACHE_TIME } from "../../config/constants";
import { INV_EUR_ICBM_HAS_KYC_KEY, INV_EUR_ICBM_HAS_KYC_SEED } from "../fixtures";
import { backupLightWalletSeed } from "../shared/backupLightWalletSeed";
import {
  assertLockedAccessModal,
  confirmAccessModal,
  goToProfile,
  registerWithLightWallet,
} from "../utils";
import { notificationTid, tid } from "../utils/selectors";
import {
  createAndLoginNewUser,
  DEFAULT_PASSWORD,
  generateRandomEmailAddress,
} from "../utils/userHelpers";

describe("Backup Seed and Private Key save and view", () => {
  it("should allow to save seed phrase", () => {
    registerWithLightWallet(generateRandomEmailAddress(), DEFAULT_PASSWORD);

    backupLightWalletSeed();
  });

  it("should prompt for an access after password cache expire", () => {
    createAndLoginNewUser({
      type: "investor",
      seed: INV_EUR_ICBM_HAS_KYC_SEED,
    }).then(() => {
      goToProfile();

      cy.get(tid("backup-seed-verified-section.view-again")).awaitedClick();

      confirmAccessModal();

      cy.wait(LIGHT_WALLET_PRIVATE_DATA_CACHE_TIME);

      assertLockedAccessModal();
    });
  });

  it("should allow to copy private key", () => {
    createAndLoginNewUser({
      type: "investor",
      seed: INV_EUR_ICBM_HAS_KYC_SEED,
    }).then(() => {
      goToProfile();

      cy.get(tid("backup-seed-verified-section.view-again")).awaitedClick();

      confirmAccessModal();

      cy.get(tid("backup-seed-intro-button")).awaitedClick();

      cy.get(tid("private-key-display.copy-to-clipboard")).awaitedClick();

      // it's not possible to check clipboard content in cypress so only check whether notification was shown
      cy.get(notificationTid("private-key-display-copied-to-clipboard")).should("exist");
    });
  });

  it("should allow to view private key", () => {
    createAndLoginNewUser({
      type: "investor",
      seed: INV_EUR_ICBM_HAS_KYC_SEED,
    }).then(() => {
      goToProfile();

      cy.get(tid("backup-seed-verified-section.view-again")).awaitedClick();

      confirmAccessModal();

      cy.get(tid("backup-seed-intro-button")).awaitedClick();

      cy.get(tid("private-key-display.view-private-key"))
        .awaitedClick()
        .contains(INV_EUR_ICBM_HAS_KYC_KEY);
    });
  });
});
