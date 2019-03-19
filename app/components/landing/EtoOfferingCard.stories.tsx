import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EtoOfferingCard, IEtoOfferingProps } from "./EtoOfferingCard";

import * as logo from "../../assets/img/logo_capitalized.svg";

const description =
  "Neufund is a blockchain based equity fundraising platform, an ecosystem of smart contracts operating on the Ethereum blockchain. The Company’s key expertise lies in legal-tech and reg-tech.";

const lorem =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, voluptatum illum unde doloremque sequi cum sed ex odit. Ad deleniti veniam, aliquid dolor eaque libero nobis magnam repellendus sed laborum.";

const props: IEtoOfferingProps = {
  roundName: "seed round",
  tags: [
    {
      text: "fintech",
      layout: "ghost-bold",
      theme: "white",
    },
    {
      text: "germany",
      layout: "ghost-bold",
      theme: "white",
    },
  ],
  name: "Neufund",
  description,
  quote: {
    text: lorem,
    credits: "John",
  },
  topImage: {
    src: "",
    srcSet: {
      "1x": "",
      "2x": "",
      "3x": "",
    },
    alt: "",
    width: 1,
    height: 1,
  },
  quoteImage: {
    src: "",
    srcSet: {
      "1x": "",
      "2x": "",
      "3x": "",
    },
    alt: "",
    width: 1,
    height: 1,
  },
  logo,
  to: "#0",
};

storiesOf("EtoOfferingCard", module).add("default", () => <EtoOfferingCard {...props} />);
