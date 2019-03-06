import { LedgerErrorMessage } from "../../../components/translatedMessages/messages";
import { createMessage, TMessage } from "../../../components/translatedMessages/utils";
import {
  LedgerContractsDisabledError,
  LedgerLockedError,
} from "../../../lib/web3/ledger-wallet/errors";

export function mapLedgerErrorToErrorMessage(error: Error): TMessage {
  let messageType = LedgerErrorMessage.GENERIC_ERROR;

  if (error instanceof LedgerLockedError) {
    messageType = LedgerErrorMessage.LEDGER_LOCKED;
  } else if (error instanceof LedgerContractsDisabledError) {
    messageType = LedgerErrorMessage.CONTRACT_DISABLED;
  }
  return createMessage(messageType);
}
