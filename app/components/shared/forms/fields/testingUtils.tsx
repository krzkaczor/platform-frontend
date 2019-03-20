import { Formik } from "formik";
import * as React from "react";

import { Form } from "../Form";

/**
 * Use only for testing and storybook.
 */
export const formWrapper = (formState: any, onSubmit?: (values: any) => any) => (
  Component: React.FunctionComponent,
) => () => (
  <Formik initialValues={formState} onSubmit={onSubmit || (() => {})}>
    {({ submitForm, values, submitCount }) => {
      if (process.env.STORYBOOK_RUN) {
        // tslint:disable-next-line
        console.log(JSON.stringify(values));
      }

      return (
        <Form>
          <Component />
          {onSubmit && (
            <button data-test-id="test-form-submit" onClick={submitForm}>
              Submit
            </button>
          )}
          <span data-test-id="test-form-submit-count">Submit count: {submitCount}</span>
        </Form>
      );
    }}
  </Formik>
);
