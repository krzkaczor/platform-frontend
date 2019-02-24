import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { IStateVideoModal, IStateVideoModalData } from "./interfaces";

const initialState: IStateVideoModal = {
  isOpen: false,
};

export const videoModalReducer: AppReducer<IStateVideoModal> = (
  state = initialState,
  action,
): DeepReadonly<IStateVideoModal> => {
  switch (action.type) {
    case "VIDEO_MODAL_SHOW":
      return {
        ...state,
        isOpen: true,
        videoModalObj: action.payload,
      };
    case "VIDEO_MODAL_HIDE":
      return {
        ...state,
        videoModalObj: undefined,
        isOpen: false,
      };
  }

  return state;
};

export const selectVideoModalIsOpen = (state: IStateVideoModal): boolean => state.isOpen;
export const selectVideoModalObj = (state: IStateVideoModal): IStateVideoModalData | undefined =>
  state.videoModalObj;
