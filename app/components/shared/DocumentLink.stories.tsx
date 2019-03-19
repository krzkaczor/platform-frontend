import { storiesOf } from "@storybook/react";
import * as React from "react";

import { DocumentLink, DocumentTemplateButton } from "./DocumentLink";
import { InlineIcon } from "./icons";

import * as link_out from "../../assets/img/inline_icons/link_out.svg";
import * as link from "../../assets/img/inline_icons/social_link.svg";

storiesOf("Document/DocumentLink", module)
  .add("doc", () => <DocumentLink url="doc" name="foo" />)
  .add("pdf", () => <DocumentLink url="pdf" name="bar" />)
  .add("alt", () => (
    <DocumentLink url="pdf" name="bar" altIcon={<InlineIcon svgIcon={link_out} />} />
  ));

storiesOf("Document/DocumentTemplateButton", module)
  .add("default", () => <DocumentTemplateButton title="my document template" onClick={() => {}} />)
  .add("custom icon", () => (
    <DocumentTemplateButton
      title="my custom template"
      onClick={() => {}}
      altIcon={<InlineIcon svgIcon={link} />}
    />
  ));
