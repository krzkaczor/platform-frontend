import { createSelector } from "reselect";

import { IAppState } from "../../store";
import { selectIsUserFullyVerified } from "../auth/selectors";
import { selectBankAccount, selectClaims } from "../kyc/selectors";
import { EBankTransferFlowState } from "./reducer";

export const selectBankTransferFlow = (state: IAppState) => state.bankTransferFLow;

export const selectBankTransferFlowState = createSelector(
  selectBankTransferFlow,
  bankTransferFlow => bankTransferFlow.state,
);

export const selectIsBankTransferModalOpened = createSelector(
  selectBankTransferFlowState,
  state => state !== EBankTransferFlowState.UNINITIALIZED,
);

export const selectBankTransferFlowReference = createSelector(
  selectBankTransferFlow,
  bankTransferFlow => bankTransferFlow.reference,
);

export const selectBankTransferType = createSelector(
  selectBankTransferFlow,
  bankTransferFlow => bankTransferFlow.type,
);

export const selectBankTransferMinAmount = createSelector(
  selectBankTransferFlow,
  bankTransferFlow => bankTransferFlow.minEuroUlps,
);

/**
 * Check whether bank account is verified.
 * Tree conditions must be met:
 * 1. User is verified (by API and Contract)
 * 2. User has bank account in API
 * 3. User has bank account in contract (IdentityRegistry)
 */
export const selectIsBankAccountVerified = createSelector(
  selectBankAccount,
  selectClaims,
  selectIsUserFullyVerified,
  (bankAccount, claims, isUserVerified) => {
    // claims and bankAccount can be undefined while loading
    if (claims && bankAccount) {
      return isUserVerified && bankAccount.hasBankAccount && claims.hasBankAccount;
    }

    return false;
  },
);

/**
 * Check whether bank account is verified.
 * Tree conditions must be met:
 * 1. User is verified (by API and Contract)
 * 2.a User doesn't have bank account
 * 2.b User doesn't have bank account in contract (IdentityRegistry)
 */
export const selectIsAllowedToVerifyBankAccount = createSelector(
  selectBankAccount,
  selectClaims,
  selectIsUserFullyVerified,
  (bankAccount, claims, isUserVerified) => {
    // claims and bankAccount can be undefined while loading
    if (claims && bankAccount) {
      return isUserVerified && (!bankAccount.hasBankAccount || !claims.hasBankAccount);
    }

    return false;
  },
);

/**
 * Check whether it's possible to do any operations related to bank flow
 * One of the condition should be true:
 * 1.a User is allowed to verify bank account
 * 1.b User bank account is verified
 */
export const selectIsBankFlowEnabled = createSelector(
  selectIsAllowedToVerifyBankAccount,
  selectIsBankAccountVerified,
  (isAllowedToVerifyBankAccount, isBankAccountVerified) =>
    isAllowedToVerifyBankAccount || isBankAccountVerified,
);
