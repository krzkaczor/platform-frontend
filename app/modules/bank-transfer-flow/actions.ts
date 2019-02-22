import { createActionFactory } from "../actionsUtils";
import { EBankTransferType } from "./reducer";

export const bankTransferFLowActions = {
  // public actions
  startBankTransfer: createActionFactory("BANK_TRANSFER_FLOW_START", (type: EBankTransferType) => ({
    type,
  })),
  stopBankTransfer: createActionFactory("BANK_TRANSFER_FLOW_STOP"),

  downloadNEurTokenAgreement: createActionFactory("BANK_TRANSFER_DOWNLOAD_TOKEN_AGREEMENT"),

  // private actions
  continueProcessing: createActionFactory("BANK_TRANSFER_FLOW_CONTINUE_PROCESSING"),

  continueToInit: createActionFactory("BANK_TRANSFER_FLOW_CONTINUE_TO_INIT"),
  continueToDetails: createActionFactory("BANK_TRANSFER_FLOW_CONTINUE_TO_DETAILS"),
  continueToSummary: createActionFactory("BANK_TRANSFER_FLOW_CONTINUE_TO_SUMMARY"),

  generateBankTransferReference: createActionFactory("BANK_TRANSFER_FLOW_GENERATE_REFERENCE"),
  showBankTransferDetails: createActionFactory("BANK_TRANSFER_FLOW_DETAILS"),
  showBankTransferSummary: createActionFactory("BANK_TRANSFER_FLOW_SUMMARY"),

  setTransferDetails: createActionFactory(
    "BANK_TRANSFER_FLOW_SET_DETAILS",
    (type: EBankTransferType, minEuroUlps: string, reference: string) => ({
      type,
      minEuroUlps,
      reference,
    }),
  ),
};
