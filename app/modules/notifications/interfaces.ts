import { AppActionTypes } from "../../store";

export enum ENotificationType {
  INFO = "info",
  WARNING = "warning",
}

export enum ENotificationText {
  COMPLETE_REQUEST_NOTIFICATION = "completeRequestNotification",
  COMPLETE_UPDATE_ACCOUNT = "completeUpdateAccount",
}

export interface INotification {
  id: number;
  type: ENotificationType;
  text: ENotificationText;
  onClickAction: AppActionTypes;
}

export interface INotificationsState {
  notifications: Array<INotification>;
}
