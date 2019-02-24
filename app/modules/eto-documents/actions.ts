import { createAction, createSimpleAction } from "../actionsUtils";
import { EEtoDocumentType, IEtoDocument, IEtoFilesState } from "./interfaces";

export const etoDocumentsActions = {
  loadFileDataStart: () => createSimpleAction("ETO_DOCUMENTS_LOAD_FILE_DATA_START"),
  loadEtoFileData: (data: IEtoFilesState) =>
    createAction("ETO_DOCUMENTS_LOAD_ETO_FILE_DATA", { data }),
  generateTemplate: (document: IEtoDocument) =>
    createAction("ETO_DOCUMENTS_GENERATE_TEMPLATE", { document }),
  generateTemplateByEtoId: (document: IEtoDocument, etoId: string) =>
    createAction("ETO_DOCUMENTS_GENERATE_TEMPLATE_BY_ETO_ID", { document, etoId }),
  etoUploadDocument: (file: File, documentType: EEtoDocumentType) =>
    createAction("ETO_DOCUMENTS_UPLOAD_DOCUMENT_START", { file, documentType }),
  showIpfsModal: (fileUploadAction: () => void) =>
    createAction("ETO_DOCUMENTS_IPFS_MODAL_SHOW", { fileUploadAction }),
  hideIpfsModal: () => createSimpleAction("ETO_DOCUMENTS_IPFS_MODAL_HIDE"),
  downloadDocumentByType: (documentType: EEtoDocumentType) =>
    createAction("ETO_DOCUMENTS_DOWNLOAD_BY_TYPE", { documentType }),
};
