import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { actions } from "../actions";

import { IStatePublicEtos } from "./interfaces/PublicEto";

export const etoFlowInitialState: IStatePublicEtos = {
  publicEtos: {},
  companies: {},
  contracts: {},
  displayOrder: undefined,
  maxCapExceeded: {},
  etoWidgetError: undefined,
  tokenData: {},
};

export const publicEtosReducer: AppReducer<IStatePublicEtos> = (
  state = etoFlowInitialState,
  action,
): DeepReadonly<IStatePublicEtos> => {
  switch (action.type) {
    case actions.publicEtos.setPublicEtos.getType():
      return {
        ...state,
        publicEtos: {
          ...state.publicEtos,
          ...action.payload.etos,
        },
        companies: {
          ...state.companies,
          ...action.payload.companies,
        },
      };
    case actions.publicEtos.setPublicEto.getType():
      return {
        ...state,
        publicEtos: {
          ...state.publicEtos,
          [action.payload.eto.previewCode]: action.payload.eto,
        },
        companies: {
          ...state.companies,
          [action.payload.company.companyId]: action.payload.company,
        },
      };
    case actions.publicEtos.setEtosDisplayOrder.getType():
      return {
        ...state,
        displayOrder: action.payload.order,
      };
    case actions.publicEtos.setEtoDataFromContract.getType():
      return {
        ...state,
        contracts: {
          ...state.contracts,
          [action.payload.previewCode]: action.payload.data,
        },
      };
    case actions.publicEtos.setEtoWidgetError.getType():
      return {
        ...state,
        etoWidgetError: true,
      };
    case actions.publicEtos.setTokenData.getType():
      return {
        ...state,
        tokenData: {
          ...state.tokenData,
          [action.payload.previewCode]: action.payload.tokenData,
        },
      };
  }

  return state;
};
