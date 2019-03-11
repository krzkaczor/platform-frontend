import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { IWalletPrivateData } from "../../../modules/web3/reducer";
import { Button, EButtonLayout } from "../../shared/buttons";
import { Heading } from "../../shared/Heading";
import { PrivateKeyDisplay } from "./PrivateKeyDisplay";

import * as arrowLeft from "../../../assets/img/inline_icons/arrow_left.svg";
import * as styles from "./BackupSeedDisplay.module.scss";

interface IBackupSeedDisplayProps {
  onNext: () => void;
  onBack: () => void;
  walletPrivateData: IWalletPrivateData;
  isModal?: boolean;
}
const BackupSeedDisplay: React.FunctionComponent<IBackupSeedDisplayProps> = ({
  walletPrivateData,
  isModal,
  onNext,
  onBack,
}) => {
  return (
    <>
      <Row>
        <Col xs={{ size: 10, offset: 1 }}>
          <section className="mb-4">
            <Heading level={3} data-test-id="eto-dashboard-application" className="mb-3">
              <FormattedMessage id="components.settings.backup-seed-display.backup-seed" />
            </Heading>
            <Row className="justify-content-around no-gutters">
              {walletPrivateData.seed.map((word, index) => (
                <Col
                  className={cn(styles.word, "mt-1 p-2 text-center")}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={2}
                  key={index}
                  data-test-id="seed-display-word"
                >
                  {`${index + 1}.`}
                  {isModal ? <div>{word}</div> : word}
                </Col>
              ))}
            </Row>
          </section>

          <PrivateKeyDisplay privateKey={walletPrivateData.privateKey} />
        </Col>
      </Row>

      {!isModal && (
        <Row className="justify-content-around">
          <Col className="mt-2" xs="auto">
            <Button
              layout={EButtonLayout.SECONDARY}
              iconPosition="icon-before"
              svgIcon={arrowLeft}
              onClick={onBack}
            >
              <FormattedMessage id="form.button.back" />
            </Button>
          </Col>
          <Col className="mt-2" xs="auto">
            <Button
              layout={EButtonLayout.SECONDARY}
              iconPosition="icon-before"
              onClick={onNext}
              data-test-id="seed-display-next-link"
            >
              <FormattedMessage id="form.button.continue" />
            </Button>
          </Col>
        </Row>
      )}
    </>
  );
};

export { BackupSeedDisplay };
