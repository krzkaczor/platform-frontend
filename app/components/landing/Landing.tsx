import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Container, Row } from "reactstrap";

import { Button } from "../shared/Buttons";
import { BulletPointWithDescription } from "./shared/BulletPointWithDescription";

import * as logoMobile from "../../assets/img/logo-square-white.svg";
import * as logo from "../../assets/img/logo_capitalized.svg";
import * as styles from "./Landing.module.scss";

export const Landing: React.SFC = () => (
  <div className={styles.landing}>
    <Container>
      <Row>
        <Col>
          <img className={cn(styles.image, "d-none", "d-lg-block")} src={logo} alt="Neufund logo" />
          <img
            className={cn(styles.image, styles.logoMobile, "d-lg-none")}
            src={logoMobile}
            alt="Neufund logo"
          />
        </Col>
      </Row>
      <Row>
        <Col className={styles.cta}>
          <FormattedMessage id="landing.welcome-box.cta" />
        </Col>
      </Row>
      <Row>
        <div className={styles.welcomeBox}>
          <h2 className={styles.welcomeHeader}>
            <FormattedMessage id="landing.welcome-box.header" />
          </h2>
          <Row className={styles.bullets}>
            <Col xs={12} lg={6}>
              <BulletPointWithDescription
                header={<FormattedMessage id="landing.welcome-box.bullet.one.header" />}
                description={<FormattedMessage id="landing.welcome-box.bullet.one.description" />}
                index={1}
              />
            </Col>
            <Col xs={12} lg={6} className="mt-4 mt-lg-0">
              <BulletPointWithDescription
                header={<FormattedMessage id="landing.welcome-box.bullet.two.header" />}
                description={<FormattedMessage id="landing.welcome-box.bullet.two.description" />}
                index={2}
              />
            </Col>
          </Row>
          <Button theme="t-white">
            <FormattedMessage id="landing.welcome-box.register-now" />
          </Button>
        </div>
      </Row>
      <Row className="d-flex">
        <a className={styles.learnMore} href="https://neufund.org/investing" target="_blank">
          <FormattedMessage id="landing.learn-more" />
        </a>
      </Row>
    </Container>
  </div>
);
