import * as MockDate from "mockdate";
import * as React from "react";

import { Modal } from "../components/modals/Modal";

export const withModalBody = () => (story: any) => (
  <Modal isOpen={true} onClose={() => {}}>
    {story()}
  </Modal>
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
