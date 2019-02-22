import { appRoutes } from "../../components/appRoutes";
import { formatThousands } from "../../utils/Number.utils";
import { withParams } from "../../utils/withParams";
import { ISSUER_SETUP } from "../fixtures";
import {
  assertRegister,
  confirmAccessModal,
  etoFixtureAddressByName,
  goToDashboard,
} from "../utils";
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
        goToDashboard();

        cy.get(tid("eto-flow-start-bookbuilding")).awaitedClick();

        logout();

        createAndLoginNewUser({
          type: "investor",
          kyc: "business",
        }).then(() => {
          cy.visit(withParams(appRoutes.etoPublicViewById, { etoId: ETO_ID }));

          cy.get(tid("eto-bookbuilding-remaining-slots"))
            .then($element => Number($element.text()))
            .as("remainingSlots");

          fillForm({
            amount: PLEDGE_AMOUNT,
            consentToRevealEmail: {
              type: "radio",
              value: "true",
            },
            "eto-bookbuilding-back-now": { type: "submit" },
          });

          confirmAccessModal();

          cy.get(tid("campaigning-your-commitment")).contains(`€${formatThousands(PLEDGE_AMOUNT)}`);
          cy.get<number>("@remainingSlots").then(remainingSlots => {
            // Remove one from remaining slots as it's first pledge
            cy.get(tid("eto-bookbuilding-remaining-slots")).should("contain", remainingSlots - 1);
          });

          logout();

          createAndLoginNewUser({
            type: "investor",
            kyc: "individual",
          }).then(() => {
            cy.visit(withParams(appRoutes.etoPublicViewById, { etoId: ETO_ID }));

            fillForm({
              amount: CHANGED_AMOUNT,
              "eto-bookbuilding-back-now": { type: "submit" },
            });

            confirmAccessModal();

            cy.get(tid("campaigning-your-commitment")).contains(
              `€${formatThousands(CHANGED_AMOUNT)}`,
            );
            cy.get<number>("@remainingSlots").then(remainingSlots => {
              // Remove two from remaining slots as it's second pledge
              cy.get(tid("eto-bookbuilding-remaining-slots")).should("contain", remainingSlots - 2);
            });
          });
        });
      });
    });
  });
});
