import * as React from "react";

import { css } from "@emotion/react";
import { mergeEvents, cloneElementWithJsx } from "~/common/utilities";
import { useCombinedRefs } from "~/common/hooks";

const hasElementFocus = (el) => el.matches(":focus");
const hasElementFocusWithin = (el) => el.matches(":focus-within");

let isFocusViaKeyboard = false;
if (typeof window !== "undefined") {
  window?.addEventListener("mousedown", () => (isFocusViaKeyboard = false));
  window?.addEventListener("keydown", () => (isFocusViaKeyboard = true));
}

const useFocusRing = ({ within, ref }) => {
  const [isFocused, setFocus] = React.useState(false);

  const enableFocusRing = () => {
    if (isFocusViaKeyboard && ref.current) {
      setFocus(within ? hasElementFocusWithin(ref.current) : hasElementFocus(ref.current));
    }
  };
  const disableFocusRing = () => setFocus(false);

  return [isFocused, { enableFocusRing, disableFocusRing }];
};

const STYLES_FOCUS_RING_DEFAULT = (theme) => css`
  outline: 2px solid ${theme.system.blue};
`;

export const FocusRing = React.forwardRef(
  (
    { children, within, style, css = STYLES_FOCUS_RING_DEFAULT, disabled, ...props },
    forwardedRef
  ) => {
    const innerRef = React.useRef();
    const ref = useCombinedRefs(innerRef, forwardedRef, children.ref);

    const [isFocused, { enableFocusRing, disableFocusRing }] = useFocusRing({ within, ref });

    React.useLayoutEffect(() => {
      enableFocusRing();
    }, []);

    return cloneElementWithJsx(React.Children.only(children), {
      ...props,
      onFocus: mergeEvents(enableFocusRing, children.onFocus),
      onBlur: mergeEvents(disableFocusRing, children.onBlur),
      css: isFocused && !disabled ? css : null,
      style: isFocused && !disabled ? style : null,
      ref,
    });
  }
);
