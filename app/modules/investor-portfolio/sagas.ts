import BigNumber from "bignumber.js";
import { filter, map } from "lodash/fp";
import { all, fork, put, select } from "redux-saga/effects";

import {convert} from "../../components/eto/utils";
import { ECurrency } from "../../components/shared/Money";
import { InvestorPortfolioMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../di/setupBindings";
import { ETOCommitment } from "../../lib/contracts/ETOCommitment";
import { promisify } from "../../lib/contracts/typechain-runtime";
import { IAppState } from "../../store";
import { EthereumAddress } from "../../types";
import {bigNumberToNumericString} from "../../utils/numericStringUtils";
import { actions, TAction } from "../actions";
import { IStateUser } from "../auth/interfaces";
import { selectUser } from "../auth/selectors";
import {TContribution} from "../contracts/interfaces";
import {IStateCompanyEtoData} from "../eto-flow/interfaces/CompanyEtoData";
import {EEtoState} from "../eto-flow/interfaces/interfaces";
import {IStatePublicEtoData} from "../eto-flow/interfaces/PublicEtoData";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import * as calculatedContributionInterfaces from "./interfaces/CalculatedContribution";
import * as investorTicketInterfaces from "./interfaces/InvestorTicket";
import { IStateTokenDisbursal } from "./interfaces/TokenDisbursal";
import {
  convertToCalculatedContribution,
  convertToInvestorTicket,
  convertToTokenDisbursal,
} from "./utils";

export function* loadInvestorTickets({ logger }: TGlobalDependencies, action: TAction): any {
  if (action.type !== "INVESTOR_TICKET_ETOS_LOAD") return;

  try {
    yield all(
      map(
        eto => put(actions.investorEtoTicket.loadEtoInvestorTicket(eto)),
        filter(eto => eto.state === EEtoState.ON_CHAIN, action.payload.etos),
      ),
    );

    yield;
  } catch (e) {
    logger.error("Could not load investor tickets", e);
  }
}

export function* loadInvestorTicket(
  { contractsService }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "INVESTOR_TICKET_LOAD") return;

  if (action.payload.eto.state !== EEtoState.ON_CHAIN) {
    throw new Error("Should be called only when eto is on chain");
  }

  const etoId = action.payload.eto.etoId;
  const user: IStateUser = yield select((state: IAppState) => selectUser(state.auth));

  const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(etoId);

  const investorTickerRaw = yield etoContract.investorTicket(user.userId);
  yield put(
    actions.investorEtoTicket.setEtoInvestorTicket(
      etoId,
      convert(convertToInvestorTicket(investorTickerRaw),investorTicketInterfaces.blToStateConversionSpec),
    ),
  );

  const contribution:calculatedContributionInterfaces.IBlCalculatedContribution = yield neuCall(loadComputedContributionFromContract, action.payload.eto);

  yield put(actions.investorEtoTicket.setInitialCalculatedContribution(etoId, convert(contribution, calculatedContributionInterfaces.blToStateConversionSpec)));
}

export function* loadComputedContributionFromContract(
  { contractsService }: TGlobalDependencies,
  eto: IStatePublicEtoData & IStateCompanyEtoData,
  amountEuroUlps?: BigNumber,
  isICBM = false,
): any {
  if (eto.state !== EEtoState.ON_CHAIN) return;

  const state: IAppState = yield select();
  const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(eto.etoId);

  if (etoContract) {
    const newInvestorContributionEurUlps:BigNumber =
      amountEuroUlps || (eto.minTicketEur && new BigNumber(eto.minTicketEur)) || new BigNumber("0");

    const from = selectEthereumAddressWithChecksum(state);

    // TODO: check whether typechain but still is not fixed
    // sorry no typechain, typechain has a bug with boolean casting
    const contribution:TContribution = yield promisify(etoContract.rawWeb3Contract.calculateContribution, [
      from,
      isICBM,
      newInvestorContributionEurUlps,
    ]);

    return convertToCalculatedContribution(contribution);
  }
}

export function* loadClaimables({
  contractsService,
  logger,
  notificationCenter,
}: TGlobalDependencies): any {
  const user: IStateUser = yield select((state: IAppState) => selectUser(state.auth));

  const { feeDisbursal, euroToken, etherToken, neumark } = contractsService;

  const tokens: [ECurrency, EthereumAddress][] = [
    [ECurrency.EUR_TOKEN, euroToken.address as EthereumAddress],
    [ECurrency.ETH, etherToken.address as EthereumAddress],
  ];

  try {
    const tokensDisbursalRaw = yield feeDisbursal.claimableMutipleByToken(
      tokens.map(([, address]) => address),
      neumark.address,
      user.userId,
    );

    const tokensDisbursal: IStateTokenDisbursal[] = tokens.map(([token], i) =>
      // claimableMultipeByToken preserves tokens order so it's safe to get exact response by index
      convertToTokenDisbursal(token, tokensDisbursalRaw[i]),
    );

    yield put(actions.investorEtoTicket.setTokensDisbursal(tokensDisbursal));
  } catch (error) {
    yield put(actions.investorEtoTicket.setTokensDisbursal([]));

    logger.error("Failed to load claimables", error);

    notificationCenter.error(
      createMessage(InvestorPortfolioMessage.INVESTOR_PORTFOLIO_FAILED_TO_LOAD_CLAIMABLES),
    );
  }
}

export function* getIncomingPayouts({
  contractsService,
  logger,
  notificationCenter,
}: TGlobalDependencies): any {
  const { feeDisbursal, euroToken, etherToken, neumark } = contractsService;

  try {
    const { euroTokenIncomingPayout, etherTokenIncomingPayout } = yield all({
      euroTokenIncomingPayout: feeDisbursal.getNonClaimableDisbursals(
        euroToken.address,
        neumark.address,
      ),
      etherTokenIncomingPayout: feeDisbursal.getNonClaimableDisbursals(
        etherToken.address,
        neumark.address,
      ),
    });

    const euroTokenIncomingPayoutValue:BigNumber = euroTokenIncomingPayout.reduce(
      (acc: BigNumber, x: BigNumber[]) => { //fixme write unit test
        acc.add(x[1])
        return acc
      }, new BigNumber(0)
    )

    const etherTokenIncomingPayoutValue:BigNumber = etherTokenIncomingPayout.reduce(
      (acc: BigNumber, x: BigNumber[]) => { //fixme write unit test
        acc.add(x[1])
        return acc
      }, new BigNumber(0)
    )

    yield put(
      actions.investorEtoTicket.setIncomingPayouts({ //fixme write a converter fn
        euroTokenIncomingPayoutValue : bigNumberToNumericString()(euroTokenIncomingPayoutValue),
        etherTokenIncomingPayoutValue : bigNumberToNumericString()(etherTokenIncomingPayoutValue)
      })
    );
  } catch (error) {
    logger.error("Failed to load incoming payouts", error);

    notificationCenter.error(
      createMessage(InvestorPortfolioMessage.INVESTOR_PORTFOLIO_FAILED_TO_LOAD_INCOMING_PAYOUTS),
    );
  }
}

export function* investorTicketsSagas(): any {
  yield fork(neuTakeEvery, "INVESTOR_TICKET_ETOS_LOAD", loadInvestorTickets);
  yield fork(neuTakeEvery, "INVESTOR_TICKET_LOAD", loadInvestorTicket);
  yield fork(neuTakeEvery, actions.investorEtoTicket.loadClaimables, loadClaimables);
  yield fork(neuTakeEvery, actions.investorEtoTicket.getIncomingPayouts, getIncomingPayouts);
}
