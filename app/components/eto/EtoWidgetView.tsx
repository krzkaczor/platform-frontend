import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col } from "reactstrap";
import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../modules/actions";
import { TBlEtoWithCompanyAndContract } from "../../modules/public-etos/interfaces/interfaces";
import {
  selectEtoWidgetError,
  selectEtoWithCompanyAndContract,
} from "../../modules/public-etos/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary";
import { LoadingIndicator } from "../shared/loading-indicator";
import { EtoOverviewStatus } from "./overview/EtoOverviewStatus";

import {IStatePublicEtos} from "../../modules/public-etos/interfaces/PublicEto";
import * as styles from "./overview/EtoOverviewStatus/EtoOverviewStatus.module.scss";

interface IStateProps {
  eto?: TBlEtoWithCompanyAndContract;
  widgetError: boolean | undefined;
}

interface IRouterParams {
  previewCode: string;
}

type TProps = {
  eto: TBlEtoWithCompanyAndContract;
  widgetError: boolean | undefined;
};

const EtoWidgetContext = React.createContext<string | undefined>(undefined);

const EtoWidgetError: React.FunctionComponent<{}> = () => (
  <div className={styles.etoOverviewStatus}>
    <div
      className={cn(styles.overviewWrapper, "justify-content-center", "align-items-center")}
      data-test-id="eto-widget-error"
    >
      <FormattedMessage id="shared-component.eto-overview.error.widget" />
    </div>
  </div>
);

const EtoWidget: React.FunctionComponent<TProps> = ({ eto, widgetError }) => (
  <Col xs={12}>
    <div className="mb-3">
      {widgetError ? (
        <EtoWidgetError />
      ) : (
        <EtoWidgetContext.Provider value={eto.previewCode}>
          <EtoOverviewStatus eto={eto} />
        </EtoWidgetContext.Provider>
      )}
    </div>
  </Col>
);

const EtoWidgetView = compose<TProps, IRouterParams>(
  createErrorBoundary(() => <Col xs={12} />),
  appConnect<IStateProps, {}, IRouterParams>({
    stateToProps: (state, props) => ({
      eto: selectEtoWithCompanyAndContract(state, props.previewCode),
      widgetError: selectEtoWidgetError(state.publicEtos as IStatePublicEtos),
    }),
  }),
  onEnterAction({
    actionCreator: (dispatch, props) => {
      dispatch(actions.publicEtos.loadEtoPreview(props.previewCode, true));
    },
  }),
  branch<IStateProps>(props => !props.eto && !props.widgetError, renderComponent(LoadingIndicator)),
)(EtoWidget);

export { EtoWidgetView, EtoWidgetContext, EtoWidget };
