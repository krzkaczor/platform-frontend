import BigNumber from "bignumber.js";
import { all, put, select } from "redux-saga/effects";

import { convert } from "../../../../../components/eto/utils";
import { ECurrency } from "../../../../../components/shared/Money";
import { TGlobalDependencies } from "../../../../../di/setupBindings";
import { invariant } from "../../../../../utils/invariant";
import { actions } from "../../../../actions";
import { selectIsVerifiedInvestor } from "../../../../auth/selectors";
import { selectStandardGasPriceWithOverHead } from "../../../../gas/selectors";
import * as tokenDisbursalInterfaces from "../../../../investor-portfolio/interfaces/TokenDisbursal";
import { neuCall } from "../../../../sagasUtils";
import { getTokenAddress } from "../../../../shared/sagas";
import * as web3Interfaces from "../../../../web3/interfaces";
import { selectEthereumAddressWithChecksum } from "../../../../web3/selectors";

// Use highest possible solidity uint256 to accept all disbursals for token
// see https://github.com/Neufund/platform-contracts/blob/59e88f6881bf5adbced8462f1925496467ea4c18/contracts/FeeDisbursal/FeeDisbursal.sol#L164
const ACCEPT_ALL_DISBURSALS = new BigNumber(2).pow(256).minus(1);

export function* generatePayoutAcceptSingleTokenTransaction(
  { contractsService, web3Manager }: TGlobalDependencies,
  tokenDisbursal: tokenDisbursalInterfaces.IBlTokenDisbursal,
): any {
  const userAddress = yield select(selectEthereumAddressWithChecksum);
  const gasPriceWithOverhead = yield select(selectStandardGasPriceWithOverHead);

  const { feeDisbursal } = contractsService;

  const txInput = feeDisbursal
    .acceptTx(
      yield neuCall(getTokenAddress, tokenDisbursal.currency),
      yield neuCall(getTokenAddress, ECurrency.NEU),
      ACCEPT_ALL_DISBURSALS,
    )
    .getData();

  const txInitialDetails = {
    to: feeDisbursal.address,
    from: userAddress,
    data: txInput,
    value: new BigNumber("0"),
    gasPrice: gasPriceWithOverhead,
  };

  const estimatedGasWithOverhead = yield web3Manager.estimateGasWithOverhead(txInitialDetails);

  return {
    ...txInitialDetails,
    gas: new BigNumber(estimatedGasWithOverhead),
  };
}

export function* generatePayoutAcceptMultipleTokenTransaction(
  { contractsService, web3Manager }: TGlobalDependencies,
  tokensDisbursal: ReadonlyArray<tokenDisbursalInterfaces.IBlTokenDisbursal>,
): any {
  const userAddress = yield select(selectEthereumAddressWithChecksum);
  const gasPriceWithOverhead = yield select(selectStandardGasPriceWithOverHead);

  const { feeDisbursal } = contractsService;

  const txInput = feeDisbursal
    .acceptMultipleByTokenTx(
      yield all(tokensDisbursal.map(disbursal => neuCall(getTokenAddress, disbursal.currency))),
      yield neuCall(getTokenAddress, ECurrency.NEU),
    )
    .getData();

  const txInitialDetails = {
    to: feeDisbursal.address,
    from: userAddress,
    data: txInput,
    value: new BigNumber("0"),
    gasPrice: gasPriceWithOverhead,
  };

  const estimatedGasWithOverhead = yield web3Manager.estimateGasWithOverhead(txInitialDetails);

  return {
    ...txInitialDetails,
    gas: new BigNumber(estimatedGasWithOverhead),
  };
}

export function* generatePayoutAcceptTokenTransaction(
  _: TGlobalDependencies,
  tokensDisbursals: ReadonlyArray<tokenDisbursalInterfaces.IBlTokenDisbursal>,
): any {
  const isInvestorVerified: boolean = yield select(selectIsVerifiedInvestor);

  invariant(
    isInvestorVerified,
    "Generating payout accept transactions is not allowed for unverified investor",
  );

  if (tokensDisbursals.length === 1) {
    return yield neuCall(generatePayoutAcceptSingleTokenTransaction, tokensDisbursals[0]);
  } else {
    return yield neuCall(generatePayoutAcceptMultipleTokenTransaction, tokensDisbursals);
  }
}

export function* startInvestorPayoutAcceptGenerator(
  _: TGlobalDependencies,
  tokensDisbursals: ReadonlyArray<tokenDisbursalInterfaces.IBlTokenDisbursal>,
): any {
  const generatedTxDetails: web3Interfaces.IBlTxData = yield neuCall(
    generatePayoutAcceptTokenTransaction,
    tokensDisbursals,
  );
  yield put(
    actions.txSender.setTransactionData(
      convert(generatedTxDetails, web3Interfaces.blToStateConversionSpec),
    ),
  );
  yield put(
    actions.txSender.txSenderContinueToSummary({
      txData: convert(generatedTxDetails, web3Interfaces.blToStateConversionSpec),
      additionalData: convert(tokensDisbursals, tokenDisbursalInterfaces.blToStateConversionSpec),
    }),
  );
}
