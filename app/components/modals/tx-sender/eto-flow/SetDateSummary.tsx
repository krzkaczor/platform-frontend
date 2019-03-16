import { find } from "lodash";
import * as moment from "moment";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Container } from "reactstrap";
import { compose, setDisplayName } from "recompose";

import {
  EEtoDocumentType,
  immutableDocumentName,
} from "../../../../lib/api/eto/EtoFileApi.interfaces";
import { actions } from "../../../../modules/actions";
import { selectPlatformTermsConstants } from "../../../../modules/contracts/selectors";
import { selectIssuerEtoWithCompanyAndContract } from "../../../../modules/eto-flow/selectors";
import { selectTxAdditionalData } from "../../../../modules/tx/sender/selectors";
import { TEtoSetDateAdditionalData } from "../../../../modules/tx/transactions/eto-flow/types";
import { ETxSenderType } from "../../../../modules/tx/types";
import { appConnect } from "../../../../store";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { EHeadingSize, Heading } from "../../../shared/Heading";
import { EtherscanAddressLink, ExternalLink } from "../../../shared/links";
import { TimeLeft } from "../../../shared/TimeLeft";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { SetDateDetails } from "./SetDateDetails";

interface IStateProps {
  additionalData: TEtoSetDateAdditionalData;
  changeableTill: moment.Moment;
  etoTermsAddress: string;
  etoCommitmentAddress: string;
  termsAgreementIPFSLink: string;
  equityTokenAddress: string;
  offeringAgreementIPFSLink: string;
}

interface IDispatchProps {
  onAccept: () => any;
}

type IProps = IStateProps & IDispatchProps;

const SetEtoDateSummaryComponent: React.FunctionComponent<IProps> = ({
  onAccept,
  etoTermsAddress,
  equityTokenAddress,
  offeringAgreementIPFSLink,
  etoCommitmentAddress,
  termsAgreementIPFSLink,
  additionalData,
  changeableTill,
}) => {
  return (
    <Container>
      <Heading className="mb-4" size={EHeadingSize.SMALL} level={4}>
        <FormattedMessage id="eto.settings.eto-start-date-summary.dates-title" />
      </Heading>

      <p className="mb-4">
        <FormattedMessage id="eto.status.onchain.change-eto-date-countdown-text" />{" "}
        <i>
          <TimeLeft refresh={false} asUtc={true} finalTime={changeableTill.utc().toDate()} />
        </i>
      </p>

      <SetDateDetails additionalData={additionalData} className="mb-4" />

      <Heading size={EHeadingSize.SMALL} level={4} className="mb-4">
        <FormattedMessage id="eto.settings.eto-start-date-summary.contracts-title" />
      </Heading>

      <p className="mb-4">
        <FormattedMessage id="eto.settings.eto-start-date-summary.contracts-description" />
      </p>

      <InfoList className="mb-4">
        <InfoRow
          caption={
            <FormattedMessage id="eto.settings.eto-start-date-summary.eto-commitment-contract-address" />
          }
          value={
            <EtherscanAddressLink address={etoCommitmentAddress}>
              {etoCommitmentAddress}
            </EtherscanAddressLink>
          }
        />
        <InfoRow
          caption={
            <FormattedMessage id="eto.settings.eto-start-date-summary.eto-terms-contract-address" />
          }
          value={
            <EtherscanAddressLink address={etoTermsAddress}>{etoTermsAddress}</EtherscanAddressLink>
          }
        />
        <InfoRow
          caption={
            <FormattedMessage id="eto.settings.eto-start-date-summary.equity-token-address" />
          }
          value={
            <EtherscanAddressLink address={equityTokenAddress}>
              {equityTokenAddress}
            </EtherscanAddressLink>
          }
        />
        <InfoRow
          caption={immutableDocumentName[EEtoDocumentType.APPROVED_INVESTOR_OFFERING_DOCUMENT]}
          value={
            <ExternalLink href={offeringAgreementIPFSLink}>
              {offeringAgreementIPFSLink}
            </ExternalLink>
          }
        />
        <InfoRow
          caption={immutableDocumentName[EEtoDocumentType.SIGNED_TERMSHEET]}
          value={
            <ExternalLink href={termsAgreementIPFSLink}>{termsAgreementIPFSLink}</ExternalLink>
          }
        />
      </InfoList>

      <div className="text-center">
        <Button
          layout={EButtonLayout.PRIMARY}
          type="button"
          onClick={onAccept}
          data-test-id="set-eto-date-summary-confirm-button"
        >
          <FormattedMessage id="eto.settings.confirm" />
        </Button>
      </div>
    </Container>
  );
};

const SetEtoDateSummary = compose<IProps, {}>(
  setDisplayName("SetEtoDateSummary"),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => {
      const additionalData = selectTxAdditionalData<ETxSenderType.ETO_SET_DATE>(state);

      if (!additionalData) {
        throw new Error("Addfjfds");
      }

      const constants = selectPlatformTermsConstants(state);
      const changeableTill = moment(additionalData.newStartDate).subtract(
        constants.DATE_TO_WHITELIST_MIN_DURATION.toNumber(),
        "seconds",
      );

      const eto = selectIssuerEtoWithCompanyAndContract(state)!;
      const ipfsUrl = "https://ipfs.io/ipfs/";
      const termsDoc: any = find(eto.documents, [
        "documentType",
        EEtoDocumentType.SIGNED_TERMSHEET,
      ]);
      const offeringDoc: any = find(eto.documents, [
        "documentType",
        EEtoDocumentType.APPROVED_INVESTOR_OFFERING_DOCUMENT,
      ]);
      const offeringAgreementIPFSLink = offeringDoc && ipfsUrl + (offeringDoc.ipfsHash as string);
      const termsAgreementIPFSLink = termsDoc && ipfsUrl + (termsDoc.ipfsHash as string);

      return {
        etoTermsAddress: eto.contract!.etoTermsAddress,
        equityTokenAddress: eto.contract!.equityTokenAddress,
        etoCommitmentAddress: eto.contract!.etoCommitmentAddress,
        additionalData,
        offeringAgreementIPFSLink,
        termsAgreementIPFSLink,
        changeableTill,
      };
    },
    dispatchToProps: d => ({
      onAccept: () => d(actions.txSender.txSenderAccept()),
    }),
  }),
)(SetEtoDateSummaryComponent);

export { SetEtoDateSummaryComponent, SetEtoDateSummary };
