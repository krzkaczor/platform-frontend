import { cryptoRandomString } from "../../lib/dependencies/cryptoRandomString";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

import {IInvestmentFlowState, EInvestmentType} from './interfaces'

export const investmentFlowInitialState: IInvestmentFlowState = {
  etoId: null,
  euroValueUlps: null,
  ethValueUlps: null,
  investmentType: EInvestmentType.InvestmentWallet,
  activeInvestmentTypes: [],
  isValidatedInput: false,
  bankTransferGasStipend: true,
  bankTransferReference: null,
};

export const investmentFlowReducer: AppReducer<IInvestmentFlowState> = (
  state = investmentFlowInitialState,
  action,
): DeepReadonly<IInvestmentFlowState> => {
  switch (action.type) {
    case "INVESTMENT_FLOW_RESET":
      return {
        ...investmentFlowInitialState,
        bankTransferReference: state.bankTransferReference,
      };
    case "INVESTMENT_FLOW_SELECT_INVESTMENT_TYPE":
      return {
        ...investmentFlowInitialState,
        etoId: state.etoId,
        activeInvestmentTypes: state.activeInvestmentTypes,
        investmentType: action.payload.type,
        bankTransferReference: state.bankTransferReference,
      };
    case "INVESTMENT_FLOW_SET_ETO_ID":
      return {
        ...state,
        etoId: action.payload.etoId,
      };
    case "INVESTMENT_FLOW_SET_INVESTMENT_ERROR_STATE":
      return {
        ...state,
        errorState: action.payload.errorState,
      };
    case "INVESTMENT_FLOW_SET_INVESTMENT_ETH_VALUE":
      return {
        ...state,
        ethValueUlps: action.payload.value,
      };
    case "INVESTMENT_FLOW_SET_INVESTMENT_EUR_VALUE":
      return {
        ...state,
        euroValueUlps: action.payload.value,
      };
    case "INVESTMENT_FLOW_SET_IS_INPUT_VALIDATED":
      return {
        ...state,
        isValidatedInput: action.payload.isValidated,
      };
    case "INVESTMENT_FLOW_SET_BANK_TRANSFER_FLOW_STATE":
      return {
        ...state,
        bankTransferFlowState: action.payload.state,
      };
    case "INVESTMENT_FLOW_TOGGLE_BANK_TRANSFER_GAS_STIPEND":
      return {
        ...state,
        bankTransferGasStipend: !state.bankTransferGasStipend,
      };
    case "INVESTMENT_FLOW_SET_ACTIVE_INVESTMENT_TYPES":
      return {
        ...state,
        ...action.payload,
      };
    case "INVESTMENT_FLOW_BANK_TRANSFER_CHANGE":
      return {
        ...state,
        bankTransferFlowState: undefined,
      };
    case "GENERATE_BANK_TRANSFER_REFERENCE":
      const bankTransferReference = btoa(cryptoRandomString(9))
        .replace("=", "")
        .toUpperCase();
      return {
        ...state,
        bankTransferReference,
      };
  }

  return state;
};
