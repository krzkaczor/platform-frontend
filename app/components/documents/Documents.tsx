import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Redirect } from "react-router";
import { branch, renderComponent, renderNothing, setDisplayName } from "recompose";
import { compose } from "redux";

import { EEtoState } from "../../lib/api/eto/EtoApi.interfaces";
import {
  EEtoDocumentType,
  IEtoDocument,
  IEtoFiles,
  TEtoDocumentTemplates,
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
import { Heading } from "../shared/Heading";
import { LoadingIndicator } from "../shared/loading-indicator";
import { SingleColDocuments } from "../shared/SingleColDocumentWidget";
import { getDocumentTitles, isBusy, isFileUploaded, renameDocuments, uploadAllowed } from "./utils";

import * as styles from "./Documents.module.scss";

type IProps = IComponentStateProps & IDispatchProps;

interface IComponentStateProps {
  etoFilesData: DeepReadonly<IEtoFiles>;
  etoFileLoading: boolean;
  etoState: EEtoState;
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

interface IExternalStateProps {
  etoFilesData: DeepReadonly<IEtoFiles>;
  loadingData: boolean;
  etoFileLoading: boolean;
  etoState: EEtoState;
  etoTemplates?: TEtoDocumentTemplates;
  etoDocuments?: TEtoDocumentTemplates;
  documentTitles: TDocumentTitles;
  isRetailEto: boolean;
  onChainState?: EETOStateOnChain;
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

export type TDocumentTitles = { [key in EEtoDocumentType]: TTranslatedString };

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
  const documents = renameDocuments(stateInfo, onChainState);
  const etoTemplateKeys = Object.keys(etoTemplates);

  return (
    <>
      <div data-test-id="eto-documents" className={styles.layout}>
        <Heading level={3} className={cn(styles.header)}>
          <FormattedMessage id="documents.legal-documents" />
        </Heading>

        <section className={styles.documentSection}>
          <h4 className={cn(styles.groupName)}>
            <FormattedMessage id="documents.generated-documents" />
          </h4>
          {etoTemplateKeys.length !== 0 ? (
            etoTemplateKeys
              .filter(key => !ignoredTemplates.some(template => template === key))
              .map(key => (
                <ClickableDocumentTile
                  key={key}
                  document={allTemplates[key]}
                  generateTemplate={generateTemplate}
                  title={documentTitles[allTemplates[key].documentType]}
                  extension={".doc"}
                  busy={documentsGenerated[allTemplates[key].ipfsHash]}
                />
              ))
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
            documents.map((key: EEtoDocumentType) => (
              <UploadableDocumentTile
                key={key}
                documentKey={key}
                active={uploadAllowed(stateInfo, etoState, key, onChainState)}
                busy={isBusy(key, transactionPending, !!documentsUploading[key])}
                typedFileName={documentTitles[key]}
                isFileUploaded={isFileUploaded(etoDocuments, key)}
                downloadDocumentStart={startDocumentDownload}
                documentDownloadLinkInactive={
                  !!documentsUploading[key] || !!documentsDownloading[key]
                }
              />
            ))}
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
  appConnect<null | IExternalStateProps, IDispatchProps>({
    stateToProps: state => {
      const etoId = selectEtoId(state);
      const etoState = selectIssuerEtoState(state);
      const isRetailEto = selectIssuerEtoIsRetail(state);
      const etoTemplates = selectIssuerEtoTemplates(state);
      const etoDocuments = selectIssuerEtoDocuments(state);
      const etoFilesData = selectEtoDocumentData(state.etoDocuments);
      const etoFilesDataIsEmpty = Object.keys(etoFilesData.allTemplates).length === 0;
      if (etoId && etoState && isRetailEto && etoTemplates && etoDocuments) {
        return {
          shouldEtoDataLoad: selectShouldEtoDataLoad(state),
          etoFilesData: selectEtoDocumentData(state.etoDocuments),
          dataNotReady:
            selectIssuerEtoLoading(state) || state.etoDocuments.loading || etoFilesDataIsEmpty,
          loadingData: selectIssuerEtoLoading(state),
          etoFileLoading: selectEtoDocumentsLoading(state.etoDocuments),
          etoState,
          onChainState: selectEtoOnChainStateById(state, etoId),
          etoTemplates,
          etoDocuments,
          documentTitles: getDocumentTitles(isRetailEto),
          documentsDownloading: selectEtoDocumentsDownloading(state.etoDocuments),
          documentsUploading: selectEtoDocumentsUploading(state.etoDocuments),
          transactionPending: selectAreTherePendingTxs(state.txMonitor),
          documentsGenerated: selectPendingDownloads(state),
          isRetailEto,
        };
      } else {
        return null;
      }
    },
    dispatchToProps: dispatch => ({
      generateTemplate: document => dispatch(actions.etoDocuments.generateTemplate(document)),
      startDocumentDownload: documentType =>
        dispatch(actions.etoDocuments.downloadDocumentStart(documentType)),
    }),
  }),
  branch<null | IExternalStateProps & IDispatchProps>(props => props === null, renderNothing),
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
