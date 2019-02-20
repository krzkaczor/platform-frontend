import { findKey } from "lodash/fp";
import { call, fork, put, select } from "redux-saga/effects";

import { EtoDocumentsMessage, IpfsMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { EJwtPermissions, ETHEREUM_ZERO_ADDRESS } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { FileAlreadyExists } from "../../lib/api/eto/EtoFileApi";
import {
  EEtoDocumentType,
  IEtoDocument,
  TEtoDocumentTemplates,
} from "../../lib/api/eto/EtoFileApi.interfaces";
import { actions, TAction } from "../actions";
import { ensurePermissionsArePresentAndRunEffect } from "../auth/jwt/sagas";
import { downloadLink } from "../immutable-file/utils";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";

export function* generateDocumentFromTemplate(
  { apiImmutableStorage, notificationCenter, logger, apiEtoFileService }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "ETO_DOCUMENTS_GENERATE_TEMPLATE") return;
  try {
    const document = action.payload.document;

    yield put(actions.immutableStorage.downloadDocumentStarted(document.ipfsHash));

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
      ipfsHash: templates.ipfs_hash,
      mimeType: templates.mime_type,
      placeholders: templates.placeholders,
      asPdf: false,
    });
    yield call(downloadLink, generatedDocument, document.name, ".doc");
  } catch (e) {
    logger.error("Failed to generate ETO template", e);
    notificationCenter.error(createMessage(IpfsMessage.IPFS_FAILED_TO_DOWNLOAD_IPFS_FILE));
  } finally {
    yield put(actions.immutableStorage.downloadImmutableFileDone(action.payload.document.ipfsHash));
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
    const extension = document.asPdf ? ".pdf" : ".doc";

    yield put(actions.immutableStorage.downloadDocumentStarted(document.ipfsHash));
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
    yield call(downloadLink, generatedDocument, document.name, extension);
  } catch (e) {
    logger.error("Failed to generate ETO template", e);
    notificationCenter.error(createMessage(IpfsMessage.IPFS_FAILED_TO_DOWNLOAD_IPFS_FILE));
  } finally {
    yield put(actions.immutableStorage.downloadImmutableFileDone(action.payload.document.ipfsHash));
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
    yield call(downloadLink, downloadedDocument, matchingDocument.name, "");
  } catch (e) {
    logger.error("Download document by type failed", e);
    notificationCenter.error(
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_FAILED_TO_DOWNLOAD_FILE),
    );
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
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_FAILED_TO_ACCESS_ETO_FILES_DATA),
    );
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

function* uploadEtoFileEffect(
  { apiEtoFileService, notificationCenter }: TGlobalDependencies,
  file: File,
  documentType: EEtoDocumentType,
): Iterator<any> {
  const matchingDocument = yield neuCall(getDocumentOfTypePromise, documentType);
  if (matchingDocument)
    yield apiEtoFileService.deleteSpecificEtoDocument(matchingDocument.ipfsHash);

  yield apiEtoFileService.uploadEtoDocument(file, documentType);
  notificationCenter.info(createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_FILE_UPLOADED));
}

function* uploadEtoFile(
  { notificationCenter, logger }: TGlobalDependencies,
  action: TAction,
): Iterator<any> {
  if (action.type !== "ETO_DOCUMENTS_UPLOAD_DOCUMENT_START") return;
  const { file, documentType } = action.payload;
  try {
    yield put(actions.etoDocuments.hideIpfsModal());

    yield neuCall(
      ensurePermissionsArePresentAndRunEffect,
      neuCall(uploadEtoFileEffect, file, documentType),
      [EJwtPermissions.UPLOAD_IMMUTABLE_DOCUMENT],
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_CONFIRM_UPLOAD_DOCUMENT_TITLE),
      createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_CONFIRM_UPLOAD_DOCUMENT_DESCRIPTION),
    );
  } catch (e) {
    if (e instanceof FileAlreadyExists) {
      notificationCenter.error(createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_FILE_EXISTS));
    } else {
      logger.error("Failed to send ETO data", e);
      notificationCenter.error(createMessage(EtoDocumentsMessage.ETO_DOCUMENTS_FILE_UPLOAD_FAILED));
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
