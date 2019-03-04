import { INV_ICBM_ETH_M_HAS_KYC_DUP } from "../fixtures";
import { closeModal, confirmAccessModal } from "../utils";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";

describe("Unlock Ether Funds", () => {
  it.skip("do", () => {
    //Can't enable without a new fixture
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
      seed: INV_ICBM_ETH_M_HAS_KYC_DUP,
      hdPath: "m/44'/60'/0'/0",
      clearPendingTransactions: true,
    }).then(() => {
      cy.visit("/wallet-unlock-etherlock");
      cy.get(tid("modals.tx-sender.withdraw-flow.summery.unlock-funds-summary.accept")).click();
      confirmAccessModal();
      cy.get(tid("modals.shared.signing-message.modal"));
      cy.get(tid("modals.tx-sender.withdraw-flow.success"));
      closeModal();
      cy.get(tid("lockedEuroWallet.balance-values-large-value")).should("not.exist");
    });
  });
});
