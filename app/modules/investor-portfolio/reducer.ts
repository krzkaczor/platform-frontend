import { AppReducer } from "../../store";
import { DeepReadonly, Dictionary } from "../../types";
import { actions } from "../actions";
import {
  ICalculatedContribution,
  IIncomingPayouts,
  IInvestorTicket,
  ITokenDisbursal,
} from "./types";

export interface IInvestorTicketsState {
  investorEtoTickets: Dictionary<IInvestorTicket | undefined>;
  calculatedContributions: Dictionary<ICalculatedContribution | undefined>;
  initialCalculatedContributions: Dictionary<ICalculatedContribution | undefined>;
  tokensDisbursal: ITokenDisbursal[] | undefined;
  incomingPayouts: IIncomingPayouts;
}

export const etoFlowInitialState: IInvestorTicketsState = {
  calculatedContributions: {},
  initialCalculatedContributions: {},
  investorEtoTickets: {},
  tokensDisbursal: undefined,
  incomingPayouts: {
    loading: true,
    data: undefined,
    payoutDone: false,
  },
};

export const investorTicketsReducer: AppReducer<IInvestorTicketsState> = (
  state = etoFlowInitialState,
  action,
): DeepReadonly<IInvestorTicketsState> => {
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
    case actions.investorEtoTicket.getIncomingPayouts.getType():
      return {
        ...state,
        incomingPayouts: etoFlowInitialState.incomingPayouts,
      };
    case actions.investorEtoTicket.setIncomingPayouts.getType():
      return {
        ...state,
        incomingPayouts: {
          ...state.incomingPayouts,
          loading: false,
          data: action.payload.incomingPayouts,
        },
      };
    case actions.investorEtoTicket.setIncomingPayoutDone.getType():
      return {
        ...state,
        incomingPayouts: {
          ...state.incomingPayouts,
          payoutDone: true,
        },
      };
  }

  return state;
};
