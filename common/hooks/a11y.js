import * as React from "react";

import { first, last } from "lodash";
import { useEventListener } from "~/common/hooks";

// SOURCE(amine): https://zellwk.com/blog/keyboard-focusable-elements/
const getFocusableElements = (element = document) =>
  [
    ...element.querySelectorAll(
      'a[href], button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
    ),
  ]
    // NOTE(amine): remove disabled buttons and elements with aria-hidden attribute
    .filter(
      (el) =>
        !el.hasAttribute("disabled") &&
        !el.getAttribute("aria-hidden") &&
        el.getAttribute("tabindex") !== "-1"
    );

/* NOTE(amine): used to trap focus inside a component. **/
export const useTrapFocus = ({ ref }) => {
  const handleFocus = (e) => {
    if (!ref.current) return;
    const elements = getFocusableElements(ref.current);
    const firstElement = first(elements);
    const lastElement = last(elements);

    const isTabPressed = e.key === "Tab" || e.keyCode === "9";
    if (!isTabPressed) return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  useEventListener({ type: "keydown", handler: handleFocus }, []);
};

export const useRestoreFocus = ({ isEnabled } = { isEnabled: true }) => {
  React.useEffect(() => {
    if (!isEnabled) return;

    const lastActiveElement = typeof document !== "undefined" ? document.activeElement : null;
    return () => lastActiveElement?.focus?.();
  }, [isEnabled]);
};
