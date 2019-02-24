import * as React from "react";
import { compose } from "recompose";

import { actions } from "../../../modules/actions";
import { TBlEtoWithCompanyAndContract } from "../../../modules/public-etos/interfaces/interfaces";
import {IStatePublicEtos} from "../../../modules/public-etos/interfaces/PublicEto";
import {
  selectEtoWidgetError,
  selectEtoWithCompanyAndContractById,
} from "../../../modules/public-etos/selectors";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { withParams } from "../../../utils/withParams";
import { appRoutes } from "../../appRoutes";

interface IStateProps {
  eto?: TBlEtoWithCompanyAndContract;
  widgetError?: boolean;
}

interface IRouterParams {
  etoId: string;
}

const TestEmbededWidgetLayout: React.FunctionComponent<IStateProps> = ({ eto, widgetError }) => {
  return (
    <>
      <h3>Eto widget testing page</h3>
      {eto &&
        eto.previewCode && (
          <iframe
            width="100%"
            height={215}
            src={withParams(appRoutes.etoWidgetView, { previewCode: eto.previewCode })}
          />
        )}

      {widgetError && (
        <iframe
          width="100%"
          height={215}
          src={withParams(appRoutes.etoWidgetView, { previewCode: "error-id" })}
        />
      )}
    </>
  );
};

const TestEmbededWidget = compose<IStateProps, IRouterParams>(
  appConnect<IStateProps, {}, IRouterParams & IRouterParams>({
    stateToProps: (state, props) => ({
      eto: selectEtoWithCompanyAndContractById(state, props.etoId),
      widgetError: selectEtoWidgetError(state.publicEtos as IStatePublicEtos),
    }),
  }),
  onEnterAction({
    actionCreator: (dispatch, props) => {
      dispatch(actions.publicEtos.loadEto(props.etoId, true));
    },
  }),
)(TestEmbededWidgetLayout);

export { TestEmbededWidget };
