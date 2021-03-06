import { EUserType, IUser } from "../../lib/api/users/interfaces";
import { createAction, createSimpleAction } from "../actionsUtils";

export const authActions = {
  loadJWT: (jwt: string) => createAction("AUTH_LOAD_JWT", { jwt }),
  setUser: (user: IUser) => createAction("AUTH_SET_USER", { user }),
  logout: (userType?: EUserType, disableRedirect?: boolean) =>
    createAction("AUTH_LOGOUT", { userType, disableRedirect }),
  verifyEmail: () => createSimpleAction("AUTH_VERIFY_EMAIL"),
};
