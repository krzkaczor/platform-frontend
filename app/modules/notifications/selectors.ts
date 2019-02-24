import { includes, some } from "lodash";

import { appRoutes } from "../../components/appRoutes";
import { IAppState } from "../../store";
import {
  selectBackupCodesVerified,
  selectIsInvestor,
  selectIsUserEmailVerified,
} from "../auth/selectors";
import { selectKycRequestStatus, selectWidgetLoading } from "../kyc/selectors";
import { INotification } from "./interfaces";
import { settingsNotification, settingsNotificationInvestor } from "./reducer";

export const selectNotifications = (state: IAppState): ReadonlyArray<INotification> =>
  state.notifications.notifications;

export const selectIsActionRequiredSettings = (state: IAppState): boolean => {
  if (selectWidgetLoading(state.kyc)) {
    return false;
  }
  return (
    !selectIsUserEmailVerified(state.auth) ||
    !selectBackupCodesVerified(state) ||
    !includes(["Outsourced", "Pending", "Accepted"], selectKycRequestStatus(state))
  );
};

/**
 * Hides notification on blacklisted routes.
 */
export const selectIsVisibleSecurityNotification = (state: IAppState): boolean => {
  const disallowedViewsPaths = [appRoutes.profile, appRoutes.kyc];

  if (
    state.router.location &&
    some(disallowedViewsPaths, p => state.router.location.pathname.startsWith(p))
  ) {
    return false;
  }

  return selectIsActionRequiredSettings(state);
};

export const selectSettingsNotificationType = (state: IAppState) =>
  selectIsInvestor(state) ? settingsNotificationInvestor() : settingsNotification();

export const selectSettingsNotification = (state: IAppState) =>
  selectIsVisibleSecurityNotification(state) ? selectSettingsNotificationType(state) : undefined;
