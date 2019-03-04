import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";

import { ChartBars, IChartBarsData } from "../../shared/charts/ChartBars";
import { HorizontalLine } from "../../shared/HorizontalLine";
import { Panel } from "../../shared/Panel";
import { TableBody } from "../../shared/table/TableBody";
import { TableCell } from "../../shared/table/TableCell";
import { TableHeader } from "../../shared/table/TableHeader";
import { TableRow } from "../../shared/table/TableRow";

import * as stylesCommon from "../EtoOverviewCommon.module.scss";

interface IProps {
  chartData: IChartBarsData;
  giniIndex: number;
  tokenDistribution: any[];
}

export const EtoTokenDistribution: React.FunctionComponent<IProps> = ({
  chartData,
  giniIndex,
  tokenDistribution,
}) => (
  <Panel>
    <div className={stylesCommon.container}>
      <Row className="mb-3">
        <Col>
          <strong className={stylesCommon.label}>
            <FormattedMessage id="eto.overview.token-distribution.gini-index" />
          </strong>{" "}
          <span>{giniIndex}</span>
        </Col>
      </Row>
      <HorizontalLine className="my-3" />
      <Row>
        <Col xs={12} md={6}>
          <TableBody>
            <TableHeader>
              <Container>
                <Row>
                  <Col>
                    <FormattedMessage id="eto.overview.token-distribution.table.header" />
                  </Col>
                </Row>
              </Container>
            </TableHeader>
            <TableRow>
              <TableCell>
                <FormattedMessage id="eto.overview.token-distribution.table.share-of-investors" />
              </TableCell>
              <TableCell>
                <FormattedMessage id="eto.overview.token-distribution.table.share-of-tokens-owned" />
              </TableCell>
            </TableRow>
            {tokenDistribution.map((data, index) => (
              <TableRow key={index}>
                <TableCell>{data[0]}</TableCell>
                <TableCell>{data[1]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Col>
        <Col xs={12} md={6}>
          <div className={stylesCommon.chartNarrow}>
            <strong className="mb-2">
              <small>
                <FormattedMessage id="eto.overview.token-distribution.table.chart-description" />
              </small>
            </strong>
            <ChartBars data={chartData} />
          </div>
        </Col>
      </Row>
    </div>
  </Panel>
);
