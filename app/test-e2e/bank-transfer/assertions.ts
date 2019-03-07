import { get } from "lodash";

import { mockApiUrl } from "../confirm";

export const assertWaitForBankTransferSummary = (reference: string, timeout: number = 10000) => {
  expect(timeout, `Email not received in ${timeout} ms`).to.be.gt(0);
  cy.wait(1000);
  cy.request({ url: mockApiUrl + "sendgrid/session/mails", method: "GET" }).then(r => {
    if (r.status === 200) {
      const purpose = get(r, "body[0].personalizations[0].substitutions.-purpose-");
      if (purpose) {
        expect(purpose).to.be.eq(reference);
        return;
      }
    }
    assertWaitForBankTransferSummary(reference, timeout - 1000);
  });
};
