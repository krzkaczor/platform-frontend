import { createSelector } from "reselect";

import { IAppState } from "../../store";
import { DeepReadonly } from "../../types";
import {
  EKycRequestType,
  ERequestOutsourcedStatus,
  ERequestStatus,
  IKycState,
  IStateBankAccount,
} from "./interfaces";

export const selectKycRequestStatus = (state: IAppState): ERequestStatus | undefined => {
  const userKycType = selectKycRequestType(state.kyc);
  switch (userKycType) {
    case EKycRequestType.BUSINESS:
      return state.kyc.businessRequestState!.status === "Accepted" && !selectIsClaimsVerified(state)
        ? ERequestStatus.PENDING
        : state.kyc.businessRequestState!.status;
    case EKycRequestType.INDIVIDUAL:
      return state.kyc.individualRequestState!.status === "Accepted" &&
        !selectIsClaimsVerified(state)
        ? ERequestStatus.PENDING
        : state.kyc.individualRequestState!.status;
    default:
      return ERequestStatus.DRAFT;
  }
};

export const selectKycRequestOutsourcedStatus = (
  state: DeepReadonly<IKycState>,
): ERequestOutsourcedStatus | undefined => {
  const requestState =
    state.individualRequestState && state.individualRequestState.status === "Draft"
      ? state.businessRequestState
      : state.individualRequestState;
  if (requestState) return requestState.outsourcedStatus;
  return undefined;
};

export const selectExternalKycUrl = (state: DeepReadonly<IKycState>): string | undefined => {
  const requestState =
    state.individualRequestState && state.individualRequestState.status === "Draft"
      ? state.businessRequestState
      : state.individualRequestState;
  if (requestState) return requestState.redirectUrl;
  return undefined;
};

export const selectPendingKycRequestType = (
  state: DeepReadonly<IKycState>,
): EKycRequestType | undefined => {
  if (state.individualRequestState && state.individualRequestState.status === "Pending")
    return EKycRequestType.INDIVIDUAL;
  if (state.businessRequestState && state.businessRequestState.status === "Pending")
    return EKycRequestType.BUSINESS;
  return undefined;
};

export const selectKycRequestType = (
  state: DeepReadonly<IKycState>,
): EKycRequestType | undefined => {
  if (state.individualRequestState && state.individualRequestState.status !== "Draft")
    return EKycRequestType.INDIVIDUAL;
  if (state.businessRequestState && state.businessRequestState.status !== "Draft")
    return EKycRequestType.BUSINESS;
  return undefined;
};

export const selectKycOutSourcedURL = (state: DeepReadonly<IKycState>): string => {
  if (state.individualRequestState && state.individualRequestState.redirectUrl)
    return state.individualRequestState.redirectUrl;
  return "";
};

export const selectCombinedBeneficialOwnerOwnership = (state: DeepReadonly<IKycState>): number => {
  if (state.beneficialOwners.length === 0) return 0;
  return state.beneficialOwners.reduce(
    (all, owner) => all + (owner.ownership ? owner.ownership : 0),
    0,
  );
};

export const selectWidgetLoading = (state: DeepReadonly<IKycState>): boolean =>
  !!state.individualRequestStateLoading || !!state.businessRequestStateLoading;

export const selectWidgetError = (state: DeepReadonly<IKycState>): string | undefined =>
  state.individualRequestError || state.businessRequestError;

export const selectIndividualClientName = (state: DeepReadonly<IKycState>): string | undefined => {
  const data = state.individualData;
  if (data) {
    return [data.firstName, data.lastName].filter(Boolean).join(" ");
  }
};

export const selectClientName = (state: DeepReadonly<IKycState>) =>
  (state.businessData && state.businessData.name) || selectIndividualClientName(state);

export const selectClientCountry = (state: DeepReadonly<IKycState>) =>
  (state.businessData && state.businessData.country) ||
  (state.individualData && state.individualData.country);

export const selectClaims = (state: IAppState) => state.kyc.claims;

export const selectIsClaimsVerified: (state: IAppState) => boolean = createSelector(
  selectClaims,
  claims => {
    if (claims) {
      return claims.isVerified;
    }

    return false;
  },
);

export const selectIsAccountFrozen: (state: IAppState) => boolean = createSelector(
  selectClaims,
  claims => {
    if (claims) {
      return claims.isAccountFrozen;
    }

    return false;
  },
);

export const selectIsUserVerifiedOnBlockchain = (state: IAppState) =>
  selectIsClaimsVerified(state) && !selectIsAccountFrozen(state);

export const selectBankAccount = (state: IAppState): DeepReadonly<IStateBankAccount> | undefined =>
  state.kyc.bankAccount;
