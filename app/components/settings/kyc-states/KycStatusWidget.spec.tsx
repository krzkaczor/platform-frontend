import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { externalRoutes } from "../../../config/externalRoutes";
import { EUserType } from "../../../modules/auth/interfaces";
import { ERequestStatus } from "../../../modules/kyc/interfaces";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { KycStatusWidgetComponent } from "./KycStatusWidget";

const defaultProps = {
  onGoToKycHome: () => {},
  onGoToDashboard: () => {},
  cancelInstantId: () => {},
  step: 1,
  userType: EUserType.INVESTOR,
  isUserEmailVerified: true,
  backupCodesVerified: true,
};
describe("<KycStatusWidgetComponent />", () => {
  it("should render verified section", () => {
    const component = shallow(
      <KycStatusWidgetComponent
        {...defaultProps}
        requestStatus={ERequestStatus.ACCEPTED}
        isLoading={false}
      />,
    );

    expect(component.contains(<FormattedMessage id="settings.kyc-status-widget.status.accepted" />))
      .to.be.true;
  });

  it("should render unverified section", () => {
    const component = shallow(
      <KycStatusWidgetComponent
        {...defaultProps}
        requestStatus={ERequestStatus.DRAFT}
        isLoading={false}
      />,
    );

    expect(
      component.contains(
        <FormattedHTMLMessage
          tagName="span"
          id="settings.kyc-status-widget.status.draft"
          values={{ url: `${externalRoutes.neufundSupport}/home` }}
        />,
      ),
    ).to.be.true;
  });

  it("should render loading indicator", () => {
    const component = shallow(<KycStatusWidgetComponent {...defaultProps} isLoading={true} />);
    expect(component.find(LoadingIndicator)).to.have.length(1);
  });
});
