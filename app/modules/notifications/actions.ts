import { AppActionTypes } from "../../store";
import { createActionFactory } from "../actionsUtils";
import { ENotificationText, ENotificationType } from "./reducer";

export interface INewNotification {
  id?: number;
  type: ENotificationType;
  text: ENotificationText;
  onClickAction?: AppActionTypes;
}

export const notificationActions = {
  notificationAdd: createActionFactory("NOTIFICATIONS_ADD", (notification: INewNotification) => ({
    notification,
  })),

  notificationRemove: createActionFactory("NOTIFICATIONS_REMOVE", (id: number) => ({ id })),
};
