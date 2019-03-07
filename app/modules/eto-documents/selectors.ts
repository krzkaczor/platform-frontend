import { EEtoDocumentType, IEtoFiles } from "../../lib/api/eto/EtoFileApi.interfaces";
import { DeepReadonly } from "../../types";
import { IEtoDocumentState } from "./reducer";

export const selectIsIpfsModalOpen = (state: DeepReadonly<IEtoDocumentState>): boolean =>
  state.showIpfsModal;

export const selectFileUploadAction = (
  state: DeepReadonly<IEtoDocumentState>,
): (() => void) | undefined => state.uploadAction;

export const selectEtoDocumentsLoading = (state: DeepReadonly<IEtoDocumentState>): boolean =>
  state.loading;

export const selectEtoDocumentData = (
  state: DeepReadonly<IEtoDocumentState>,
): DeepReadonly<IEtoFiles> => state.etoFileData;

export const selectEtoDocumentsDownloading = (
  state: DeepReadonly<IEtoDocumentState>,
): { [key in EEtoDocumentType]?: boolean } => state.downloading;

export const selectEtoDocumentsUploading = (
  state: DeepReadonly<IEtoDocumentState>,
): { [key in EEtoDocumentType]?: boolean } => state.uploading;
