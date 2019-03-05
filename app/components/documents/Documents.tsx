import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Redirect } from "react-router";
import { branch, renderComponent, setDisplayName } from "recompose";
import { compose } from "redux";

import { EEtoState, EtoStateToCamelcase } from "../../lib/api/eto/EtoApi.interfaces";
import {
  EEtoDocumentType,
  IEtoDocument,
  IEtoFiles,
  TEtoDocumentTemplates,
  TStateInfo,
} from "../../lib/api/eto/EtoFileApi.interfaces";
import { ignoredTemplates } from "../../lib/api/eto/EtoFileUtils";
import { actions } from "../../modules/actions";
import {
  selectEtoDocumentData,
  selectEtoDocumentsDownloading,
  selectEtoDocumentsLoading,
  selectEtoDocumentsUploading,
} from "../../modules/eto-documents/selectors";
import {
  selectEtoId,
  selectIssuerEtoDocuments,
  selectIssuerEtoIsRetail,
  selectIssuerEtoLoading,
  selectIssuerEtoState,
  selectIssuerEtoTemplates,
  selectShouldEtoDataLoad,
} from "../../modules/eto-flow/selectors";
import { selectPendingDownloads } from "../../modules/immutable-file/selectors";
import { selectEtoOnChainStateById } from "../../modules/public-etos/selectors";
import { EETOStateOnChain } from "../../modules/public-etos/types";
import { selectAreTherePendingTxs } from "../../modules/tx/monitor/selectors";
import { appConnect } from "../../store";
import { DeepReadonly, TTranslatedString } from "../../types";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer";
import { withMetaTags } from "../../utils/withMetaTags";
import { appRoutes } from "../appRoutes";
import { EtoFileIpfsModal } from "../eto/shared/EtoFileIpfsModal";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { ClickableDocumentTile, UploadableDocumentTile } from "../shared/Document";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryLayoutAuthorized } from "../shared/errorBoundary/ErrorBoundaryLayoutAuthorized";
import { LoadingIndicator } from "../shared/loading-indicator";
import { SectionHeader } from "../shared/SectionHeader";
import { SingleColDocuments } from "../shared/SingleColDocumentWidget";
import { getDocumentTitles } from "./utils";

import * as styles from "./Documents.module.scss";

type IProps = IComponentStateProps & IDispatchProps;

interface IComponentStateProps {
  etoFilesData: DeepReadonly<IEtoFiles>;
  etoFileLoading: boolean;
  etoState?: EEtoState;
  etoTemplates: TEtoDocumentTemplates;
  etoDocuments: TEtoDocumentTemplates;
  documentTitles: TDocumentTitles;
  isRetailEto: boolean;
  onChainState: EETOStateOnChain;
  documentsDownloading: { [key in EEtoDocumentType]?: boolean };
  documentsUploading: { [key in EEtoDocumentType]?: boolean };
  transactionPending: boolean;
  documentsGenerated: { [ipfsHash: string]: boolean };
}

type IStateProps = IComponentStateProps & {
  dataNotReady: boolean;
  shouldEtoDataLoad: boolean;
};

interface IDispatchProps {
  generateTemplate: (document: IEtoDocument) => void;
  startDocumentDownload: (documentType: EEtoDocumentType) => void;
}

interface IGeneratedDocumentProps {
  document: IEtoDocument;
  generateTemplate: (document: IEtoDocument) => void;
  documentTitle?: TTranslatedString;
  busy: boolean;
}

interface IUploadableDocumentProps {
  documentTitle: TTranslatedString;
  documentKey: EEtoDocumentType;
  etoDocuments: TEtoDocumentTemplates;
  stateInfo: DeepReadonly<TStateInfo>;
  etoState: EEtoState;
  startDocumentDownload: (documentType: EEtoDocumentType) => void;
  onChainState: EETOStateOnChain;
  documentUploading: boolean;
  documentDownloading: boolean;
  transactionPending: boolean;
}

export type TDocumentTitles = { [key in EEtoDocumentType]: TTranslatedString };

export const GeneratedDocument: React.FunctionComponent<IGeneratedDocumentProps> = ({
  document,
  generateTemplate,
  documentTitle,
  busy,
}) => {
  return (
    <ClickableDocumentTile
      document={document}
      generateTemplate={generateTemplate}
      title={documentTitle}
      extension={".doc"}
      busy={busy}
    />
  );
};

const UploadableDocument: React.FunctionComponent<IUploadableDocumentProps> = ({
  documentTitle,
  documentKey,
  etoDocuments,
  stateInfo,
  etoState,
  onChainState,
  startDocumentDownload,
  documentUploading,
  documentDownloading,
  transactionPending,
}) => {
  const canUploadInOnChainStates = (
    etoState: EEtoState,
    documentKey: EEtoDocumentType,
    onChainState: EETOStateOnChain,
  ) =>
    etoState === EEtoState.ON_CHAIN
      ? onChainState === EETOStateOnChain.Signing &&
        documentKey === EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT
      : true;

  const canUpload =
    stateInfo &&
    etoState &&
    stateInfo.canUploadInStates[EtoStateToCamelcase[etoState]].some(
      (fileName: string) => fileName === documentKey,
    ) &&
    canUploadInOnChainStates(etoState, documentKey, onChainState);

  const mayBeSignedNow = (documentKey: EEtoDocumentType, transactionPending: boolean) => {
    return documentKey === EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT
      ? !transactionPending
      : true;
  };

  const busy = !mayBeSignedNow(documentKey, transactionPending) || documentUploading;

  const isFileUploaded = Object.keys(etoDocuments).some(
    uploadedKey => etoDocuments[uploadedKey].documentType === documentKey,
  );
  return (
    <UploadableDocumentTile
      documentKey={documentKey}
      active={canUpload}
      busy={busy}
      typedFileName={documentTitle}
      isFileUploaded={isFileUploaded}
      downloadDocumentStart={startDocumentDownload}
      documentDownloadLinkInactive={documentUploading || documentDownloading}
    />
  );
};

const DocumentsLayout: React.FunctionComponent<IProps> = ({
  etoFilesData,
  generateTemplate,
  etoState,
  etoTemplates,
  etoDocuments,
  startDocumentDownload,
  documentTitles,
  isRetailEto,
  onChainState,
  documentsUploading,
  documentsDownloading,
  transactionPending,
  documentsGenerated,
}) => {
  const { allTemplates, stateInfo } = etoFilesData;
  const generalUploadables = stateInfo ? stateInfo.uploadableDocuments : [];
  const etoTemplateKeys = Object.keys(etoTemplates);

  return (
    <>
      <div data-test-id="eto-documents" className={styles.layout}>
        <SectionHeader className={cn(styles.header)}>
          <FormattedMessage id="documents.legal-documents" />
        </SectionHeader>

        <section className={styles.documentSection}>
          <h4 className={cn(styles.groupName)}>
            <FormattedMessage id="documents.generated-documents" />
          </h4>
          {etoTemplateKeys.length !== 0 ? (
            etoTemplateKeys
              .filter(key => !ignoredTemplates.some(template => template === key))
              .map(key => {
                return (
                  <GeneratedDocument
                    key={key}
                    document={allTemplates[key]}
                    generateTemplate={generateTemplate}
                    documentTitle={documentTitles[allTemplates[key].documentType]}
                    busy={documentsGenerated[allTemplates[key].ipfsHash]}
                  />
                );
              })
          ) : (
            <div className={styles.note}>
              <FormattedMessage id="documents.please-fill-the-eto-forms-in-order-to-generate-templates" />
            </div>
          )}
        </section>

        <section className={styles.documentSection}>
          <h4 className={styles.groupName}>
            <FormattedMessage id="documents.approved-prospectus-and-agreements-to-upload" />
          </h4>
          {stateInfo &&
            etoState &&
            generalUploadables.map((key: EEtoDocumentType) => {
              return (
                <UploadableDocument
                  key={key}
                  documentKey={key}
                  documentTitle={documentTitles[key]}
                  etoDocuments={etoDocuments}
                  stateInfo={stateInfo}
                  etoState={etoState}
                  startDocumentDownload={startDocumentDownload}
                  onChainState={onChainState}
                  documentUploading={documentsUploading[key] || false}
                  documentDownloading={documentsDownloading[key] || false}
                  transactionPending={transactionPending}
                />
              );
            })}
        </section>
        {allTemplates && (
          <SingleColDocuments
            documents={etoTemplateKeys.map(key => {
              return allTemplates[key];
            })}
            title={<FormattedMessage id="documents.agreement-and-prospectus-templates" />}
            className={styles.documents}
            isRetailEto={isRetailEto}
          />
        )}
      </div>
      <EtoFileIpfsModal />
    </>
  );
};

const Documents = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryLayoutAuthorized),
  setDisplayName("Documents"),
  onEnterAction({ actionCreator: d => d(actions.etoDocuments.loadFileDataStart()) }),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => {
      const isRetailEto = selectIssuerEtoIsRetail(state);
      const etoFilesData = selectEtoDocumentData(state.etoDocuments);
      const etoFilesDataIsEmpty = Object.keys(etoFilesData.allTemplates).length === 0;

      return {
        shouldEtoDataLoad: selectShouldEtoDataLoad(state),
        etoFilesData,
        dataNotReady:
          selectIssuerEtoLoading(state) || state.etoDocuments.loading || etoFilesDataIsEmpty,
        etoFileLoading: selectEtoDocumentsLoading(state.etoDocuments),
        etoState: selectIssuerEtoState(state),
        onChainState: selectEtoOnChainStateById(state, selectEtoId(state)!)!,
        etoTemplates: selectIssuerEtoTemplates(state)!,
        etoDocuments: selectIssuerEtoDocuments(state)!,
        documentTitles: getDocumentTitles(isRetailEto),
        documentsDownloading: selectEtoDocumentsDownloading(state.etoDocuments),
        documentsUploading: selectEtoDocumentsUploading(state.etoDocuments),
        documentsGenerated: selectPendingDownloads(state),
        transactionPending: selectAreTherePendingTxs(state.txMonitor),
        isRetailEto,
      };
    },
    dispatchToProps: dispatch => ({
      generateTemplate: document => dispatch(actions.etoDocuments.generateTemplate(document)),
      startDocumentDownload: documentType =>
        dispatch(actions.etoDocuments.downloadDocumentStart(documentType)),
    }),
  }),
  withMetaTags((_, intl) => ({ title: intl.formatIntlMessage("menu.documents-page") })),
  withContainer(LayoutAuthorized),
  branch<IStateProps>(
    props => !props.shouldEtoDataLoad,
    renderComponent(() => <Redirect to={appRoutes.profile} />),
  ),
  branch<IStateProps>(
    props => props.dataNotReady || props.etoFileLoading || !props.etoState,
    renderComponent(LoadingIndicator),
  ),
)(DocumentsLayout);

export { Documents, DocumentsLayout };
