import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EEtoDocumentType, TEtoFormType } from "../../lib/api/eto/EtoFileApi.interfaces";
import { ClickableDocumentTile, Document, DocumentTile, UploadableDocumentTile } from "./Document";

const document = {
  documentType: EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT,
  form: "asdf" as TEtoFormType,
  ipfsHash: "ipfs:bla",
  mimeType: "bla/bla",
  name: "document_name",
};

storiesOf("Document", module)
  .add("doc", () => <Document extension="doc" />)
  .add("pdf", () => <Document extension="pdf" />)
  .add("document tile blank, not active", () => (
    <DocumentTile
      extension="pdf"
      title="document title"
      onlyDownload={true}
      blank={true}
      active={false}
      busy={false}
    />
  ))
  .add("document tile blank, active", () => (
    <DocumentTile
      extension="pdf"
      title="document title"
      onlyDownload={true}
      blank={true}
      active={true}
      busy={false}
    />
  ))
  .add("document tile not blank, active", () => (
    <DocumentTile
      extension="pdf"
      title="document title"
      onlyDownload={true}
      blank={false}
      active={true}
      busy={false}
    />
  ))
  .add("document tile not blank, active, busy", () => (
    <DocumentTile
      extension="pdf"
      title="document title"
      onlyDownload={true}
      blank={false}
      active={true}
      busy={true}
    />
  ))
  .add("generated document tile", () => (
    <ClickableDocumentTile
      extension="doc"
      title="bla"
      generateTemplate={() => {}}
      document={document}
      onlyDownload={true}
      active={true}
      blank={false}
    />
  ))
  .add("uploadable document tile", () => (
    <UploadableDocumentTile
      active={true}
      documentKey={EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT}
      typedFileName={"investment agreement"}
      isFileUploaded={false}
      downloadDocumentStart={() => {}}
      documentDownloadLinkInactive={false}
      busy={false}
    />
  ))
  .add("uploadable document tile full", () => (
    <UploadableDocumentTile
      active={true}
      documentKey={EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT}
      typedFileName={"investment agreement"}
      isFileUploaded={true}
      downloadDocumentStart={() => {}}
      documentDownloadLinkInactive={false}
      busy={false}
    />
  ))
  .add("uploadable document tile full busy", () => (
    <UploadableDocumentTile
      active={true}
      documentKey={EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT}
      typedFileName={"investment agreement"}
      isFileUploaded={true}
      downloadDocumentStart={() => {}}
      documentDownloadLinkInactive={true}
      busy={true}
    />
  ));
