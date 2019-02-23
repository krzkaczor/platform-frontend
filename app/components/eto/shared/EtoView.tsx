import * as cn from "classnames";
import { some } from "lodash";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { externalRoutes } from "../../../config/externalRoutes";
import { EETOStateOnChain, TBlEtoWithCompanyAndContract } from "../../../modules/public-etos/interfaces/interfaces";
import { isOnChain } from "../../../modules/public-etos/utils";
import { withMetaTags } from "../../../utils/withMetaTags";
import { withParams } from "../../../utils/withParams";
import { PersonProfileModal } from "../../modals/PersonProfileModal";
import { Accordion, AccordionElement } from "../../shared/Accordion";
import { ButtonLink } from "../../shared/buttons";
import { ChartDoughnut } from "../../shared/charts/ChartDoughnut";
import { ExternalLink } from "../../shared/links";
import { ILink, MediaLinksWidget, normalizedUrl } from "../../shared/MediaLinksWidget";
import { Panel } from "../../shared/Panel";
import { IPerson, PeopleSwiperWidget } from "../../shared/PeopleSwiperWidget";
import { SectionHeader } from "../../shared/SectionHeader";
import { Slides } from "../../shared/Slides";
import { IEtoSocialProfile, SocialProfilesList } from "../../shared/SocialProfilesList";
import { TabContent, Tabs } from "../../shared/Tabs";
import { TwitterTimelineEmbed } from "../../shared/TwitterTimeline";
import { Video } from "../../shared/Video";
import { EtoOverviewStatus } from "../overview/EtoOverviewStatus";
import { EtoTimeline } from "../overview/EtoTimeline";
import { Cover } from "../public-view/Cover";
import { DocumentsWidget } from "../public-view/DocumentsWidget";
import { EtoInvestmentTermsWidget } from "../public-view/EtoInvestmentTermsWidget";
import { LegalInformationWidget } from "../public-view/LegalInformationWidget";
import { areThereIndividuals, selectActiveCarouselTab } from "./EtoView.utils";

import * as styles from "./EtoView.module.scss";

const DEFAULT_PLACEHOLDER = "N/A";

export const CHART_COLORS = ["#50e3c2", "#2fb194", "#4a90e2", "#0b0e11", "#394652", "#c4c5c6"];
export const DEFAULT_CHART_COLOR = "#c4c5c6";

interface IProps {
  eto: TBlEtoWithCompanyAndContract;
}

// TODO: There are lots of castings right now in this file, cause formerly the types of IProps was "any"
// The castings should be resolved when the EtoApi.interface.ts reflects the correct data types from swagger!

// TODO: Refactor to smaller components
const EtoViewLayout: React.FunctionComponent<IProps> = ({ eto }) => {
  const {
    advisors,
    companyDescription,
    keyQuoteInvestor,
    socialChannels,
    companyVideo,
    categories,
    disableTwitterFeed,
    companySlideshare,
    brandName,
    companyOneliner,
    companyLogo,
    companyWebsite,
    companyBanner,
    team,
    boardMembers,
    keyAlliances,
    keyCustomers,
    partners,
    notableInvestors,
    keyBenefitsForInvestors,
    targetMarketAndIndustry,
    roadmap,
    marketingApproach,
    useOfCapitalList,
    inspiration,
    companyMission,
    marketTraction,
    problemSolved,
    productVision,
    customerGroup,
    sellingProposition,
    keyCompetitors,
    companyNews,
    marketingLinks,
    businessModel,
    useOfCapital,
  } = eto.company;

  const isTwitterFeedEnabled =
    some(socialChannels, (channel: any) => channel.type === "twitter" && channel.url.length) &&
    !disableTwitterFeed;
  const isYouTubeVideoAvailable = !!(companyVideo && companyVideo.url);
  const isSlideShareAvailable = !!(companySlideshare && companySlideshare.url);
  const hasSocialChannelsAdded = !!(socialChannels && socialChannels.length);
  const twitterUrl =
    isTwitterFeedEnabled && socialChannels
      ? socialChannels.find(c => c.type === "twitter")!.url //fixme
      : "";

  const isInSetupState = isOnChain(eto) && eto.contract.timedState === EETOStateOnChain.Setup;

  return (
    <>
      <PersonProfileModal />
      <article data-test-id="eto.public-view">
        <Cover
          companyName={brandName}
          companyOneliner={companyOneliner}
          companyLogo={{
            alt: brandName,
            srcSet: {
              "1x": companyLogo,
            },
          }}
          companyBanner={{
            alt: brandName,
            srcSet: {
              "1x": companyBanner,
            },
          }}
          tags={categories}
        />
        <EtoOverviewStatus eto={eto} className="mb-3" publicView={true} />
        <Row>
          <Col className="mb-4">
            <SectionHeader decorator={false} className="mb-3">
              <div className={styles.headerWithButton}>
                <FormattedMessage id="eto.public-view.eto-timeline" />
                {process.env.NF_MAY_SHOW_INVESTOR_STATS === "1" &&
                  !isInSetupState && (
                    <ButtonLink
                      to={withParams(externalRoutes.icoMonitorEto, { etoId: eto.etoId })}
                      target="_blank"
                    >
                      <FormattedMessage id="eto.public-view.fundraising-statistics-button" />
                    </ButtonLink>
                  )}
              </div>
            </SectionHeader>
            <Panel>
              <EtoTimeline
                startOfStates={isOnChain(eto) ? eto.contract.startOfStates : undefined}
              />
            </Panel>
          </Col>
        </Row>
        <Row className="align-items-stretch">
          <Col
            xs={12}
            md={
              isSlideShareAvailable ||
              isTwitterFeedEnabled ||
              isYouTubeVideoAvailable ||
              hasSocialChannelsAdded
                ? 8
                : 12
            }
            className="mb-4"
          >
            <SectionHeader decorator={false} className="mb-4">
              <div className={styles.headerWithButton}>
                {brandName}
                {companyWebsite && (
                  <ExternalLink href={normalizedUrl(companyWebsite)}>
                    {companyWebsite.split("//")[1] || DEFAULT_PLACEHOLDER}
                  </ExternalLink>
                )}
              </div>
            </SectionHeader>

            {(companyDescription || keyQuoteInvestor) && (
              <Panel className="mb-4">
                {companyDescription && <p className="mb-4">{companyDescription}</p>}
                {keyQuoteInvestor && <p className={cn(styles.quote, "mb-4")}>{keyQuoteInvestor}</p>}
              </Panel>
            )}

            <SectionHeader decorator={false} className="mb-4">
              <FormattedMessage id="eto.public-view.legal-information.title" />
            </SectionHeader>

            <LegalInformationWidget companyData={eto.company} />
          </Col>
          {(isYouTubeVideoAvailable || isSlideShareAvailable) && (
            <Col xs={12} md={4} className="mb-4 flex-column d-flex">
              <Tabs className="mb-4" layoutSize="large" layoutOrnament={false}>
                {isYouTubeVideoAvailable && (
                  <TabContent tab="video">
                    <Video youTubeUrl={companyVideo && companyVideo.url} hasModal />
                  </TabContent>
                )}
                {isSlideShareAvailable && (
                  <TabContent tab="pitch deck">
                    <Slides slideShareUrl={companySlideshare && companySlideshare.url} />
                  </TabContent>
                )}
              </Tabs>
              <div
                className={cn(
                  (isSlideShareAvailable || isTwitterFeedEnabled || isYouTubeVideoAvailable) &&
                    "mt-4",
                )}
              >
                <SocialProfilesList profiles={(socialChannels as IEtoSocialProfile[]) || []} />
              </div>
              {isTwitterFeedEnabled && (
                <>
                  <SectionHeader decorator={false} className="mt-4 mb-4">
                    Twitter
                  </SectionHeader>
                  <Panel
                    narrow
                    className={cn(styles.twitterPanel, "align-self-stretch", "flex-grow-1")}
                  >
                    <TwitterTimelineEmbed url={twitterUrl} userName={brandName} />
                  </Panel>
                </>
              )}
            </Col>
          )}
        </Row>
        <Row>
          <Col className="mb-4">
            <SectionHeader decorator={false} className="mb-4">
              <FormattedMessage id="eto.public-view.token-terms.title" />
            </SectionHeader>

            <EtoInvestmentTermsWidget etoData={eto} />
          </Col>
        </Row>
        {areThereIndividuals(team) && (
          <Row>
            <Col className="mb-4">
              <SectionHeader decorator={false} className="mb-4">
                <FormattedMessage id="eto.public-view.carousel.team" />
              </SectionHeader>
              <Panel>
                <PeopleSwiperWidget
                  people={(team && (team.members as IPerson[])) || []}
                  key={"team"}
                />
              </Panel>
            </Col>
          </Row>
        )}
        {(areThereIndividuals(advisors) ||
          areThereIndividuals(notableInvestors) ||
          areThereIndividuals(partners) ||
          areThereIndividuals(keyCustomers) ||
          areThereIndividuals(keyAlliances) ||
          areThereIndividuals(boardMembers)) && (
          <Row>
            <Col className="mb-4">
              <Tabs
                className="mb-4"
                layoutSize="large"
                layoutOrnament={false}
                selectedIndex={selectActiveCarouselTab([
                  advisors,
                  notableInvestors,
                  partners,
                  keyCustomers,
                  boardMembers,
                  keyAlliances,
                ])}
              >
                {areThereIndividuals(advisors) && (
                  <TabContent tab={<FormattedMessage id="eto.public-view.carousel.tab.advisors" />}>
                    <Panel>
                      <PeopleSwiperWidget people={advisors.members as IPerson[]} key={"team"} />
                    </Panel>
                  </TabContent>
                )}
                {areThereIndividuals(notableInvestors) && (
                  <TabContent
                    tab={<FormattedMessage id="eto.public-view.carousel.tab.investors" />}
                  >
                    <Panel>
                      <PeopleSwiperWidget
                        people={notableInvestors.members as IPerson[]}
                        key="notableInvestors"
                      />
                    </Panel>
                  </TabContent>
                )}
                {areThereIndividuals(partners) && (
                  <TabContent tab={<FormattedMessage id="eto.public-view.carousel.tab.partners" />}>
                    <Panel>
                      <PeopleSwiperWidget people={partners.members as IPerson[]} key="partners" />
                    </Panel>
                  </TabContent>
                )}
                {areThereIndividuals(keyCustomers) && (
                  <TabContent
                    tab={<FormattedMessage id="eto.public-view.carousel.tab.key-customers" />}
                  >
                    <Panel>
                      <PeopleSwiperWidget
                        key="keyCustomers"
                        people={keyCustomers.members as IPerson[]}
                      />
                    </Panel>
                  </TabContent>
                )}
                {areThereIndividuals(boardMembers) && (
                  <TabContent
                    tab={<FormattedMessage id="eto.public-view.carousel.tab.board-members" />}
                  >
                    <Panel>
                      <PeopleSwiperWidget
                        key="boardMembers"
                        people={boardMembers.members as IPerson[]}
                      />
                    </Panel>
                  </TabContent>
                )}
                {areThereIndividuals(keyAlliances) && (
                  <TabContent
                    tab={<FormattedMessage id="eto.public-view.carousel.tab.key-alliances" />}
                  >
                    <Panel>
                      <PeopleSwiperWidget
                        key="keyAlliances"
                        people={keyAlliances.members as IPerson[]}
                      />
                    </Panel>
                  </TabContent>
                )}
              </Tabs>
            </Col>
          </Row>
        )}
        <Row>
          <Col sm={12} md={8} className="mb-4">
            {(inspiration ||
              companyMission ||
              customerGroup ||
              productVision ||
              problemSolved ||
              marketTraction ||
              keyCompetitors ||
              sellingProposition ||
              useOfCapitalList ||
              marketingApproach ||
              roadmap ||
              targetMarketAndIndustry ||
              keyBenefitsForInvestors) && (
              <>
                <SectionHeader decorator={false} className="mb-4">
                  <FormattedMessage id="eto.public-view.product-vision.title" />
                </SectionHeader>
                <Panel>
                  <Accordion>
                    {inspiration && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.inspiration" />}
                      >
                        <p>{inspiration}</p>
                      </AccordionElement>
                    )}
                    {companyMission && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.company-mission" />}
                      >
                        <p>{companyMission}</p>
                      </AccordionElement>
                    )}
                    {productVision && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.product-vision" />}
                      >
                        <p>{productVision}</p>
                      </AccordionElement>
                    )}
                    {problemSolved && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.problem-solved" />}
                      >
                        <p>{problemSolved}</p>
                      </AccordionElement>
                    )}
                    {customerGroup && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.customer-group" />}
                      >
                        <p>{customerGroup}</p>
                      </AccordionElement>
                    )}
                    {targetMarketAndIndustry && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.target-segment" />}
                      >
                        <p>{targetMarketAndIndustry}</p>
                      </AccordionElement>
                    )}
                    {keyCompetitors && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.key-competitors" />}
                      >
                        <p>{keyCompetitors}</p>
                      </AccordionElement>
                    )}
                    {sellingProposition && (
                      <AccordionElement
                        title={
                          <FormattedMessage id="eto.form.product-vision.selling-proposition" />
                        }
                      >
                        <p>{sellingProposition}</p>
                      </AccordionElement>
                    )}
                    {keyBenefitsForInvestors && (
                      <AccordionElement
                        title={
                          <FormattedMessage id="eto.form.product-vision.key-benefits-for-investors" />
                        }
                      >
                        <p>{keyBenefitsForInvestors}</p>
                      </AccordionElement>
                    )}

                    {((useOfCapitalList && useOfCapitalList.some((e: any) => e.percent > 0)) ||
                      useOfCapital) && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.use-of-capital" />}
                      >
                        <Row>
                          {useOfCapital && (
                            <Col>
                              <p>{useOfCapital}</p>
                            </Col>
                          )}

                          {useOfCapitalList && (
                            <Col md={12} lg={6}>
                              <ChartDoughnut
                                className="pr-5 pb-4"
                                layout="vertical"
                                data={{
                                  datasets: [
                                    {
                                      data: useOfCapitalList.map(d => d && d.percent.toNumber()),
                                      backgroundColor: useOfCapitalList.map(
                                        (_, i: number) => CHART_COLORS[i],
                                      ),
                                    },
                                  ],
                                  labels: (useOfCapitalList || []).map(
                                    d => d && d.description,
                                  ),
                                }}
                              />
                            </Col>
                          )}
                        </Row>
                      </AccordionElement>
                    )}
                    {marketTraction && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.market-traction" />}
                      >
                        <p>{marketTraction}</p>
                      </AccordionElement>
                    )}
                    {roadmap && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.roadmap" />}
                      >
                        <p>{roadmap}</p>
                      </AccordionElement>
                    )}
                    {businessModel && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.business-model" />}
                      >
                        <p>{businessModel}</p>
                      </AccordionElement>
                    )}
                    {marketingApproach && (
                      <AccordionElement
                        title={<FormattedMessage id="eto.form.product-vision.marketing-approach" />}
                      >
                        <p>{marketingApproach}</p>
                      </AccordionElement>
                    )}
                  </Accordion>
                </Panel>
              </>
            )}
          </Col>
          <Col sm={12} md={4}>
            {marketingLinks && (
              <>
                <SectionHeader decorator={false} className="mb-4">
                  <FormattedMessage id="eto.form.documents.title" />
                </SectionHeader>

                <DocumentsWidget
                  className="mb-4"
                  companyMarketingLinks={marketingLinks}
                  etoTemplates={eto.templates}
                  etoDocuments={eto.documents}
                  isRetailEto={eto.allowRetailInvestors}
                />
              </>
            )}

            {companyNews &&
              !!companyNews[0].url && (
                <>
                  <SectionHeader decorator={false} className="mb-4">
                    <FormattedMessage id="eto.form.media-links.title" />
                  </SectionHeader>
                  <MediaLinksWidget links={[...companyNews].reverse() as ILink[]} />
                </>
              )}
          </Col>
        </Row>
      </article>
    </>
  );
};

const EtoView = withMetaTags<IProps>(({ eto }, intl) => {
  const requiredDataPresent = eto.company.brandName && eto.equityTokenName && eto.equityTokenSymbol;

  return {
    title: requiredDataPresent
      ? `${eto.company.brandName} - ${eto.equityTokenName} (${eto.equityTokenSymbol})`
      : intl.formatIntlMessage("menu.eto-page"),
  };
})(EtoViewLayout);

export { EtoView, EtoViewLayout };
