import * as cn from "classnames";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { copyToClipboard } from "../../../utils/copyToClipboard";
import { Button, ButtonGroup, EButtonLayout } from "../../shared/buttons";
import { Heading } from "../../shared/Heading";
import { showInfoToast } from "../../shared/Toast";

import * as blindIcon from "../../../assets/img/inline_icons/blind.svg";
import * as eyeIcon from "../../../assets/img/inline_icons/eye.svg";
import * as clipboardIcon from "../../../assets/img/inline_icons/icon-clipboard.svg";
import * as styles from "./PrivateKeyDisplay.module.scss";

type TProps = {
  privateKey: string;
};

type TState = {
  showPrivateKey: boolean;
};

class PrivateKeyDisplay extends React.Component<TProps, TState> {
  state = {
    showPrivateKey: false,
  };

  togglePrivateKeyVisibility = () => {
    this.setState(state => ({ showPrivateKey: !state.showPrivateKey }));
  };

  copyPrivateKeyToClipboard = () => {
    copyToClipboard(this.props.privateKey);

    showInfoToast(
      <FormattedMessage id="components.settings.private-key-display.copied-to-clipboard" />,
      { "data-test-id": "private-key-display-copied-to-clipboard" },
    );
  };

  render(): React.ReactNode {
    const { privateKey } = this.props;
    const { showPrivateKey } = this.state;

    return (
      <section className="mb-4">
        <Heading level={3} data-test-id="eto-dashboard-application" className="mb-3">
          <FormattedMessage id="components.settings.private-key-display.header" />
        </Heading>
        <p>
          <FormattedHTMLMessage
            tagName="span"
            id="components.settings.private-key-display.description"
          />
        </p>
        <ButtonGroup>
          <Button
            data-test-id="private-key-display.copy-to-clipboard"
            className={styles.button}
            innerClassName={styles.content}
            layout={EButtonLayout.SIMPLE}
            onClick={this.copyPrivateKeyToClipboard}
            type="button"
            svgIcon={clipboardIcon}
            iconPosition="icon-after"
          >
            <FormattedMessage id="components.settings.private-key-display.copy-private-key" />
          </Button>
          <Button
            aria-live="polite"
            data-test-id="private-key-display.view-private-key"
            className={styles.button}
            innerClassName={cn(styles.content, { [styles.contentActive]: showPrivateKey })}
            layout={EButtonLayout.SIMPLE}
            onClick={this.togglePrivateKeyVisibility}
            svgIcon={showPrivateKey ? blindIcon : eyeIcon}
            iconPosition="icon-after"
          >
            {showPrivateKey ? (
              privateKey
            ) : (
              <FormattedMessage id="components.settings.private-key-display.view-private-key" />
            )}
          </Button>
        </ButtonGroup>
      </section>
    );
  }
}

export { PrivateKeyDisplay };
