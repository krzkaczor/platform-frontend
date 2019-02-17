import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ENotificationText, ENotificationType } from "../../../modules/notifications/interfaces";
import { Button, ButtonClose, ButtonTextPosition, ButtonWidth, EButtonLayout } from "../buttons";

import * as infoIcon from "../../../assets/img/notifications/info.svg";
import * as warningIcon from "../../../assets/img/notifications/warning.svg";
import * as styles from "./Notification.module.scss";

export interface INotificationProps {
  type: ENotificationType;
  text: ENotificationText;
  onClick?: () => void;
}

export interface INotificationContentProps {
  type: ENotificationType;
  text: ENotificationText;
}

const icons = {
  [ENotificationType.INFO]: infoIcon,
  [ENotificationType.WARNING]: warningIcon,
};

const notificationTexts = {
  [ENotificationText.COMPLETE_REQUEST_NOTIFICATION]: (
    <FormattedMessage id="notifications.complete-request" />
  ),
  [ENotificationText.COMPLETE_UPDATE_ACCOUNT]: (
    <FormattedMessage id="notifications.update-account" />
  ),
};

const NotificationContent: React.FunctionComponent<INotificationContentProps> = ({
  text,
  type,
}) => (
  <div className={cn(styles.notification, type)}>
    <i className={`${styles.iconNotificationType}`}>
      <img src={icons[type]} alt="" />
    </i>
    <span data-test-id="notification-text" className={styles.text}>
      {notificationTexts[text]}
    </span>
  </div>
);

const Notification: React.FunctionComponent<INotificationProps> = ({ type, text, onClick }) => {
  return (
    <section data-test-id="notification" className={cn(styles.notificationWrapper)}>
      {onClick ? (
        <Button
          data-test-id="notification-button"
          layout={EButtonLayout.SIMPLE}
          width={ButtonWidth.BLOCK}
          textPosition={ButtonTextPosition.LEFT}
          onClick={onClick}
        >
          <NotificationContent text={text} type={type} />
        </Button>
      ) : (
        <NotificationContent text={text} type={type} />
      )}

      {onClick && (
        <ButtonClose className={styles.close} data-test-id="notification-close" onClick={onClick} />
      )}
    </section>
  );
};

export { Notification, NotificationContent };
