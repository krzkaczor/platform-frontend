import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { SET_BOOKBUILDING_FLOW_STATS, SET_PLEDGE } from "./actions";
import { IStateBookbuildingFLow } from "./interfaces/interfaces";

export const bookBuildingFlow: IStateBookbuildingFLow = {
  bookbuildingStats: {},
  pledges: {},
};

export const bookBuildingFlowReducer: AppReducer<IStateBookbuildingFLow> = (
  state = bookBuildingFlow,
  action,
): DeepReadonly<IStateBookbuildingFLow> => {
  switch (action.type) {
    case SET_BOOKBUILDING_FLOW_STATS:
      return {
        ...state,
        bookbuildingStats: {
          ...state.bookbuildingStats,
          [action.payload.etoId]: action.payload.stats,
        },
      };
    case SET_PLEDGE:
      return {
        ...state,
        pledges: {
          ...state.pledges,
          [action.payload.etoId]: action.payload.pledge,
        },
      };
  }
  return state;
};
