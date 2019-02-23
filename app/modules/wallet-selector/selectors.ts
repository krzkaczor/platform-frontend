import { RouterState } from "connected-react-router";
import { appRoutes } from "../../components/appRoutes";
import { IAppState } from "../../store";
import { EUserType } from "../auth/interfaces";

export const selectUrlUserType = (router: RouterState): EUserType =>
  router.location && router.location.pathname.includes("eto")
    ? EUserType.ISSUER
    : EUserType.INVESTOR;

export const selectIsLoginRoute = (state: RouterState): boolean =>
  !!state.location && state.location.pathname.includes("login");

export const selectRootPath = (state: RouterState): string => {
  if (selectUrlUserType(state) === EUserType.INVESTOR) {
    return selectIsLoginRoute(state) ? appRoutes.login : appRoutes.register;
  } else {
    return selectIsLoginRoute(state) ? appRoutes.loginEto : appRoutes.registerEto;
  }
};

export const selectOppositeRootPath = (state: RouterState): string => {
  if (selectUrlUserType(state) === EUserType.INVESTOR) {
    return selectIsLoginRoute(state) ? appRoutes.register : appRoutes.login;
  } else {
    return selectIsLoginRoute(state) ? appRoutes.registerEto : appRoutes.loginEto;
  }
};

export const selectIsMessageSigning = (state: IAppState): boolean =>
  !!state.walletSelector.isMessageSigning;
