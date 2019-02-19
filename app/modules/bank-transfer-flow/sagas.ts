import * as moment from "moment";
import { fork, put, select } from "redux-saga/effects";

import { BankTransferFlowMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../di/setupBindings";
import { cryptoRandomString } from "../../lib/dependencies/cryptoRandomString";
import { EthereumAddressWithChecksum } from "../../types";
import { invariant } from "../../utils/invariant";
import { convertToBigInt } from "../../utils/Number.utils";
import { actions } from "../actions";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import { EBankTransferType } from "./reducer";
import { selectBankTransferType, selectIsBankTransferModalOpened } from "./selectors";

/**
 * Generates reference code in the following format:
 * NF <user address> REF <bank transfer type (2 characters)><date with minutes in UTC (format DDMMYYHHmm)><4 random characters>
 * see https://github.com/Neufund/platform-backend/wiki/5.4.-Use-Case-EUR-T-deposit for reference
 */
function* generateReference(): Iterable<any> {
  const addressHex: EthereumAddressWithChecksum = yield select(selectEthereumAddressWithChecksum);
  const type: EBankTransferType = yield select(selectBankTransferType);

  invariant(type.length === 2, "Bank transfer type should be the length of 2 characters");

  const date = moment.utc().format("DDMMYYHHmm");
  const random = cryptoRandomString(4);

  const reference = `${type}${date}${random}`.toUpperCase();

  return `NF ${addressHex} REF ${reference}`;
}

function* start({ logger, notificationCenter }: TGlobalDependencies): any {
  try {
    const reference: string = yield neuCall(generateReference);

    yield put(
      actions.bankTransferFlow.continueToDetails({
        minEuroUlps: convertToBigInt(1), // TODO: will be replaced by proper contract call later
        reference: reference,
      }),
    );
  } catch (e) {
    yield put(actions.bankTransferFlow.stopBankTransfer());

    notificationCenter.error(createMessage(BankTransferFlowMessage.BANK_TRANSFER_FLOW_ERROR));

    logger.error(`Failed to start bank transfer flow`, e);
  }
}

function* stop(): any {
  const isInProgress: boolean = yield select(selectIsBankTransferModalOpened);

  if (isInProgress) {
    yield put(actions.bankTransferFlow.stopBankTransfer());
  }
}

export function* bankTransferFlowSaga(): any {
  yield fork(neuTakeEvery, actions.bankTransferFlow.startBankTransfer, start);
  yield fork(neuTakeEvery, "@@router/LOCATION_CHANGE", stop);
}
