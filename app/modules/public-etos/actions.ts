import { TCompanyEtoData, TEtoSpecsData } from "../../lib/api/eto/EtoApi.interfaces";
import { EEtoDocumentType, IEtoDocument } from "../../lib/api/eto/EtoFileApi.interfaces";
import { Dictionary } from "../../types";
import { createActionFactory } from "../actionsUtils";
import { IEtoContractData, IEtoTokenData } from "./types";

export const etoActions = {
  // public actions
  loadEtoPreview: createActionFactory(
    "PUBLIC_ETOS_LOAD_ETO_PREVIEW",
    (previewCode: string, widgetView?: boolean) => ({
      previewCode,
      widgetView,
    }),
  ),
  loadEto: createActionFactory("PUBLIC_ETOS_LOAD_ETO", (etoId: string, widgetView?: boolean) => ({
    etoId,
    widgetView,
  })),
  loadEtos: createActionFactory("PUBLIC_ETOS_LOAD_ETOS"),
  downloadPublicEtoDocument: createActionFactory(
    "PUBLIC_ETOS_DOWNLOAD_DOCUMENT",
    (document: IEtoDocument) => ({ document }),
  ),
  downloadPublicEtoTemplateByType: createActionFactory(
    "PUBLIC_ETOS_DOWNLOAD_TEMPLATE_BY_TYPE",
    (etoId: string, documentType: EEtoDocumentType) => ({ etoId, documentType }),
  ),
  loadTokensData: createActionFactory("PORTFOLIO_LOAD_TOKENS_DATA"),
  setTokenData: createActionFactory(
    "PORTFOLIO_SET_TOKEN_DATA",
    (previewCode: string, tokenData: IEtoTokenData) => ({
      previewCode,
      tokenData,
    }),
  ),
  // state mutations
  setPublicEtos: createActionFactory(
    "PUBLIC_ETOS_SET_PUBLIC_ETOS",
    ({
      etos,
      companies,
    }: {
      etos: Dictionary<TEtoSpecsData>;
      companies: Dictionary<TCompanyEtoData>;
    }) => ({ etos, companies }),
  ),
  setPublicEto: createActionFactory(
    "PUBLIC_ETOS_SET_PUBLIC_ETO",
    ({ eto, company }: { eto: TEtoSpecsData; company: TCompanyEtoData }) => ({ eto, company }),
  ),
  setEtosDisplayOrder: createActionFactory("PUBLIC_ETOS_SET_DISPLAY_ORDER", (order: string[]) => ({
    order,
  })),
  setEtoDataFromContract: createActionFactory(
    "PUBLIC_ETOS_SET_ETO_DATA_FROM_CONTRACT",
    (previewCode: string, data: IEtoContractData) => ({ previewCode, data }),
  ),
  setEtoWidgetError: createActionFactory("PUBLIC_ETOS_SET_ETO_WIDGET_ERROR"),
};
