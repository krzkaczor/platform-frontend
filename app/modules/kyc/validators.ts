import * as Yup from "yup";

import {
  countryCode,
  isUsCitizen,
  percentage,
  personBirthDate,
  restrictedCountry
} from "../../lib/api/util/schemaHelpers";
import * as YupTS from "../../lib/yup-ts";

export const KycPersonValidator = Yup.object().shape({
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

export const KycBeneficialOwnerValidator = KycPersonValidator.concat(
  Yup.object().shape({
    ownership: percentage,
    id: Yup.string(),
  }),
);

export const KycBusinessDataValidator = Yup.object<any>().shape({
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

export const KycFileInfoValidator = Yup.object().shape({
  id: Yup.string(),
  fileName: Yup.string(),
});

export const KycIndividualDataValidator = KycPersonValidator.concat(
  Yup.object().shape({
    isUsCitizen,
    isHighIncome: Yup.bool(),
  }),
);

export const KycRequestStateValidator = Yup.object().shape({
  status: Yup.string().required("Request state is required"),
  outsourcedStatus: Yup.string(),
  redirectUrl: Yup.string(),
  type: Yup.string(),
});

export const KycLegalRepresentativeValidator = KycPersonValidator;

export const KycBankAccountValidator = YupTS.object({
  bankAccountNumberLast4: YupTS.string(),
  holderName: YupTS.string(),
});
