import {IEtoFiles} from "../../lib/api/eto/EtoFileApi.interfaces";
import { DeepReadonly } from "../../types";
import { IEtoDocumentState } from "./reducer";

export const selectIsIpfsModalOpen = (state: DeepReadonly<IEtoDocumentState>): boolean =>
  state.showIpfsModal;

export const selectFileUploadAction = (
  state: DeepReadonly<IEtoDocumentState>,
): (() => void) | undefined => state.uploadAction;

export const selectEtoDocumentLoading = (state: DeepReadonly<IEtoDocumentState>): boolean =>
  state.loading;

export const selectEtoDocumentData = (
  state: DeepReadonly<IEtoDocumentState>,
): DeepReadonly<IEtoFiles> => state.etoFileData;

