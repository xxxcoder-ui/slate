import * as React from "react";
import * as SVG from "~/common/svg";
import * as Strings from "~/common/strings";

import { css } from "@emotion/react";

import { ContentControl } from "~/components/core/FontFrame/Settings/Controls";

const CONTROLS_STYLES_WRAPPER = (theme) => css`
  width: fit-content;
  display: flex;
  margin: 0 auto;
  & > * + * {
    margin-left: 8px;
  }
  path {
    stroke: ${theme.fontPreviewDarkMode ? theme.system.white : theme.system.black};
  }
  svg {
    display: block;
  }
`;

const CONTROLS_DARKMODE_WRAPPER = (theme) => css`
  display: flex;
  border-radius: 4px;
  border: 1px solid
    ${theme.fontPreviewDarkMode ? theme.semantic.textGrayDark : theme.system.grayLight5};
  button {
    display: block;
    box-sizing: border-box;
    cursor: pointer;
    padding: 8px 12px;
    margin: 0;
    background: none;
    border: none;
  }
  button:focus {
    outline: none;
  }

  .lightmode_btn {
    path {
      stroke: ${theme.fontPreviewDarkMode ? theme.system.grayLight2 : theme.system.black};
    }
    background-color: ${!theme.fontPreviewDarkMode ? theme.system.grayLight5 : "none"};
  }
  .darkmode_btn {
    path {
      stroke: ${theme.fontPreviewDarkMode ? theme.system.white : theme.semantic.textGray};
    }
    background-color: ${theme.fontPreviewDarkMode ? theme.system.grayDark4 : "none"};
  }
`;

const CONTROLS_SETTINGS_BUTTON = (isActive) => (theme) =>
  css`
    padding: 8px 12px;
    margin: 0;
    border-radius: 4px;
    background: none;
    border: 1px solid
      ${theme.fontPreviewDarkMode ? theme.semantic.textGrayDark : theme.system.grayLight5};
    cursor: pointer;
    ${isActive &&
    css`
      background-color: ${theme.fontPreviewDarkMode
        ? theme.system.grayDark4
        : theme.system.grayLight5};
    `};
    path {
      ${isActive
        ? css`
            stroke: ${theme.fontPreviewDarkMode ? theme.system.white : theme.system.black};
          `
        : css`
            stroke: ${theme.fontPreviewDarkMode
              ? theme.system.grayLight2
              : theme.semantic.textGray};
          `}
    }
  `;

export const FixedControls = ({
  onDarkMode,
  onLightMode,
  onToggleSettings,
  isSettingsVisible,
  ...props
}) => {
  return (
    <div css={CONTROLS_STYLES_WRAPPER} {...props}>
      <div>
        <button css={CONTROLS_SETTINGS_BUTTON(isSettingsVisible)} onClick={onToggleSettings}>
          <SVG.Sliders height={16} width={16} />
        </button>
      </div>
      <div css={CONTROLS_DARKMODE_WRAPPER}>
        <button onClick={onLightMode} className="lightmode_btn">
          <SVG.Sun height={16} width={16} />
        </button>
        <button onClick={onDarkMode} className="darkmode_btn">
          <SVG.Moon height={16} width={16} />
        </button>
      </div>
    </div>
  );
};

const STYLES_MOBILE_CONTROLS_WRAPPER = (theme) => css`
  width: 100%;
  display: flex;
  margin: 0 auto;
  padding: 18px 22px;
  & > * + * {
    margin-left: 44px;
  }
  path {
    stroke: ${theme.fontPreviewDarkMode ? theme.system.white : theme.system.black};
  }
`;

export const MobileFixedControls = ({
  onDarkMode,
  onLightMode,
  view,
  defaultOptions,
  updateView,
}) => {
  const arrayToSelectOptions = (arr) =>
    arr.reduce((acc, option) => [...acc, { value: option, name: Strings.capitalize(option) }], []);
  return (
    <div css={STYLES_MOBILE_CONTROLS_WRAPPER}>
      <ContentControl
        value={view}
        options={arrayToSelectOptions(defaultOptions.VIEW_OPTIONS)}
        onChange={(e) => updateView(e.target.value)}
        showLabel={false}
      />
      <div css={CONTROLS_DARKMODE_WRAPPER}>
        <button onClick={onLightMode} className="lightmode_btn">
          <SVG.Sun height={16} width={16} />
        </button>
        <button onClick={onDarkMode} className="darkmode_btn">
          <SVG.Moon height={16} width={16} />
        </button>
      </div>
    </div>
  );
};
