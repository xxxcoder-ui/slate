import * as React from "react";
import * as SVG from "~/common/svg";

import { css } from "@emotion/react";

const CONTROLS_STYLES_WRAPPER = (dark) => (theme) => css`
  width: fit-content;
  display: flex;
  margin: 0 auto;
  & > * + * {
    margin-left: 8px;
  }
  path {
    stroke: ${dark ? theme.system.white : theme.system.black};
  }
`;

const CONTROLS_DARKMODE_WRAPPER = (dark) => (theme) => css`
  display: inline-block;
  border-radius: 4px;
  border: 1px solid ${dark ? theme.system.textGrayDark : theme.system.gray20};
  button {
    box-sizing: border-box;
    cursor: pointer;
    padding: 8px 12px;
    margin: 0;
    background: none;
    border: none;
  }
  .lightmode_btn {
    path {
      stroke: ${dark ? theme.system.gray50 : theme.system.black};
    }
    background-color: ${!dark ? theme.system.gray20 : "none"};
  }
  .darkmode_btn {
    path {
      stroke: ${dark ? theme.system.white : theme.system.textGray};
    }
    background-color: ${dark ? theme.system.gray80 : "none"};
  }
`;

const CONTROLS_SETTINGS_BUTTON = (dark, isActive) => (theme) => css`
  padding: 8px 12px;
  margin: 0;
  border-radius: 4px;
  background: none;
  border: 1px solid ${dark ? theme.system.textGrayDark : theme.system.gray20};
  cursor: pointer;
  ${isActive &&
  css`
    background-color: ${dark ? theme.system.gray80 : theme.system.gray20};
  `};
  path {
    ${isActive
      ? css`
          stroke: ${dark ? theme.system.white : theme.system.black};
        `
      : css`
          stroke: ${dark ? theme.system.gray50 : theme.system.textGray};
        `}
  }
`;

export default function Controls({
  onDarkMode,
  onLightMode,
  onToggleSettings,
  isDarkMode,
  isSettingsVisible,
}) {
  return (
    <div css={CONTROLS_STYLES_WRAPPER(isDarkMode)}>
      <div>
        <button
          css={CONTROLS_SETTINGS_BUTTON(isDarkMode, isSettingsVisible)}
          onClick={onToggleSettings}
        >
          <SVG.Sliders />
        </button>
      </div>
      <div css={CONTROLS_DARKMODE_WRAPPER(isDarkMode)}>
        <button onClick={onLightMode} className="lightmode_btn">
          <SVG.Sun />
        </button>
        <button onClick={onDarkMode} className="darkmode_btn">
          <SVG.Moon />
        </button>
      </div>
    </div>
  );
}
