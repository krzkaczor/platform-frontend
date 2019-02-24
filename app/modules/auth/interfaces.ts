import { EWalletSubType, EWalletType } from "../web3/interfaces";

export interface IStateAuth {
  user?: IStateUser;
  jwt?: string;
  currentAgreementHash?: string;
}

export interface IStateUser {
  userId: string;
  backupCodesVerified?: boolean;
  latestAcceptedTosIpfs?: string;
  language?: string;
  unverifiedEmail?: string;
  verifiedEmail?: string;
  type: EUserType;
  walletType: EWalletType;
  walletSubtype: EWalletSubType;
}

export interface IApiUser {
  userId: string;
  backupCodesVerified?: boolean;
  latestAcceptedTosIpfs?: string;
  language?: string;
  unverifiedEmail?: string;
  verifiedEmail?: string;
  type: EUserType;
  walletType: EWalletType;
  walletSubtype: EWalletSubType;
}

export enum EUserType {
  INVESTOR = "investor",
  ISSUER = "issuer",
}

export interface IApiEmailStatus {
  isAvailable: boolean;
}

export interface IApiUserInput {
  newEmail?: string;
  salt?: string;
  language?: string;
  backupCodesVerified?: boolean;
  type: EUserType;
  walletType: EWalletType;
  walletSubtype: EWalletSubType;
}

export interface IVerifyEmailUser {
  verificationCode: string;
}
