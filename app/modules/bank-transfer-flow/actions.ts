import { createActionFactory } from "../actionsUtils";
import { EBankTransferType } from "./reducer";

export const bankTransferFLowActions = {
  // public actions
  startBankTransfer: createActionFactory("BANK_TRANSFER_FLOW_START", (type: EBankTransferType) => ({
    type,
  })),
  stopBankTransfer: createActionFactory("BANK_TRANSFER_FLOW_STOP"),

  // private actions
  continueToDetails: createActionFactory(
    "BANK_TRANSFER_FLOW_CONTINUE_TO_DETAILS",
    (values: { minEuroUlps?: string; reference: string }) => values,
  ),
  continueToSummary: createActionFactory("BANK_TRANSFER_FLOW_CONTINUE_TO_SUMMARY"),

  generateBankTransferReference: createActionFactory("BANK_TRANSFER_FLOW_GENERATE_REFERENCE"),
  showBankTransferDetails: createActionFactory("BANK_TRANSFER_FLOW_DETAILS"),
  showBankTransferSummary: createActionFactory("BANK_TRANSFER_FLOW_SUMMARY"),
};
