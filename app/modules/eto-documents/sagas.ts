import { findKey } from "lodash/fp";
import { fork, put, select } from "redux-saga/effects";

import { ETHEREUM_ZERO_ADDRESS, UPLOAD_IMMUTABLE_DOCUMENT } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { FileAlreadyExists } from "../../lib/api/eto/EtoFileApi";
import {
  EEtoDocumentType,
  IEtoDocument,
  TEtoDocumentTemplates,
} from "../../lib/api/eto/EtoFileApi.interfaces";
import { actions, TAction } from "../actions";
import { ensurePermissionsArePresent } from "../auth/sagas";
import { downloadLink } from "../immutable-file/sagas";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import {createMessage} from "../../components/translatedMessages/utils";
import {EtoDocuments} from "../../components/translatedMessages/messages";

export function* generateDocumentFromTemplate(
  { apiImmutableStorage, notificationCenter, logger, apiEtoFileService }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "ETO_DOCUMENTS_GENERATE_TEMPLATE") return;
  try {
    const document = action.payload.document;

    const templates = yield apiEtoFileService.getEtoTemplate(
      {
        documentType: document.documentType,
        name: document.name,
        form: "template",
        ipfsHash: document.ipfsHash,
        mimeType: document.mimeType,
      },
      // token holder is required in on-chain state, use non-existing address
      // to obtain issuer side template
      { token_holder_ethereum_address: ETHEREUM_ZERO_ADDRESS },
    );
    const generatedDocument = yield apiImmutableStorage.getFile({
      ...{
        ipfsHash: templates.ipfs_hash,
        mimeType: templates.mime_type,
        placeholders: templates.placeholders,
      },
      asPdf: false,
    });
    yield neuCall(downloadLink, generatedDocument, document.name, ".doc");
  } catch (e) {
    logger.error("Failed to generate ETO template", e);
    notificationCenter.error(createMessage(EtoDocuments.ETO_DOCUMENTS_FAILED_TO_DOWNLOAD_IPFS_FILE)); //"Failed to download file from IPFS"
  }
}

export function* generateDocumentFromTemplateByEtoId(
  { apiImmutableStorage, notificationCenter, logger, apiEtoFileService }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "ETO_DOCUMENTS_GENERATE_TEMPLATE_BY_ETO_ID") return;
  try {
    const userEthAddress = yield select(selectEthereumAddressWithChecksum);
    const document = action.payload.document;
    const etoId = action.payload.etoId;
    const templates = yield apiEtoFileService.getSpecificEtoTemplate(
      etoId,
      {
        documentType: document.documentType,
        name: document.name,
        form: "template",
        ipfsHash: document.ipfsHash,
        mimeType: document.mimeType,
      },
      // token holder is required in on-chain state, use non-existing address
      // to obtain issuer side template
      { token_holder_ethereum_address: userEthAddress },
    );
    const generatedDocument = yield apiImmutableStorage.getFile({
      ...{
        ipfsHash: templates.ipfs_hash,
        mimeType: templates.mime_type,
        placeholders: templates.placeholders,
      },
      asPdf: true,
    });
    yield neuCall(downloadLink, generatedDocument, document.name, ".doc");
  } catch (e) {
    logger.error("Failed to generate ETO template", e);
    notificationCenter.error("Failed to download file from IPFS");
  }
}

export function* downloadDocumentByType(
  { apiImmutableStorage, notificationCenter, logger }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "ETO_DOCUMENTS_DOWNLOAD_BY_TYPE") return;
  try {
    const matchingDocument = yield neuCall(getDocumentOfTypePromise, action.payload.documentType);
    const downloadedDocument = yield apiImmutableStorage.getFile({
      ipfsHash: matchingDocument.ipfsHash,
      mimeType: matchingDocument.mimeType,
      asPdf: true,
    });
    yield neuCall(downloadLink, downloadedDocument, matchingDocument.name, "");
  } catch (e) {
    logger.error("Download document by type failed", e);
    notificationCenter.error(createMessage(EtoDocuments.ETO_DOCUMENTS_FAILED_TO_DOWNLOAD_FILE)); //"Failed to download file"
  }
}

export function* loadEtoFileData({
  notificationCenter,
  apiEtoFileService,
  logger,
}: TGlobalDependencies): any {
  try {
    yield put(actions.etoFlow.loadIssuerEto());
    const stateInfo = yield apiEtoFileService.getEtoFileStateInfo();
    const allTemplates = yield apiEtoFileService.getAllEtoTemplates();
    yield put(
      actions.etoDocuments.loadEtoFileData({
        allTemplates,
        stateInfo,
      }),
    );
  } catch (e) {
    logger.error("Load ETO data failed", e);
    notificationCenter.error(
      createMessage(EtoDocuments.ETO_DOCUMENTS_FAILED_TO_ACCESS_ETO_FILES_DATA)
    ); //"Could not access ETO files data. Make sure you have completed KYC and email verification process."
    yield put(actions.routing.goToDashboard());
  }
}

async function getDocumentOfTypePromise(
  { apiEtoFileService }: TGlobalDependencies,
  documentType: EEtoDocumentType,
): Promise<IEtoDocument> {
  const documents: TEtoDocumentTemplates = await apiEtoFileService.getAllEtoDocuments();

  const matchingDocument = findKey(document => document.documentType === documentType, documents);

  return documents[matchingDocument!];
}

function* uploadEtoFile(
  {
    apiEtoFileService,
    notificationCenter,
    logger,
  }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "ETO_DOCUMENTS_UPLOAD_DOCUMENT_START") return;
  const { file, documentType } = action.payload;
  try {
    yield put(actions.etoDocuments.hideIpfsModal());

    yield neuCall(
      ensurePermissionsArePresent,
      [UPLOAD_IMMUTABLE_DOCUMENT],
      createMessage(EtoDocuments.ETO_DOCUMENTS_CONFIRM_UPLOAD_DOCUMENT_TITLE), //"eto.modal.confirm-upload-document-title"
      createMessage(EtoDocuments.ETO_DOCUMENTS_CONFIRM_UPLOAD_DOCUMENT_DESCRIPTION), //"eto.modal.confirm-upload-document-description"
    );

    const matchingDocument = yield neuCall(getDocumentOfTypePromise, documentType);
    if (matchingDocument)
      yield apiEtoFileService.deleteSpecificEtoDocument(matchingDocument.ipfsHash);

    yield apiEtoFileService.uploadEtoDocument(file, documentType);
    notificationCenter.info(createMessage(EtoDocuments.ETO_DOCUMENTS_FILE_UPLOADED)); //"eto.modal.file-uploaded"
  } catch (e) {
    if (e instanceof FileAlreadyExists) {
      notificationCenter.error(createMessage(EtoDocuments.ETO_DOCUMENTS_FILE_EXISTS)); //"eto.modal.file-already-exists"
    } else {
      logger.error("Failed to send ETO data", e);
      notificationCenter.error(createMessage(EtoDocuments.ETO_DOCUMENTS_FILE_UPLOAD_FAILED)) //"eto.modal.file-upload-failed"
    }
  } finally {
    yield put(actions.etoDocuments.loadFileDataStart());
  }
}

export function* etoDocumentsSagas(): any {
  yield fork(
    neuTakeEvery,
    "ETO_DOCUMENTS_GENERATE_TEMPLATE_BY_ETO_ID",
    generateDocumentFromTemplateByEtoId,
  );
  yield fork(neuTakeEvery, "ETO_DOCUMENTS_GENERATE_TEMPLATE", generateDocumentFromTemplate);
  yield fork(neuTakeEvery, "ETO_DOCUMENTS_LOAD_FILE_DATA_START", loadEtoFileData);
  yield fork(neuTakeEvery, "ETO_DOCUMENTS_UPLOAD_DOCUMENT_START", uploadEtoFile);
  yield fork(neuTakeEvery, "ETO_DOCUMENTS_DOWNLOAD_BY_TYPE", downloadDocumentByType);
}
