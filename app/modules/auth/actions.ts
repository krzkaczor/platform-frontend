import { createAction, createSimpleAction } from "../actionsUtils";
import { EUserType, IStateUser } from "./interfaces";

export const authActions = {
  loadJWT: (jwt: string) => createAction("AUTH_LOAD_JWT", { jwt }),
  setUser: (user: IStateUser) => createAction("AUTH_SET_USER", { user }),
  logout: (userType?: EUserType) => createAction("AUTH_LOGOUT", { userType }),
  verifyEmail: () => createSimpleAction("AUTH_VERIFY_EMAIL"),
};
