import { map } from "lodash/fp";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Modal, Row } from "reactstrap";
import { compose } from "recompose";

import { actions } from "../../../modules/actions";
import {
  EEtoDocumentType,
  IEtoDocument,
  immutableDocumentNames,
} from "../../../modules/eto-documents/interfaces";
import { IImmutableFileId } from "../../../modules/immutable-file/interfaces";
import { selectIsPendingDownload } from "../../../modules/immutable-file/selectors";
import { TBlEtoWithCompanyAndContract } from "../../../modules/public-etos/interfaces/interfaces";
import { selectEtoWithCompanyAndContractById } from "../../../modules/public-etos/selectors";
import { appConnect } from "../../../store";
import { getDocumentTitles } from "../../documents/utils";
import {
  selectDownloadAgreementModalEtoId,
  selectDownloadAgrementModalIsOpen,
} from "../../portfolio/selectors";
import { ButtonIcon } from "../../shared/buttons";
import { DocumentTemplateLabel } from "../../shared/DocumentLink";
import { Heading } from "../../shared/modals/Heading";
import { ModalComponentBody } from "../ModalComponentBody";
import { InfoList } from "../tx-sender/shared/InfoList";
import { InfoRow } from "../tx-sender/shared/InfoRow";

import * as iconDownload from "../../../assets/img/inline_icons/download.svg";
import * as styles from "./DownloadTokenAgreementModal.module.scss";

interface IStateProps {
  isOpen: boolean;
  eto: TBlEtoWithCompanyAndContract | undefined;
  isPendingDownload: (ipfsHash: string) => boolean;
}

interface IDispatchProps {
  onClose?: () => void;
  generateTemplateByEtoId: (immutableFileId: IEtoDocument, etoId: string) => void;
  downloadDocument: (immutableFileId: IImmutableFileId, fileName: string) => void;
}

type IComponentProps = IStateProps & IDispatchProps;

const DownloadTokenAgreementModalComponent: React.FunctionComponent<IComponentProps> = ({
  isOpen,
  onClose,
  generateTemplateByEtoId,
  downloadDocument,
  eto,
  isPendingDownload,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={onClose}>
      <ModalComponentBody onClose={onClose}>
        <Container>
          <Row className="mb-4">
            <Col>
              <Heading>
                <FormattedMessage id="portfolio.section.my-assets.modal.header" />
              </Heading>
            </Col>
          </Row>
          {eto && (
            <InfoList>
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
                          title={getDocumentTitles(eto.allowRetailInvestors)[document.documentType]}
                        />
                      }
                      value={
                        <ButtonIcon
                          className={styles.icon}
                          svgIcon={iconDownload}
                          disabled={isPendingDownload(document.ipfsHash)}
                          data-test-id={`modals.portfolio.portfolio-assets.download-agreements-${
                            eto.etoId
                          }.download`}
                          onClick={() =>
                            downloadDocument(
                              {
                                ipfsHash: document.ipfsHash,
                                mimeType: document.mimeType,
                                asPdf: true,
                              },
                              immutableDocumentNames[document.documentType],
                            )
                          }
                        />
                      }
                    />
                  ) : null;
                }, eto.documents)}
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
                          title={getDocumentTitles(eto.allowRetailInvestors)[template.documentType]}
                        />
                      }
                      value={
                        <ButtonIcon
                          className={styles.icon}
                          svgIcon={iconDownload}
                          disabled={isPendingDownload(template.ipfsHash)}
                          data-test-id={`modals.portfolio.portfolio-assets.download-agreements-${
                            eto.etoId
                          }.download`}
                          onClick={() =>
                            generateTemplateByEtoId({ ...template, asPdf: true }, eto.etoId)
                          }
                        />
                      }
                    />
                  ) : null;
                }, eto.templates)}
              </>
            </InfoList>
          )}
        </Container>
      </ModalComponentBody>
    </Modal>
  );
};

const DownloadTokenAgreementModal = compose<IComponentProps, {}>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => {
      const etoId = selectDownloadAgreementModalEtoId(state);
      const eto = etoId ? selectEtoWithCompanyAndContractById(state, etoId) : undefined;
      return {
        isOpen: etoId ? selectDownloadAgrementModalIsOpen(state) : false,
        eto: eto,
        isPendingDownload: selectIsPendingDownload(state),
      };
    },
    dispatchToProps: dispatch => ({
      downloadDocument: (immutableFileId: IImmutableFileId, fileName: string) => {
        dispatch(actions.immutableStorage.downloadImmutableFile(immutableFileId, fileName));
      },
      generateTemplateByEtoId: (immutableFileId: IEtoDocument, etoId: string) => {
        dispatch(actions.etoDocuments.generateTemplateByEtoId(immutableFileId, etoId));
      },
      onClose: () => {
        dispatch(actions.portfolio.hideDownloadAgreementModal());
      },
    }),
  }),
)(DownloadTokenAgreementModalComponent);

export { DownloadTokenAgreementModal };
