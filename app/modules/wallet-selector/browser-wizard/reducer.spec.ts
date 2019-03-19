import { expect } from "chai";

import { GenericErrorMessage } from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { actions } from "../../actions";
import { browserWalletWizardInitialState, browserWalletWizardReducer } from "./reducer";

describe("Wallet selector > Browser wizard > reducer", () => {
  it("should act on BROWSER_WALLET_CONNECTION_ERROR action", () => {
    const expectedErrorMsg = createMessage(GenericErrorMessage.GENERIC_ERROR);

    const actualState = browserWalletWizardReducer(
      undefined,
      actions.walletSelector.browserWalletConnectionError(expectedErrorMsg),
    );

    expect(actualState).to.be.deep.eq({
      approvalRejected: false,
      isLoading: false,
      errorMsg: expectedErrorMsg,
    });
  });

  it("should act on BROWSER_WALLET_APPROVAL_REJECTED action", () => {
    const state = browserWalletWizardReducer(
      undefined,
      actions.walletSelector.browserWalletAccountApprovalRejectedError(),
    );

    expect(state).to.be.deep.eq({
      isLoading: false,
      approvalRejected: true,
    });
  });

  it("should act on BROWSER_WALLET_APPROVAL_REQUEST_RESET action", () => {
    const initialState = {
      ...browserWalletWizardInitialState,
      approvalRejected: true,
    };

    const state = browserWalletWizardReducer(
      initialState,
      actions.walletSelector.browserWalletResetApprovalRequest(),
    );

    expect(state).to.be.deep.eq({
      isLoading: true,
      approvalRejected: false,
    });
  });
});
