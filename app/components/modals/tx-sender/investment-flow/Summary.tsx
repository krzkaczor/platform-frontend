import BigNumber from "bignumber.js";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Container, Row } from "reactstrap";
import { compose, setDisplayName } from "recompose";

import { getShareAndTokenPrice } from "../../../../lib/api/eto/EtoUtils";
import { actions } from "../../../../modules/actions";
import {
  selectInvestmentEthValueUlps,
  selectInvestmentEtoId,
  selectInvestmentEurValueUlps,
  selectIsICBMInvestment,
} from "../../../../modules/investment-flow/selectors";
import {
  selectEquityTokenCountByEtoId,
  selectNeuRewardUlpsByEtoId,
} from "../../../../modules/investor-portfolio/selectors";
import { selectEtoWithCompanyAndContractById } from "../../../../modules/public-etos/selectors";
import { selectEtherPriceEur } from "../../../../modules/shared/tokenPrice/selectors";
import { ETxSenderType } from "../../../../modules/tx/interfaces";
import { selectTxGasCostEthUlps } from "../../../../modules/tx/sender/selectors";
import { appConnect } from "../../../../store";
import { formatThousands } from "../../../../utils/Number.utils";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { CustomTooltip } from "../../../shared/CustomTooltip";
import { DocumentTemplateButton } from "../../../shared/DocumentLink";
import { Heading } from "../../../shared/modals/Heading";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import {
  formatEthTsd,
  formatEurTsd,
  formatSummaryTokenPrice,
  getActualTokenPriceEur,
} from "./utils";

import * as neuIcon from "../../../../assets/img/neu_icon.svg";
import * as info from "../../../../assets/img/notifications/info.svg";
import * as tokenIcon from "../../../../assets/img/token_icon.svg";
import { EEtoDocumentType } from "../../../../modules/eto-documents/interfaces";
import { IBlPublicEtoData } from "../../../../modules/eto-flow/interfaces/PublicEtoData";
import * as styles from "./Summary.module.scss";

interface IStateProps {
  companyName: string;
  eto: IBlPublicEtoData;
  investmentEur: BigNumber | null;
  investmentEth: BigNumber | null;
  gasCostEth: BigNumber | null;
  equityTokens?: BigNumber;
  estimatedReward: BigNumber | undefined;
  etherPriceEur: BigNumber | null;
  isIcbm?: boolean;
}

type IDispatchProps = {
  onAccept: () => any;
  onChange: () => any;
  downloadAgreement: (etoId: string) => void;
};

type IProps = IStateProps & IDispatchProps;

const NeuRewardCaption: React.FunctionComponent<{ isIcbm?: boolean }> = ({ isIcbm }) => {
  const neuMsg = <FormattedMessage id="investment-flow.summary.estimated-reward" />;
  const icbmMsg = (
    <>
      {neuMsg}
      <img className={styles.infoIcon} id="tooltip-target-neu" src={info} alt="" />
      <CustomTooltip target="tooltip-target-neu">
        <FormattedMessage id="investment-flow.message.no-icbm-neu-reward" />
      </CustomTooltip>
    </>
  );
  return isIcbm ? icbmMsg : neuMsg;
};

const InvestmentSummaryComponent: React.FunctionComponent<IProps> = ({
  onAccept,
  onChange,
  downloadAgreement,
  gasCostEth,
  etherPriceEur,
  isIcbm,
  eto,
  equityTokens,
  investmentEth,
  investmentEur,
  estimatedReward,
  companyName,
}) => {
  const equityTokensValue = (
    <span>
      {/* TODO: Change to actual custom token icon */}
      <img src={tokenIcon} alt="" /> {formatThousands(equityTokens)}
    </span>
  );
  const estimatedRewardValue = (
    <span>
      <img src={neuIcon} alt="" /> {formatEurTsd(estimatedReward)} NEU
    </span>
  );
  const gasCostEuro = gasCostEth && etherPriceEur && gasCostEth.mul(etherPriceEur);
  const totalCostEth = gasCostEth && investmentEth && gasCostEth.add(investmentEth);
  const totalCostEur = gasCostEuro && investmentEur && gasCostEuro.add(investmentEur);

  const investment = `€ ${formatEurTsd(investmentEur)} ≈ ${formatEthTsd(investmentEth)} ETH`;
  const total = `€ ${formatEurTsd(totalCostEur)} ≈ ${formatEthTsd(totalCostEth)} ETH`;

  const actualTokenPrice =
    investmentEur && equityTokens && getActualTokenPriceEur(investmentEur, equityTokens);

  const { tokenPrice: fullTokenPrice } = getShareAndTokenPrice(eto);
  const formattedTokenPrice = `€ ${formatSummaryTokenPrice(fullTokenPrice, actualTokenPrice)}`;

  return (
    <Container className={styles.container}>
      <Row className="mt-0">
        <Heading>
          <FormattedMessage id="investment-flow.investment-summary" />
        </Heading>
      </Row>

      <Row>
        <InfoList>
          <InfoRow
            caption={<FormattedMessage id="investment-flow.summary.company" />}
            value={companyName}
          />
          <InfoRow
            data-test-id="investment-summary-token-price"
            caption={<FormattedMessage id="investment-flow.summary.token-price" />}
            value={formattedTokenPrice}
          />
          <InfoRow
            caption={<FormattedMessage id="investment-flow.summary.eto-address" />}
            value={eto.etoId}
          />
          <InfoRow
            caption={<FormattedMessage id="investment-flow.summary.your-investment" />}
            value={investment}
            data-test-id="invest-modal-summary-your-investment"
          />
          <InfoRow
            caption={<FormattedMessage id="investment-flow.summary.transaction-cost" />}
            value={`${formatEthTsd(gasCostEth)} ETH`}
          />
          <InfoRow
            caption={<FormattedMessage id="investment-flow.summary.equity-tokens" />}
            value={equityTokensValue}
          />
          <InfoRow caption={<NeuRewardCaption isIcbm={isIcbm} />} value={estimatedRewardValue} />
          <InfoRow
            caption={<FormattedMessage id="investment-flow.summary.transaction-value" />}
            value={total}
          />
        </InfoList>
      </Row>

      <Row className="justify-content-center">
        <DocumentTemplateButton
          onClick={() => downloadAgreement(eto.etoId)}
          title={<FormattedMessage id="investment-flow.summary.download-agreement" />}
        />
      </Row>

      <Row className="justify-content-center mb-0 mt-0">
        <Button
          layout={EButtonLayout.PRIMARY}
          type="button"
          onClick={onAccept}
          data-test-id="invest-modal-summary-confirm-button"
        >
          <FormattedMessage id="investment-flow.confirm" />
        </Button>
        <Button
          layout={EButtonLayout.SECONDARY}
          type="button"
          onClick={onChange}
          data-test-id="invest-modal-summary-change-button"
        >
          <FormattedMessage id="investment-flow.change" />
        </Button>
      </Row>
    </Container>
  );
};

const InvestmentSummary = compose<IProps, {}>(
  setDisplayName("InvestmentSummary"),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => {
      const etoId = selectInvestmentEtoId(state);
      // eto and computed values are guaranteed to be present at investment summary state
      const eto = etoId ? selectEtoWithCompanyAndContractById(state, etoId) : null;
      if (eto) {
        return {
          eto,
          companyName: eto.company.name,
          investmentEth: selectInvestmentEthValueUlps(state),
          investmentEur: selectInvestmentEurValueUlps(state),
          gasCostEth: selectTxGasCostEthUlps(state),
          // tslint:disable: no-useless-cast
          equityTokens: selectEquityTokenCountByEtoId(state, etoId!),
          estimatedReward: selectNeuRewardUlpsByEtoId(state, etoId!),
          etherPriceEur: selectEtherPriceEur(state),
          isIcbm: selectIsICBMInvestment(state),
        };
      } else {
        throw new Error("bla"); //fixme
      }
    },
    dispatchToProps: d => ({
      onAccept: () => d(actions.txSender.txSenderAccept()),
      onChange: () => d(actions.txSender.txSenderChange(ETxSenderType.INVEST)),
      downloadAgreement: (etoId: string) =>
        d(
          actions.publicEtos.downloadPublicEtoTemplateByType(
            etoId,
            EEtoDocumentType.RESERVATION_AND_ACQUISITION_AGREEMENT,
          ),
        ),
    }),
  }),
)(InvestmentSummaryComponent);

export { InvestmentSummaryComponent, InvestmentSummary };
