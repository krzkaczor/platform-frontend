import * as cn from "classnames";
import * as React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "reactstrap";

import { actions } from "../../modules/actions";
import { EUserType } from "../../modules/auth/interfaces";
import { selectIsAuthorized, selectUserType } from "../../modules/auth/selectors";
import { appConnect } from "../../store";
import { appRoutes } from "../appRoutes";
import { Button, ButtonLink, EButtonLayout } from "../shared/buttons";
import { loginWalletRoutes, walletRegisterRoutes } from "../wallet-selector/walletRoutes";

import * as logo from "../../assets/img/logo_yellow.svg";
import * as logoText from "../../assets/img/neufund-logo.svg";
import * as styles from "./Header.module.scss";

interface IStateProps {
  isAuthorized: boolean;
  location: any;
  userType?: EUserType;
}

interface IDispatchProps {
  logout: (userType?: EUserType) => void;
}

export const HeaderComponent: React.FunctionComponent<IStateProps & IDispatchProps> = props => (
  <Navbar dark className={cn(styles.bar, "flex-nowrap")}>
    <Link to={appRoutes.root} className={styles.logo}>
      <img src={logo} className={styles.logoImage} />
      <img src={logoText} alt="NEUFUND" className={styles.logoText} />
    </Link>
    {props.isAuthorized ? (
      <Button
        layout={EButtonLayout.SECONDARY}
        theme="white"
        onClick={() => props.logout(props.userType)}
        data-test-id="Header-logout"
      >
        LOGOUT
      </Button>
    ) : (
      <div className={styles.buttons}>
        {props.location && props.location.indexOf("eto") !== -1 ? (
          <>
            <ButtonLink
              theme="white"
              innerClassName={cn(styles.registerButton, styles.resizableButton)}
              data-test-id="Header-register-eto"
              isActive={false}
              to={appRoutes.registerEto}
            >
              REGISTER
            </ButtonLink>
            <ButtonLink
              theme="white"
              innerClassName={styles.resizableButton}
              data-test-id="Header-login-eto"
              isActive={false}
              to={appRoutes.loginEto}
            >
              LOGIN
            </ButtonLink>
          </>
        ) : (
          <>
            <ButtonLink
              theme="white"
              innerClassName={cn(styles.registerButton, styles.resizableButton)}
              data-test-id="Header-register"
              isActive={false}
              to={walletRegisterRoutes.light}
            >
              REGISTER
            </ButtonLink>
            <ButtonLink
              theme="white"
              innerClassName={styles.resizableButton}
              data-test-id="Header-login"
              isActive={false}
              to={loginWalletRoutes.light}
            >
              LOGIN
            </ButtonLink>
          </>
        )}
      </div>
    )}
  </Navbar>
);

export const Header = appConnect<IStateProps, IDispatchProps>({
  stateToProps: s => ({
    isAuthorized: selectIsAuthorized(s.auth),
    location: s.router.location && s.router.location.pathname,
    userType: selectUserType(s),
  }),
  dispatchToProps: dispatch => ({
    logout: (userType?: EUserType) => {
      dispatch(actions.auth.logout(userType));
    },
  }),
})(HeaderComponent);
