import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { actions } from "../actions";
import { routingActions } from "../routing/actions";
import { notificationActions } from "./actions";
import {INotificationsState, ENotificationType, ENotificationText} from './interfaces'

export const notificationsInitState: INotificationsState = {
  notifications: [],
};

export const notificationsReducer: AppReducer<INotificationsState> = (
  state = notificationsInitState,
  action,
): DeepReadonly<INotificationsState> => {
  switch (action.type) {
    case actions.notifications.notificationAdd.getType(): {
      const pNotification = action.payload.notification;

      const newState = {
        notifications: Array.from(state.notifications),
      };

      const id = pNotification.id ? pNotification.id : Date.now();

      newState.notifications.push({
        id: id,
        type: pNotification.type,
        text: pNotification.text,
        onClickAction: pNotification.onClickAction
          ? pNotification.onClickAction
          : notificationActions.notificationRemove(id),
      });
      return newState;
    }
    case actions.notifications.notificationRemove.getType():
      const notificationsFiltered = state.notifications.filter(
        notification => notification.id !== action.payload.id,
      );
      return {
        ...state,
        notifications: notificationsFiltered,
      };
  }
  return state;
};

export const settingsNotification = () => ({
  id: Date.now(),
  type: ENotificationType.WARNING,
  text: ENotificationText.COMPLETE_UPDATE_ACCOUNT,
  actionLinkText: "Go to profile",
  onClickAction: routingActions.goToProfile(),
});

export const settingsNotificationInvestor = () => ({
  id: Date.now(),
  type: ENotificationType.WARNING,
  text: ENotificationText.COMPLETE_REQUEST_NOTIFICATION,
  onClickAction: routingActions.goToProfile(),
  clickable: true,
});
