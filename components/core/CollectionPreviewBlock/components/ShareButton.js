import * as React from "react";
import * as Styles from "~/common/styles";
import * as SVG from "~/common/svg";

import { css } from "@emotion/react";

const STYLES_BUTTON = (theme) => css`
  ${Styles.BUTTON_RESET};
  ${Styles.HOVERABLE};
  padding: 8px;
  background-color: ${theme.semantic.bgBlurWhite};
  border-radius: 8px;
  box-shadow: 0 0 0 1px ${theme.semantic.borderGrayLight};

  transition: box-shadow 0.3s;
  :hover {
    box-shadow: 0 0 0 1px ${theme.system.blue}, ${theme.shadow.lightLarge};
  }

  path {
    transition: stroke 0.3s;
  }

  :hover path {
    stroke: ${theme.system.blue};
  }
`;

export default function ShareButton({ user, collection, preview, ...props }) {
  const handleOnClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // openModal({
    //   user,
    //   collection,
    //   preview,
    // });
  };

  return (
    <button css={STYLES_BUTTON} onClick={handleOnClick} {...props}>
      <span>
        <SVG.Share style={{ display: "block" }} width={16} height={16} />
      </span>
    </button>
  );
}
