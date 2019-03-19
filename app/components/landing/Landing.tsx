import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";
import { compose } from "redux";

import { etoCompaniesCards } from "../../data/etoCompanies";
import { withContainer } from "../../utils/withContainer";
import { LayoutUnauthorized } from "../layouts/LayoutUnauthorized";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryLayoutUnauthorized } from "../shared/errorBoundary/ErrorBoundaryLayoutUnauthorized";
import { EtoOfferingCard } from "./EtoOfferingCard";
import { Features } from "./parts/Features";
import { LandingFeatured } from "./parts/LandingFeatured";
import { LandingHeader } from "./parts/LandingHeader";
import { Testimonials } from "./parts/Testimonials";

import * as styles from "./Landing.module.scss";

export const LandingComponent: React.FunctionComponent = () => (
  <div className={cn(styles.landingWrapper, "pure")} data-test-id="landing-page">
    {process.env.NF_FEATURED_ETO_PREVIEW_CODE ? (
      <LandingFeatured />
    ) : (
      <>
        <LandingHeader />
        <Features />
      </>
    )}

    <section className={styles.equityTokenOfferings}>
      <Container>
        <Row>
          <Col>
            <h2 className={styles.etoCardsHeader}>
              <FormattedMessage id="platform.landing.meet-tokenizing-companies" />
            </h2>
          </Col>
        </Row>

        <Row>
          {etoCompaniesCards.filter(e => !e.hidden).map((e, index) => (
            <Col
              xs={12}
              lg={6}
              className={styles.equityTokenCol}
              id={`eto-card-${index}`}
              key={index}
            >
              <EtoOfferingCard {...e} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>

    <Testimonials />
  </div>
);

export const Landing: React.FunctionComponent = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryLayoutUnauthorized),
  withContainer(LayoutUnauthorized),
)(LandingComponent);
