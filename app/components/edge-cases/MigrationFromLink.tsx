import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { actions } from "../../modules/actions";
import { EUserType } from "../../modules/auth/interfaces";
import { selectUserType } from "../../modules/auth/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { DashboardSection } from "../eto/shared/DashboardSection";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { CheckYourICBMWalletWidget } from "../settings/icbm-wallet-widget/CheckYourICBMWalletWidget";

interface IStateProps {
  userType?: EUserType;
}

export const MigrationFromLinkComponent: React.FunctionComponent<IStateProps> = ({ userType }) => {
  const isUserInvestor = userType === EUserType.INVESTOR;

  return (
    <LayoutAuthorized>
      <Row className="row-gutter-top">
        <DashboardSection
          title={<FormattedMessage id="settings.account-info.title" />}
          data-test-id="eto-dashboard-application"
        />

        {process.env.NF_CHECK_LOCKED_WALLET_WIDGET_ENABLED === "1" &&
          isUserInvestor && (
            <Col lg={4} xs={12}>
              <CheckYourICBMWalletWidget />
            </Col>
          )}
      </Row>
    </LayoutAuthorized>
  );
};

export const MigrationFromLink = compose<React.FunctionComponent>(
  onEnterAction({ actionCreator: d => d(actions.wallet.loadWalletData()) }),
  appConnect<IStateProps>({
    stateToProps: state => ({
      userType: selectUserType(state),
    }),
  }),
)(MigrationFromLinkComponent);
