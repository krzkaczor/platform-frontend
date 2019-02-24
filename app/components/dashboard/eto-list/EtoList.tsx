import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col } from "reactstrap";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { TBlEtoWithCompanyAndContract } from "../../../modules/public-etos/interfaces/interfaces";
import { selectPublicEtos } from "../../../modules/public-etos/selectors";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { EtoOverviewStatus } from "../../eto/overview/EtoOverviewStatus";
import { EtosComingSoon } from "../../eto/overview/EtoOverviewStatus/EtosComingSoon";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { SectionHeader } from "../../shared/SectionHeader";

import * as styles from "./EtoList.module.scss";

interface IStateProps {
  etos: TBlEtoWithCompanyAndContract[] | undefined;
}

const EtoListComponent: React.FunctionComponent<IStateProps> = ({ etos }) => (
  <>
    <Col xs={12}>
      <SectionHeader>
        <FormattedMessage id="dashboard.eto-opportunities" />
      </SectionHeader>
    </Col>
    <Col xs={12}>
      <p className={styles.opportunitiesDescription}>
        <FormattedMessage id="dashboard.eto-opportunities.description" />
      </p>
    </Col>
    <Col xs={12}>
      {etos ? (
        <>
          {etos.map(eto => (
            <div className="mb-3" key={eto.previewCode}>
              <EtoOverviewStatus eto={eto} />
            </div>
          ))}
          {etos.length < 4 && (
            <div className="mb-3">
              <EtosComingSoon />
            </div>
          )}
        </>
      ) : (
        <LoadingIndicator type="hexagon" />
      )}
    </Col>
  </>
);

export const EtoList = compose<React.ComponentClass>(
  setDisplayName("EtoList"),
  onEnterAction({
    actionCreator: d => {
      d(actions.wallet.loadWalletData());
      d(actions.publicEtos.loadEtos());
    },
  }),
  appConnect<IStateProps>({
    stateToProps: state => ({
      etos: selectPublicEtos(state),
    }),
  }),
)(EtoListComponent);
