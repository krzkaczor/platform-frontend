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
import { ITxData } from "../../../../lib/web3/types";
import { actions } from "../../../../modules/actions";
import { selectIsPendingDownload } from "../../../../modules/immutable-file/selectors";
import { selectMyInvestorTicketByEtoId } from "../../../../modules/investor-portfolio/selectors";
import { TETOWithInvestorTicket } from "../../../../modules/investor-portfolio/types";
import {
  selectTxGasCostEthUlps,
  selectTxSummaryAdditionalData,
  selectTxSummaryData,
} from "../../../../modules/tx/sender/selectors";
import { appConnect } from "../../../../store";
import { getDocumentTitles } from "../../../documents/utils";
import { ButtonIcon } from "../../../shared/buttons";
import { DocumentTemplateLabel } from "../../../shared/DocumentLink";
import { EHeadingSize, Heading } from "../../../shared/Heading";
import { ECurrency, ECurrencySymbol, Money } from "../../../shared/Money";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { SummaryForm } from "./SummaryForm";

import * as iconDownload from "../../../../assets/img/inline_icons/download.svg";
import * as styles from "./Summary.module.scss";

interface IStateProps {
  txData: Partial<ITxData>;
  txCost: string;
  etoData: TETOWithInvestorTicket;
  etoId: string;
  isPendingDownload: (ipfsHash: string) => boolean;
}

interface IDispatchProps {
  onAccept: () => any;
  downloadDocument: (immutableFileId: ImmutableFileId, fileName: string) => void;
  generateTemplateByEtoId: (immutableFileId: IEtoDocument, etoId: string) => void;
}

type TComponentProps = IStateProps & IDispatchProps;

export const UserClaimSummaryComponent: React.FunctionComponent<TComponentProps> = ({
  etoData,
  txCost,
  onAccept,
  downloadDocument,
  generateTemplateByEtoId,
  etoId,
  isPendingDownload,
}) => {
  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <Heading size={EHeadingSize.SMALL} level={4}>
            <FormattedMessage id="user-claim-flow.summary" />
          </Heading>
        </Col>
      </Row>
      <p className="mb-3">
        <FormattedMessage id="user-claim-flow.summary.explanation" />
      </p>
      <Row className="mb-2">
        <Col>
          <InfoList>
            <InfoRow
              caption={<FormattedMessage id="user-claim-flow.token-name" />}
              value={etoData.equityTokenName}
            />

            <InfoRow
              caption={<FormattedMessage id="user-claim-flow.balance" />}
              value={etoData.investorTicket.equityTokenInt.toString()}
            />

            <InfoRow
              caption={<FormattedMessage id="user-claim-flow.estimated-reward" />}
              value={
                <Money
                  value={etoData.investorTicket.rewardNmkUlps.toString()}
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
                          getDocumentTitles(etoData.allowRetailInvestors)[document.documentType]
                        }
                      />
                    }
                    value={
                      <ButtonIcon
                        className={styles.icon}
                        svgIcon={iconDownload}
                        disabled={isPendingDownload(document.ipfsHash)}
                        data-test-id="token-claim-agreements"
                        onClick={() =>
                          downloadDocument(
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
              }, etoData.documents)}
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
                          getDocumentTitles(etoData.allowRetailInvestors)[template.documentType]
                        }
                      />
                    }
                    value={
                      <ButtonIcon
                        className={styles.icon}
                        svgIcon={iconDownload}
                        data-test-id="token-claim-agreements"
                        disabled={isPendingDownload(template.ipfsHash)}
                        onClick={() => generateTemplateByEtoId({ ...template, asPdf: true }, etoId)}
                      />
                    }
                  />
                ) : null;
              }, etoData.templates)}
            </>
          </InfoList>
        </Col>
      </Row>
      <SummaryForm onSubmit={onAccept} />
    </Container>
  );
};

export const UserClaimSummary = appConnect<IStateProps, IDispatchProps, {}>({
  stateToProps: state => {
    const etoId: string = selectTxSummaryAdditionalData(state);
    return {
      txData: selectTxSummaryData(state)!,
      etoData: selectMyInvestorTicketByEtoId(state, etoId)!,
      txCost: selectTxGasCostEthUlps(state),
      etoId,
      isPendingDownload: selectIsPendingDownload(state),
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
