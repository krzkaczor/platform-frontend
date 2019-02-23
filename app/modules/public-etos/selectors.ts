import { find } from "lodash/fp";

import {convert} from "../../components/eto/utils";
import { IAppState } from "../../store";
import * as publicEtoDataInterfaces from "../eto-flow/interfaces/PublicEtoData";
import * as tokenDataInterfaces from "./interfaces/EtoTokenData";
import {
  EETOStateOnChain, stateToBlConversionSpec, TBlEtoWithCompanyAndContract,
} from "./interfaces/interfaces";
import * as publicEtosInterfaces from "./interfaces/PublicEto";

const selectPublicEtosState = (state: IAppState):publicEtosInterfaces.IBlPublicEtos =>
  convert(state.publicEtos, publicEtosInterfaces.stateToBlConversionSpec);

const selectEtoPreviewCode = (state: IAppState, etoId: string):string | undefined => {
  const eto = find(eto => eto!.etoId === etoId, state.publicEtos.publicEtos);

  if (eto) {
    return eto.previewCode;
  }

  return undefined;
};

export const selectEtoTokenName = (state: IAppState, etoId: string):string | undefined => {
  const eto = find(eto => eto!.etoId === etoId, state.publicEtos.publicEtos);

  if (eto) {
    return eto.equityTokenName;
  }

  return undefined;
};

export const selectPublicEto = (state: IAppState, previewCode: string):publicEtoDataInterfaces.IBlPublicEtoData | undefined =>
  convert(state.publicEtos.publicEtos[previewCode], publicEtoDataInterfaces.stateToBlConversionSpec);

export const selectPublicEtoById = (state: IAppState, etoId: string):publicEtoDataInterfaces.IBlPublicEtoData | undefined => {
  const previewId = selectEtoPreviewCode(state, etoId);
  return previewId
    ? convert(state.publicEtos.publicEtos[previewId], publicEtoDataInterfaces.stateToBlConversionSpec)
    : undefined; //previewId may be an empty string too
};

export const selectEtoWithCompanyAndContract = (
  state: IAppState,
  previewCode: string,
): TBlEtoWithCompanyAndContract | undefined => {
  const publicEtosState = selectPublicEtosState(state);
  const eto = publicEtosState.publicEtos[previewCode];

  if (eto) {
    return convert({
      ...eto,
      company: publicEtosState.companies[eto.companyId]!,
      contract: publicEtosState.contracts[previewCode],
    },
      stateToBlConversionSpec
    );
  }

  return undefined;
};

export const selectEtoWithCompanyAndContractById = (
  state: IAppState,
  etoId: string,
): TBlEtoWithCompanyAndContract | undefined => {
  const previewCode = selectEtoPreviewCode(state, etoId);

  if (previewCode) {
    return selectEtoWithCompanyAndContract(state, previewCode);
  }

  return undefined;
};

export const selectPublicEtos = (state: IAppState): TBlEtoWithCompanyAndContract[] | undefined => {
  const publicEtosState = selectPublicEtosState(state);

  if (publicEtosState.displayOrder) {
    return publicEtosState.displayOrder
      .map(id => selectEtoWithCompanyAndContract(state, id)!)
      .filter(Boolean);
  }

  return undefined;
};

export const selectEtoOnChainState = (
  state: IAppState,
  previewCode: string,
): EETOStateOnChain | undefined => {
  const contracts = state.publicEtos.contracts[previewCode];
  return contracts && contracts.timedState;
};

export const selectEtoOnChainNextStateStartDate = (
  state: IAppState,
  previewCode: string,
): Date | undefined => { //FIXME dates shouldn't be in state
  const eto = selectEtoWithCompanyAndContract(state, previewCode);

  if (eto) {
    const nextState: EETOStateOnChain | undefined = eto.contract!.timedState + 1;

    if (nextState) {
      return eto.contract!.startOfStates[nextState];
    }
  }

  return undefined;
};

export const selectEtoWidgetError = (state: publicEtosInterfaces.IStatePublicEtos): boolean | undefined => {
  return state.etoWidgetError;
};

export const selectEtoOnChainStateById = (
  state: IAppState,
  etoId: string,
): EETOStateOnChain | undefined => {
  const code = selectEtoPreviewCode(state, etoId);
  if (code) return selectEtoOnChainState(state, code);
};

export const selectTokenData = (
  state: publicEtosInterfaces.IStatePublicEtos,
  previewCode: string,
): tokenDataInterfaces.IBlEtoTokenData | undefined => {
  const tokenData = state.tokenData[previewCode];
    return tokenData
    ? convert(tokenData, tokenDataInterfaces.stateToBlConversionSpec)
    : undefined
};
