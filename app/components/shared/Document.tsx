import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EEtoDocumentType, IEtoDocument } from "../../lib/api/eto/EtoFileApi.interfaces";
import { TTranslatedString } from "../../types";
import { ETOAddDocuments } from "../eto/shared/EtoAddDocument";
import { LoadingIndicator } from "./loading-indicator/LoadingIndicator";

import * as styles from "./Document.module.scss";

interface IDocumentProps {
  extension: string;
  blank?: boolean;
  className?: string;
}

interface IDocumentTileProps {
  title: string | React.ReactNode;
  className?: string;
  onlyDownload?: boolean;
  blank?: boolean;
  active?: boolean;
  busy?: boolean;
}

interface IUploadableDocumentTileProps {
  documentKey: EEtoDocumentType;
  active: boolean;
  typedFileName: TTranslatedString;
  isFileUploaded: boolean;
  downloadDocumentStart: (documentType: EEtoDocumentType) => void;
  documentDownloadLinkInactive: boolean;
  busy?: boolean;
}

interface IClickableDocumentTileProps {
  generateTemplate: (document: IEtoDocument) => void;
  document: IEtoDocument;
}

export const Document: React.FunctionComponent<IDocumentProps> = ({
  extension,
  blank,
  className,
}) => {
  const labelHeight = 24;
  const labelWidth = 50;

  const arr = extension.split(".");
  const computedExtension = arr[arr.length - 1];

  return (
    <svg
      viewBox="0 0 61 73"
      className={cn("document-icon", styles.document, { [computedExtension]: !blank }, className)}
    >
      <path
        className={styles.file}
        d="M40.3300171,1 L7.98360656,1 C4.66989806,1 1.98360656,3.6862915 1.98360656,7 L1.98360656,31 L1,31 L1,6 C1,2.6862915 3.6862915,1.4968968e-15 7,8.8817842e-16 L41.6849183,8.8817842e-16 L61,19.6908043 L61,67 C61,70.3137085 58.3137085,73 55,73 L7,73 C3.6862915,73 1,70.3137085 1,67 L1,57 L1.98360656,57 L1.98360656,66 C1.98360656,69.3137085 4.66989806,72 7.98360656,72 L54.0163934,72 C57.3301019,72 60.0163934,69.3137085 60.0163934,66 L60.0163934,21 L40.3300171,21 L40.3300171,1 Z M41.3300171,1 L41.3300171,20 L59.8687734,20 L41.3345931,1 L41.3300171,1 Z"
      />
      <rect className={styles.label} width={labelWidth} height={labelHeight} y="32" />
      <text className={styles.text} fontSize="8">
        <tspan x="12" y="47">
          .{computedExtension}
        </tspan>
      </text>
    </svg>
  );
};

export const DocumentTile: React.FunctionComponent<IDocumentProps & IDocumentTileProps> = ({
  extension,
  title,
  className,
  blank,
  onlyDownload,
  active,
  busy,
}) => {
  return (
    <div
      className={cn(
        styles.tile,
        {
          [styles.busy]: busy,
          [styles.enabled]: !blank,
          [styles.active]: active,
        },
        className,
      )}
    >
      <LoadingIndicator className={busy ? styles.documentBusy : styles.documentNotBusy} />

      <Document extension={extension} blank={blank} className={busy && styles.documentIconBusy} />
      <p
        className={cn(styles.title, {
          [styles.blankTitle]: blank,
          [styles.disabledTitle]: !onlyDownload && !active,
          [styles.textBusy]: busy,
        })}
      >
        {title}
      </p>
      {!onlyDownload &&
        blank &&
        active && (
          <p className={cn(styles.subTitle, { [styles.textBusy]: busy })}>
            <FormattedMessage id="documents.drag-n-drop" />
          </p>
        )}
    </div>
  );
};

DocumentTile.defaultProps = {
  busy: false,
};

export const ClickableDocumentTile: React.FunctionComponent<
  IDocumentProps & IDocumentTileProps & IClickableDocumentTileProps
> = ({ generateTemplate, title, document, extension, busy }) => {
  return (
    <div>
      <button
        disabled={busy}
        className={styles.clickableArea}
        onClick={() => generateTemplate(document)}
      >
        <DocumentTile
          title={title}
          extension={extension}
          blank={false}
          onlyDownload={true}
          busy={busy}
        />
      </button>
    </div>
  );
};

export const UploadableDocumentTile: React.FunctionComponent<IUploadableDocumentTileProps> = ({
  documentKey,
  active,
  typedFileName,
  isFileUploaded,
  downloadDocumentStart,
  documentDownloadLinkInactive,
  busy,
}) => {
  const linkDisabled = documentDownloadLinkInactive || busy;

  return (
    <div data-test-id={`form.name.${documentKey}`}>
      <ETOAddDocuments documentType={documentKey} disabled={!active || busy}>
        <DocumentTile
          title={typedFileName}
          extension={".pdf"}
          active={active}
          blank={!isFileUploaded}
          busy={busy}
        />
      </ETOAddDocuments>
      {isFileUploaded && (
        <button
          data-test-id="documents-download-document"
          onClick={() => downloadDocumentStart(documentKey)}
          className={cn(styles.subTitleDownload, linkDisabled && styles.downloadLinkDisabled)}
          disabled={linkDisabled}
        >
          {linkDisabled ? (
            <FormattedMessage id="documents.download-document-busy" />
          ) : (
            <FormattedMessage id="documents.download-document" />
          )}
        </button>
      )}
    </div>
  );
};
