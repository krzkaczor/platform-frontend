import { fillForm } from "../utils/forms";
import {
  acceptWallet,
  assertUserInDashboard,
  clearEmailServer,
  goToProfile,
  logoutViaTopRightButton,
  registerWithLightWallet,
  verifyLatestUserEmail,
} from "../utils/index";
import { notificationTid, tid } from "../utils/selectors";
import { DEFAULT_PASSWORD, generateRandomEmailAddress } from "../utils/userHelpers";

let email: string;

describe("Change Email", () => {
  beforeEach(() => {
    email = generateRandomEmailAddress();

    clearEmailServer();

    registerWithLightWallet(email, DEFAULT_PASSWORD);
    assertUserInDashboard();
    verifyLatestUserEmail();

    goToProfile();

    cy.get(tid("verify-email-widget.change-email.button")).click();
  });

  it("should allow to change email", () => {
    const newEmail = generateRandomEmailAddress();

    clearEmailServer();

    fillForm({
      email: newEmail,
      "verify-email-widget-form-submit": { type: "submit" },
    });

    acceptWallet();

    // assert if new email is pending for verification
    cy.get(notificationTid("profile-email-change-success")).should("exist");
    cy.get(tid("profile.verify-email-widget.verified-email")).contains(email);
    cy.get(tid("profile.verify-email-widget.unverified-email")).contains(newEmail);
  });

  it("should not allow to change email if it's already used by different account", () => {
    const newEmail = generateRandomEmailAddress();

    logoutViaTopRightButton();

    // register another account
    clearEmailServer();

    registerWithLightWallet(newEmail, DEFAULT_PASSWORD);
    assertUserInDashboard();
    verifyLatestUserEmail();

    cy.get(tid("verify-email-widget.change-email.button")).click();

    fillForm({
      email: email,
      "verify-email-widget-form-submit": { type: "submit" },
    });

    acceptWallet();

    // assert if error message has pooped in
    cy.get(notificationTid("profile-email-exists")).should("exist");
  });

  it("should not allow to change email to the same as verified", () => {
    fillForm({
      email: email,
      "verify-email-widget-form-submit": { type: "submit" },
    });

    // assert if error message is present and new email has not been set
    cy.get(notificationTid("profile-email-change-verified-exists")).should("exist");
    cy.get(tid("profile.verify-email-widget.unverified-email")).should("not.exist");
  });

  it("should not allow to change email to the same as pending unverified", () => {
    const newEmail = generateRandomEmailAddress();

    fillForm({
      email: newEmail,
      "verify-email-widget-form-submit": { type: "submit" },
    });

    acceptWallet();

    // assert if new email is pending for verification
    cy.get(notificationTid("profile-email-change-success")).should("exist");
    cy.get(tid("profile.verify-email-widget.verified-email")).contains(email);
    cy.get(tid("profile.verify-email-widget.unverified-email")).contains(newEmail);

    cy.get(tid("verify-email-widget.change-email.button")).click();

    // fill again with the same email
    fillForm({
      email: newEmail,
      "verify-email-widget-form-submit": { type: "submit" },
    });

    // assert if error message pooped in
    cy.get(notificationTid("profile-email-change-unverified-exists")).should("exist");
  });
});
