import * as React from "react";
import { Col } from "reactstrap";

import { etoCompaniesCards } from "../../../data/etoCompanies";
import { EtoCard } from "../../shared/EtoCard";
import { Heading } from "../../shared/Heading";

export const EtoListDummies: React.FunctionComponent = () => (
  <>
    <Col xs={12}>
      <Heading level={3}>ETO Offerings</Heading>
    </Col>
    {etoCompaniesCards.map((eto, index) => (
      <Col xs={12} lg={6} key={index}>
        <EtoCard {...eto} className="responsive" />
      </Col>
    ))}
  </>
);
