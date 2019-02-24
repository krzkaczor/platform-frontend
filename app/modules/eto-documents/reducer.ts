import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { IStateEtoDocuments } from "./interfaces";

export const etoFlowInitialState: IStateEtoDocuments = {
  loading: false,
  saving: false,
  etoFileData: {
    allTemplates: {},
  },
  showIpfsModal: false,
};

export const etoDocumentReducer: AppReducer<IStateEtoDocuments> = (
  state = etoFlowInitialState,
  action,
): DeepReadonly<IStateEtoDocuments> => {
  switch (action.type) {
    case "ETO_DOCUMENTS_LOAD_FILE_DATA_START":
      return {
        ...state,
        loading: true,
      };
    case "ETO_DOCUMENTS_LOAD_ETO_FILE_DATA":
      return {
        ...state,
        etoFileData: { ...state.etoFileData, ...action.payload.data },
        loading: false,
        saving: false,
      };
    case "ETO_DOCUMENTS_UPLOAD_DOCUMENT_START":
      return {
        ...state,
        saving: true,
      };
    case "ETO_DOCUMENTS_IPFS_MODAL_SHOW":
      return {
        ...state,
        uploadAction: action.payload.fileUploadAction,
        showIpfsModal: true,
      };
    case "ETO_DOCUMENTS_IPFS_MODAL_HIDE":
      return {
        ...state,
        uploadAction: undefined,
        showIpfsModal: false,
      };
  }

  return state;
};
