import { BigNumber } from "bignumber.js";
import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import MaskedInput from "react-text-mask";
import { Col, Container, FormGroup, Label, Row } from "reactstrap";
import { withHandlers, withProps } from "recompose";
import { compose } from "redux";
import { createNumberMask } from "text-mask-addons";

import { actions } from "../../../../modules/actions";
import {
  EInvestmentCurrency,
  EInvestmentErrorState,
  EInvestmentType,
} from "../../../../modules/investment-flow/reducer";
import {
  selectInvestmentErrorState,
  selectInvestmentEthValueUlps,
  selectInvestmentEtoId,
  selectInvestmentEurValueUlps,
  selectInvestmentType,
  selectIsInvestmentInputValidated,
  selectIsReadyToInvest,
} from "../../../../modules/investment-flow/selectors";
import {
  selectCalculatedEtoTicketSizesUlpsById,
  selectEquityTokenCountByEtoId,
  selectHasInvestorTicket,
  selectNeuRewardUlpsByEtoId,
} from "../../../../modules/investor-portfolio/selectors";
import { selectEtoWithCompanyAndContractById } from "../../../../modules/public-etos/selectors";
import { TEtoWithCompanyAndContract } from "../../../../modules/public-etos/types";
import {
  selectEtherPriceEur,
  selectEurPriceEther,
} from "../../../../modules/shared/tokenPrice/selectors";
import { EValidationState } from "../../../../modules/tx/sender/reducer";
import { selectTxGasCostEthUlps } from "../../../../modules/tx/sender/selectors";
import { appConnect } from "../../../../store";
import { addBigNumbers, multiplyBigNumbers } from "../../../../utils/BigNumberUtils";
import { IIntlProps, injectIntlHelpers } from "../../../../utils/injectIntlHelpers";
import { formatMoney } from "../../../../utils/Money.utils";
import { formatThousands } from "../../../../utils/Number.utils";
import { appRoutes } from "../../../appRoutes";
import { InfoAlert } from "../../../shared/Alerts";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { FormFieldRaw } from "../../../shared/forms/fields/FormFieldRaw";
import { Heading } from "../../../shared/modals/Heading";
import { ECurrency, Money } from "../../../shared/Money";
import { InvestmentTypeSelector, WalletSelectionData } from "./InvestmentTypeSelector";
import {
  createWallets,
  formatEth,
  formatEthTsd,
  formatEur,
  formatEurTsd,
  formatVaryingDecimals,
  getInputErrorMessage,
} from "./utils";

import * as styles from "./Investment.module.scss";

interface IStateProps {
  eto: TEtoWithCompanyAndContract;
  wallets: WalletSelectionData[];
  euroValue: string;
  ethValue: string;
  etherPriceEur: string;
  eurPriceEther: string;
  investmentType?: EInvestmentType;
  gasCostEth: string;
  errorState?: EInvestmentErrorState | EValidationState;
  equityTokenCount?: string;
  neuReward?: string;
  readyToInvest: boolean;
  showTokens: boolean;
  hasPreviouslyInvested?: boolean;
  etoTicketSizes?: {
    minTicketEurUlps: BigNumber;
    maxTicketEurUlps: BigNumber;
  };
}

interface IDispatchProps {
  sendTransaction: () => void;
  changeEuroValue: (value: string) => void;
  changeEthValue: (value: string) => void;
  changeInvestmentType: (type: EInvestmentType) => void;
  investEntireBalance: () => void;
}

interface IWithProps {
  gasCostEuro: string;
  minTicketEth: string;
  minTicketEur: string;
  maxTicketEur: string;
  totalCostEth: string;
  totalCostEur: string;
}

interface IHandlersProps {
  investNow: () => void;
}

type IProps = IStateProps & IDispatchProps & IIntlProps & IWithProps & IHandlersProps;

export const InvestmentSelectionComponent: React.FunctionComponent<IProps> = ({
  changeEthValue,
  changeEuroValue,
  changeInvestmentType,
  equityTokenCount,
  errorState,
  ethValue,
  eto,
  euroValue,
  gasCostEth,
  gasCostEuro,
  intl,
  investEntireBalance,
  investmentType,
  minTicketEth,
  minTicketEur,
  maxTicketEur,
  neuReward,
  readyToInvest,
  investNow,
  showTokens,
  totalCostEth,
  totalCostEur,
  wallets,
  hasPreviouslyInvested,
}) => (
  <>
    <Container className={styles.container} fluid>
      <Row className="mt-0">
        <Col>
          <Heading>
            <FormattedMessage id="investment-flow.select-wallet-and-currency" />
          </Heading>
        </Col>
      </Row>
      <Row>
        <InvestmentTypeSelector
          wallets={wallets}
          currentType={investmentType}
          onSelect={changeInvestmentType}
        />
      </Row>
      <Row>
        <Col>
          <Heading>
            <FormattedMessage id="investment-flow.calculate-investment" />
          </Heading>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            <FormattedMessage id="investment-flow.amount-to-invest" />
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormFieldRaw
            name="minTicketSizeEur"
            data-test-id="invest-modal-eur-field"
            prefix="€"
            errorMsg={getInputErrorMessage(
              errorState,
              eto.equityTokenName,
              maxTicketEur,
              minTicketEur,
            )}
            placeholder={`${intl.formatIntlMessage(
              "investment-flow.min-ticket-size",
            )} ${minTicketEur} €`}
            value={formatVaryingDecimals(euroValue)}
            className={cn("form-control", styles.investInput)}
            renderInput={props => (
              <MaskedInput
                {...props}
                mask={createNumberMask({
                  prefix: "",
                  thousandsSeparatorSymbol: " ",
                  allowDecimal: true,
                  decimalLimit: 2,
                  integerLimit: 20,
                })}
                onChange={e => changeEuroValue(e.target.value)}
              />
            )}
          />
        </Col>
        <Col sm="1">
          <div className={styles.equals}>≈</div>
        </Col>
        <Col>
          <FormFieldRaw
            name="minTicketSizeEth"
            data-test-id="invest-modal-eth-field"
            prefix="ETH"
            placeholder={`${intl.formatIntlMessage(
              "investment-flow.min-ticket-size",
            )} ${formatMoney(minTicketEth, 0, 4)} ETH`}
            value={formatVaryingDecimals(ethValue)}
            className={cn("form-control", styles.investInput)}
            renderInput={props => (
              <MaskedInput
                {...props}
                mask={createNumberMask({
                  prefix: "",
                  thousandsSeparatorSymbol: " ",
                  allowDecimal: true,
                  decimalLimit: 4,
                  integerLimit: 15, // integer limit due to weird behavior on large inputs
                })}
                onChange={e => changeEthValue(e.target.value)}
              />
            )}
          />
          <a
            className={styles.investAll}
            data-test-id="invest-modal-full-balance-btn"
            href="#"
            onClick={e => {
              e.preventDefault();
              investEntireBalance();
            }}
          >
            <FormattedMessage id="investment-flow.invest-entire-balance" />
          </a>
        </Col>
      </Row>
    </Container>
    <section className={styles.green}>
      <Container className={styles.container} fluid>
        <Row>
          <Col>
            <p className="mb-0">
              <FormattedMessage id="investment-flow.you-will-receive" />
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label>
                <FormattedMessage id="investment-flow.equity-tokens" />
              </Label>
              <InfoAlert>
                {(showTokens &&
                  equityTokenCount &&
                  `${formatThousands(equityTokenCount.toString())} ${eto.equityTokenSymbol}`) ||
                  "\xA0" /* non breaking space*/}
              </InfoAlert>
            </FormGroup>
          </Col>
          <Col sm="1" />
          <Col>
            <FormGroup>
              <Label>
                <FormattedMessage id="investment-flow.estimated-neu-tokens" />
              </Label>
              <InfoAlert data-test-id="invest-modal.est-neu-tokens">
                {(showTokens &&
                  neuReward && <Money value={neuReward} currency={ECurrency.NEU} />) ||
                  "\xA0"}
              </InfoAlert>
            </FormGroup>
          </Col>
        </Row>
        {hasPreviouslyInvested && (
          <Row>
            <Col>
              <p className="mb-0 mt-0">
                <FormattedMessage id="investment-flow.you-already-invested" />
                <br />
                <Link to={appRoutes.portfolio}>
                  <FormattedMessage id="investment-flow.see-your-portfolio-for-details" />
                </Link>
              </p>
            </Col>
          </Row>
        )}
      </Container>
    </section>
    <Container className={styles.container} fluid>
      <Row>
        <Col className={styles.summary}>
          {gasCostEth &&
            gasCostEth !== "0" && (
              <div>
                + <FormattedMessage id="investment-flow.estimated-gas-cost" />:{" "}
                <span className={styles.orange} data-test-id="invest-modal-gas-cost">
                  {formatEur(gasCostEuro)} € ≈ ETH {formatEth(gasCostEth)}
                </span>
              </div>
            )}
          <div>
            <FormattedMessage id="investment-flow.total" />:{" "}
            <span className={styles.orange} data-test-id="invest-modal-total-cost">
              {formatEurTsd(totalCostEur)} € ≈ ETH {formatEthTsd(totalCostEth)}
            </span>
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center mb-0">
        <Button
          onClick={investNow}
          layout={EButtonLayout.PRIMARY}
          type="submit"
          disabled={!readyToInvest}
          data-test-id="invest-modal-invest-now-button"
        >
          <FormattedMessage id="investment-flow.invest-now" />
        </Button>
      </Row>
    </Container>
  </>
);

export const InvestmentSelection: React.FunctionComponent = compose<any>(
  injectIntlHelpers,
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => {
      const etoId = selectInvestmentEtoId(state);
      const eto = selectEtoWithCompanyAndContractById(state, etoId)!;
      const eur = selectInvestmentEurValueUlps(state);
      return {
        eto,
        etherPriceEur: selectEtherPriceEur(state),
        eurPriceEther: selectEurPriceEther(state),
        euroValue: eur,
        ethValue: selectInvestmentEthValueUlps(state),
        errorState: selectInvestmentErrorState(state),
        gasCostEth: selectTxGasCostEthUlps(state),
        investmentType: selectInvestmentType(state),
        wallets: createWallets(state),
        neuReward: selectNeuRewardUlpsByEtoId(state, etoId),
        equityTokenCount: selectEquityTokenCountByEtoId(state, etoId),
        showTokens: !!(eur && selectIsInvestmentInputValidated(state)),
        readyToInvest: selectIsReadyToInvest(state),
        etoTicketSizes: selectCalculatedEtoTicketSizesUlpsById(state, etoId),
        hasPreviouslyInvested: selectHasInvestorTicket(state, etoId),
      };
    },
    dispatchToProps: dispatch => ({
      sendTransaction: () => dispatch(actions.txSender.txSenderAcceptDraft()),
      changeEthValue: value =>
        dispatch(actions.investmentFlow.submitCurrencyValue(value, EInvestmentCurrency.Ether)),
      changeEuroValue: value =>
        dispatch(actions.investmentFlow.submitCurrencyValue(value, EInvestmentCurrency.Euro)),
      changeInvestmentType: (type: EInvestmentType) =>
        dispatch(actions.investmentFlow.selectInvestmentType(type)),
      investEntireBalance: () => dispatch(actions.investmentFlow.investEntireBalance()),
    }),
  }),
  withProps<IWithProps, IStateProps>(
    ({ ethValue, etoTicketSizes, gasCostEth, euroValue, etherPriceEur, eurPriceEther }) => {
      const gasCostEther = !ethValue ? "0" : gasCostEth;
      const gasCostEuro = multiplyBigNumbers([gasCostEther, etherPriceEur]);
      const minTicketEur = formatEur(etoTicketSizes && etoTicketSizes.minTicketEurUlps) || "0";
      const maxTicketEur = formatEur(etoTicketSizes && etoTicketSizes.maxTicketEurUlps) || "0";
      return {
        minTicketEur,
        maxTicketEur,
        minTicketEth: multiplyBigNumbers([minTicketEur, eurPriceEther]),
        gasCostEuro,
        gasCostEth: gasCostEther,
        totalCostEth: addBigNumbers([gasCostEther, ethValue || "0"]),
        totalCostEur: addBigNumbers([gasCostEuro, euroValue || "0"]),
      };
    },
  ),
  withHandlers<IStateProps & IDispatchProps & IWithProps, IHandlersProps>({
    investNow: ({ sendTransaction }) => () => {
      sendTransaction();
    },
  }),
)(InvestmentSelectionComponent);
