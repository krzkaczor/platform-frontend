import { storiesOf } from "@storybook/react";
import * as React from "react";

import { etoDocuments } from "../../../test/fixtures/fixtures";
import {etoTemplates} from "../../../test/fixtures/testEtoTemplates";
import {etoFilesData} from "../../../test/fixtures/testEtoFilesData";
import { EEtoState } from "../../modules/eto-flow/interfaces/interfaces";
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
  downloadDocumentByType: () => {},
};

storiesOf("ETO/Documents", module).add("default", () => {
  return <DocumentsLayout {...props} />;
});
