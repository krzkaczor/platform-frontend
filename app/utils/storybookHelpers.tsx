import * as MockDate from "mockdate";
import * as React from "react";

import { ModalComponentBody } from "../components/modals/ModalComponentBody";

export const withModalBody = () => (story: any) => (
  <ModalComponentBody isOpen={true} onClose={() => {}}>
    {story()}
  </ModalComponentBody>
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
