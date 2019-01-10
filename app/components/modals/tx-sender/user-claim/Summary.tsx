import { map } from "lodash/fp";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";

import {
  EEtoDocumentType,
  IEtoDocument,
  immutableDocumentName,
} from "../../../../lib/api/eto/EtoFileApi.interfaces";
import { ImmutableFileId } from "../../../../lib/api/ImmutableStorage.interfaces";
import { actions } from "../../../../modules/actions";
import { selectMyInvestorTicketByEtoId } from "../../../../modules/investor-tickets/selectors";
import {
  selectTxGasCostEthUlps,
  selectTxSummaryAdditionalData,
  selectTxSummaryData,
} from "../../../../modules/tx/sender/selectors";
import { appConnect } from "../../../../store";
import { getDocumentTitles } from "../../../documents/utils";
import { ButtonIcon } from "../../../shared/buttons/Button";
import { DocumentTemplateLabel } from "../../../shared/DocumentLink";
import { Heading } from "../../../shared/modals/Heading";
import { ECurrency, ECurrencySymbol, Money } from "../../../shared/Money";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { ITxSummaryDispatchProps, ITxSummaryStateProps, TSummaryComponentProps } from "../TxSender";
import { SummaryForm } from "./SummaryForm";

import * as iconDownload from "../../../../assets/img/inline_icons/download.svg";
import * as styles from "./Summary.module.scss";

export const UserClaimSummaryComponent: React.SFC<TSummaryComponentProps> = ({
  etoData,
  txCost,
  onAccept,
  downloadDocument,
  generateTemplateByEtoId,
  etoId,
}) => {
  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <Heading>
            <FormattedMessage id="upgrade-flow.summary" />
          </Heading>
        </Col>
      </Row>
      <div className="mb-3">
        <FormattedMessage id="user-claim-flow.summary.explanation" />
      </div>
      <Row className="mb-2">
        <Col>
          <InfoList>
            <InfoRow
              caption={<FormattedMessage id="user-claim-flow.token-name" />}
              value={etoData!.equityTokenName}
            />

            <InfoRow
              caption={<FormattedMessage id="user-claim-flow.balance" />}
              value={etoData!.investorTicket.equityTokenInt.toString()}
            />

            <InfoRow
              caption={<FormattedMessage id="user-claim-flow.estimated-reward" />}
              value={
                <Money
                  value={etoData!.investorTicket.rewardNmkUlps.toString()}
                  currency={ECurrency.NEU}
                  currencySymbol={ECurrencySymbol.NONE}
                />
              }
            />

            <InfoRow
              caption={<FormattedMessage id="upgrade-flow.transaction-cost" />}
              value={<Money currency={ECurrency.ETH} value={txCost} />}
            />

            <>
              {/* Based on https://github.com/Neufund/platform-frontend/issues/2102#issuecomment-453086304 */}
              {map((document: IEtoDocument) => {
                return [EEtoDocumentType.SIGNED_INVESTMENT_AND_SHAREHOLDER_AGREEMENT].includes(
                  document.documentType,
                ) ? (
                  <InfoRow
                    key={document.ipfsHash}
                    caption={
                      <DocumentTemplateLabel
                        onClick={() => {}}
                        title={
                          getDocumentTitles(etoData!.allowRetailInvestors)[document.documentType]
                        }
                      />
                    }
                    value={
                      <ButtonIcon
                        className={styles.icon}
                        svgIcon={iconDownload}
                        onClick={() =>
                          downloadDocument!(
                            {
                              ipfsHash: document.ipfsHash,
                              mimeType: document.mimeType,
                              asPdf: true,
                            },
                            immutableDocumentName[document.documentType],
                          )
                        }
                      />
                    }
                  />
                ) : null;
              }, etoData!.documents)}
              {map((template: IEtoDocument) => {
                return [
                  EEtoDocumentType.COMPANY_TOKEN_HOLDER_AGREEMENT,
                  EEtoDocumentType.RESERVATION_AND_ACQUISITION_AGREEMENT,
                ].includes(template.documentType) ? (
                  <InfoRow
                    key={template.ipfsHash}
                    caption={
                      <DocumentTemplateLabel
                        onClick={() => {}}
                        title={
                          getDocumentTitles(etoData!.allowRetailInvestors)[template.documentType]
                        }
                      />
                    }
                    value={
                      <ButtonIcon
                        className={styles.icon}
                        svgIcon={iconDownload}
                        onClick={() => generateTemplateByEtoId!(template, etoId!)}
                      />
                    }
                  />
                ) : null;
              }, etoData!.templates)}
            </>
          </InfoList>
        </Col>
      </Row>
      <SummaryForm onSubmit={onAccept} />
    </Container>
  );
};

export const UserClaimSummary = appConnect<ITxSummaryStateProps, ITxSummaryDispatchProps, {}>({
  stateToProps: state => {
    const etoId: string = selectTxSummaryAdditionalData(state);
    return {
      txData: selectTxSummaryData(state)!,
      etoData: selectMyInvestorTicketByEtoId(state, etoId)!,
      txCost: selectTxGasCostEthUlps(state),
      etoId,
    };
  },
  dispatchToProps: d => ({
    onAccept: () => d(actions.txSender.txSenderAccept()),
    downloadDocument: (immutableFileId: ImmutableFileId, fileName: string) => {
      d(actions.immutableStorage.downloadImmutableFile(immutableFileId, fileName));
    },
    generateTemplateByEtoId: (immutableFileId: IEtoDocument, etoId: string) => {
      d(actions.etoDocuments.generateTemplateByEtoId(immutableFileId, etoId));
    },
  }),
})(UserClaimSummaryComponent);
