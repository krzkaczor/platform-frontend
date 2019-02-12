import { createSelector } from "reselect";

import { ERequestStatus } from "../../lib/api/KycApi.interfaces";
import { EUserType, IStateUser } from "./interfaces";
import { IAppState } from "../../store";
import { selectKycRequestStatus } from "../kyc/selectors";
import { selectIsLightWallet } from "../web3/selectors";
import { IStateAuth } from "./interfaces";

export const selectIsAuthorized = (state: IStateAuth): boolean => !!(state.jwt && state.user);
export const selectUserType = (state: IAppState): EUserType | undefined =>
  state.auth.user && state.auth.user.type;

export const selectUserEmail = (state: IStateAuth): string | undefined =>
  state.user && (state.user.unverifiedEmail || state.user.verifiedEmail);

export const selectVerifiedUserEmail = (state: IStateAuth): string | undefined =>
  state.user && state.user.verifiedEmail;

export const selectUnverifiedUserEmail = (state: IStateAuth): string | undefined =>
  state.user && state.user.unverifiedEmail;

export const selectUser = (state: IStateAuth): IStateUser | undefined => state.user;

export const selectBackupCodesVerified = (state: IAppState): boolean =>
  (!!state.auth.user && !!state.auth.user.backupCodesVerified) || !selectIsLightWallet(state.web3);

export const selectIsUserEmailVerified = (state: IStateAuth): boolean =>
  !!state.user && !!state.user.verifiedEmail;

export const selectIsThereUnverifiedEmail = (state: IStateAuth): boolean =>
  !!state.user && !!state.user.unverifiedEmail;

export const selectDoesEmailExist = (state: IStateAuth): boolean =>
  selectIsThereUnverifiedEmail(state) || selectIsUserEmailVerified(state);

export const selectIsUserVerified = (state: IAppState): boolean =>
  selectIsUserEmailVerified(state.auth) &&
  selectKycRequestStatus(state) === ERequestStatus.ACCEPTED;

export const selectIsInvestor = (state: IAppState): boolean =>
  selectUserType(state) === EUserType.INVESTOR;

export const selectIsVerifiedInvestor:(state:IAppState)=>boolean =
  createSelector(
    selectIsInvestor,
    selectIsUserVerified,
  (isInvestor, isUserVerified) => isInvestor && isUserVerified,
);

// TOS Related Selectors

export const selectIsAgreementAccepted = (state: IAppState): boolean =>
  !!(state.auth.user && state.auth.user.latestAcceptedTosIpfs !== undefined);

export const selectCurrentAgreementHash = (state: IAppState): string | undefined =>
  state.auth.currentAgreementHash;

export const selectIsLatestAgreementAccepted = (state: IAppState): boolean =>
  !!(
    state.auth.user &&
    state.auth.currentAgreementHash &&
    state.auth.user.latestAcceptedTosIpfs === state.auth.currentAgreementHash
  );

export const selectIsLatestAgreementLoaded = (state: IAppState):boolean =>
  !!state.auth.currentAgreementHash;
