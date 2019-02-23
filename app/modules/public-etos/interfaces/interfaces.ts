import * as companyEtoData from "../../eto-flow/interfaces/CompanyEtoData";
import * as publicEtoInterfaces from "../../eto-flow/interfaces/PublicEtoData";
import * as contractDataInterfaces from "./EtoContractData";

export type TApiPublicEtoData =
  publicEtoInterfaces.IApiPublicEtoData & { company: companyEtoData.IApiCompanyEtoData };


export type TEtoStartOfStates = Record<EETOStateOnChain, Date | undefined>;

// Order is important. Next state is calculated by adding 1 to current state.
export enum EETOStateOnChain {
  Setup = 0, // Initial state
  Whitelist = 1,
  Public = 2,
  Signing = 3,
  Claim = 4,
  Payout = 5, // Terminal state
  Refund = 6, // Terminal state
}

export type TStateEtoWithCompanyAndContract =
  publicEtoInterfaces.IStatePublicEtoData & {
    // contract is undefined when ETO is not on blockchain
    contract?: contractDataInterfaces.IStateEtoContractData;
    company: companyEtoData.IStateCompanyEtoData;
  }

export type TBlEtoWithCompanyAndContract =
  publicEtoInterfaces.IBlPublicEtoData & {
  // contract is undefined when ETO is not on blockchain
  contract?: contractDataInterfaces.IBlEtoContractData;
  company: companyEtoData.IBlCompanyEtoData;
}

export type TApiEtoWithCompanyAndContract =
  publicEtoInterfaces.IApiPublicEtoData & {
  // contract is undefined when ETO is not on blockchain
  contract?: contractDataInterfaces.IApiEtoContractData;
  company: companyEtoData.IApiCompanyEtoData;
}

export const stateToBlConversionSpec = {
  ...publicEtoInterfaces.stateToBlConversionSpec,
  company: companyEtoData.stateToBlConversionSpec
};
