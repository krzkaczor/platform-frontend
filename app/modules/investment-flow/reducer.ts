import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

import {EInvestmentType, IStateInvestmentFlow} from './interfaces'

export const investmentFlowInitialState: IStateInvestmentFlow = {
  etoId: null,
  euroValueUlps: null,
  ethValueUlps: null,
  investmentType: EInvestmentType.InvestmentWallet,
  activeInvestmentTypes: [],
  isValidatedInput: false,
  bankTransferGasStipend: true,
  bankTransferReference: null,
};

export const investmentFlowReducer: AppReducer<IStateInvestmentFlow> = (
  state = investmentFlowInitialState,
  action,
): DeepReadonly<IStateInvestmentFlow> => {
  switch (action.type) {
    case "INVESTMENT_FLOW_RESET":
      return investmentFlowInitialState;
    case "INVESTMENT_FLOW_SELECT_INVESTMENT_TYPE":
      return {
        ...investmentFlowInitialState,
        etoId: state.etoId,
        activeInvestmentTypes: state.activeInvestmentTypes,
        investmentType: action.payload.type,
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
    case "INVESTMENT_FLOW_SET_ACTIVE_INVESTMENT_TYPES":
      return {
        ...state,
        ...action.payload,
      };
  }

  return state;
};
