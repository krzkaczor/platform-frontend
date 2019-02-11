import { Dictionary } from "../../types";
import { createAction, createActionFactory } from "../actionsUtils";
import { IStateCalculatedContribution, IStateTokenDisbursal } from "./interfaces/interfaces";
import {IStateInvestorTicket} from './interfaces/InvestorTicket'
import {IStatePublicEtoData} from "../eto-flow/interfaces/PublicEtoData";

export const investorEtoTicketActions = {
  // public actions
  loadEtoInvestorTicket: (eto: IStatePublicEtoData) => createAction("INVESTOR_TICKET_LOAD", { eto }),
  loadInvestorTickets: (etos: Dictionary<IStatePublicEtoData>) =>
    createAction("INVESTOR_TICKET_ETOS_LOAD", { etos }),
  claim: (etoId: string) => createAction("INVESTOR_TICKET_CLAIM", { etoId }),
  loadClaimables: createActionFactory("INVESTOR_CLAIMABLES_LOAD"),

  // state mutations
  setEtoInvestorTicket: (etoId: string, ticket: IStateInvestorTicket) =>
    createAction("INVESTOR_TICKET_SET", { etoId, ticket }),
  setCalculatedContribution: (etoId: string, contribution: IStateCalculatedContribution) =>
    createAction("INVESTOR_TICKET_SET_CALCULATED_CONTRIBUTION", { etoId, contribution }),
  setInitialCalculatedContribution: (etoId: string, contribution: IStateCalculatedContribution) =>
    createAction("INVESTOR_TICKET_SET_INITIAL_CALCULATED_CONTRIBUTION", { etoId, contribution }),
  setTokensDisbursal: createActionFactory(
    "SET_TOKENS_DISBURSAL",
    (tokensDisbursal: IStateTokenDisbursal[]) => ({ tokensDisbursal }),
  ),
};
