import {mapValues} from 'lodash/fp';

import {convert} from "../../../components/eto/utils";
import * as companyEtoDataInterfaces from "../../eto-flow/interfaces/CompanyEtoData";
import * as publicEtoDataInterfaces from "../../eto-flow/interfaces/PublicEtoData";
import * as etoContractData from "./EtoContractData";
import * as etoTokenData from "./EtoTokenData";

export interface IStatePublicEtos {
  publicEtos: { [previewCode: string]: publicEtoDataInterfaces.IStatePublicEtoData | undefined };
  companies: { [companyId: string]: companyEtoDataInterfaces.IStateCompanyEtoData | undefined };
  contracts: { [previewCode: string]: etoContractData.IStateEtoContractData };
  displayOrder: string[] | undefined;
  maxCapExceeded: { [previewCode: string]: boolean | undefined };
  etoWidgetError: boolean | undefined;
  tokenData: { [previewCode: string]: etoTokenData.IStateEtoTokenData | undefined };
}

export interface IBlPublicEtos {
  publicEtos: { [previewCode: string]: publicEtoDataInterfaces.IBlPublicEtoData | undefined };
  companies: { [companyId: string]: companyEtoDataInterfaces.IBlCompanyEtoData | undefined };
  contracts: { [previewCode: string]: etoContractData.IBlEtoContractData };
  displayOrder: string[] | undefined;
  maxCapExceeded: { [previewCode: string]: boolean | undefined };
  etoWidgetError: boolean | undefined;
  tokenData: { [previewCode: string]: etoTokenData.IBlEtoTokenData | undefined };
}

export const stateToBlConversionSpec = {
  publicEtos: mapValues(v => convert(v, publicEtoDataInterfaces.stateToBlConversionSpec)),
  companies: mapValues(v => convert(v, companyEtoDataInterfaces.stateToBlConversionSpec)),
  contracts: mapValues(v => convert(v, etoContractData.stateToBlConversionSpec)),
  tokenData: mapValues(v => convert(v, etoTokenData.stateToBlConversionSpec)),
};
