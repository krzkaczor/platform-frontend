import { EEtoDocumentType, IEtoDocument, IEtoFiles } from "../../lib/api/eto/EtoFileApi.interfaces";
import {createAction, createActionFactory, createSimpleAction} from "../actionsUtils";

export const etoDocumentsActions = {
  loadFileDataStart: () => createSimpleAction("ETO_DOCUMENTS_LOAD_FILE_DATA_START"),
  loadEtoFileData: (data: IEtoFiles) => createAction("ETO_DOCUMENTS_LOAD_ETO_FILE_DATA", { data }),
  generateTemplate: (document: IEtoDocument) =>
    createAction("ETO_DOCUMENTS_GENERATE_TEMPLATE", { document }),
  generateTemplateByEtoId: (document: IEtoDocument, etoId: string) =>
    createAction("ETO_DOCUMENTS_GENERATE_TEMPLATE_BY_ETO_ID", { document, etoId }),
  etoUploadDocumentStart: createActionFactory("ETO_DOCUMENTS_UPLOAD_DOCUMENT_START",
    (file: File, documentType: EEtoDocumentType) =>({ file, documentType })),
  etoUploadDocumentFinish: createActionFactory("ETO_DOCUMENTS_UPLOAD_DOCUMENT_FINISH",
    (documentType:EEtoDocumentType) => ({documentType})),
  showIpfsModal: (fileUploadAction: () => void) =>
    createAction("ETO_DOCUMENTS_IPFS_MODAL_SHOW", { fileUploadAction }),
  hideIpfsModal: () => createSimpleAction("ETO_DOCUMENTS_IPFS_MODAL_HIDE"),
  downloadDocumentStart: createActionFactory("ETO_DOCUMENTS_DOWNLOAD_START",
    (documentType: EEtoDocumentType) =>({ documentType })),
  downloadDocumentFinish: createActionFactory("ETO_DOCUMENTS_DOWNLOAD_FINISH",
    (documentType: EEtoDocumentType) =>({ documentType })),
};
