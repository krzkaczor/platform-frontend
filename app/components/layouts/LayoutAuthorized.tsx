import * as React from "react";
import { Col, Row } from "reactstrap";

import { NotificationWidget } from "../dashboard/notification-widget/NotificationWidget";
import { DepositEthModal } from "../modals/DepositEthModal";
import { SendEthModal } from "../modals/SendEthModal";
import { LayoutAuthorizedMenu } from "./LayoutAuthorizedMenu";

import * as styles from "./LayoutAuthorized.module.scss";

export const LayoutAuthorized: React.SFC = ({ children }) => (
  <>
    <div>
      <LayoutAuthorizedMenu />
    </div>
    <div className="layout-container">
      <Row>
        <Col>
          <NotificationWidget />
        </Col>
      </Row>
      <Row>
        <Col className={styles.content}>{children}</Col>
      </Row>
    </div>
    <DepositEthModal />
    <SendEthModal />
  </>
);
