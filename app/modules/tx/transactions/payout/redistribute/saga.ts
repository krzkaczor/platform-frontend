import BigNumber from "bignumber.js";
import { put, select, take } from "redux-saga/effects";

import {convert} from "../../../../../components/eto/utils";
import { ECurrency } from "../../../../../components/shared/Money";
import { TGlobalDependencies } from "../../../../../di/setupBindings";
import { invariant } from "../../../../../utils/invariant";
import { actions } from "../../../../actions";
import { selectIsVerifiedInvestor } from "../../../../auth/selectors";
import { selectStandardGasPriceWithOverHead } from "../../../../gas/selectors";
import * as tokenDisbursalInterfaces  from "../../../../investor-portfolio/interfaces/TokenDisbursal";
import { neuCall } from "../../../../sagasUtils";
import { getTokenAddress } from "../../../../shared/sagas";
import * as web3Interfaces  from "../../../../web3/interfaces";
import { selectEthereumAddressWithChecksum } from "../../../../web3/selectors";

// Use highest possible solidity uint256 to redistribute all disbursals for token
// see https://github.com/Neufund/platform-contracts/blob/59e88f6881bf5adbced8462f1925496467ea4c18/contracts/FeeDisbursal/FeeDisbursal.sol#L164
const REDISTRIBUTE_ALL_DISBURSALS = new BigNumber(2).pow(256).minus(1);

export function* generatePayoutRedistributeTransaction(
  { contractsService, web3Manager }: TGlobalDependencies,
  tokenDisbursal: tokenDisbursalInterfaces.IBlTokenDisbursal,
): any {
  const isInvestorVerified: boolean = yield select(selectIsVerifiedInvestor);

  invariant(
    isInvestorVerified,
    "Generating payout redistribution transactions is not allowed for unverified investor",
  );

  const userAddress = yield select(selectEthereumAddressWithChecksum);
  const gasPriceWithOverhead = yield select(selectStandardGasPriceWithOverHead);

  const { feeDisbursal } = contractsService;

  const txInput = feeDisbursal
    .rejectTx(
      yield neuCall(getTokenAddress, tokenDisbursal.currency),
      yield neuCall(getTokenAddress, ECurrency.NEU),
      REDISTRIBUTE_ALL_DISBURSALS,
    )
    .getData();

  const txInitialDetails = {
    to: feeDisbursal.address,
    from: userAddress,
    data: txInput,
    value: "0",
    gasPrice: gasPriceWithOverhead,
  };

  const estimatedGasWithOverhead = yield web3Manager.estimateGasWithOverhead(txInitialDetails);

  return {
    ...txInitialDetails,
    gas: estimatedGasWithOverhead,
  };
}

export function* startInvestorPayoutRedistributionGenerator(
  _: TGlobalDependencies,
  tokenDisbursals: tokenDisbursalInterfaces.IBlTokenDisbursal,
): any {
  // Wait for redistribute confirmation
  yield take(actions.txSender.txSenderAcceptDraft);

  const generatedTxDetails: web3Interfaces.IBlTxData = yield neuCall(
    generatePayoutRedistributeTransaction,
    tokenDisbursals,
  );
  yield put(actions.txSender.setTransactionData(convert(generatedTxDetails, web3Interfaces.blToStateConversionSpec)));
  yield put(
    actions.txSender.txSenderContinueToSummary({
      txData: convert(generatedTxDetails, web3Interfaces.blToStateConversionSpec),
      additionalData: convert(tokenDisbursals, tokenDisbursalInterfaces.blToStateConversionSpec),
    }),
  );
}
