import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TDataTestId, TTranslatedString } from "../../../types";
import { Panel } from "../Panel";

import * as styles from "./NewTable.module.scss";

export enum ENewTableCellLayout {
  TOP = "top",
  MIDDLE = "middle",
  BOTTOM = "bottom",
}

interface INewTableTitle {
  title: TTranslatedString | React.ReactNode;
  width: string;
}

interface INewTableHeader {
  titles: (INewTableTitle | TTranslatedString | React.ReactNode)[];
}

interface INewTableRow {
  children: React.ReactNode[];
  cellLayout?: ENewTableCellLayout;
}

interface IPlaceholderTableRow {
  children?: TTranslatedString;
  numberOfCells: number;
}

type INewTableChildren =
  | React.ReactElement<INewTableRow | null>
  | React.ReactElement<INewTableRow | null>[]
  | null;

interface INewTable {
  children: INewTableChildren | INewTableChildren[];
  placeholder?: TTranslatedString;
  className?: string;
  keepRhythm?: boolean;
}

type TProps = INewTable & INewTableHeader;

const NewTableRow: React.FunctionComponent<INewTableRow & TDataTestId> = ({
  children,
  ["data-test-id"]: dataTestId,
  cellLayout,
}) => (
  <tr className={styles.row} data-test-id={dataTestId}>
    {React.Children.toArray(children).map((child, index) => {
      return (
        <td className={cn(styles.cell, cellLayout)} key={index}>
          {child}
        </td>
      );
    })}
  </tr>
);

const PlaceholderTableRow: React.FunctionComponent<IPlaceholderTableRow> = ({
  children,
  numberOfCells,
}) => (
  <tr className={styles.row}>
    <td className={cn(styles.cell, styles.cellPlaceholder)} colSpan={numberOfCells}>
      {children || <FormattedMessage id="shared-components.table.default-placeholder" />}
    </td>
  </tr>
);

const NewTable: React.FunctionComponent<TProps> = ({
  titles,
  children,
  className,
  placeholder,
  keepRhythm,
}) => {
  // We have to filter empty nodes in case of any conditional rendering inside table
  const isEmpty = React.Children.toArray(children).filter(React.isValidElement).length === 0;

  return (
    <Panel className={styles.panel}>
      <div className={cn(styles.tableWrapper, className, { "keep-rhythm": keepRhythm })}>
        <table className={styles.table}>
          <thead className={styles.header}>
            <tr>
              {titles.map((value, index) => {
                return value && typeof value === "object" && "width" in value ? (
                  <th className={styles.cell} key={index} style={{ width: value.width }}>
                    {value.title}
                  </th>
                ) : (
                  <th className={styles.cell} key={index}>
                    {value}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {isEmpty ? (
              <PlaceholderTableRow numberOfCells={titles.length}>{placeholder}</PlaceholderTableRow>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
};

export { NewTable, NewTableRow };
