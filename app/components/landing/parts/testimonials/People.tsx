import * as React from "react";
import Slider, { Settings } from "react-slick";

import { HiResImage } from "../../../shared/HiResImage";
import { ExternalLink } from "../../../shared/links";

import * as styles from "./People.module.scss";

interface IPersonInfoProps {
  imageSrc: string;
  fullName: string;
  description: string;
  link: string;
  setDangerouslyDescription?: boolean;
}

const people: Array<IPersonInfoProps> = [
  {
    imageSrc: "landing/testimonials/people/Julian",
    fullName: "JULIAN ZAWISTOWSKI",
    description: "Founder of Golem Project,  one of the first & biggest ICOs",
    link: "https://golem.network/",
  },
  {
    imageSrc: "landing/testimonials/people/Alexander",
    fullName: "ALEXANDER LANGE",
    description: "Investor at Index Ventures, crypto expert and VC, previously at Early Bird VC",
    link: "https://www.indexventures.com/",
  },
  {
    imageSrc: "landing/testimonials/people/Max",
    description: "President of LISK Foundation, one of the first & biggest ICOs",
    fullName: "MAX KORDEK",
    link: "https://lisk.io/",
  },
  {
    imageSrc: "landing/testimonials/people/philipp",
    description: "Head of Technology at world’s biggest private equity firm, KKR",
    fullName: "PHILIPP FREISE",
    link: "http://www.kkr.com/",
  },
  {
    imageSrc: "landing/testimonials/people/Brian",
    description:
      "Crypto expert, business angel, founder of Epicenter.tv and Berlin Blockchain Meetup, COO at TenderMint, Founder at Chorus One",
    fullName: "BRIAN FABIAN CRAIN",
    link: "https://epicenter.tv/",
  },
  {
    imageSrc: "landing/testimonials/people/Eric",
    description: "Founder and Chief Product Officer at SoundCloud",
    fullName: "ERIC WAHLFORSS",
    link: "https://soundcloud.com/",
  },
  {
    imageSrc: "landing/testimonials/people/trent",
    description:
      "Founder of Ocean, BigChainDB & IPDB blockchain database protocol & network, COALA IP protocol, and advisor for the Estonian E-residency program",
    fullName: "TRENT McCONAGHY",
    link: "https://oceanprotocol.com/",
  },
  {
    imageSrc: "landing/testimonials/people/christophe",
    description: "General partner at Atlantic Labs, VC",
    fullName: "CHRISTOPHE MAIRE",
    link: "http://www.atlanticlabs.de/",
  },
  {
    imageSrc: "landing/testimonials/people/udo",
    fullName: "UDO SCHLOEMER",
    description: "The founder of one of Germany’s first and biggest startup camps, Factory Berlin",
    link: "https://factoryberlin.com/",
  },
  {
    imageSrc: "landing/testimonials/people/pawel",
    fullName: "PAWEŁ BYLICA",
    description: "Core Ethereum Developer",
    link: "https://www.ethereum.org/",
  },
  {
    imageSrc: "landing/testimonials/people/Fabian",
    description: "Ethereum and Mist developer, co-creator of the ERC20 token with Vitalik Buterin",
    fullName: "FABIAN VOGELSTELLER",
    link: "https://www.ethereum.org/",
  },
  {
    imageSrc: "landing/testimonials/people/Frank",
    description:
      "Co-founder and CEO at Freigeist Capital. European serial founder, tech investor and TV personality based in Bonn, Germany",
    fullName: "FRANK THELEN & FREIGEIST CAPITAL",
    link: "https://freigeist.com/",
  },
  {
    imageSrc: "landing/testimonials/people/andreas",
    fullName: "ANDREAS BODCZEK",
    description:
      "Co-founder at Fyber, managing director at Telefonica Deutschland, entrepreneur & investor",
    link: "https://www.fyber.com/",
  },
  {
    imageSrc: "landing/testimonials/people/andre",
    fullName: "ANDRÉ EGGERT",
    description:
      "Partner at Lacore Rechtsanwaelte LLP, lawyer with 10 years experience in venture capital and technology",
    link: "https://lacore.de/en/",
  },
  {
    imageSrc: "landing/testimonials/people/MICHAEL",
    fullName: "MICHAEL JACKSON",
    description: "General partner at Mangrove Capital and board member at blockchain.com",
    link: "http://www.mangrove.vc/",
  },
  {
    imageSrc: "landing/testimonials/people/dario",
    fullName: "DARIO SUTER",
    description:
      "Co-founder of DCM Productions and managing director of Delphi Film Distribution, producer of Oscar-winning movies & business angel",
    link: "https://dcmworld.com/",
  },
  {
    imageSrc: "landing/testimonials/people/Maks Giordano",
    fullName: "MAKS GIORDANO",
    description: "Co-founder at kreait GmbH, previously partner at WIRED Magazine",
    link: "https://www.kreait.com/",
  },
  {
    imageSrc: "landing/testimonials/people/Minh Ha Duonh",
    fullName: "MINH HA DUONG",
    description: "Investment Manager at Project A&nbsp;Ventures",
    link: "https://www.project-a.com/en",
    setDangerouslyDescription: true,
  },
  {
    imageSrc: "landing/testimonials/people/Adam Stradling",
    fullName: "ADAM STRADLING",
    description: "Crypto investor and entrepreneur & former co-founder (2011/12) at bitcoin.com",
    link: "https://www.bitcoin.com/",
  },
  {
    imageSrc: "landing/testimonials/people/Kerstin Eichmann",
    fullName: "KERSTIN EICHMANN",
    description:
      "Head of Machine Economy Lighthouse at Innogy Innovation Hub, a German-based VC aiming to radically innovate energy",
    link: "https://innovationhub.innogy.com/",
  },
  {
    imageSrc: "landing/testimonials/people/piotr wilam",
    fullName: "PIOTR WILAM",
    description:
      "Co-founder, general partner and leading investor at Innovation Nest (VC), founder of Pascal Publishing House and co-founder and first president of the management board of Onet.pl",
    link: "http://www.innovationnest.co/",
  },
  {
    imageSrc: "landing/testimonials/people/KLAAS KERSTIN",
    fullName: "KLAAS KERSTING",
    description:
      "Co-founder of Flaregames and Gameforge, early stage investor (Supercell, Spacetime Studios and iQU)",
    link: "https://www.flaregames.com/",
  },
  {
    imageSrc: "landing/testimonials/people/Karolina Kukielka",
    fullName: "KAROLINA KUKIEŁKA",
    description: "Venture Entrepreneur at InReach Ventures",
    link: "https://www.inreachventures.com/",
  },
  {
    imageSrc: "landing/testimonials/people/zarabiaj_inaczej",
    fullName: "KAMIL JARZOMBEK",
    description: "Crypto Investor and Founder at Zarabiaj Inaczej",
    link: "https://www.linkedin.com/in/kamil-jarzombek-b1649295/",
  },
];

const PersonBox: React.FunctionComponent<IPersonInfoProps> = ({
  imageSrc,
  fullName,
  description,
  link,
  setDangerouslyDescription,
}) => (
  <ExternalLink href={link} className="text-center">
    <HiResImage partialPath={imageSrc} className={styles.personImage} />
    <h3>{fullName}</h3>
    {setDangerouslyDescription ? (
      <p className={styles.description} dangerouslySetInnerHTML={{ __html: description }} />
    ) : (
      <p className={styles.description}>{description}</p>
    )}
  </ExternalLink>
);

const settings: Settings = {
  dots: false,
  infinite: true,
  autoplay: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  arrows: true,
  responsive: [
    {
      breakpoint: 500,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 1100,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
  ],
};

export const PeopleSlider: React.FunctionComponent = () => (
  <div className={styles.wrapper}>
    <Slider {...settings}>
      {people.map((p, i) => (
        <div key={i}>
          <PersonBox {...p} />
        </div>
      ))}
    </Slider>
  </div>
);
