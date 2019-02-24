import { Dictionary } from "../../types";
import { createAction, createActionFactory } from "../actionsUtils";
import { IStatePublicEtoData } from "../eto-flow/interfaces/PublicEtoData";
import { IStateCalculatedContribution } from "./interfaces/CalculatedContribution";
import { IStateIncomingPayoutsData } from "./interfaces/IncomingPayouts";
import { IStateInvestorTicket } from "./interfaces/InvestorTicket";
import { IStateTokenDisbursal } from "./interfaces/TokenDisbursal";

export const investorEtoTicketActions = {
  // public actions
  loadEtoInvestorTicket: (eto: IStatePublicEtoData) =>
    createAction("INVESTOR_TICKET_LOAD", { eto }),
  loadInvestorTickets: (etos: Dictionary<IStatePublicEtoData>) =>
    createAction("INVESTOR_TICKET_ETOS_LOAD", { etos }),
  claim: (etoId: string) => createAction("INVESTOR_TICKET_CLAIM", { etoId }),
  loadClaimables: createActionFactory("INVESTOR_CLAIMABLES_LOAD"),
  getIncomingPayouts: createActionFactory("INVESTOR_TICKET_GET_INCOMING_PAYOUTS"),

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
  setIncomingPayouts: createActionFactory(
    "INVESTOR_TICKET_SET_INCOMING_PAYOUTS",
    (incomingPayouts: IStateIncomingPayoutsData) => ({
      incomingPayouts,
    }),
  ),
  setIncomingPayoutDone: createActionFactory("INVESTOR_TICKET_SET_INCOMING_PAYOUTS_DONE"),
};
