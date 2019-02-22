import BigNumber from "bignumber.js";
import * as moment from "moment";

import { IAppState } from "../../store";
import { selectIsAccountFrozen, selectIsClaimsVerified } from "../kyc/selectors";
import { selectEtoOnChainStateById } from "../public-etos/selectors";
import { EETOStateOnChain } from "../public-etos/interfaces/interfaces";
import { EValidationState } from "../tx/sender/interfaces";
import { selectTxValidationState } from "../tx/sender/selectors";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import {EBankTransferFlowState, EInvestmentCurrency, EInvestmentErrorState, EInvestmentType} from "./interfaces";

// State Selectors

export const selectInvestmentEthValueUlps = (state: IAppState):BigNumber | null =>
  state.investmentFlow.ethValueUlps
    ? new BigNumber(state.investmentFlow.ethValueUlps)
    : null;

export const selectInvestmentEurValueUlps = (state: IAppState):BigNumber | null =>
  state.investmentFlow.euroValueUlps
    ? new BigNumber(state.investmentFlow.euroValueUlps)
    : null;

export const selectInvestmentErrorState = (state: IAppState):EInvestmentErrorState | undefined => state.investmentFlow.errorState;

export const selectInvestmentType = (state: IAppState):EInvestmentType  | undefined => state.investmentFlow.investmentType;

export const selectInvestmentEtoId = (state: IAppState):string | null => state.investmentFlow.etoId;

export const selectIsInvestmentInputValidated = (state: IAppState):boolean =>
  state.investmentFlow.isValidatedInput;

export const selectInvestmentActiveTypes = (state: IAppState):ReadonlyArray<EInvestmentType> =>
  state.investmentFlow.activeInvestmentTypes;

export const selectBankTransferFlowState = (state: IAppState): EBankTransferFlowState | undefined =>
  state.investmentFlow.bankTransferFlowState;

export const selectIsBankTransferGasStipend = (state: IAppState): boolean =>
  !!state.investmentFlow.bankTransferGasStipend;

// Derived Values

export const selectIsICBMInvestment = (state: IAppState):boolean => {
  const type = selectInvestmentType(state);
  return type === EInvestmentType.ICBMEth || type === EInvestmentType.ICBMnEuro;
};

export const selectIsReadyToInvest = (state: IAppState):boolean => {
  const ethValue = selectInvestmentEthValueUlps(state);

  return !!(
    ethValue &&
    !selectInvestmentErrorState(state) &&
    selectIsInvestmentInputValidated(state) &&
    ethValue.comparedTo(0) > 0 &&
    (type !== EInvestmentType.BankTransfer
      ? selectTxValidationState(state) === EValidationState.VALIDATION_OK
      : true)
  );
};

export const selectCurrencyByInvestmentType = (state: IAppState):EInvestmentCurrency => {
  const type = selectInvestmentType(state);
  return type === EInvestmentType.InvestmentWallet || type === EInvestmentType.ICBMEth
    ? EInvestmentCurrency.Ether
    : EInvestmentCurrency.Euro;
};

export const selectIsBankTransferModalOpened = (state: IAppState):boolean =>
  selectInvestmentType(state) === EInvestmentType.BankTransfer &&
  !!selectBankTransferFlowState(state) &&
  selectIsReadyToInvest(state);

export const selectBankTransferReferenceCode = (state: IAppState):string | null => {
  const addressHex = selectEthereumAddressWithChecksum(state);

  const reference = state.investmentFlow.bankTransferReference
    ? state.investmentFlow.bankTransferReference.toUpperCase()
    : null;
  const etoId = selectInvestmentEtoId(state);
  if(etoId && reference) {
    const date = moment().format("DD-MM-YYYY"); //FIXME this is not utc!

    let code = `Investment Amount, Reservation and Acquisition Agreement from ${date} NF ${addressHex} REF ${reference}`;
    if (selectIsBankTransferGasStipend(state)) {
      code += " G";
    }

    const etoState = selectEtoOnChainStateById(state, etoId);
    if (etoState === EETOStateOnChain.Whitelist) {
      code += " WL";
    }

    return code;
    // see https://github.com/Neufund/platform-backend/wiki/5.4.-Use-Case-EUR-T-deposit for reference
  } else {
    return null
  }
};

export const GAS_STIPEND_PRICE:BigNumber = new BigNumber(10);

export const selectBankTransferAmount = (state: IAppState):BigNumber | null => {
  const eur = selectInvestmentEurValueUlps(state);
  if(eur) {
    return selectIsBankTransferGasStipend(state) ? GAS_STIPEND_PRICE.add(eur) : eur;
  } else {
    return null
  }
};

export const selectIsAllowedToInvest = (state: IAppState):boolean =>
  selectIsClaimsVerified(state) && !selectIsAccountFrozen(state);
