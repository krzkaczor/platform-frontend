import * as moment from "moment";

import {
  INV_ETH_EUR_ICBM_M_HAS_KYC_DUP,
  INV_ETH_EUR_ICBM_M_HAS_KYC_DUP_ADDRESS,
  INV_EUR_ICBM_HAS_KYC_ADDRESS,
  INV_EUR_ICBM_HAS_KYC_SEED,
} from "../fixtures";
import { clearEmailServer, goToWallet } from "../utils";
import { fillForm } from "../utils/forms";
import { assertWallet, goToProfile } from "../utils/index";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { assertWaitForBankTransferSummary } from "./assertions";

function assertBankTransferFlow({
  address,
  agreementApprovalRequired,
}: {
  address: string;
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

  const date = moment.utc().format("DDMMYYHH");

  // for details how it's generated see `generateReference` method
  const referenceRegexp = new RegExp(`NF ${address} REF PU${date}\\d\\d.{4}`);

  cy.get(tid("bank-transfer.purchase.summary.reference-number"))
    .then($e => $e.text().trim())
    .as("referenceNumber")
    .should("match", referenceRegexp);

  clearEmailServer();

  cy.get(tid("bank-transfer.purchase.summary.transfer-completed")).click();

  cy.get<string>("@referenceNumber").then(assertWaitForBankTransferSummary);

  cy.get(tid("bank-transfer.purchase.success.go-to-wallet")).click();

  assertWallet();
}

function assertBankAccountDetails(): void {
  cy.get(tid("wallet.bank-account.name")).contains("Account Holder Name");
  cy.get(tid("wallet.bank-account.details")).contains(/Sparkasse Berlin \(\*{16}\d{4}\)/);
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
        address: INV_EUR_ICBM_HAS_KYC_ADDRESS,
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
        address: INV_ETH_EUR_ICBM_M_HAS_KYC_DUP_ADDRESS,
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
