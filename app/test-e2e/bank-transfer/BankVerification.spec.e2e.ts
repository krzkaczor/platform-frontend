import { INV_ETH_EUR_ICBM_M_HAS_KYC_DUP, INV_EUR_ICBM_HAS_KYC_SEED } from "../fixtures";
import { assertWallet, clearEmailServer, goToProfile, goToWallet } from "../utils";
import { fillForm } from "../utils/forms";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { assertWaitForBankTransferSummary } from "./assertions";

function assertBankTransferFlow({
  agreementApprovalRequired,
}: {
  agreementApprovalRequired: boolean;
}): void {
  if (agreementApprovalRequired) {
    cy.get(tid("bank-verification.link-now")).click();

    fillForm({
      quintessenceTosApproved: {
        type: "checkbox",
        values: { false: true },
      },
      nEurTosApproved: {
        type: "checkbox",
        values: { false: true },
      },
      "bank-verification.agree-with-tos": {
        type: "submit",
      },
    });
  }

  cy.get(tid("bank-transfer.summary.amount")).contains("1.00 EUR");
  cy.get(tid("bank-transfer.summary.recipient")).contains("Quintessence AG");
  cy.get(tid("bank-transfer.summary.iban")).contains("LI78088110102905K002E");
  cy.get(tid("bank-transfer.summary.bic")).contains("BFRILI22XXX");

  cy.get(tid("bank-transfer.summary.reference-number"))
    .then($e => $e.text().trim())
    .as("referenceNumber")
    .should("match", /NR[\w\d]{10}NR/);

  clearEmailServer();

  cy.get(tid("bank-transfer.summary.transfer-completed")).click();

  cy.get<string>("@referenceNumber").then(assertWaitForBankTransferSummary);

  cy.get(tid("bank-transfer.verify.success.go-to-wallet")).click();

  assertWallet();
}

describe("Bank Verification", () => {
  it("should start verification process from wallet", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_EUR_ICBM_HAS_KYC_SEED,
    }).then(() => {
      goToWallet();

      cy.get(tid("locked-wallet.neur.bank-account.not-verified")).should("exist");

      cy.get(tid("locked-wallet.neur.bank-account.link-account")).click();

      assertBankTransferFlow({
        agreementApprovalRequired: true,
      });
    });
  });

  it("should start verification process from profile", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_EUR_ICBM_HAS_KYC_SEED,
    }).then(() => {
      goToProfile();

      cy.get(tid("linked-bank-account-widget.link-account")).click();

      assertBankTransferFlow({
        agreementApprovalRequired: true,
      });
    });
  });

  it("should start new verification process from wallet", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_ETH_EUR_ICBM_M_HAS_KYC_DUP,
      hdPath: "m/44'/60'/0'/0",
      clearPendingTransactions: true,
    }).then(() => {
      goToWallet();

      cy.get(tid("locked-wallet.neur.bank-account.link-account")).click();

      assertBankTransferFlow({
        agreementApprovalRequired: false,
      });
    });
  });

  it("should start new verification process from profile", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_ETH_EUR_ICBM_M_HAS_KYC_DUP,
      hdPath: "m/44'/60'/0'/0",
      clearPendingTransactions: true,
    }).then(() => {
      goToProfile();

      cy.get(tid("linked-bank-account-widget.link-different-account")).click();

      assertBankTransferFlow({
        agreementApprovalRequired: false,
      });
    });
  });

  it("should disable all action buttons related to bank transfer when not verified", () => {
    createAndLoginNewUser({
      type: "investor",
    }).then(() => {
      // Disabled on profile
      goToProfile();
      cy.get(tid("linked-bank-account-widget.link-account")).should("be.disabled");

      // Disabled on wallet
      goToWallet();
      cy.get(tid("locked-wallet.neur.bank-account.link-account")).should("be.disabled");
    });
  });
});
