import * as MockDate from "mockdate";
import * as React from "react";

import { ModalComponentBody } from "../components/modals/ModalComponentBody";

export const withModalBody = (maxWidth = "37.5rem") => (story: any) => (
  <div style={{ maxWidth }}>
    <ModalComponentBody onClose={() => {}}>{story()}</ModalComponentBody>
  </div>
);

export const withMockedDate = (testDate: Date) => {
  class MockDateComp extends React.Component<{ story: any; testDate: Date }> {
    constructor(props: any) {
      super(props);
      MockDate.set(this.props.testDate);
    }

    render(): React.ReactNode {
      return this.props.story();
    }

    componentWillUnmount(): void {
      MockDate.reset();
    }
  }

  return (story: any) => {
    return <MockDateComp testDate={testDate} story={story} />;
  };
};
