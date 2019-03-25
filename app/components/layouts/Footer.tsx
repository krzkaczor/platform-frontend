import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ExternalLink } from "../shared/links";

import * as logo from "../../assets/img/logo_capitalized.svg";
import * as styles from "./Footer.module.scss";

export const Footer: React.FunctionComponent = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.contentWrapper}>
        <h2>TEST!</h2>
        <div className={styles.links}>
          <ExternalLink href="https://neufund.org/imprint">
            <FormattedMessage id="footer.links.imprint" />
          </ExternalLink>
          <ExternalLink href="https://neufund.org/cms_resources/fifth-force-privacy-policy-2018-11-26.pdf">
            <FormattedMessage id="footer.links.privacy-policy" />
          </ExternalLink>
        </div>
        <div className={styles.content}>
          <img src={logo} className={styles.logo} alt="logo" />
          <div>&copy; FIFTH FORCE GMBH</div>
        </div>
      </div>
    </footer>
  );
};
