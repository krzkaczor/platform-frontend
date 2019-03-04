import { Formik, FormikConsumer } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import * as Web3Utils from "web3-utils";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { Button, EButtonLayout } from "../../shared/buttons";
import { Form, FormFieldColorful } from "../../shared/forms";
import { Panel } from "../../shared/Panel";
import { Tooltip } from "../../shared/Tooltip";

import * as cn from "classnames";
import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as styles from "./CheckYourICBMWalletWidget.module.scss";

interface IDispatchProps {
  loadICBMWallet: (address: string) => void;
}

interface IExternalProps {
  layoutClass?: string;
}

class FormContent extends React.Component {
  render(): React.ReactNode {
    return (
      <FormikConsumer>
        {({ values }: { values: { address: string } }) => (
          <>
            <FormFieldColorful
              name="address"
              placeholder="0xff2bee8169957caa2f5a34af7bf8e717fea7f"
              data-test-id="models.profile.icbm-wallet-widget.check-your-icbm-wallet-widget.address"
            />
            <Button
              innerClassName={styles.button}
              layout={EButtonLayout.SECONDARY}
              iconPosition="icon-after"
              svgIcon={arrowRight}
              type="submit"
              disabled={!Web3Utils.isAddress(values.address.toUpperCase())}
            >
              <FormattedMessage id="check-your-icbm-wallet-widget.submit" />
            </Button>
          </>
        )}
      </FormikConsumer>
    );
  }
}

export const CheckYourICBMWalletWidgetComponent: React.FunctionComponent<
  IExternalProps & IDispatchProps
> = ({ loadICBMWallet, layoutClass }) => {
  return (
    <Panel
      headerText={
        <>
          <FormattedMessage id="check-your-icbm-wallet-widget.header" />
          <Tooltip content={<FormattedMessage id="icbm-wallet.tooltip" />} alignLeft={true} />
        </>
      }
      className={cn("h-100", layoutClass)}
      data-test-id="models.profile.icbm-wallet-widget.check-your-icbm-wallet-widget"
    >
      <p>
        <FormattedMessage id="check-your-icbm-wallet-widget.notice" />
      </p>
      <Formik<{ address: string }>
        initialValues={{ address: "" }}
        onSubmit={values => loadICBMWallet(values.address)}
      >
        <Form className={styles.section}>
          <FormContent />
        </Form>
      </Formik>
    </Panel>
  );
};

export const CheckYourICBMWalletWidget = appConnect<IDispatchProps>({
  dispatchToProps: dispatch => ({
    loadICBMWallet: (address: string) => {
      dispatch(actions.icbmWalletBalanceModal.getWalletData(address));
    },
  }),
})(CheckYourICBMWalletWidgetComponent);
