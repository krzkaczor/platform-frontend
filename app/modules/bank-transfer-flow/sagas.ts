import BigNumber from "bignumber.js";
import * as moment from "moment";
import { all, fork, put, select, take } from "redux-saga/effects";

import { BankTransferFlowMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../di/setupBindings";
import { cryptoRandomString } from "../../lib/dependencies/cryptoRandomString";
import { EthereumAddressWithChecksum } from "../../types";
import { invariant } from "../../utils/invariant";
import { actions, TActionFromCreator } from "../actions";
import { selectIsUserFullyVerified } from "../auth/selectors";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import { EBankTransferType } from "./reducer";
import {
  selectBankTransferFlowReference,
  selectIsBankAccountVerified,
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

function* start(
  { logger, notificationCenter, contractsService }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.bankTransferFlow.startBankTransfer>,
): any {
  try {
    const isAllowed: boolean = yield select(selectIsUserFullyVerified);

    invariant(isAllowed, "Bank Flow is not allowed, account is not verified completely");

    const transferType = action.payload.type;

    const reference: string = yield neuCall(generateReference, transferType);

    const minEuroUlps: BigNumber = yield contractsService.euroTokenController
      .minDepositAmountEurUlps;

    yield put(
      actions.bankTransferFlow.setTransferDetails(transferType, minEuroUlps.toString(), reference),
    );

    const isVerified: boolean = yield select(selectIsBankAccountVerified);

    // Only show agreement when bank account was not yet verified
    if (!isVerified) {
      yield put(actions.bankTransferFlow.continueToAgreement());
      yield take(actions.bankTransferFlow.continueProcessing);
    }

    yield put(actions.bankTransferFlow.continueToSummary());
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

export function* getRedeemData({ contractsService }: TGlobalDependencies): any {
  const { bankFeeUlps, minEuroUlps } = yield all({
    bankFeeUlps: contractsService.euroTokenController.withdrawalFeeFraction,
    minEuroUlps: contractsService.euroTokenController.minWithdrawAmountEurUlps,
  });

  yield put(actions.bankTransferFlow.setRedeemData(bankFeeUlps, minEuroUlps));
}

export function* completeBankTransfer({ apiKycService, logger }: TGlobalDependencies): any {
  try {
    const reference: string = yield select(selectBankTransferFlowReference);

    // TODO: replace by correct amount when implemented
    apiKycService.nEurPurchaseRequest("1", reference);
  } catch (e) {
    logger.error(`Not able to complete bank transfer`, e);
  }
}

export function* bankTransferFlowSaga(): any {
  yield fork(neuTakeEvery, actions.bankTransferFlow.startBankTransfer, start);
  yield fork(neuTakeEvery, actions.bankTransferFlow.continueToSuccess, completeBankTransfer);
  yield fork(
    neuTakeEvery,
    actions.bankTransferFlow.downloadNEurTokenAgreement,
    downloadNEurTokenAgreement,
  );
  yield fork(neuTakeEvery, "@@router/LOCATION_CHANGE", stop);
  yield fork(neuTakeEvery, actions.bankTransferFlow.getRedeemData, getRedeemData);
}
