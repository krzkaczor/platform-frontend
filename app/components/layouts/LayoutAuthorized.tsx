import * as React from "react";
import { Col, Row } from "reactstrap";

import { AcceptTosModal } from "../modals/accept-tos-modal/AcceptTosModal";
import { BankTransferFlowModal } from "../modals/bank-transfer-flow/BankTransferFlow";
import { DepositEthModal } from "../modals/DepositEthModal";
import { DownloadTokenAgreementModal } from "../modals/download-token-agreements-modal/DownloadTokenAgreementModal";
import { IcbmWalletBalanceModal } from "../modals/icbm-wallet-balance-modal/IcbmWalletBalanceModal";
import { TxSenderModal } from "../modals/tx-sender/TxSender";
import { LoadingIndicator } from "../shared/loading-indicator/LoadingIndicator";
import { NotificationWidget } from "../shared/notification-widget/NotificationWidget";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { LayoutAuthorizedMenu } from "./LayoutAuthorizedMenu";

import * as styles from "./LayoutAuthorized.module.scss";
import * as sharedStyles from "./LayoutShared.module.scss";

export const LayoutAuthorized: React.FunctionComponent = ({ children }) => (
  <>
    <Header />

    <div className={`wrapper ${sharedStyles.layoutBg}`}>
      <div>
        <LayoutAuthorizedMenu />
      </div>
      <div className="layout-container">
        <NotificationWidget />
        <Row>
          <Col className={styles.content}>
            <React.Suspense fallback={<LoadingIndicator />}>{children}</React.Suspense>
          </Col>
        </Row>
      </div>
    </div>

    <Footer />
    <AcceptTosModal />
    <DepositEthModal />
    <TxSenderModal />
    <IcbmWalletBalanceModal />
    <BankTransferFlowModal />
    <DownloadTokenAgreementModal />
  </>
);
