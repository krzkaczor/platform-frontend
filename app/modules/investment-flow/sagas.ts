import BigNumber from "bignumber.js";
import { delay } from "redux-saga";
import { put, select, take, takeEvery, takeLatest } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { ETOCommitment } from "../../lib/contracts/ETOCommitment";
import { ITxData } from "../../lib/web3/types";
import { IAppState } from "../../store";
import { addBigNumbers, compareBigNumbers, subtractBigNumbers } from "../../utils/BigNumberUtils";
import { convertToBigInt } from "../../utils/Number.utils";
import { extractNumber } from "../../utils/StringUtils";
import { actions, TAction } from "../actions";
import { loadComputedContributionFromContract } from "../investor-portfolio/sagas";
import {
  selectCalculatedContribution,
  selectCalculatedEtoTicketSizesUlpsById,
  selectIsWhitelisted,
} from "../investor-portfolio/selectors";
import { selectEtoOnChainStateById, selectPublicEtoById } from "../public-etos/selectors";
import { EETOStateOnChain } from "../public-etos/types";
import { neuCall } from "../sagasUtils";
import { selectEtherPriceEur, selectEurPriceEther } from "../shared/tokenPrice/selectors";
import { selectTxGasCostEthUlps } from "../tx/sender/selectors";
import { generateInvestmentTransaction } from "../tx/transactions/investment/sagas";
import { ETxSenderType } from "../tx/types";
import { txValidateSaga } from "../tx/validator/sagas";
import {
  selectLiquidEtherBalance,
  selectLockedEtherBalance,
  selectLockedEuroTokenBalance,
} from "../wallet/selectors";
import { EInvestmentCurrency, EInvestmentErrorState, EInvestmentType } from "./reducer";
import {
  selectCurrencyByInvestmentType,
  selectInvestmentEthValueUlps,
  selectInvestmentEtoId,
  selectInvestmentEurValueUlps,
  selectInvestmentType,
  selectIsICBMInvestment,
} from "./selectors";

function* processCurrencyValue(action: TAction): any {
  if (action.type !== "INVESTMENT_FLOW_SUBMIT_INVESTMENT_VALUE") return;
  const state: IAppState = yield select();

  const value = action.payload.value && convertToBigInt(extractNumber(action.payload.value));
  const curr = action.payload.currency;
  const oldVal =
    curr === EInvestmentCurrency.Ether
      ? selectInvestmentEthValueUlps(state)
      : selectInvestmentEurValueUlps(state);

  // stop if value has not changed. allows editing fractions without overriding user input.
  if (compareBigNumbers(oldVal || "0", value || "0") === 0) return;

  yield put(actions.investmentFlow.setIsInputValidated(false));
  yield computeAndSetCurrencies(value, curr);
  // dispatch in order to debounce, instead of calling directly
  yield put(actions.investmentFlow.validateInputs());
}

function* computeAndSetCurrencies(value: string, currency: EInvestmentCurrency): any {
  const state: IAppState = yield select();
  const etherPriceEur = selectEtherPriceEur(state);
  const eurPriceEther = selectEurPriceEther(state);
  if (!value) {
    yield put(actions.investmentFlow.setEthValue(""));
    yield put(actions.investmentFlow.setEurValue(""));
  } else if (etherPriceEur && etherPriceEur !== "0") {
    const bignumber = new BigNumber(value);
    switch (currency) {
      case EInvestmentCurrency.Ether:
        const eurVal = bignumber.mul(etherPriceEur);
        yield put(actions.investmentFlow.setEthValue(bignumber.toFixed(0, BigNumber.ROUND_UP)));
        yield put(actions.investmentFlow.setEurValue(eurVal.toFixed(0, BigNumber.ROUND_UP)));
        return;
      case EInvestmentCurrency.Euro:
        const ethVal = bignumber.mul(eurPriceEther);
        yield put(actions.investmentFlow.setEthValue(ethVal.toFixed(0, BigNumber.ROUND_UP)));
        yield put(actions.investmentFlow.setEurValue(bignumber.toFixed(0, BigNumber.ROUND_UP)));
        return;
    }
  }
}

function* investEntireBalance(): any {
  const state: IAppState = yield select();

  const type = selectInvestmentType(state);

  let balance = "";
  switch (type) {
    case EInvestmentType.ICBMEth:
      balance = selectLockedEtherBalance(state);
      yield computeAndSetCurrencies(balance, EInvestmentCurrency.Ether);
      break;

    case EInvestmentType.ICBMnEuro:
      balance = selectLockedEuroTokenBalance(state.wallet);
      yield computeAndSetCurrencies(balance, EInvestmentCurrency.Euro);
      break;

    case EInvestmentType.InvestmentWallet:
      const gasCostEth = selectTxGasCostEthUlps(state);
      balance = selectLiquidEtherBalance(state.wallet);
      balance = subtractBigNumbers([balance, gasCostEth]);
      yield computeAndSetCurrencies(balance, EInvestmentCurrency.Ether);
      break;
  }

  if (balance) {
    yield put(actions.investmentFlow.validateInputs());
  }
}

function validateInvestment(state: IAppState): EInvestmentErrorState | undefined {
  const investmentFlow = state.investmentFlow;
  const euroValue = investmentFlow.euroValueUlps;
  const etherValue = investmentFlow.ethValueUlps;
  const wallet = state.wallet.data;
  const contribs = selectCalculatedContribution(state, investmentFlow.etoId);
  const ticketSizes = selectCalculatedEtoTicketSizesUlpsById(state, investmentFlow.etoId);

  if (!contribs || !euroValue || !wallet || !ticketSizes) return;

  const gasPrice = selectTxGasCostEthUlps(state);

  if (investmentFlow.investmentType === EInvestmentType.InvestmentWallet) {
    if (
      compareBigNumbers(
        addBigNumbers([etherValue, gasPrice]),
        selectLiquidEtherBalance(state.wallet),
      ) > 0
    ) {
      return EInvestmentErrorState.ExceedsWalletBalance;
    }
  }

  if (investmentFlow.investmentType === EInvestmentType.ICBMnEuro) {
    if (compareBigNumbers(euroValue, selectLockedEuroTokenBalance(state.wallet)) > 0) {
      return EInvestmentErrorState.ExceedsWalletBalance;
    }
  }

  if (investmentFlow.investmentType === EInvestmentType.ICBMEth) {
    if (compareBigNumbers(etherValue, selectLockedEtherBalance(state)) > 0) {
      return EInvestmentErrorState.ExceedsWalletBalance;
    }
  }

  if (compareBigNumbers(euroValue, ticketSizes.minTicketEurUlps) < 0) {
    return EInvestmentErrorState.BelowMinimumTicketSize;
  }

  if (compareBigNumbers(euroValue, ticketSizes.maxTicketEurUlps) > 0) {
    return EInvestmentErrorState.AboveMaximumTicketSize;
  }

  if (contribs.maxCapExceeded) {
    return EInvestmentErrorState.ExceedsTokenAmount;
  }

  return;
}

function* validateAndCalculateInputs({ contractsService }: TGlobalDependencies): any {
  // debounce validation
  yield delay(300);

  let state: IAppState = yield select();
  const eto = selectPublicEtoById(state, state.investmentFlow.etoId);
  const value = state.investmentFlow.euroValueUlps;
  if (value && eto) {
    const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(eto.etoId);
    if (etoContract) {
      const isICBM = selectIsICBMInvestment(state);
      const contribution = yield neuCall(loadComputedContributionFromContract, eto, value, isICBM);

      yield put(actions.investorEtoTicket.setCalculatedContribution(eto.etoId, contribution));

      state = yield select();
      yield put(actions.investmentFlow.setErrorState(validateInvestment(state)));

      const txData: ITxData = yield neuCall(
        txValidateSaga,
        actions.txValidator.txSenderValidateDraft({ type: ETxSenderType.INVEST }),
      );
      yield put(actions.txSender.setTransactionData(txData));

      yield put(actions.investmentFlow.setIsInputValidated(true));
    }
  } else {
    yield put(actions.investmentFlow.setErrorState());
  }
}

function* start(action: TAction): any {
  if (action.type !== "INVESTMENT_FLOW_START") return;
  const etoId = action.payload.etoId;
  const state: IAppState = yield select();
  yield put(actions.investmentFlow.resetInvestment());
  yield put(actions.investmentFlow.setEtoId(etoId));
  yield put(actions.kyc.kycLoadClientData());
  yield put(actions.txTransactions.startInvestment());
  yield put(actions.investorEtoTicket.loadEtoInvestorTicket(selectPublicEtoById(state, etoId)!));

  yield take("TX_SENDER_WATCH_PENDING_TXS_DONE");
  yield getActiveInvestmentTypes();
  yield resetTxDataAndValidations();
}

export function* onInvestmentTxModalHide(): any {
  yield put(actions.investmentFlow.resetInvestment());
}

function* getActiveInvestmentTypes(): any {
  const state: IAppState = yield select();
  const etoId = selectInvestmentEtoId(state);
  const etoState = selectEtoOnChainStateById(state, etoId);

  let activeTypes: EInvestmentType[] = [EInvestmentType.InvestmentWallet];

  // no regular investment if not whitelisted in pre eto
  if (etoState === EETOStateOnChain.Whitelist && !selectIsWhitelisted(state, etoId)) {
    activeTypes = [];
  }

  // only ICBM investment if balance available
  if (compareBigNumbers(selectLockedEuroTokenBalance(state.wallet), 0) > 0) {
    activeTypes.unshift(EInvestmentType.ICBMnEuro);
  }
  if (compareBigNumbers(selectLockedEtherBalance(state), 0) > 0) {
    activeTypes.unshift(EInvestmentType.ICBMEth);
  }

  yield put(actions.investmentFlow.setActiveInvestmentTypes(activeTypes));

  // guarantee that current type is inside active types.
  const currentType = selectInvestmentType(state);
  if (currentType && !activeTypes.includes(currentType)) {
    yield put(actions.investmentFlow.selectInvestmentType(activeTypes[0]));
  }
}

function* recalculateCurrencies(): any {
  yield delay(100); // wait for new token price to be available
  const s: IAppState = yield select();
  const curr = selectCurrencyByInvestmentType(s);
  const ethVal = selectInvestmentEthValueUlps(s);
  const eurVal = selectInvestmentEurValueUlps(s);
  if (curr === EInvestmentCurrency.Ether && ethVal) {
    yield computeAndSetCurrencies(ethVal, curr);
  } else if (eurVal) {
    yield computeAndSetCurrencies(eurVal, curr);
  }
}

function* resetTxDataAndValidations(): any {
  yield put(actions.txValidator.setValidationState());
  const initialTxData = yield neuCall(generateInvestmentTransaction);
  yield put(actions.txSender.setTransactionData(initialTxData));
}

function* stop(): any {
  yield put(actions.txSender.txSenderHideModal());
}

export function* investmentFlowSagas(): any {
  yield takeEvery("INVESTMENT_FLOW_SUBMIT_INVESTMENT_VALUE", processCurrencyValue);
  yield takeLatest("INVESTMENT_FLOW_VALIDATE_INPUTS", neuCall, validateAndCalculateInputs);
  yield takeEvery("INVESTMENT_FLOW_START", start);
  yield takeEvery("TOKEN_PRICE_SAVE", recalculateCurrencies);
  yield takeEvery("INVESTMENT_FLOW_SELECT_INVESTMENT_TYPE", resetTxDataAndValidations);
  yield takeEvery("INVESTMENT_FLOW_INVEST_ENTIRE_BALANCE", investEntireBalance);
  yield takeEvery("@@router/LOCATION_CHANGE", stop); // stop investment if some link is clicked
}
