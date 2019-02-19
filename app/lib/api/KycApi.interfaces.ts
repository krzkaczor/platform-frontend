import * as Yup from "yup";

import * as YupTS from "../yup-ts";
import {
  countryCode,
  isUsCitizen,
  makeAllRequired,
  percentage,
  personBirthDate,
  restrictedCountry,
} from "./util/schemaHelpers";

export enum EKycRequestType {
  BUSINESS = "business",
  INDIVIDUAL = "individual",
}

export interface IKycPerson {
  firstName?: string;
  lastName?: string;
  street?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  birthDate?: string;
  placeOfBirth?: string;
  nationality?: string;
  isPoliticallyExposed?: boolean;
}

export const KycPersonSchema = Yup.object().shape({
  firstName: Yup.string(),
  lastName: Yup.string(),
  street: Yup.string(),
  city: Yup.string(),
  zipCode: Yup.string(),
  country: restrictedCountry,
  birthDate: personBirthDate,
  placeOfBirth: countryCode,
  nationality: countryCode,
  isPoliticallyExposed: Yup.bool(),
});

// individual data
export interface IKycIndividualData extends IKycPerson {
  isUsCitizen?: boolean;
  isHighIncome?: boolean;
}

export const KycIndividualDataSchema = KycPersonSchema.concat(
  Yup.object().shape({
    isUsCitizen,
    isHighIncome: Yup.bool(),
  }),
);

export const KycIndividualDataSchemaRequired = makeAllRequired(KycIndividualDataSchema);

// business data
export interface IKycBusinessData {
  name?: string;
  registrationNumber?: string;
  legalForm?: string;
  legalFormType?: EKycBusinessType;
  street?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  jurisdiction?: string;
}

export const KycBusinessDataSchema = Yup.object<any>().shape({
  name: Yup.string().required(),
  registrationNumber: Yup.string(),
  legalForm: Yup.string().required(),
  legalFormType: Yup.string(),
  street: Yup.string().required(),
  city: Yup.string().required(),
  zipCode: Yup.string().required(),
  country: restrictedCountry.required(),
  jurisdiction: Yup.string().default("de"),
});

// legal representative (same as base person)
export interface IKycLegalRepresentative extends IKycPerson {}
export const KycLegalRepresentativeSchema = KycPersonSchema;
export const KycLegalRepresentativeSchemaRequired = makeAllRequired(KycPersonSchema);

// beneficial owner
export interface IKycBeneficialOwner extends IKycPerson {
  ownership?: number;
  id?: string;
}

export const KycBeneficialOwnerSchema = KycPersonSchema.concat(
  Yup.object().shape({
    ownership: percentage,
    id: Yup.string(),
  }),
);
export const KycBeneficialOwnerSchemaRequired = makeAllRequired(KycBeneficialOwnerSchema);

// file
export interface IKycFileInfo {
  id: string;
  fileName: string;
  preview?: string;
}

export const KycFileInfoShape = Yup.object().shape({
  id: Yup.string(),
  fileName: Yup.string(),
});

// request state
export enum ERequestStatus {
  DRAFT = "Draft",
  PENDING = "Pending",
  OUTSOURCED = "Outsourced",
  REJECTED = "Rejected",
  ACCEPTED = "Accepted",
  IGNORED = "Ignored",
}

export enum ERequestOutsourcedStatus {
  STARTED = "started",
  SUCCESS = "success",
  SUCCESS_DATA_CHANGED = "success_data_changed",
  REVIEW_PENDING = "review_pending",
  ABORTED = "aborted",
  CANCELED = "canceled",
  OTHER = "other",
}

export interface IKycRequestState {
  status: ERequestStatus;
  outsourcedStatus?: ERequestOutsourcedStatus;
  redirectUrl?: string;
}

export const KycRequestStateSchema = Yup.object().shape({
  status: Yup.string().required("Request state is required"),
  outsourcedStatus: Yup.string(),
  redirectUrl: Yup.string(),
  type: Yup.string(),
});

export enum EKycBusinessType {
  CORPORATE = "corporate",
  SMALL = "small",
  PARTNERSHIP = "partnership",
}

export const KycBankAccountSchema = YupTS.object({
  bankAccountNumberLast4: YupTS.string(),
  holderName: YupTS.string(),
});

export type TKycBankAccount = YupTS.TypeOf<typeof KycBankAccountSchema>;
