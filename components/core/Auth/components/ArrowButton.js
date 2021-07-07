import * as React from "react";
import * as SVG from "~/common/svg";
import * as Styles from "~/common/styles";

import { css } from "@emotion/react";

const STYLES_BUTTON = (theme) => css`
  background-color: ${theme.system.white};
  border: none;
  padding: 2px;
  height: 20px;
  width: 20px;
  border-radius: 8px;
  &:disabled {
    cursor: not-allowed;
    background-color: ${theme.system.grayLight5};
    color: ${theme.semantic.textGray};
  }
  &:disabled:hover {
    color: ${theme.semantic.textGray};
  }
`;

export default function ArrowButton({ disabled, style, ...props }) {
  return (
    <button
      type="button"
      disabled={disabled}
      css={[STYLES_BUTTON, Styles.CONTAINER_CENTERED, Styles.HOVERABLE]}
      {...props}
    >
      <SVG.RightArrow height={16} width={16} />
    </button>
  );
}
