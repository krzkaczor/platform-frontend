import { BigNumber } from "bignumber.js";
import { put, select, take } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ContractsService } from "../../../../lib/web3/ContractsService";
import { ITxData } from "../../../../lib/web3/types";
import { IAppState } from "../../../../store";
import { compareBigNumbers } from "../../../../utils/BigNumberUtils";
import { actions } from "../../../actions";
import { selectStandardGasPriceWithOverHead } from "../../../gas/selectors";
import { EInvestmentType } from "../../../investment-flow/reducer";
import {
  selectInvestmentEthValueUlps,
  selectInvestmentEtoId,
  selectInvestmentEurValueUlps,
  selectIsICBMInvestment,
} from "../../../investment-flow/selectors";
import {
  selectEquityTokenCountByEtoId,
  selectNeuRewardUlpsByEtoId,
} from "../../../investor-portfolio/selectors";
import {
  selectEtoWithCompanyAndContractById,
  selectPublicEtoById,
} from "../../../public-etos/selectors";
import { TEtoWithCompanyAndContract } from "../../../public-etos/types";
import { selectEtherPriceEur } from "../../../shared/tokenPrice/selectors";
import { selectEtherTokenBalance } from "../../../wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";
import { selectTxGasCostEthUlps } from "../../sender/selectors";
import { calculateGasLimitWithOverhead } from "../../utils";
import { TInvestmentAdditionalData } from "./types";

export const INVESTMENT_GAS_AMOUNT = "600000";

const createInvestmentTxData = (
  state: IAppState,
  txData: string,
  contractAddress: string,
  value = "0",
) => ({
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
) => {
  const txData = contractsService.etherLock
    .transferTx(etoId, new BigNumber(state.investmentFlow.ethValueUlps || "0"), [""])
    .getData();
  return createInvestmentTxData(state, txData, contractsService.etherLock.address);
};

const getEuroLockTransaction = (
  state: IAppState,
  contractsService: ContractsService,
  etoId: string,
) => {
  const txData = contractsService.euroLock
    .transferTx(etoId, new BigNumber(state.investmentFlow.euroValueUlps || "0"), [""])
    .getData();
  return createInvestmentTxData(state, txData, contractsService.euroLock.address);
};

const getEuroTokenTransaction = (
  state: IAppState,
  contractsService: ContractsService,
  etoId: string,
) => {
  const euroValueUlps = state.investmentFlow.euroValueUlps || "0";

  const txData = contractsService.euroToken
    .transferTx(etoId, new BigNumber(euroValueUlps))
    .getData();
  return createInvestmentTxData(state, txData, contractsService.euroToken.address);
};

function getEtherTokenTransaction(
  state: IAppState,
  contractsService: ContractsService,
  etoId: string,
): ITxData {
  const etherTokenBalance = selectEtherTokenBalance(state);
  const etherValue = state.investmentFlow.ethValueUlps || "0";

  if (!etherTokenBalance) {
    throw new Error("No ether Token Balance");
  }

  if (compareBigNumbers(etherTokenBalance, etherValue) >= 0) {
    // transaction can be fully covered by etherTokens

    // rawWeb3Contract is called directly due to the need for calling the 3 args version of transfer method.
    // See the abi in the contract.
    const txInput = contractsService.etherToken.rawWeb3Contract.transfer[
      "address,uint256,bytes"
    ].getData(etoId, etherValue, "");
    return createInvestmentTxData(state, txInput, contractsService.etherToken.address);
  } else {
    // fill up etherToken with ether from wallet
    const ethVal = new BigNumber(etherValue);
    const value = ethVal.sub(etherTokenBalance);
    const txCall = contractsService.etherToken.depositAndTransferTx(etoId, ethVal, [""]).getData();

    return createInvestmentTxData(
      state,
      txCall,
      contractsService.etherToken.address,
      value.toString(),
    );
  }
}

export function* generateInvestmentTransaction({ contractsService }: TGlobalDependencies): any {
  const state: IAppState = yield select();
  const investmentState = state.investmentFlow;
  const eto = selectPublicEtoById(state, investmentState.etoId)!;

  switch (investmentState.investmentType) {
    case EInvestmentType.Eth:
      return yield getEtherTokenTransaction(state, contractsService, eto.etoId);
    case EInvestmentType.NEur:
      return yield getEuroTokenTransaction(state, contractsService, eto.etoId);
    case EInvestmentType.ICBMEth:
      return yield getEtherLockTransaction(state, contractsService, eto.etoId);
    case EInvestmentType.ICBMnEuro:
      return yield getEuroLockTransaction(state, contractsService, eto.etoId);
  }
}

export function* investmentFlowGenerator(_: TGlobalDependencies): any {
  yield take(actions.txSender.txSenderAcceptDraft);

  const etoId: string = yield select(selectInvestmentEtoId);
  const eto: TEtoWithCompanyAndContract = yield select((state: IAppState) =>
    selectEtoWithCompanyAndContractById(state, etoId),
  );

  const investmentEth: string = yield select(selectInvestmentEthValueUlps);
  const investmentEur: string = yield select(selectInvestmentEurValueUlps);
  const gasCostEth: string = yield select(selectTxGasCostEthUlps);
  const equityTokens: string = yield select((state: IAppState) =>
    selectEquityTokenCountByEtoId(state, etoId),
  );
  const estimatedReward: string = yield select((state: IAppState) =>
    selectNeuRewardUlpsByEtoId(state, etoId),
  );

  const etherPriceEur: string = yield select(selectEtherPriceEur);
  const isIcbm: boolean = yield select(selectIsICBMInvestment);

  const additionalData = {
    eto: {
      etoId,
      companyName: eto.company.name,
      existingCompanyShares: eto.existingCompanyShares,
      equityTokensPerShare: eto.equityTokensPerShare,
      preMoneyValuationEur: eto.preMoneyValuationEur,
    },
    investmentEth,
    investmentEur,
    gasCostEth,
    equityTokens,
    estimatedReward,
    etherPriceEur,
    isIcbm,
  };

  yield put(actions.txSender.txSenderContinueToSummary<TInvestmentAdditionalData>(additionalData));
}
