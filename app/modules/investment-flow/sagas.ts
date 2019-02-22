import BigNumber from "bignumber.js";
import { delay } from "redux-saga";
import { put, select, take, takeEvery, takeLatest } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { ETOCommitment } from "../../lib/contracts/ETOCommitment";
import * as txInterfaces from "../../modules/web3/interfaces";
import { IAppState } from "../../store";
import { compareBigNumbers } from "../../utils/BigNumberUtils";
import { isLessThanNHours } from "../../utils/Date.utils";
import { extractNumber } from "../../utils/StringUtils";
import { actions, TAction } from "../actions";
import { loadComputedContributionFromContract } from "../investor-portfolio/sagas";
import {
  selectCalculatedContribution,
  selectCalculatedEtoTicketSizesUlpsById,
  selectIsWhitelisted,
} from "../investor-portfolio/selectors";
import {
  selectEtoOnChainStateById,
  selectEtoWithCompanyAndContractById,
  selectPublicEtoById,
} from "../public-etos/selectors";
import { EETOStateOnChain } from "../public-etos/interfaces/interfaces";
import { neuCall } from "../sagasUtils";
import { selectEtherPriceEur, selectEurPriceEther } from "../shared/tokenPrice/selectors";
import { ETxSenderType } from "../tx/interfaces";
import { selectTxGasCostEthUlps } from "../tx/sender/selectors";
import { generateInvestmentTransaction } from "../tx/transactions/investment/sagas";
import { txValidateSaga } from "../tx/validator/sagas";
import {
  selectLiquidEtherBalance,
  selectLockedEtherBalance,
  selectLockedEuroTokenBalance,
} from "../wallet/selectors";
import {
  EBankTransferFlowState,
  EInvestmentCurrency,
  EInvestmentErrorState,
  EInvestmentType,
  IStateInvestmentFlow,
} from "./interfaces";
import {
  selectCurrencyByInvestmentType,
  selectInvestmentEthValueUlps,
  selectInvestmentEtoId,
  selectInvestmentEurValueUlps,
  selectInvestmentType,
  selectIsICBMInvestment,
} from "./selectors";
import * as calculatedContributionInterfaces from "../investor-portfolio/interfaces/CalculatedContribution";
import {NumericString} from "../../types";
import {convert} from "../../components/eto/utils";
import * as publicEtoDataInterfaces from "../eto-flow/interfaces/PublicEtoData";

// default: 3 days
const HOURS_TO_DISABLE_BANK_TRANSFER = parseInt(
  process.env.NF_HOURS_TO_DISABLE_BANK_TRANSFER_INVESTMENT || "72",
  10,
);
//todo move debouncing and user input validation into component
function* processCurrencyValue(action: TAction): any {
  if (action.type !== "INVESTMENT_FLOW_SUBMIT_INVESTMENT_VALUE") return;
  const state: IAppState = yield select();

  const value = new BigNumber(extractNumber(action.payload.value)); //fixme extract number should go into component

  if (value.isNaN()) return;

  const curr = action.payload.currency;
  const oldVal: BigNumber | null =
    curr === EInvestmentCurrency.Ether
      ? selectInvestmentEthValueUlps(state)
      : selectInvestmentEurValueUlps(state);

  // stop if value has not changed. allows editing fractions without overriding user input.
  if (compareBigNumbers(oldVal || "0", value || "0") === 0) return; //FIXME find out what it is

  yield put(actions.investmentFlow.setIsInputValidated(false));
  yield computeAndSetCurrencies(value, curr);
  // dispatch in order to debounce, instead of calling directly
  yield put(actions.investmentFlow.validateInputs());
}

function* computeAndSetCurrencies(value: BigNumber, currency: EInvestmentCurrency): any {
  const state: IAppState = yield select();
  const etherPriceEur = selectEtherPriceEur(state);
  const eurPriceEther = selectEurPriceEther(state);
  if (value.isNaN()) { //fixme remove this.
    yield put(actions.investmentFlow.setEthValue(null));
    yield put(actions.investmentFlow.setEurValue(null));
  } else if (etherPriceEur && !etherPriceEur.isZero()) {
    switch (currency) {
      case EInvestmentCurrency.Ether:
        const eurVal = value.mul(etherPriceEur);
        yield put(actions.investmentFlow.setEthValue(value.toFixed(0, BigNumber.ROUND_UP) as NumericString));
        yield put(actions.investmentFlow.setEurValue(eurVal.toFixed(0, BigNumber.ROUND_UP) as NumericString));
        return;
      case EInvestmentCurrency.Euro:
        const ethVal = value.mul(eurPriceEther);
        yield put(actions.investmentFlow.setEthValue(ethVal.toFixed(0, BigNumber.ROUND_UP) as NumericString));
        yield put(actions.investmentFlow.setEurValue(value.toFixed(0, BigNumber.ROUND_UP) as NumericString));
        return;
    }
  }
}

function* investEntireBalance(): any {
  const state: IAppState = yield select();

  const type = selectInvestmentType(state);

  let balance = null;
  switch (type) {
    case EInvestmentType.ICBMEth:
      balance = selectLockedEtherBalance(state.wallet);
      yield computeAndSetCurrencies(balance, EInvestmentCurrency.Ether);
      break;

    case EInvestmentType.ICBMnEuro:
      balance = selectLockedEuroTokenBalance(state.wallet);
      yield computeAndSetCurrencies(balance, EInvestmentCurrency.Euro);
      break;

    case EInvestmentType.InvestmentWallet:
      const gasCostEth = selectTxGasCostEthUlps(state);
      balance = selectLiquidEtherBalance(state.wallet).sub(gasCostEth);
      yield computeAndSetCurrencies(balance, EInvestmentCurrency.Ether);
      break;
  }

  if (balance) {
    yield put(actions.investmentFlow.validateInputs());
  }
}

function calculateInvestmentError(state: IAppState): EInvestmentErrorState | undefined {
  const investmentFlow = state.investmentFlow;

  if(!investmentFlow.etoId) {
    return;
  } else {
    const euroValue = investmentFlow.euroValueUlps !== null ? new BigNumber(investmentFlow.euroValueUlps) : null;
    const etherValue = investmentFlow.ethValueUlps !== null ? new BigNumber(investmentFlow.ethValueUlps) : null;
    const wallet = state.wallet.data;
    const contribs:calculatedContributionInterfaces.IBlCalculatedContribution | undefined =
      selectCalculatedContribution(state, investmentFlow.etoId);
    const ticketSizes = selectCalculatedEtoTicketSizesUlpsById(state, investmentFlow.etoId); //{bignumber, bignumber}

    if (!contribs || !euroValue || !etherValue || !wallet || !ticketSizes) return;

    const gasPrice = selectTxGasCostEthUlps(state);

    if (
      investmentFlow.investmentType === EInvestmentType.InvestmentWallet &&
      etherValue.add(gasPrice).comparedTo(selectLiquidEtherBalance(state.wallet)) > 0
    ) {
        return EInvestmentErrorState.ExceedsWalletBalance;
    }

    if (investmentFlow.investmentType === EInvestmentType.ICBMnEuro &&
      euroValue.comparedTo(selectLockedEuroTokenBalance(state.wallet)) > 0
    ) {
        return EInvestmentErrorState.ExceedsWalletBalance;
    }

    if (investmentFlow.investmentType === EInvestmentType.ICBMEth &&
      etherValue.comparedTo(selectLockedEtherBalance(state.wallet)) > 0
    ) {
        return EInvestmentErrorState.ExceedsWalletBalance;
    }

    if (euroValue.comparedTo(ticketSizes.minTicketEurUlps) < 0) {
      return EInvestmentErrorState.BelowMinimumTicketSize;
    }

    if (euroValue.comparedTo(ticketSizes.maxTicketEurUlps) > 0) {
      return EInvestmentErrorState.AboveMaximumTicketSize;
    }

    if (contribs.maxCapExceeded) {
      return EInvestmentErrorState.ExceedsTokenAmount;
    }

    return;
  }
}
//TODO move debounce, input validation etc to the component
function* validateAndCalculateInputs({ contractsService }: TGlobalDependencies): any {
  // debounce validation
  yield delay(300);

  let state: IAppState = yield select();
  const eto = state.investmentFlow.etoId && selectPublicEtoById(state, state.investmentFlow.etoId);
  const value = selectInvestmentEurValueUlps(state); //bn
  if (value && eto) {
    const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(eto.etoId);
    if (etoContract) {
      const isICBM = selectIsICBMInvestment(state);
      const contribution:calculatedContributionInterfaces.IBlCalculatedContribution =
        yield neuCall(loadComputedContributionFromContract, eto, value, isICBM);

      yield put(actions.investorEtoTicket.setCalculatedContribution(eto.etoId,
        convert(contribution, calculatedContributionInterfaces.blToStateConversionSpec)
      ));

      state = yield select();

      const error = yield calculateInvestmentError(state);
      if(error){
        yield put(actions.investmentFlow.setErrorState(error))
      }

      // validate and set transaction if not on bank transfer
      if (state.investmentFlow.investmentType !== EInvestmentType.BankTransfer) {
        const txData: txInterfaces.IBlTxData = yield neuCall(
          txValidateSaga,
          actions.txValidator.txSenderValidateDraft({ type: ETxSenderType.INVEST }),
        );
        yield put(actions.txSender.setTransactionData(convert(txData, txInterfaces.stateToBlConversionSpec)));
      }

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
  yield put(actions.investorEtoTicket.loadEtoInvestorTicket(
    convert(selectPublicEtoById(state, etoId), publicEtoDataInterfaces.blToApiConversionSpec)
  ));

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
  if(etoId){
    const eto = etoId && selectEtoWithCompanyAndContractById(state, etoId);//null
    const etoState = etoId && selectEtoOnChainStateById(state, etoId);//null

    let activeTypes: EInvestmentType[] = [
      EInvestmentType.InvestmentWallet,
      EInvestmentType.BankTransfer,
    ];

    // no public bank transfer 3 days before eto end
    const etoEndDate = eto && eto.contract && eto.contract.startOfStates[EETOStateOnChain.Signing];
    if (
      etoState === EETOStateOnChain.Public &&
      etoEndDate &&
      isLessThanNHours(new Date(), etoEndDate, HOURS_TO_DISABLE_BANK_TRANSFER) //FIXME this is not UTC
    ) {
      activeTypes.splice(1); // remove bank transfer
    }

    // no whitelist bank transfer 3 days before public eto
    const etoEndWhitelistDate =
      eto && eto.contract && eto.contract.startOfStates[EETOStateOnChain.Public];
    if (
      etoState === EETOStateOnChain.Whitelist &&
      etoEndWhitelistDate &&
      isLessThanNHours(new Date(), etoEndWhitelistDate, HOURS_TO_DISABLE_BANK_TRANSFER) //FIXME this is not UTC
    ) {
      activeTypes.splice(1); // remove bank transfer
    }

    // no regular investment if not whitelisted in pre eto
    if (etoState === EETOStateOnChain.Whitelist && !selectIsWhitelisted(state, etoId)) {
      activeTypes = [];
    }

    // only ICBM investment if balance available
    if (compareBigNumbers(selectLockedEuroTokenBalance(state.wallet), 0) > 0) {
      activeTypes.unshift(EInvestmentType.ICBMnEuro);
    }
    if (compareBigNumbers(selectLockedEtherBalance(state.wallet), 0) > 0) {
      activeTypes.unshift(EInvestmentType.ICBMEth);
    }

    yield put(actions.investmentFlow.setActiveInvestmentTypes(activeTypes));

    // guarantee that current type is inside active types.
    const currentType = selectInvestmentType(state);
    if (currentType && !activeTypes.includes(currentType)) {
      yield put(actions.investmentFlow.selectInvestmentType(activeTypes[0]));
    }
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

function* showBankTransferDetails(): any {
  const state: IStateInvestmentFlow = yield select((s: IAppState) => s.investmentFlow);
  if (state.investmentType !== EInvestmentType.BankTransfer) return;
  yield put(actions.investmentFlow.setBankTransferFlowState(EBankTransferFlowState.Details));
  yield put(actions.txSender.txSenderHideModal());
}

function* showBankTransferSummary(): any {
  const state: IStateInvestmentFlow = yield select((s: IAppState) => s.investmentFlow);
  if (state.investmentType !== EInvestmentType.BankTransfer) return;
  yield put(actions.investmentFlow.setBankTransferFlowState(EBankTransferFlowState.Summary));
  yield put(actions.txSender.txSenderHideModal());
}

function* bankTransferChange(action: TAction): any {
  if (action.type !== "INVESTMENT_FLOW_BANK_TRANSFER_CHANGE") return;
  yield put(actions.txSender.txSenderChange(action.payload.type));
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
