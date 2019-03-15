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
import { selectIsPendingDownload } from "../../../../modules/immutable-file/selectors";
import { selectMyInvestorTicketByEtoId } from "../../../../modules/investor-portfolio/selectors";
import { TETOWithInvestorTicket } from "../../../../modules/investor-portfolio/types";
import { selectTxAdditionalData } from "../../../../modules/tx/sender/selectors";
import { TClaimAdditionalData } from "../../../../modules/tx/transactions/claim/types";
import { appConnect } from "../../../../store";
import { getDocumentTitles } from "../../../documents/utils";
import { ButtonIcon } from "../../../shared/buttons";
import { DocumentTemplateLabel } from "../../../shared/DocumentLink";
import { EHeadingSize, Heading } from "../../../shared/Heading";
import { InfoRow } from "../shared/InfoRow";
import { ClaimTransactionDetails } from "./ClaimTransactionDetails";
import { SummaryForm } from "./SummaryForm";

import * as iconDownload from "../../../../assets/img/inline_icons/download.svg";
import * as styles from "./Summary.module.scss";

interface IStateProps {
  additionalData: TClaimAdditionalData;
  etoData: TETOWithInvestorTicket;
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
  additionalData,
  onAccept,
  downloadDocument,
  generateTemplateByEtoId,
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
          <ClaimTransactionDetails additionalData={additionalData}>
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
                      title={getDocumentTitles(etoData.allowRetailInvestors)[document.documentType]}
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
                      title={getDocumentTitles(etoData.allowRetailInvestors)[template.documentType]}
                    />
                  }
                  value={
                    <ButtonIcon
                      className={styles.icon}
                      svgIcon={iconDownload}
                      data-test-id="token-claim-agreements"
                      disabled={isPendingDownload(template.ipfsHash)}
                      onClick={() =>
                        generateTemplateByEtoId({ ...template, asPdf: true }, etoData.etoId)
                      }
                    />
                  }
                />
              ) : null;
            }, etoData.templates)}
          </ClaimTransactionDetails>
        </Col>
      </Row>
      <SummaryForm onSubmit={onAccept} />
    </Container>
  );
};

export const UserClaimSummary = appConnect<IStateProps, IDispatchProps, {}>({
  stateToProps: state => {
    const additionalData = selectTxAdditionalData(state);

    return {
      additionalData,
      etoData: selectMyInvestorTicketByEtoId(state, additionalData.etoId)!,
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
