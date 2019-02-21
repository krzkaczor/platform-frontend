import * as cn from "classnames";
import * as React from "react";
import {FormattedMessage} from "react-intl-phraseapp";
import {Redirect} from "react-router";
import {branch, renderComponent, setDisplayName} from "recompose";
import {compose} from "redux";

import {EEtoState, EtoStateToCamelcase} from "../../lib/api/eto/EtoApi.interfaces";
import {
  EEtoDocumentType,
  IEtoDocument,
  IEtoFiles,
  TEtoDocumentTemplates,
  TStateInfo,
} from "../../lib/api/eto/EtoFileApi.interfaces";
import {ignoredTemplates} from "../../lib/api/eto/EtoFileUtils";
import {actions} from "../../modules/actions";
import {
  selectEtoDocumentData,
  selectEtoDocumentsDownloading,
  selectEtoDocumentsLoading,
  selectEtoDocumentsUploading,
} from "../../modules/eto-documents/selectors";
import {
  selectIssuerEtoDocuments,
  selectIssuerEtoIsRetail,
  selectIssuerEtoLoading,
  selectIssuerEtoState,
  selectIssuerEtoTemplates,
  selectShouldEtoDataLoad,
} from "../../modules/eto-flow/selectors";
import {appConnect} from "../../store";
import {DeepReadonly, TTranslatedString} from "../../types";
import {onEnterAction} from "../../utils/OnEnterAction";
import {withContainer} from "../../utils/withContainer";
import {withMetaTags} from "../../utils/withMetaTags";
import {appRoutes} from "../appRoutes";
import {EtoFileIpfsModal} from "../eto/shared/EtoFileIpfsModal";
import {LayoutAuthorized} from "../layouts/LayoutAuthorized";
import {ClickableDocumentTile, UploadableDocumentTile} from "../shared/Document";
import {createErrorBoundary} from "../shared/errorBoundary/ErrorBoundary";
import {ErrorBoundaryLayoutAuthorized} from "../shared/errorBoundary/ErrorBoundaryLayoutAuthorized";
import {LoadingIndicator} from "../shared/loading-indicator";
import {SectionHeader} from "../shared/SectionHeader";
import {SingleColDocuments} from "../shared/SingleColDocumentWidget";
import {getDocumentTitles} from "./utils";
import {selectEtoOnChainStateById} from "../../modules/public-etos/selectors";
import {EETOStateOnChain} from "../../modules/public-etos/types";

import * as styles from "./Documents.module.scss";
import {selectAreTherePendingTxs} from "../../modules/tx/monitor/selectors";
import {selectPendingDownloads} from "../../modules/immutable-file/selectors";

type IProps = IComponentStateProps & IDispatchProps;

interface IComponentStateProps {
  etoFilesData: DeepReadonly<IEtoFiles>;
  loadingData: boolean;
  etoFileLoading: boolean;
  etoState?: EEtoState;
  etoTemplates: TEtoDocumentTemplates;
  etoDocuments: TEtoDocumentTemplates;
  documentTitles: TDocumentTitles;
  isRetailEto: boolean;
  onChainState: EETOStateOnChain;
  documentsDownloading: {[key in EEtoDocumentType]?:boolean};
  documentsUploading:{[key in EEtoDocumentType]?:boolean};
  transactionPending:boolean;
  documentsGenerated: {[ipfsHash:string]:boolean}
}


type IStateProps = IComponentStateProps & {
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
  busy:boolean
}

interface IUploadableDocumentProps {
  documentTitle: TTranslatedString;
  documentKey: EEtoDocumentType;
  etoDocuments: TEtoDocumentTemplates;
  stateInfo: DeepReadonly<TStateInfo>;
  etoState: EEtoState;
  startDocumentDownload: (documentType: EEtoDocumentType) => void;
  onChainState: EETOStateOnChain,
  documentUploading: boolean,
  documentDownloading: boolean,
  transactionPending:boolean
}

export type TDocumentTitles = { [key in EEtoDocumentType]: TTranslatedString };

export const GeneratedDocument: React.FunctionComponent<IGeneratedDocumentProps> = ({
  document,
  generateTemplate,
  documentTitle,
  busy

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

//todo
const canUploadInOnChainStates = (documentKey:EEtoDocumentType, onChainState:EETOStateOnChain) => {
  if (onChainState === EETOStateOnChain.Signing && documentKey === EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT){
    return true
  } else {
    return false
  }
}
//todo
const mayBeSignedNow = (documentKey: EEtoDocumentType, transactionPending: boolean) => {
  console.log("mayBeSignedNow",documentKey, transactionPending)
  if(documentKey === EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT){
    return !transactionPending
  } else {
    return true
  }
}

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
  transactionPending
}) => {
  const canUpload =
    stateInfo &&
    etoState &&
    stateInfo.canUploadInStates[EtoStateToCamelcase[etoState]].some(
      (fileName: string) => fileName === documentKey,
    ) &&
    canUploadInOnChainStates(documentKey, onChainState);

  const busy = !mayBeSignedNow(documentKey, transactionPending) || documentUploading

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
  documentsGenerated

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
                    // busy={documentsDownloading[key as EEtoDocumentType] || false}
                    busy={documentsGenerated[allTemplates[key].ipfsHash]}
                    // busy={documentsGenerated[]}
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
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => {
      const isRetailEto = selectIssuerEtoIsRetail(state);
      return {
        shouldEtoDataLoad: selectShouldEtoDataLoad(state),
        etoFilesData: selectEtoDocumentData(state.etoDocuments),
        loadingData: selectIssuerEtoLoading(state),
        etoFileLoading: selectEtoDocumentsLoading(state.etoDocuments),
        etoState: selectIssuerEtoState(state),
        etoTemplates: selectIssuerEtoTemplates(state)!,
        etoDocuments: selectIssuerEtoDocuments(state)!,
        documentTitles: getDocumentTitles(isRetailEto),
        documentsDownloading: selectEtoDocumentsUploading(state.etoDocuments),
        documentsUploading: selectEtoDocumentsDownloading(state.etoDocuments),
        documentsGenerated: selectPendingDownloads(state),
        transactionPending: selectAreTherePendingTxs(state.txMonitor),
        isRetailEto,
      };
    },
    dispatchToProps: dispatch => ({
      generateTemplate: document => dispatch(actions.etoDocuments.generateTemplate(document)),
      startDocumentDownload: documentType => {
        return dispatch(actions.etoDocuments.downloadDocumentStart(documentType))
      }
    }),
  }),
  withMetaTags((_, intl) => ({ title: intl.formatIntlMessage("menu.documents-page") })),
  withContainer(LayoutAuthorized),
  branch(
    (props: IStateProps) => !props.shouldEtoDataLoad,
    renderComponent(() => <Redirect to={appRoutes.profile} />),
  ),
  onEnterAction({ actionCreator: d => d(actions.etoDocuments.loadFileDataStart()) }),
  branch(
    (props: IProps) => props.loadingData || props.etoFileLoading || !props.etoState,
    renderComponent(LoadingIndicator),
  ),
)(DocumentsLayout);

export { Documents, DocumentsLayout };
