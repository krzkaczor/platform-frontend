import { storiesOf } from "@storybook/react";
import * as React from "react";

import { NewTable, NewTableRow } from "./NewTable";

storiesOf("NewTable", module)
  .add("default", () => (
    <NewTable titles={["Name", "Surname", "Role"]}>
      <NewTableRow>
        <>Pawel</>
        <>Lula</>
        <>Developer</>
      </NewTableRow>
      <NewTableRow>
        <>Wiktor</>
        <>Furman</>
        <>Developer</>
      </NewTableRow>
      <NewTableRow>
        <>Thomas</>
        <>Gorny</>
        <>Developer</>
      </NewTableRow>
    </NewTable>
  ))
  .add("empty", () => <NewTable titles={["Name", "Surname", "Role"]}>{[]}</NewTable>)
  .add("empty with custom placeholder", () => (
    <NewTable
      titles={["Name", "Surname", "Role"]}
      placeholder="This is custom placeholder when table is empty"
    >
      {[]}
    </NewTable>
  ))
  .add("keeps rhytm", () => (
    <NewTable titles={["Name", "Surname", "Role"]} keepRhythm>
      <NewTableRow>
        <>Pawel</>
        <>Lula</>
        <>Developer</>
      </NewTableRow>
      <NewTableRow>
        <>Wiktor</>
        <>Furman</>
        <>Developer</>
      </NewTableRow>
      <NewTableRow>
        <>Thomas</>
        <>Gorny</>
        <>Developer</>
      </NewTableRow>
    </NewTable>
  ))
  .add("empty but keeps rhytm", () => (
    <NewTable titles={["Name", "Surname", "Role"]} keepRhythm>
      {[]}
    </NewTable>
  ));
