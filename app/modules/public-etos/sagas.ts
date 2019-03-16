import { LOCATION_CHANGE } from "connected-react-router";
import { camelCase } from "lodash";
import { compose, keyBy, map, omit } from "lodash/fp";
import { delay } from "redux-saga";
import { all, fork, put, race, select } from "redux-saga/effects";

import { PublicEtosMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import {
  EEtoState,
  TCompanyEtoData,
  TEtoSpecsData,
  TPublicEtoData,
} from "../../lib/api/eto/EtoApi.interfaces";
import { IEtoDocument, immutableDocumentName } from "../../lib/api/eto/EtoFileApi.interfaces";
import { EUserType } from "../../lib/api/users/interfaces";
import { EtherToken } from "../../lib/contracts/EtherToken";
import { ETOCommitment } from "../../lib/contracts/ETOCommitment";
import { EuroToken } from "../../lib/contracts/EuroToken";
import { IAppState } from "../../store";
import { Dictionary } from "../../types";
import { divideBigNumbers } from "../../utils/BigNumberUtils";
import { actions, TActionFromCreator } from "../actions";
import { selectUserType } from "../auth/selectors";
import { selectMyAssets } from "../investor-portfolio/selectors";
import { neuCall, neuFork, neuTakeEvery, neuTakeUntil } from "../sagasUtils";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import { etoInProgressPoolingDelay, etoNormalPoolingDelay } from "./constants";
import { InvalidETOStateError } from "./errors";
import {
  selectEtoOnChainNextStateStartDate,
  selectEtoWithCompanyAndContract,
  selectPublicEtoById,
} from "./selectors";
import { EETOStateOnChain, TEtoWithCompanyAndContract } from "./types";
import { convertToEtoTotalInvestment, convertToStateStartDate } from "./utils";

export function* loadEtoPreview(
  { apiEtoService, notificationCenter, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.publicEtos.loadEtoPreview>,
): any {
  const previewCode = action.payload.previewCode;

  try {
    const etoResponse: IHttpResponse<TEtoSpecsData> = yield apiEtoService.getEtoPreview(
      previewCode,
    );
    const eto = etoResponse.body;
    const companyResponse: IHttpResponse<TCompanyEtoData> = yield apiEtoService.getCompanyById(
      eto.companyId,
    );
    const company = companyResponse.body;

    // Load contract data if eto is already on blockchain
    if (eto.state === EEtoState.ON_CHAIN) {
      // load investor tickets
      const userType: EUserType | undefined = yield select((state: IAppState) =>
        selectUserType(state),
      );
      if (userType === EUserType.INVESTOR) {
        yield put(actions.investorEtoTicket.loadEtoInvestorTicket(eto));
      }

      yield neuCall(loadEtoContact, eto);
    }

    yield put(actions.publicEtos.setPublicEto({ eto, company }));
  } catch (e) {
    logger.error("Could not load eto by preview code", e);

    if (action.payload.widgetView) {
      yield put(actions.publicEtos.setEtoWidgetError());

      return;
    }

    notificationCenter.error(createMessage(PublicEtosMessage.COULD_NOT_LOAD_ETO_PREVIEW));
    yield put(actions.routing.goToDashboard());
  }
}

export function* loadEto(
  { apiEtoService, notificationCenter, logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.publicEtos.loadEto>,
): any {
  try {
    const etoId = action.payload.etoId;

    const etoResponse: IHttpResponse<TEtoSpecsData> = yield apiEtoService.getEto(etoId);
    const eto = etoResponse.body;

    const companyResponse: IHttpResponse<TCompanyEtoData> = yield apiEtoService.getCompanyById(
      eto.companyId,
    );
    const company = companyResponse.body;

    // Load contract data if eto is already on blockchain
    if (eto.state === EEtoState.ON_CHAIN) {
      // load investor tickets
      const userType: EUserType | undefined = yield select((state: IAppState) =>
        selectUserType(state),
      );
      if (userType === EUserType.INVESTOR) {
        yield put(actions.investorEtoTicket.loadEtoInvestorTicket(eto));
      }

      yield neuCall(loadEtoContact, eto);
    }

    yield put(actions.publicEtos.setPublicEto({ eto, company }));
  } catch (e) {
    logger.error("Could not load eto by id", e);

    if (action.payload.widgetView) {
      yield put(actions.publicEtos.setEtoWidgetError());

      return;
    }

    notificationCenter.error(createMessage(PublicEtosMessage.COULD_NOT_LOAD_ETO));

    yield put(actions.routing.goToDashboard());
  }
}

export function* loadEtoContact(
  { contractsService, logger }: TGlobalDependencies,
  eto: TPublicEtoData,
): any {
  if (eto.state !== EEtoState.ON_CHAIN) {
    logger.error("Invalid eto state", new InvalidETOStateError(eto.state, EEtoState.ON_CHAIN), {
      etoId: eto.etoId,
    });
    return;
  }

  try {
    const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(eto.etoId);
    const etherTokenContract: EtherToken = contractsService.etherToken;
    const euroTokenContract: EuroToken = contractsService.euroToken;

    // fetch eto contracts state with 'all' to improve performance
    const [
      etherTokenBalance,
      euroTokenBalance,
      timedStateRaw,
      totalInvestmentRaw,
      startOfStatesRaw,
      equityTokenAddress,
      etoTermsAddress,
      etoCommitmentAddress,
    ] = yield all([
      etherTokenContract.balanceOf(etoContract.address),
      euroTokenContract.balanceOf(etoContract.address),
      etoContract.timedState,
      etoContract.totalInvestment(),
      etoContract.startOfStates,
      etoContract.equityToken,
      etoContract.etoTerms,
      etoContract.address,
    ]);

    yield put(
      actions.publicEtos.setEtoDataFromContract(eto.previewCode, {
        equityTokenAddress,
        etoTermsAddress,
        etoCommitmentAddress,
        timedState: timedStateRaw.toNumber(),
        totalInvestment: convertToEtoTotalInvestment(
          totalInvestmentRaw,
          euroTokenBalance,
          etherTokenBalance,
        ),
        startOfStates: convertToStateStartDate(startOfStatesRaw),
      }),
    );
  } catch (e) {
    logger.error("ETO contract data could not be loaded", e, { etoId: eto.etoId });
  }
}

function* watchEtoSetAction(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.publicEtos.setPublicEto>,
): any {
  const previewCode = action.payload.eto.previewCode;

  yield neuFork(watchEto, previewCode);
}

function* watchEtosSetAction(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.publicEtos.setPublicEtos>,
): any {
  yield all(map(eto => neuFork(watchEto, eto.previewCode), action.payload.etos));
}

const etoNextStateCount: Dictionary<number | undefined> = {};
function* calculateNextStateDelay({ logger }: TGlobalDependencies, previewCode: string): any {
  const nextStartDate: Date | undefined = yield select((state: IAppState) =>
    selectEtoOnChainNextStateStartDate(state, previewCode),
  );

  if (nextStartDate) {
    const timeToNextState = nextStartDate.getTime() - Date.now();

    if (timeToNextState > 0) {
      etoNextStateCount[previewCode] = undefined;
      // add small delay to start date to avoid fetching eto in same state
      return timeToNextState + 2000;
    }

    // if timeToNextState is negative then user and ethereum clock are not in sync
    // in that case pool eto in two time intervals of 2 and 5 seconds
    // if after than state time is still negative log warning message
    const nextStateWatchCount = etoNextStateCount[previewCode];
    if (nextStateWatchCount === undefined) {
      etoNextStateCount[previewCode] = 1;
      return 2000;
    }

    if (nextStateWatchCount === 1) {
      etoNextStateCount[previewCode] = 2;
      return 5000;
    }

    logger.warn(
      "ETO next state pooling failed.",
      new Error("User and ethereum clocks are not in sync"),
      { etoPreviewCode: previewCode },
    );
  }

  return undefined;
}

function* watchEto(_: TGlobalDependencies, previewCode: string): any {
  const eto: TEtoWithCompanyAndContract = yield select((state: IAppState) =>
    selectEtoWithCompanyAndContract(state, previewCode),
  );

  let strategies: Dictionary<Promise<true>> = {
    default: delay(etoNormalPoolingDelay),
  };

  if (eto.state === EEtoState.ON_CHAIN) {
    if ([EETOStateOnChain.Whitelist, EETOStateOnChain.Public].includes(eto.contract!.timedState)) {
      strategies.inProgress = delay(etoInProgressPoolingDelay);
    }

    const nextStateDelay: number = yield neuCall(calculateNextStateDelay, previewCode);
    // Do not schedule update if it's later than normal pooling
    // otherwise it's possible to overflow max timeout limit
    // see https://stackoverflow.com/questions/3468607/why-does-settimeout-break-for-large-millisecond-delay-values
    if (nextStateDelay && nextStateDelay < etoNormalPoolingDelay) {
      strategies.nextState = delay(nextStateDelay);
    }
  }

  yield race(strategies);

  yield put(actions.publicEtos.loadEtoPreview(previewCode));
}

function* loadEtos({ apiEtoService, logger }: TGlobalDependencies): any {
  try {
    const etosResponse: IHttpResponse<TPublicEtoData[]> = yield apiEtoService.getEtos();
    const etos = etosResponse.body;

    const companies = compose(
      keyBy((eto: TCompanyEtoData) => eto.companyId),
      map((eto: TPublicEtoData) => eto.company),
    )(etos);

    const etosByPreviewCode = compose(
      keyBy((eto: TEtoSpecsData) => eto.previewCode),
      // remove company prop from eto
      // it's saved separately for consistency with other endpoints
      map(omit("company")),
    )(etos);

    const order = etosResponse.body.map(eto => eto.previewCode);

    yield all(
      order
        .map(id => etosByPreviewCode[id])
        .filter(eto => eto.state === EEtoState.ON_CHAIN)
        .map(eto => neuCall(loadEtoContact, eto)),
    );

    // load investor tickets
    const userType: EUserType | undefined = yield select((state: IAppState) =>
      selectUserType(state),
    );
    if (userType === EUserType.INVESTOR) {
      yield put(actions.investorEtoTicket.loadInvestorTickets(etosByPreviewCode));
    }

    yield put(actions.publicEtos.setPublicEtos({ etos: etosByPreviewCode, companies }));
    yield put(actions.publicEtos.setEtosDisplayOrder(order));
  } catch (e) {
    logger.error("ETOs could not be loaded", e);
  }
}

function* download(document: IEtoDocument): any {
  if (document) {
    yield put(
      actions.immutableStorage.downloadImmutableFile(
        {
          ipfsHash: document.ipfsHash,
          mimeType: document.mimeType,
          asPdf: true,
        },
        immutableDocumentName[document.documentType],
      ),
    );
  }
}

function* downloadDocument(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.publicEtos.downloadPublicEtoDocument>,
): any {
  yield download(action.payload.document);
}

function* downloadTemplateByType(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.publicEtos.downloadPublicEtoTemplateByType>,
): any {
  const state: IAppState = yield select();
  const eto = selectPublicEtoById(state, action.payload.etoId);
  if (eto) {
    yield download(eto.templates[camelCase(action.payload.documentType)]);
  }
}

export function* loadTokensData({ contractsService }: TGlobalDependencies): any {
  const myAssets = yield select(selectMyAssets);
  const walletAddress = yield select(selectEthereumAddressWithChecksum);

  if (!myAssets) {
    return;
  }

  for (const eto of myAssets) {
    const equityTokenAddress = eto.contract.equityTokenAddress;

    const equityToken = yield contractsService.getEquityToken(equityTokenAddress);

    const { balance, tokensPerShare, tokenController } = yield all({
      balance: equityToken.balanceOf(walletAddress),
      tokensPerShare: equityToken.tokensPerShare,
      tokenController: equityToken.tokenController,
    });

    const controllerGovernance = yield contractsService.getControllerGovernance(tokenController);

    const [
      totalCompanyShares,
      companyValuationEurUlps,
      ,
    ] = yield controllerGovernance.shareholderInformation();

    const tokenPrice = divideBigNumbers(
      divideBigNumbers(companyValuationEurUlps, totalCompanyShares),
      tokensPerShare,
    );

    yield put(
      actions.publicEtos.setTokenData(eto.previewCode, {
        balance: balance.toString(),
        tokensPerShare: tokensPerShare.toString(),
        totalCompanyShares: totalCompanyShares.toString(),
        companyValuationEurUlps: companyValuationEurUlps.toString(),
        tokenPrice: tokenPrice.toString(),
      }),
    );
  }
}

export function* etoSagas(): any {
  yield fork(neuTakeEvery, actions.publicEtos.loadEtoPreview, loadEtoPreview);
  yield fork(neuTakeEvery, actions.publicEtos.loadEto, loadEto);
  yield fork(neuTakeEvery, actions.publicEtos.loadEtos, loadEtos);
  yield fork(neuTakeEvery, actions.publicEtos.downloadPublicEtoDocument, downloadDocument);
  yield fork(
    neuTakeEvery,
    actions.publicEtos.downloadPublicEtoTemplateByType,
    downloadTemplateByType,
  );
  yield fork(neuTakeEvery, actions.publicEtos.loadTokensData, loadTokensData);

  yield fork(neuTakeUntil, actions.publicEtos.setPublicEto, LOCATION_CHANGE, watchEtoSetAction);
  yield fork(neuTakeUntil, actions.publicEtos.setPublicEtos, LOCATION_CHANGE, watchEtosSetAction);
}
