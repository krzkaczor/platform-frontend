import * as React from "react";
import { Col, Container, Row } from "reactstrap";

import { SpinningEthereum } from "../../shared/ethererum";
import { Interoperable } from "./Interoperable";
import { RainbowSheepTip } from "./RainbowSheepTip";
import { SmartContractWindow } from "./SmartContractWindow";

import * as styles from "./Features.module.scss";

export const Features: React.FunctionComponent = () => (
  <div className={styles.features}>
    <Container>
      <RainbowSheepTip
        triggerId="sheep-1"
        side="right"
        tip={["Better than NASDAQ", "IPO on blockchain"]}
      />
      <Row>
        <Col xs={12} md={6} className="align-self-center">
          <SpinningEthereum />
        </Col>
        <Col xs={12} md={6} className="align-self-center">
          <h2>Technologically enhanced shares</h2>
          <p id="sheep-1">
            Equity Tokens are programmable shares. With Ethereum-based ERC20 tokens we empower
            shareholders and grant them the rights of stakeholders.
          </p>
        </Col>
      </Row>
      <RainbowSheepTip triggerId="sheep-2" side="left" tip={["Making ICOs legal"]} />
      <Row>
        <Col xs={12} md={6} className="order-xs-2 order-md-1 align-self-center">
          <h2>Legally binding tokens</h2>
          <p id="sheep-2">
            German law is engrained in the code of our legally binding equity tokens. Shareholder
            rights are getting self-executed using smart contracts written by our programmers and
            lawyers.
          </p>
        </Col>
        <Col xs={12} md={6} className="order-first order-md-last align-self-center">
          <SmartContractWindow />
        </Col>
      </Row>
      <RainbowSheepTip triggerId="sheep-3" side="right" tip={["Trade your shares"]} />
      <Row>
        <Col xs={12} md={6} className="align-self-center">
          <Interoperable />
        </Col>
        <Col xs={12} md={6} className="align-self-center">
          <h2>Interoperable assets</h2>
          <p id="sheep-3">
            Equity Tokens are fully liquid investment assets. They can be traded on secondary
            markets and transferred between parties. Invest globally with ETH or EUR into stage and
            ticket size agnostic offerings.
          </p>
        </Col>
      </Row>
    </Container>
  </div>
);
