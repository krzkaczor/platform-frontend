import * as React from "react";
import { Col, Row } from "reactstrap";

import * as cn from "classnames";
import * as ethIcom from "../../../assets/img/eth_icon.svg";
import * as moneyIcom from "../../../assets/img/nEUR_icon.svg";
import { ArrowLink } from "../../shared/ArrowLink";
import { Money, selectCurrencySymbol, TCurrency } from "../../shared/Money";
import { PanelDark } from "../../shared/PanelDark";
import * as styles from "./MyWalletWidget.module.scss";

interface IMoneySuiteWidgetProps {
  icon: string;
  currency: TCurrency;
  largeNo: string;
}

const MoneySuiteWidget: React.SFC<
  IMoneySuiteWidgetProps & React.HTMLAttributes<HTMLDivElement>
> = ({ icon, currency, largeNo, children, className }) => (
  <Row className={cn("mt-2 mb-2 justify-content-center", className)} noGutters>
    <Col className="col-auto">
      <img className={styles.icon} src={icon} />
    </Col>
    <Col className="pl-2 col-sm-auto col-lg">
      <div className={styles.largeDarkFont}>
        {selectCurrencySymbol(currency)}{" "}
        <Money value={largeNo} currency={currency} noCurrencySymbol />
      </div>
      <div>{children}</div>
    </Col>
    <Col xs={12} className="mt-3">
      <div className={styles.border} />
    </Col>
  </Row>
);
export const MyWalletWidget = () => {
  return (
    <PanelDark
      headerText="My Wallet"
      rightComponent={
        <ArrowLink
          arrowDirection="right"
          to="#"
          className={cn(styles.link, "text-light mb-1 pl-0 pr-0 pb-1 d-none d-sm-block text-right")}
        >
          Manage Wallet
        </ArrowLink>
      }
      className={styles.background}
    >
      <Row noGutters>
        <Col xs={12} sm={6} lg={12} className="mt-2">
          <MoneySuiteWidget
            currency="eur_token"
            largeNo={"36490" + "0".repeat(18)}
            icon={moneyIcom}
            className={styles.borderRight}
          >
            = <Money value={"36490" + "0".repeat(18)} currency="eur" noCurrencySymbol />
          </MoneySuiteWidget>
        </Col>
        <Col xs={12} sm={6} lg={12} className="mt-2">
          <MoneySuiteWidget currency="eth" largeNo={"66482" + "0".repeat(14)} icon={ethIcom}>
            <span>
              = <Money value={"6004904646" + "0".repeat(16)} currency="eur" noCurrencySymbol />
              <span className={cn(styles.smallRedFont, "ml-2")}> (-3.67%) </span>
            </span>
          </MoneySuiteWidget>
        </Col>
        <Col xs={12}>
          <div className={styles.borderS} />
        </Col>
      </Row>
      <Row className="mb-3 justify-content-between mt-2" noGutters>
        <Col className="d-flex align-items-center">
          <span className={cn(styles.smallFont)}>TOTAL</span>
          <Money
            value={"637238" + "0".repeat(18)}
            currency="eur"
            noCurrencySymbol
            className={cn(styles.mediumSeaweedFont, "pl-1 pl-sm-2 m-0")}
          />
          <span className={cn(styles.smallSeaweedFont, "pl-1")}>EUR</span>
        </Col>
        <Col className="d-block d-sm-none text-right col-auto">
          <ArrowLink arrowDirection="right" to="#" className={cn(styles.link, "p-0")}>
            Manage Wallet
          </ArrowLink>
        </Col>
      </Row>
    </PanelDark>
  );
};
