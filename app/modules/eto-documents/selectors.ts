import { DeepReadonly } from "../../types";
import { IEtoFiles, IStateEtoDocuments } from "./interfaces";

export const selectIsIpfsModalOpen = (state: DeepReadonly<IStateEtoDocuments>): boolean =>
  state.showIpfsModal;

export const selectFileUploadAction = (
  state: DeepReadonly<IStateEtoDocuments>,
): (() => void) | undefined => state.uploadAction;

export const selectEtoDocumentLoading = (state: DeepReadonly<IStateEtoDocuments>): boolean =>
  state.loading;

export const selectEtoDocumentData = (
  state: DeepReadonly<IStateEtoDocuments>,
): DeepReadonly<IEtoFiles> => state.etoFileData;
