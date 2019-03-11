import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TTranslatedString } from "../../types";
import { copyToClipboard } from "../../utils/copyToClipboard";
import { ButtonIcon } from "./buttons";
import { showInfoToast } from "./Toast";

import * as clipboardIcon from "../../assets/img/inline_icons/icon-clipboard.svg";

interface IProps {
  value: React.ReactNode;
  alt?: TTranslatedString;
  message?: TTranslatedString;
  className?: string;
  "data-test-id"?: string;
}

class CopyToClipboardButton extends React.Component<IProps> {
  copyToClipboard = () => {
    copyToClipboard(this.props.value);

    showInfoToast(
      this.props.message || <FormattedMessage id="shared-component.copy-to-clipboard.copied" />,
    );
  };

  render(): React.ReactNode {
    const { className, alt } = this.props;

    return (
      <ButtonIcon
        className={className}
        svgIcon={clipboardIcon}
        alt={alt || <FormattedMessage id="shared-component.copy-to-clipboard.alt" />}
        onClick={this.copyToClipboard}
      />
    );
  }
}

export { CopyToClipboardButton };
