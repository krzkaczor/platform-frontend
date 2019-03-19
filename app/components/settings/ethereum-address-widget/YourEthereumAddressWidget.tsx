import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { selectEthereumAddressWithChecksum } from "../../../modules/web3/selectors";
import { appConnect } from "../../../store";
import { AccountAddress } from "../../shared/AccountAddress";
import { Panel } from "../../shared/Panel";

import * as styles from "./YourEthereumAddressWidget.module.scss";

interface IStateProps {
  address: string;
}

interface IExternalProps {
  layoutClass?: string;
}

export const YourEthereumAddressWidgetComponent: React.FunctionComponent<
  IStateProps & IExternalProps
> = ({ address, layoutClass }) => (
  <Panel
    className={cn("h-100", layoutClass)}
    headerText={<FormattedMessage id="your-ethereum-address-widget.header" />}
  >
    <p>
      <FormattedMessage id="your-ethereum-address-widget.explanation" />
    </p>
    <div className={styles.panelBody}>
      <AccountAddress address={address} />
    </div>
  </Panel>
);

export const YourEthereumAddressWidget = appConnect<IStateProps>({
  stateToProps: state => ({
    address: selectEthereumAddressWithChecksum(state),
  }),
})(YourEthereumAddressWidgetComponent);
