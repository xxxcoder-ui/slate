import * as React from "react";
import * as Constants from "~/common/constants";

import { css } from "@emotion/react";
import { P2 } from "~/components/system/components/Typography";

const STYLES_POPOVER = css`
  z-index: ${Constants.zindex.tooltip};
  box-sizing: border-box;
  font-family: ${Constants.font.text};
  min-width: 200px;
  border-radius: 8px;
  user-select: none;
  position: absolute;
  background-color: ${Constants.system.white};
  color: ${Constants.system.black};
  box-shadow: ${Constants.shadow.lightMedium};
  padding: 16px;
  border: 1px solid ${Constants.semantic.borderGrayLight};
`;

const STYLES_POPOVER_SECTION = (theme) => css`
  border-bottom: 1px solid ${theme.semantic.borderGrayLight};

  :last-child {
    border-bottom: none;
    margin-bottom: -6px;
    padding-bottom: 0px;
  }
`;

const STYLES_POPOVER_ITEM = css`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  transition: 200ms ease all;
  cursor: pointer;

  :hover {
    color: ${Constants.system.blue};
  }
`;

export function PopoverNavigation({
  containerCss,
  sectionCss,
  sectionItemCss,
  css,
  topSection = null,
  navigation,
  itemStyle,
  ...props
}) {
  return (
    <div
      css={[STYLES_POPOVER, containerCss]}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      {...props}
    >
      {topSection}
      {navigation.map((section, i) => (
        <div css={[STYLES_POPOVER_SECTION, sectionCss]} key={i}>
          {section.map((each, j) => (
            <div
              key={`${i}-${j}`}
              css={[STYLES_POPOVER_ITEM, sectionItemCss]}
              style={itemStyle}
              onClick={each.onClick}
            >
              <P2 color="textBlack" css={css}>
                {each.text}
              </P2>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
