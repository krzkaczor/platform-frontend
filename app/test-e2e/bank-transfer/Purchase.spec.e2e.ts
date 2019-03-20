import { INV_ETH_EUR_ICBM_M_HAS_KYC_DUP, INV_EUR_ICBM_HAS_KYC_SEED } from "../fixtures";
import { assertWallet, clearEmailServer, goToProfile, goToWallet } from "../utils";
import { fillForm } from "../utils/forms";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { assertBankAccountDetails, assertWaitForBankTransferSummary } from "./assertions";

function assertBankTransferFlow({
  agreementApprovalRequired,
}: {
  agreementApprovalRequired: boolean;
}): void {
  if (agreementApprovalRequired) {
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

  cy.get(tid("bank-transfer.purchase.summary.min-amount")).contains("1.00 EUR");
  cy.get(tid("bank-transfer.purchase.summary.recipient")).contains("Quintessence AG");
  cy.get(tid("bank-transfer.purchase.summary.iban")).contains("LI78088110102905K002E");
  cy.get(tid("bank-transfer.purchase.summary.bic")).contains("BFRILI22XXX");

  cy.get(tid("bank-transfer.purchase.summary.reference-number"))
    .then($e => $e.text().trim())
    .as("referenceNumber")
    .should("match", /NR[\w\d]{10}NR/);

  clearEmailServer();

  cy.get(tid("bank-transfer.purchase.summary.transfer-completed")).click();

  cy.get<string>("@referenceNumber").then(assertWaitForBankTransferSummary);

  cy.get(tid("bank-transfer.purchase.success.go-to-wallet")).click();

  assertWallet();
}

describe("Purchase", () => {
  it("should start purchase agreement approval when bank account not verified", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_EUR_ICBM_HAS_KYC_SEED,
    }).then(() => {
      goToWallet();

      cy.get(tid("wallet-balance.neur.purchase-button")).click();

      assertBankTransferFlow({
        agreementApprovalRequired: true,
      });
    });
  });

  it("should start purchase without agreement approval when bank account is verified", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_ETH_EUR_ICBM_M_HAS_KYC_DUP,
      hdPath: "m/44'/60'/0'/0",
      clearPendingTransactions: true,
    }).then(() => {
      goToWallet();

      cy.get(tid("wallet-balance.neur.purchase-button")).click();

      assertBankTransferFlow({
        agreementApprovalRequired: false,
      });
    });
  });

  it("should show bank account details", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_ETH_EUR_ICBM_M_HAS_KYC_DUP,
      hdPath: "m/44'/60'/0'/0",
      clearPendingTransactions: true,
    }).then(() => {
      // On wallet
      goToWallet();

      assertBankAccountDetails();

      // On profile
      goToProfile();

      assertBankAccountDetails();
    });
  });

  it("should disable all action buttons related to bank transfer when not verified", () => {
    createAndLoginNewUser({
      type: "investor",
    }).then(() => {
      goToWallet();
      cy.get(tid("wallet-balance.neur.purchase-button")).should("be.disabled");
    });
  });
});
