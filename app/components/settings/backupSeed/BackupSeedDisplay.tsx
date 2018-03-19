import * as cn from "classnames";
import * as React from "react";
import { Col, Row } from "reactstrap";

import { LayoutAuthorized } from "../../layouts/LayoutAuthorized";
import { ArrowButton } from "../../shared/ArrowNavigation";
import { BreadCrumb } from "../../shared/BreadCrumb";
import { ButtonPrimary } from "../../shared/Buttons";
import { HeaderProgressStepper } from "../../shared/HeaderProgressStepper";
import { PanelWhite } from "../../shared/PanelWhite";

import * as styles from "./BackupSeedDisplay.module.scss";

export const WORDS_PER_PAGE = 12;

interface IBackupSeedDisplayProps {
  onNext?: () => void;
  onBack?: () => void;
  words: string[];
  startingStep: number;
  totalSteps: number;
  isModal?: boolean;
}

interface IBackupSeedDisplayState {
  pageNo: number;
}

export class BackupSeedDisplayComponent extends React.Component<
  IBackupSeedDisplayProps,
  IBackupSeedDisplayState
> {
  constructor(props: IBackupSeedDisplayProps) {
    super(props);

    this.state = {
      pageNo: 0,
    };
  }

  handlePrevPage = () => {
    if (this.state.pageNo > 0) {
      this.setState({
        pageNo: this.state.pageNo - 1,
      });
    }
  };

  handleNextPage = () => {
    this.setState({
      pageNo: this.state.pageNo + 1,
    });
  };

  render(): React.ReactNode {
    const stepNo = this.props.startingStep + this.state.pageNo;
    const wordsNo = this.props.words.length;
    const startWord = WORDS_PER_PAGE * this.state.pageNo;
    const endWord = startWord + WORDS_PER_PAGE;
    const showNextButton = endWord >= wordsNo;
    return (
      <PanelWhite className="pt-5">
        <HeaderProgressStepper
          steps={this.props.totalSteps}
          currentStep={stepNo}
          headerText="Write down your Recovery Phrase"
          descText="Your Recovery Phrase allows you to restore your wallet and access your funds if you forgot your password."
          warning
        />
        <Row>
          <Col xs={{ size: 10, offset: 1 }}>
            <Row className="no-gutters">
              <Col className={cn("text-right", styles.pageStatus)}>
                {`${(this.state.pageNo + 1) * WORDS_PER_PAGE} / ${wordsNo}`}
              </Col>
            </Row>
            <Row className="justify-content-around no-gutters">
              {this.props.words.slice(startWord, endWord).map((word, index) => (
                <Col
                  className={cn(styles.word, "mt-1 p-2 text-center")}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={2}
                  key={word}
                  data-test-id="seed-display-word"
                >
                  {`${this.state.pageNo * WORDS_PER_PAGE + index + 1}.`}
                  {this.props.isModal ? <div>{word}</div> : word}
                </Col>
              ))}
            </Row>
            <Row className="my-4 justify-content-center justify-content-sm-between">
              <Col className="mt-2" xs="auto">
                <ButtonPrimary
                  data-test-id="seed-display-prev-words"
                  disabled={this.state.pageNo === 0}
                  onClick={this.handlePrevPage}
                >
                  {`previous ${WORDS_PER_PAGE} words`}
                </ButtonPrimary>
              </Col>
              <Col className="mt-2" xs="auto">
                {this.props.onNext && showNextButton ? (
                  <ButtonPrimary data-test-id="seed-display-next-link" onClick={this.props.onNext}>
                    Go to next step
                  </ButtonPrimary>
                ) : (
                  <ButtonPrimary
                    data-test-id="seed-display-next-words"
                    disabled={this.state.pageNo === 1}
                    onClick={this.handleNextPage}
                  >
                    {`next ${WORDS_PER_PAGE} words`}
                  </ButtonPrimary>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
        {this.props.onBack && (
          <Row>
            <Col>
              <ArrowButton arrowDirection="left" onClick={this.props.onBack}>
                Back
              </ArrowButton>
            </Col>
          </Row>
        )}
      </PanelWhite>
    );
  }
}

export const BackupSeedDisplay: React.SFC<IBackupSeedDisplayProps> = props => (
  <LayoutAuthorized>
    <BreadCrumb
      className="my-4"
      path={["Settings", "Security settings"]}
      view="Backup recovery phase"
    />
    <Row>
      <Col md={12} lg={{ size: 10, offset: 1 }} xl={{ size: 8, offset: 2 }}>
        <BackupSeedDisplayComponent {...props} startingStep={2} totalSteps={4} />
      </Col>
    </Row>
  </LayoutAuthorized>
);
