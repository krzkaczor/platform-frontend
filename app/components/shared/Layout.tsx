import * as React from "react";
import * as styles from "./Layout.module.scss";

export const GridBaseLayout:React.FunctionComponent<{dataTestId?:string}> = ({children, dataTestId}) =>
  <div className={styles.layout} data-test-id={dataTestId}>
    {children}
  </div>

export const WidgetGridLayout:React.FunctionComponent<{dataTestId?:string}> = ({children, dataTestId}) =>
  <div className={styles.widgetLayout} data-test-id={dataTestId}>
    {children}
  </div>
