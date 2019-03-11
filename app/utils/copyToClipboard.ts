import * as React from "react";

export const copyToClipboard = (str: React.ReactNode) => {
  const el = document.createElement("textarea");

  el.value = str as string;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";

  document.body.appendChild(el);

  const selectedRange =
    document.getSelection()!.rangeCount > 0 ? document.getSelection()!.getRangeAt(0) : null;
  el.select(); // Select the <textarea> content
  document.execCommand("copy"); // Copy - only works as a result of a user action (e.g. click events)
  document.body.removeChild(el); // Remove the <textarea> element

  if (selectedRange) {
    document.getSelection()!.removeAllRanges();
    document.getSelection()!.addRange(selectedRange);
  }
};
