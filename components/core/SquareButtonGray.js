import * as React from "react";
import * as Constants from "~/common/constants";

import { css } from "@emotion/react";

const STYLES_BUTTON = css`
  background-color: ${Constants.semantic.bgGrayLight};
  color: ${Constants.system.black};
  display: inline-flex;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background-size: cover;
  background-position: 50% 50%;
  transition: 100ms ease all;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
  ${"" /* box-shadow: 0 0 0 1px ${Constants.semantic.bgLight} inset; */}

  :hover {
    background-color: ${Constants.system.grayLight4};
  }

  ${"" /* @media (max-width: ${Constants.sizes.mobile}px) {
    width: 32px;
    height: 32px;
  } */}
`;

export const SquareButtonGray = (props) => {
  return <span css={STYLES_BUTTON} {...props} />;
};

export default SquareButtonGray;
