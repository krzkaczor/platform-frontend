import * as React from "react";

import * as styles from "./ButtonGroup.module.scss";

const ButtonGroup: React.FunctionComponent = ({ children }) => (
  <section className={styles.buttonGroup}>{children}</section>
);

export { ButtonGroup };
