import * as React from "react";
import * as Constants from "~/common/constants";

import { css } from "@emotion/react";

const STYLES_SCENE = css`
  flex-shrink: 0;
  width: 100%;
  padding: 32px;
  display: block;

  @media (max-width: ${Constants.sizes.mobile}px) {
    padding: 36px 16px 128px 16px;
  }
`;

export const ScenePage = ({ css, ...props }) => (
  <div css={[STYLES_SCENE, css]} {...props}>
    <div style={props.contentstyle}>{props.children}</div>
  </div>
);

export default ScenePage;
