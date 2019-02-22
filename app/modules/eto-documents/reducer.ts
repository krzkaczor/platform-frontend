import { EEtoDocumentType, IEtoFiles } from "../../lib/api/eto/EtoFileApi.interfaces";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { actions } from "../actions";

export interface IEtoDocumentState {
  loading: boolean;
  saving: boolean;
  showIpfsModal: boolean;
  etoFileData: IEtoFiles;
  uploadAction?: () => void;
  uploading: { [key in EEtoDocumentType]?: boolean };
  downloading: { [key in EEtoDocumentType]?: boolean };
}

export const etoFlowInitialState: IEtoDocumentState = {
  loading: false,
  saving: false,
  etoFileData: {
    allTemplates: {},
  },
  showIpfsModal: false,
  uploading: {},
  downloading: {},
};

export const etoDocumentReducer: AppReducer<IEtoDocumentState> = (
  state = etoFlowInitialState,
  action,
): DeepReadonly<IEtoDocumentState> => {
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
    case actions.etoDocuments.etoUploadDocumentStart.getType():
      return {
        ...state,
        saving: true,
        uploading: { ...state.uploading, [action.payload.documentType]: true },
      };
    case actions.etoDocuments.etoUploadDocumentFinish.getType():
      return {
        ...state,
        uploading: { ...state.uploading, [action.payload.documentType]: false },
      };
    case actions.etoDocuments.downloadDocumentStart.getType():
      return {
        ...state,
        downloading: { ...state.downloading, [action.payload.documentType]: true },
      };
    case actions.etoDocuments.downloadDocumentFinish.getType():
      return {
        ...state,
        downloading: { ...state.downloading, [action.payload.documentType]: false },
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
