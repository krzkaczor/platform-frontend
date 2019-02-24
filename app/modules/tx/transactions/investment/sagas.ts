import { BigNumber } from "bignumber.js";
import { put, select, take } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ContractsService } from "../../../../lib/web3/ContractsService";
import { IBlTxData } from "../../../../modules/web3/interfaces";
import { IAppState } from "../../../../store";
import { actions } from "../../../actions";
import { selectStandardGasPriceWithOverHead } from "../../../gas/selectors";
import { EInvestmentType } from "../../../investment-flow/interfaces";
import { selectPublicEtoById } from "../../../public-etos/selectors";
import { selectEtherTokenBalance } from "../../../wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";
import { calculateGasLimitWithOverhead } from "../../utils";

export const INVESTMENT_GAS_AMOUNT = new BigNumber("600000");

const createInvestmentTxData = (
  state: IAppState,
  txData: string,
  contractAddress: string,
  value = new BigNumber("0"),
): IBlTxData => ({
  to: contractAddress,
  from: selectEthereumAddressWithChecksum(state),
  data: txData,
  value: value,
  gasPrice: selectStandardGasPriceWithOverHead(state),
  gas: calculateGasLimitWithOverhead(INVESTMENT_GAS_AMOUNT),
});

const getEtherLockTransaction = (
  state: IAppState,
  contractsService: ContractsService,
  etoId: string,
): IBlTxData => {
  const txData = contractsService.etherLock
    .transferTx(etoId, new BigNumber(state.investmentFlow.ethValueUlps || "0"), [""])
    .getData();
  return createInvestmentTxData(state, txData, contractsService.etherLock.address);
};

const getEuroLockTransaction = (
  state: IAppState,
  contractsService: ContractsService,
  etoId: string,
): IBlTxData => {
  const txData = contractsService.euroLock
    .transferTx(etoId, new BigNumber(state.investmentFlow.euroValueUlps || "0"), [""])
    .getData();
  return createInvestmentTxData(state, txData, contractsService.euroLock.address);
};

function getEtherTokenTransaction(
  state: IAppState,
  contractsService: ContractsService,
  etoId: string,
): IBlTxData {
  const etherTokenBalance = selectEtherTokenBalance(state);
  const etherValue = new BigNumber(state.investmentFlow.ethValueUlps || "0");

  if (!etherTokenBalance) {
    throw new Error("No ether Token Balance");
  }

  if (etherTokenBalance.comparedTo(etherValue) >= 0) {
    // transaction can be fully covered by etherTokens

    // rawWeb3Contract is called directly due to the need for calling the 3 args version of transfer method.
    // See the abi in the contract.
    const txInput = contractsService.etherToken.rawWeb3Contract.transfer[
      "address,uint256,bytes"
    ].getData(etoId, etherValue, "");
    return createInvestmentTxData(state, txInput, contractsService.etherToken.address);
  } else {
    // fill up etherToken with ether from wallet
    const txCall = contractsService.etherToken
      .depositAndTransferTx(etoId, etherValue, [""])
      .getData();

    return createInvestmentTxData(
      state,
      txCall,
      contractsService.etherToken.address,
      etherValue.sub(etherTokenBalance),
    );
  }
}

export function* generateInvestmentTransaction({ contractsService }: TGlobalDependencies): any {
  const state: IAppState = yield select();
  const investmentState = state.investmentFlow;
  const eto = investmentState.etoId && selectPublicEtoById(state, investmentState.etoId);

  if (eto) {
    switch (investmentState.investmentType) {
      case EInvestmentType.InvestmentWallet:
        return yield getEtherTokenTransaction(state, contractsService, eto.etoId);
      case EInvestmentType.ICBMEth:
        return yield getEtherLockTransaction(state, contractsService, eto.etoId);
      case EInvestmentType.ICBMnEuro:
        return yield getEuroLockTransaction(state, contractsService, eto.etoId);
    }
  }
}

export function* investmentFlowGenerator(_: TGlobalDependencies): any {
  yield take(actions.txSender.txSenderAcceptDraft);

  yield put(actions.txSender.txSenderContinueToSummary());
}
