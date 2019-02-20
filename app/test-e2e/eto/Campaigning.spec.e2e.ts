import { appRoutes } from "../../components/appRoutes";
import { formatThousands } from "../../utils/Number.utils";
import { withParams } from "../../utils/withParams";
import { ISSUER_SETUP } from "../fixtures";
import { assertRegister, confirmAccessModal, etoFixtureAddressByName } from "../utils";
import { fillForm } from "../utils/forms";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser, logout, makeAuthenticatedCall } from "../utils/userHelpers";

const PLEDGE_AMOUNT = "1000";
const CHANGED_AMOUNT = "1500";

describe("Eto campaigning state", () => {
  it("should show Register button when not logged in", () => {
    const ETO_ID = etoFixtureAddressByName("ETONoStartDate");

    cy.visit(withParams(appRoutes.etoPublicViewById, { etoId: ETO_ID }));
    cy.get(tid("eto.public-view")).should("exist");

    cy.get(tid("logged-out-campaigning-register")).awaitedClick();

    assertRegister();
  });

  it("should show founders quote when logged in and campaigning date is not set", () => {
    const ETO_ID = etoFixtureAddressByName("ETONoStartDate");

    createAndLoginNewUser({
      type: "issuer",
      kyc: "business",
    }).then(() => {
      cy.visit(withParams(appRoutes.etoPublicViewById, { etoId: ETO_ID }));
      cy.get(tid("eto.public-view")).should("exist");

      cy.get(tid("eto-overview-status-founders-quote")).should("exist");
    });
  });

  it("should allow to pledge by investor", () => {
    // eto ID must match issuer SEED below
    const ETO_ID = etoFixtureAddressByName("ETOInSetupState");

    createAndLoginNewUser({
      type: "issuer",
      kyc: "business",
      seed: ISSUER_SETUP,
      permissions: ["do-bookbuilding"],
    }).then(() => {
      // make sure bookbuilding is off (especially after CI retry)
      return makeAuthenticatedCall("/api/eto-listing/etos/me/bookbuilding", {
        method: "PUT",
        body: JSON.stringify({
          is_bookbuilding: false,
        }),
      }).then(() => {
        let remainingSlots: number;
        cy.visit(appRoutes.dashboard);

        cy.get(tid("eto-flow-start-bookbuilding")).awaitedClick();

        // give it a chance to settle before logging out
        cy.wait(5000);
        logout();

        cy.reload();
        cy.wait(1000);
        createAndLoginNewUser({
          type: "investor",
          kyc: "business",
        }).then(() => {
          cy.wait(1000);
          cy.reload();

          cy.visit(withParams(appRoutes.etoPublicViewById, { etoId: ETO_ID }));

          cy.get(tid("eto-bookbuilding-remaining-slots")).then(
            $element => (remainingSlots = Number($element.text())),
          );

          fillForm({
            amount: PLEDGE_AMOUNT,
            consentToRevealEmail: {
              type: "radio",
              value: "true",
            },
            "eto-bookbuilding-back-now": { type: "submit" },
          });

          confirmAccessModal();

          cy.get(tid("campaigning-your-commitment")).then($element => {
            cy.wrap($element).contains(`€${formatThousands(PLEDGE_AMOUNT)}`);
          });
          cy.get(tid("eto-bookbuilding-remaining-slots")).then($element => {
            const slots = Number($element.text());
            const expectedSlots = remainingSlots - 1;

            assert.equal(slots, expectedSlots, `Expect remaining slots to equal ${expectedSlots}`);
            remainingSlots = slots;
          });

          // give it a chance to settle before logging out
          cy.wait(5000);

          logout();

          cy.reload();
          cy.wait(1000);
          createAndLoginNewUser({
            type: "investor",
            kyc: "individual",
          }).then(() => {
            cy.wait(1000);
            cy.reload();

            cy.visit(withParams(appRoutes.etoPublicViewById, { etoId: ETO_ID }));
            fillForm({
              amount: CHANGED_AMOUNT,
              "eto-bookbuilding-back-now": { type: "submit" },
            });

            confirmAccessModal();

            cy.wait(1000);
            cy.get(tid("campaigning-your-commitment")).then($element => {
              cy.wrap($element).contains(`€${formatThousands(CHANGED_AMOUNT)}`);
            });
            cy.get(tid("eto-bookbuilding-remaining-slots")).then($element => {
              const expectedSlots = remainingSlots - 1;

              assert.equal(
                Number($element.text()),
                expectedSlots,
                `Expect remaining slots to equal ${expectedSlots}`,
              );
            });
          });
        });
      });
    });
  });
});
