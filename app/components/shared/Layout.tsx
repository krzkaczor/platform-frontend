import * as React from "react";
import * as cn from "classnames"

import * as styles from "./Layout.module.scss";

export const GridBaseLayout:React.FunctionComponent<{dataTestId?:string, additionalStyling?:string}> = ({children, dataTestId, additionalStyling}) =>
  <article className={cn(styles.layout, additionalStyling)} data-test-id={dataTestId}>
    {children}
  </article>

export const WidgetGridLayout:React.FunctionComponent<{dataTestId?:string}> = ({children, dataTestId}) =>
  <div className={styles.widgetLayout} data-test-id={dataTestId}>
    {children}
  </div>
