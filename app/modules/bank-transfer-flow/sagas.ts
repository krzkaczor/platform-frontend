import BigNumber from "bignumber.js";
import * as moment from "moment";
import { fork, put, select, take } from "redux-saga/effects";

import { BankTransferFlowMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../di/setupBindings";
import { cryptoRandomString } from "../../lib/dependencies/cryptoRandomString";
import { EthereumAddressWithChecksum } from "../../types";
import { invariant } from "../../utils/invariant";
import { actions, TActionFromCreator } from "../actions";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import { EBankTransferType } from "./reducer";
import {
  selectIsBankAccountVerified,
  selectIsBankFlowEnabled,
  selectIsBankTransferModalOpened,
} from "./selectors";

/**
 * Generates reference code in the following format:
 * NF <user address> REF <bank transfer type (2 characters)><date with minutes in UTC (format DDMMYYHHmm)><4 random characters>
 * see https://github.com/Neufund/platform-backend/wiki/5.4.-Use-Case-EUR-T-deposit for reference
 */
function* generateReference(_: TGlobalDependencies, type: EBankTransferType): Iterable<any> {
  invariant(type.length === 2, "Bank transfer type should be the length of 2 characters");

  const addressHex: EthereumAddressWithChecksum = yield select(selectEthereumAddressWithChecksum);

  const date = moment.utc().format("DDMMYYHHmm");
  const random = cryptoRandomString(4);

  const reference = `${type}${date}${random}`.toUpperCase();

  return `NF ${addressHex} REF ${reference}`;
}

function* startVerification({ contractsService }: TGlobalDependencies): any {
  const reference: string = yield neuCall(generateReference, EBankTransferType.VERIFY);

  const minEuroUlps: BigNumber = yield contractsService.euroTokenController.minDepositAmountEurUlps;

  yield put(
    actions.bankTransferFlow.setTransferDetails(
      EBankTransferType.VERIFY,
      minEuroUlps.toString(),
      reference,
    ),
  );

  yield put(actions.bankTransferFlow.continueToInit());

  yield take(actions.bankTransferFlow.continueProcessing);

  yield put(actions.bankTransferFlow.continueToDetails());
}

function* startPurchase({ contractsService }: TGlobalDependencies): any {
  const reference: string = yield neuCall(generateReference, EBankTransferType.PURCHASE);

  const minEuroUlps: BigNumber = yield contractsService.euroTokenController.minDepositAmountEurUlps;

  yield put(
    actions.bankTransferFlow.setTransferDetails(
      EBankTransferType.PURCHASE,
      minEuroUlps.toString(),
      reference,
    ),
  );

  yield put(actions.bankTransferFlow.continueToDetails());
}

function* start(
  { logger, notificationCenter }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.bankTransferFlow.startBankTransfer>,
): any {
  try {
    const isAllowed: boolean = yield select(selectIsBankFlowEnabled);

    invariant(isAllowed, "Bank Flow is not allowed, account is not verified completely");

    const isVerified: boolean = yield select(selectIsBankAccountVerified);

    if (action.payload.type !== EBankTransferType.VERIFY && !isVerified) {
      yield neuCall(startVerification);
    } else {
      switch (action.payload.type) {
        case EBankTransferType.PURCHASE:
          yield neuCall(startPurchase);
          break;
        case EBankTransferType.VERIFY:
          yield neuCall(startVerification);
          break;
      }
    }
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

function* downloadNEurTokenAgreement({ contractsService, intlWrapper }: TGlobalDependencies): any {
  const [, , agreementHashWithIpfs] = yield contractsService.euroToken.currentAgreement();

  const agreementHash = agreementHashWithIpfs.replace("ipfs:", "");

  yield put(
    actions.immutableStorage.downloadImmutableFile(
      {
        ipfsHash: agreementHash,
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        asPdf: true,
      },
      intlWrapper.intl.formatIntlMessage(
        "bank-verification.info.download-neur-token-agreement.file-name",
      ),
    ),
  );
}

export function* bankTransferFlowSaga(): any {
  yield fork(neuTakeEvery, actions.bankTransferFlow.startBankTransfer, start);
  yield fork(
    neuTakeEvery,
    actions.bankTransferFlow.downloadNEurTokenAgreement,
    downloadNEurTokenAgreement,
  );
  yield fork(neuTakeEvery, "@@router/LOCATION_CHANGE", stop);
}
