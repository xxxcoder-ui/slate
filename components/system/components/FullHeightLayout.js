import * as React from "react";

import { useIsomorphicLayoutEffect } from "~/common/hooks";
import { css } from "@emotion/react";

const updateCssVarFullHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty("--full-height", `${window.innerHeight}px`);
};

const STYLES_FULL_HEIGHT = css`
  height: 100vh;
  height: var(--full-height);
`;

export const FullHeightLayout = React.forwardRef(({ children, css, as = "div", ...props }, ref) => {
  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;
    updateCssVarFullHeight();
    window.addEventListener("resize", updateCssVarFullHeight);
    return () => window.removeEventListener("resize", updateCssVarFullHeight);
  }, []);

  const Component = as;

  return (
    <Component css={[STYLES_FULL_HEIGHT, css]} ref={ref} {...props}>
      {children}
    </Component>
  );
});
