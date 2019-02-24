import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../modules/actions";
import {
  EETOStateOnChain,
  TBlEtoWithCompanyAndContract,
} from "../../modules/public-etos/interfaces/interfaces";
import { selectEtoWithCompanyAndContractById } from "../../modules/public-etos/selectors";
import { appConnect } from "../../store";
import { InvestmentProgress } from "../eto/overview/EtoOverviewStatus/InvestmentWidget/InvestmentProgress";
import { Button, ButtonSize, EButtonLayout } from "../shared/buttons";

import * as arrowRight from "../../assets/img/inline_icons/arrow_right.svg";

type TExternalProps = {
  state: EETOStateOnChain;
  etoId: string;
};

interface IDispatchProps {
  onClaim: (etoId: string) => void;
}

interface IStateProps {
  eto: TBlEtoWithCompanyAndContract;
}

const PortfolioAssetActionComponent: React.FunctionComponent<
  TExternalProps & IDispatchProps & IStateProps
> = ({ state, etoId, onClaim, eto }) => {
  switch (state) {
    case EETOStateOnChain.Claim:
    case EETOStateOnChain.Payout:
      return (
        <Button
          onClick={() => onClaim(etoId)}
          layout={EButtonLayout.SECONDARY}
          iconPosition="icon-after"
          svgIcon={arrowRight}
          data-test-id={"modals.portfolio.portfolio-asset-action.claim-" + etoId}
          size={ButtonSize.SMALL}
        >
          <FormattedMessage id="portfolio.section.reserved-assets.claim-tokens" />
        </Button>
      );
    case EETOStateOnChain.Refund:
      return (
        <Button
          layout={EButtonLayout.SECONDARY}
          iconPosition="icon-after"
          svgIcon={arrowRight}
          size={ButtonSize.SMALL}
          disabled
        >
          <FormattedMessage id="portfolio.section.reserved-assets.refund" />
        </Button>
      );
    case EETOStateOnChain.Signing:
      return (
        <Button layout={EButtonLayout.SECONDARY} size={ButtonSize.SMALL} disabled>
          <FormattedMessage id="portfolio.section.reserved-assets.wait-for-update" />
        </Button>
      );

    case EETOStateOnChain.Public:
    case EETOStateOnChain.Whitelist:
      return <InvestmentProgress eto={eto} />;

    default:
      return null;
  }
};

const PortfolioAssetAction = appConnect<IStateProps, IDispatchProps, TExternalProps>({
  stateToProps: (state, props) => ({
    eto: selectEtoWithCompanyAndContractById(state, props.etoId)!,
  }),
  dispatchToProps: dispatch => ({
    onClaim: (etoId: string) => dispatch(actions.txTransactions.startUserClaim(etoId)),
  }),
})(PortfolioAssetActionComponent);

export { PortfolioAssetAction };
