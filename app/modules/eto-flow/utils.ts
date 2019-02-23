import BigNumber from "bignumber.js";
import * as Yup from "yup";

import {IApiDetailedBookbuildingStats} from "../bookbuilding-flow/interfaces/DetailedBookbuildingStats";
import {  EtoCompanyInformationValidator,
  EtoEquityTokenInfoValidator,
  EtoInvestmentTermsValidator,
  EtoKeyIndividualsValidator,
  EtoLegalInformationValidator,
  EtoMediaValidator,
  EtoPitchValidator,
  EtoRiskAssessmentValidator,
  EtoTermsValidator,
  EtoVotingRightsValidator,
  GeneralEtoDataValidator
} from './validators'

function getErrorsNumber(validator: Yup.Schema<any>, data?: any): number {
  try {
    validator.validateSync(data, { abortEarly: false });
    return 0;
  } catch (e) {
    return e.errors.length;
  }
}

export interface IProgressOptions {
  ignore: any;
}

export type ProgressCalculator = (formState: any, initialData?: any) => number;

// recursivly clones a YUP Schema and makes number and string properties required
export function updateValidator(objectSchema: any, ignore: any): any {
  const type = objectSchema._type;
  if (ignore !== true) {
    switch (type) {
      case "object":
        for (const prop in objectSchema.fields) {
          // need to clone before change
          const schema = (objectSchema.fields[prop] = objectSchema.fields[prop].clone());
          updateValidator(schema, ignore && ignore[prop]);
        }
        break;
      case "array":
        // need to clone before change
        objectSchema._subType = objectSchema._subType.clone();
        updateValidator(objectSchema._subType, ignore && ignore[0]);
        break;
      case "string":
      case "number":
        objectSchema.withMutation((schema: any) => schema.required());
    }
  }
}

// recursivly create initial data from current values
function updateInitialData(initialData: any, currentValue: any): any {
  if (Array.isArray(currentValue)) {
    return currentValue.map((_, i) => updateInitialData({}, currentValue[i]));
  } else if (typeof currentValue === "object") {
    for (const prop in currentValue) {
      if (currentValue.hasOwnProperty(prop)) {
        initialData[prop] = updateInitialData({}, currentValue && currentValue[prop]);
      }
    }
    return initialData;
  }
}

export function getInitialDataForFractionCalculation(formState: any): any {
  return updateInitialData({}, formState);
}

export const etoMediaProgressOptions: IProgressOptions = {
  ignore: {
    companyVideo: true,
    companySlideshare: true,
  },
};

export const etoInvestmentTermsProgressOptions: IProgressOptions = {
  ignore: {
    discountScheme: true,
  },
};

export const calculateCompanyInformationProgress = getFormFractionDoneCalculator(
  EtoCompanyInformationValidator.toYup(),
);
export const calculateEtoTermsProgress = getFormFractionDoneCalculator(EtoTermsValidator.toYup());
export const calculateEtoKeyIndividualsProgress = getFormFractionDoneCalculator(
  EtoKeyIndividualsValidator.toYup(),
);
export const calculateLegalInformationProgress = getFormFractionDoneCalculator(
  EtoLegalInformationValidator.toYup(),
);
export const calculateProductVisionProgress = getFormFractionDoneCalculator(EtoPitchValidator.toYup());
export const calculateEtoMediaProgress = getFormFractionDoneCalculator(
  EtoMediaValidator.toYup(),
  etoMediaProgressOptions,
);
export const calculateEtoRiskAssessmentProgress = getFormFractionDoneCalculator(
  EtoRiskAssessmentValidator.toYup(),
);
export const calculateEtoVotingRightsProgress = getFormFractionDoneCalculator(
  EtoVotingRightsValidator.toYup(),
);
export const calculateEtoEquityTokenInfoProgress = getFormFractionDoneCalculator(
  EtoEquityTokenInfoValidator.toYup(),
);
export const calculateInvestmentTermsProgress = getFormFractionDoneCalculator(
  EtoInvestmentTermsValidator.toYup(),
  etoInvestmentTermsProgressOptions,
);

export const calculateGeneralEtoData = getFormFractionDoneCalculator(GeneralEtoDataValidator.toYup(), {
  ignore: true,
});

export function getFormFractionDoneCalculator(
  validator: Yup.Schema<any>,
  opts?: IProgressOptions,
): ProgressCalculator {
  const strictValidator = validator.clone();
  const ignore = opts && opts.ignore;
  updateValidator(strictValidator, ignore);

  return (formState: any, initialData?: any) => {
    if (typeof initialData === "undefined") {
      initialData = updateInitialData({}, formState);
    }

    const errors = getErrorsNumber(strictValidator, formState) || 0;
    const maxErrors = getErrorsNumber(strictValidator, initialData) || 1;

    const result = 1 - errors / maxErrors;
    if (result < 0) return 0;
    return result;
  };
}

export const bookBuildingStatsToCsvString = (stats: IApiDetailedBookbuildingStats[]):string =>
  [`email,amount,"submitted on","updated on"`]
    .concat(
      stats.map(
        (el: IApiDetailedBookbuildingStats) =>
          `${el.email ? `"${el.email}"` : "(anonymous pledge)"},${
            el.amountEur
          },${el.insertedAt.slice(0, 10)},${el.updatedAt.slice(0, 10)}`,
      ),
    )
    .join("\r\n");

export const createCsvDataUri = (dataAsString: string) =>
  `data:text/csv,${encodeURIComponent(dataAsString)}`;

export const downloadFile = (uri: string, filename: string) => {
  const link = document.createElement("a");
  link.href = uri;
  link.download = filename;
  link.click();
};

export const isValidEtoStartDate = (startDate: Date, dateToWhitelistMinDurationSec: BigNumber) => {
  const startTimeSec = startDate.getTime() / 1000;
  const nowSec = Date.now() / 1000;
  return dateToWhitelistMinDurationSec.add(nowSec).lessThan(startTimeSec);
};
