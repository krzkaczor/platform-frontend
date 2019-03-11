import { createAction } from "../../actionsUtils";
import { EValidationState } from "../sender/reducer";
import { IDraftType } from "../types";

export const txValidatorActions = {
  txSenderValidateDraft: (txDraft: IDraftType) => createAction("TX_SENDER_VALIDATE_DRAFT", txDraft),
  setValidationState: (validationState?: EValidationState) =>
    createAction("TX_SENDER_SET_VALIDATION_STATE", { validationState }),
};
