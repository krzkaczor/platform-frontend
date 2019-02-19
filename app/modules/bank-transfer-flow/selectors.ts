import { createSelector } from "reselect";

import { IAppState } from "../../store";
import { EBankTransferFlowState } from "./reducer";

export const selectBankTransferFlow = (state: IAppState) => state.bankTransferFLow;

export const selectBankTransferFlowState = createSelector(
  selectBankTransferFlow,
  bankTransferFlow => bankTransferFlow.state,
);

export const selectIsBankTransferModalOpened = createSelector(
  selectBankTransferFlowState,
  state => state !== EBankTransferFlowState.UNINITIALIZED,
);

export const selectBankTransferFlowReference = createSelector(
  selectBankTransferFlow,
  bankTransferFlow => bankTransferFlow.reference,
);

export const selectBankTransferType = createSelector(
  selectBankTransferFlow,
  bankTransferFlow => bankTransferFlow.type,
);

export const selectBankTransferMinAmount = createSelector(
  selectBankTransferFlow,
  bankTransferFlow => bankTransferFlow.minEuroUlps,
);
