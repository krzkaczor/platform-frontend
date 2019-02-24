import BigNumber from "bignumber.js";
import { isArray } from "lodash/fp";
import { createSelector } from "reselect";

import { convert } from "../../components/eto/utils";
import { Q18 } from "../../config/constants";
import { getShareAndTokenPrice } from "../../lib/api/eto/EtoUtils";
import { IAppState } from "../../store";
import { EETOStateOnChain } from "../public-etos/interfaces/interfaces";
import { selectPublicEtoById, selectPublicEtos, selectTokenData } from "../public-etos/selectors";
import { isOnChain } from "../public-etos/utils";
import { selectLockedWalletConnected } from "../wallet/selectors";
import { IBlCalculatedContribution } from "./interfaces/CalculatedContribution";
import { TBlETOWithInvestorTicket, TBlETOWithTokenData } from "./interfaces/interfaces";
import * as investorTicketsInterfaces from "./interfaces/InvestorTickets";
import { IBlTokenDisbursal } from "./interfaces/TokenDisbursal";

const selectInvestorTicketsState = (
  state: IAppState,
): investorTicketsInterfaces.IBlInvestorTickets =>
  convert(state.investorTickets, investorTicketsInterfaces.stateToBlConversionSpec);

export const selectInvestorTicket = (state: IAppState, etoId: string) => {
  const investorState = selectInvestorTicketsState(state);

  return investorState.investorEtoTickets[etoId];
};

export const selectHasInvestorTicket = (state: IAppState, etoId: string) => {
  const investorState = selectInvestorTicketsState(state);

  const investmentTicket = investorState.investorEtoTickets[etoId];

  if (investmentTicket) {
    // equivEurUlps is set to zero when investor didn't invest
    return !new BigNumber(investmentTicket.equivEurUlps).isZero();
  }

  return false;
};

export const selectEtoWithInvestorTickets = (
  state: IAppState,
): TBlETOWithInvestorTicket[] | undefined => {
  const etos = selectPublicEtos(state);
  if (etos) {
    return etos
      .filter(isOnChain)
      .filter(eto => eto.contract && eto.contract.timedState !== EETOStateOnChain.Setup)
      .filter(eto => selectHasInvestorTicket(state, eto.etoId))
      .map(eto => ({
        ...eto,
        investorTicket: selectInvestorTicket(state, eto.etoId)!,
      }));
  }

  return undefined;
};

export const selectMyAssets = (state: IAppState): TBlETOWithInvestorTicket[] | undefined => {
  const etos = selectEtoWithInvestorTickets(state);

  if (etos) {
    return etos.filter(
      eto =>
        eto.contract!.timedState === EETOStateOnChain.Claim ||
        eto.contract!.timedState === EETOStateOnChain.Payout,
    );
  }

  return undefined;
};

export const selectMyPendingAssets = (state: IAppState): TBlETOWithInvestorTicket[] | undefined => {
  const etos = selectEtoWithInvestorTickets(state);
  if (etos) {
    return etos.filter(eto => !eto.investorTicket.claimedOrRefunded);
  }

  return undefined;
};

export const selectMyInvestorTicketByEtoId = (
  state: IAppState,
  etoId: string,
): TBlETOWithInvestorTicket | undefined => {
  const etos = selectEtoWithInvestorTickets(state);
  if (etos) {
    // Should only return one
    return etos.filter(eto => eto.etoId === etoId)[0];
  }

  return undefined;
};

export const selectCalculatedContribution = (
  state: IAppState,
  etoId: string,
): IBlCalculatedContribution | undefined => {
  const investorState = selectInvestorTicketsState(state);

  return (
    investorState.calculatedContributions[etoId] ||
    selectInitialCalculatedContribution(etoId, state)
  );
};

export const selectInitialCalculatedContribution = (
  etoId: string,
  state: IAppState,
): IBlCalculatedContribution | undefined => {
  const investorState = selectInvestorTicketsState(state);

  return investorState.initialCalculatedContributions[etoId];
};

export const selectInitialMaxCapExceeded = (state: IAppState, etoId: string): boolean => {
  const initialCalculatedContribution = selectInitialCalculatedContribution(etoId, state);

  if (!initialCalculatedContribution) return false;

  return initialCalculatedContribution.maxCapExceeded;
};

export const selectEquityTokenCountByEtoId = (
  state: IAppState,
  etoId: string,
): BigNumber | undefined => {
  const contrib = selectCalculatedContribution(state, etoId);
  return contrib && contrib.equityTokenInt;
};

export const selectCalculatedEtoTicketSizesUlpsById = (
  state: IAppState,
  etoId: string,
): { minTicketEurUlps: BigNumber; maxTicketEurUlps: BigNumber } | undefined => {
  const eto = selectPublicEtoById(state, etoId);
  const contrib = selectCalculatedContribution(state, etoId);
  const investorTicket = selectInvestorTicket(state, etoId);

  let min = (contrib && contrib.minTicketEurUlps) || (eto && Q18.mul(eto.minTicketEur || 0));
  let max =
    (contrib && contrib.maxTicketEurUlps) ||
    (eto && eto.maxTicketEur && Q18.mul(eto.maxTicketEur || 0));

  if (min && max) {
    if (eto && investorTicket) {
      const { tokenPrice } = getShareAndTokenPrice(eto);
      min = BigNumber.max(min.sub(investorTicket.equivEurUlps), Q18.mul(tokenPrice.toString()));
      max = BigNumber.max(max.sub(investorTicket.equivEurUlps), 0);
    }

    return {
      minTicketEurUlps: min,
      maxTicketEurUlps: max,
    };
  }
};

export const selectNeuRewardUlpsByEtoId = (
  state: IAppState,
  etoId: string,
): BigNumber | undefined => {
  const contrib = selectCalculatedContribution(state, etoId);
  return contrib && contrib.neuRewardUlps;
};

export const selectIsWhitelisted = (state: IAppState, etoId: string): boolean => {
  const contrib = selectCalculatedContribution(state, etoId);
  return !!contrib && contrib.isWhitelisted;
};

export const selectIsEligibleToPreEto = (state: IAppState, etoId: string): boolean => {
  const isLockedWalletConnected = selectLockedWalletConnected(state);
  const isWhitelisted = selectIsWhitelisted(state, etoId);
  return isLockedWalletConnected || isWhitelisted;
};

/**
 * Selects tokens disbursal with `amountToBeClaimed` greater than zero
 */
export const selectTokensDisbursal: (state: IAppState) => IBlTokenDisbursal[] = createSelector(
  selectInvestorTicketsState,
  investorTickets => {
    let res: IBlTokenDisbursal[] = [];
    if (isArray(investorTickets.tokensDisbursal)) {
      res = investorTickets.tokensDisbursal.filter(d => !d.amountToBeClaimed.isZero());
    }
    return res;
  },
);

export const selectMyAssetsWithTokenData = (
  state: IAppState,
): TBlETOWithTokenData[] | undefined => {
  const myAsssets = selectMyAssets(state);
  if (myAsssets) {
    return myAsssets.map((asset: TBlETOWithInvestorTicket) => ({
      ...asset,
      tokenData: selectTokenData(state.publicEtos, asset.previewCode)!,
    }));
  }

  return undefined;
};

export const selectIsIncomingPayoutLoading = (state: IAppState): boolean => {
  return state.investorTickets.incomingPayouts.loading;
};

export const selectEtherTokenIncomingPayout = (state: IAppState): string => {
  const incomingPayout = state.investorTickets.incomingPayouts.data;

  if (incomingPayout) {
    return incomingPayout.etherTokenIncomingPayoutValue;
  }
  return "0";
};

export const selectEuroTokenIncomingPayout = (state: IAppState): string => {
  const incomingPayout = state.investorTickets.incomingPayouts.data;

  if (incomingPayout) {
    return incomingPayout.euroTokenIncomingPayoutValue;
  }
  return "0";
};

export const selectIsIncomingPayoutAvailable = (state: IAppState): boolean => {
  const etherToken = selectEtherTokenIncomingPayout(state);
  const euroToken = selectEuroTokenIncomingPayout(state);

  return etherToken !== "0" || euroToken !== "0";
};

export const selectIsIncomingPayoutDone = (state: IAppState): boolean => {
  return state.investorTickets.incomingPayouts.payoutDone;
};
