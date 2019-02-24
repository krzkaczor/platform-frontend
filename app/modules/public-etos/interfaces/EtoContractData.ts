import { EETOStateOnChain, TEtoStartOfStates } from "./interfaces";
import * as totalInvestmentInterfaces from "./TotalInvestment";

export interface IStateEtoContractData {
  timedState: EETOStateOnChain;
  totalInvestment: totalInvestmentInterfaces.IStateEtoTotalInvestment;
  startOfStates: TEtoStartOfStates;
  equityTokenAddress: string;
  etoTermsAddress: string;
  etoCommitmentAddress: string;
}

export interface IBlEtoContractData {
  timedState: EETOStateOnChain;
  totalInvestment: totalInvestmentInterfaces.IBlEtoTotalInvestment;
  startOfStates: TEtoStartOfStates;
  equityTokenAddress: string;
  etoTermsAddress: string;
  etoCommitmentAddress: string;
}

export interface IApiEtoContractData {
  timedState: EETOStateOnChain;
  totalInvestment: totalInvestmentInterfaces.IApiEtoTotalInvestment;
  startOfStates: TEtoStartOfStates;
  equityTokenAddress: string;
  etoTermsAddress: string;
  etoCommitmentAddress: string;
}

export const stateToBlConversionSpec = {
  totalInvestment: totalInvestmentInterfaces.stateToBlConversionSpec,
};
