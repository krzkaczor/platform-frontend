import * as React from "react";
import { toast, ToastContainer as ToastifyContainer } from "react-toastify";

import { IS_CYPRESS, TOAST_COMPONENT_DELAY } from "../../config/constants";
import { TDataTestId, TTranslatedString } from "../../types";

import "react-toastify/dist/ReactToastify.css";

const ToastContainer = () => <ToastifyContainer autoClose={TOAST_COMPONENT_DELAY} />;

const getOptions = (options?: TDataTestId) =>
  IS_CYPRESS && options ? { className: options["data-test-id"] } : undefined;

const showErrorToast = (content: TTranslatedString, options?: TDataTestId) => {
  toast.error(content, getOptions(options));
};

const showInfoToast = (content: TTranslatedString, options?: TDataTestId) => {
  toast.info(content, getOptions(options));
};

export { ToastContainer, showErrorToast, showInfoToast };
