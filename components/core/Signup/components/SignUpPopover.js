import * as React from "react";
import * as System from "~/components/system";

import { Symbol } from "~/common/logo";
import { css } from "@emotion/react";

const STYLES_POPOVER = (theme) => css`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  max-width: 432px;
  height: 528px;
  width: 95vw;
  border-radius: 8px;
  padding: 36px 32px;

  @media (max-width: ${theme.sizes.mobile}px) {
    flex-grow: 1;
    margin-bottom: auto;
  }

  background: radial-gradient(
    80.79% 80.79% at 50% 50%,
    rgba(242, 242, 247, 0.5) 0%,
    rgba(242, 242, 247, 0) 100%
  );
  /* background-blur */

  backdrop-filter: blur(75px);

  @keyframes authentication-popover-fade-in {
    from {
      transform: translateY(-8px);
      opacity: 0;
    }

    to {
      transform: translateY(0px);
      opacity: 1;
    }
  }

  animation: authentication-popover-fade-in 400ms ease;
`;

const STYLES_POPOVER_BODY = css`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
`;
export default function SignUpPopover({ children, title, logoStyle, titleStyle, props }) {
  return (
    <div css={STYLES_POPOVER} {...props}>
      <div>
        <div style={{ textAlign: "center" }}>
          <Symbol style={{ width: "40px", marginBottom: "8px", ...logoStyle }} />
        </div>
        <System.H3 style={{ textAlign: "center", lineHeight: "30px", ...titleStyle }}>
          {title}{" "}
        </System.H3>
      </div>
      <div css={STYLES_POPOVER_BODY}>{children}</div>
    </div>
  );
}
