import { storiesOf } from "@storybook/react";
import * as React from "react";

import { etoDocuments, etoFilesData, etoTemplates } from "../../../test/fixtures";
import { EEtoState } from "../../lib/api/eto/EtoApi.interfaces";
import { DocumentsLayout } from "./Documents";
import { getDocumentTitles } from "./utils";

const props = {
  etoFilesData: etoFilesData,
  loadingData: false,
  etoFileLoading: false,
  etoState: EEtoState.ON_CHAIN,
  etoTemplates: etoTemplates,
  etoDocuments: etoDocuments,
  documentTitles: getDocumentTitles(false),
  isRetailEto: false,
  generateTemplate: () => {},
  downloadDocumentStart: () => {},
};

storiesOf("ETO/Documents", module).add("default", () => {
  return <DocumentsLayout {...props} />;
});
