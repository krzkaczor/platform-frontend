import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { actions } from "../actions";
import {IStateInvestorTickets} from './interfaces/interfaces'

export const etoFlowInitialState: IStateInvestorTickets = {
  calculatedContributions: {},
  initialCalculatedContributions: {},
  investorEtoTickets: {},
  tokensDisbursal: undefined,
};

export const investorTicketsReducer: AppReducer<IStateInvestorTickets> = (
  state = etoFlowInitialState,
  action,
): DeepReadonly<IStateInvestorTickets> => {
  switch (action.type) {
    case "INVESTOR_TICKET_SET":
      return {
        ...state,
        investorEtoTickets: {
          ...state.investorEtoTickets,
          [action.payload.etoId]: action.payload.ticket,
        },
      };
    case "INVESTOR_TICKET_SET_CALCULATED_CONTRIBUTION":
      return {
        ...state,
        calculatedContributions: {
          ...state.calculatedContributions,
          [action.payload.etoId]: action.payload.contribution,
        },
      };
    case "INVESTOR_TICKET_SET_INITIAL_CALCULATED_CONTRIBUTION":
      return {
        ...state,
        initialCalculatedContributions: {
          ...state.initialCalculatedContributions,
          [action.payload.etoId]: action.payload.contribution,
        },
      };
    case actions.investorEtoTicket.setTokensDisbursal.getType():
      return {
        ...state,
        tokensDisbursal: action.payload.tokensDisbursal,
      };
  }

  return state;
};
