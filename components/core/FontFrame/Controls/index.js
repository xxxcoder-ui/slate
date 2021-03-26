import * as React from "react";
import * as SVG from "~/common/svg";
import * as Constants from "~/common/constants";
import * as Strings from "~/common/strings";

import { P } from "~/components/system/components/Typography";
import { Slider } from "~/components/system/components/Slider";
import { css } from "@emotion/react";

import Select from "../Select";

const STYLES_CONTROLLER_WRAPPER = (theme) =>
  css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-column-gap: 48px;
    grid-row-gap: 32px;
    background-color: ${theme.fontPreviewDarkMode ? "#212124" : "#fbfbfb"};
    width: 100%;
    padding: 25px 32px 32px;
    flex-wrap: wrap;
  `;

const STYLES_CONTENT_SELECT = (theme) => css`
  display: flex;
  justify-content: space-between;
  width: 100%;
  border: 1px solid ${theme.fontPreviewDarkMode ? Constants.system.gray80 : Constants.system.gray20};
  padding: 8px 12px;
  border-radius: 4px;
`;

const STYLES_FEELING_LUCKY = (theme) => css`
  box-sizing: border-box;
  display: flex;
  border-radius: 4px;
  border: 1px solid ${theme.fontPreviewDarkMode ? theme.system.textGrayDark : theme.system.gray20};
  justify-content: space-between;
  overflow: hidden;
  button {
    display: block;
    box-sizing: border-box;
    cursor: pointer;
    padding: 8px 12px;
    margin: 0;
    border: none;
    background: none;
    color: ${theme.fontPreviewDarkMode ? theme.system.white : theme.system.textGrayDark};
  }
  button:focus {
    outline: none;
  }

  svg {
    display: block;
    path {
      stroke: ${theme.fontPreviewDarkMode ? theme.system.white : theme.system.textGrayDark};
    }
  }
  .reset_button {
    border-left: 1px solid
      ${theme.fontPreviewDarkMode ? theme.system.textGrayDark : theme.system.gray20};
  }
`;
export const Controls = ({
  view,
  settings,
  defaultOptions,
  updateView,
  updateFontSize,
  updateLineHeight,
  updateTracking,
  updateColumn,
  updateTextAlign,
  updateVerticalAlign,
  getRandomLayout,
  resetLayout,
}) => {
  const arrayToSelectOptions = (arr) =>
    arr.reduce((acc, option) => [...acc, { value: option, name: Strings.capitalize(option) }], []);

  return (
    <div css={STYLES_CONTROLLER_WRAPPER}>
      <div>
        <P css={STYLES_LABEL}>Settings</P>
        <div css={STYLES_FEELING_LUCKY}>
          <button onClick={getRandomLayout}>
            <P
              css={css`
                font-size: 14px;
                white-space: pre;
              `}
            >
              I’m feeling lucky
            </P>
          </button>
          <button className="reset_button" onClick={resetLayout}>
            <SVG.RotateCcw />
          </button>
        </div>
      </div>
      <ContentControl
        value={view}
        options={arrayToSelectOptions(defaultOptions.VIEW_OPTIONS)}
        onChange={(e) => updateView(e.target.value)}
      />
      <AlignmentControl
        options={arrayToSelectOptions(defaultOptions.VALIGN_OPTIONS)}
        vAlign={settings.valign}
        textAlign={settings.textAlign}
        onChange={(e) => updateVerticalAlign(e.target.value)}
        updateTextAlign={updateTextAlign}
        disabled={view === "glyphs"}
      />
      <Controller
        selectSuffix="px"
        label="Size"
        {...defaultOptions.SIZE_OPTIONS}
        options={[
          { value: 12, name: "12px" },
          { value: 14, name: "14px" },
        ]}
        value={settings.fontSize}
        onChange={(e) => {
          updateFontSize(e.target.value);
        }}
        disabled={view === "glyphs"}
      />
      <Controller
        label="Line Height"
        selectSuffix="%"
        {...defaultOptions.LINE_HEIGHT_OPTIONS}
        options={[
          { value: 100, name: "100%" },
          { value: 200, name: "200%" },
          { value: 300, name: "300%" },
          { value: 400, name: "400%" },
        ]}
        value={settings.lineHeight}
        onChange={(e) => updateLineHeight(e.target.value)}
        disabled={view === "glyphs"}
      />
      <Controller
        label="Tracking"
        selectSuffix="em"
        {...defaultOptions.TRACKING_OPTIONS}
        options={[
          { value: -1, name: "-1em" },
          { value: 0, name: "0em" },
          { value: 1, name: "1em" },
          { value: 2, name: "2em" },
        ]}
        value={settings.tracking}
        onChange={(e) => updateTracking(e.target.value)}
        disabled={view === "glyphs"}
      />
      <Controller
        label="Column"
        {...defaultOptions.COLUMN_OPTIONS}
        options={[
          { value: 1, name: "1" },
          { value: 2, name: "2" },
          { value: 3, name: "3" },
          { value: 4, name: "4" },
        ]}
        value={settings.column}
        onChange={(e) => updateColumn(e.target.value)}
        disabled={view !== "paragraph"}
      />
    </div>
  );
};

const STYLES_ALIGNEMENT_BUTTON = (theme) => css`
  display: flex;
  border-radius: 4px;
  border: 1px solid ${theme.fontPreviewDarkMode ? theme.system.textGrayDark : theme.system.gray20};
  margin-left: 16px;
  button {
    display: block;
    box-sizing: border-box;
    cursor: pointer;
    padding: 8px 12px;
    margin: 0;
    border: none;
  }
  button:focus {
    outline: none;
  }

  svg {
    display: block;
  }
  /* .left_btn {
    path {
      stroke: ${dark ? theme.system.gray50 : theme.system.black};
    }
    background-color: ${dark ? theme.system.gray20 : "none"};
  }
  .center_btn {
    path {
      stroke: ${dark ? theme.system.white : theme.system.textGray};
    }
    background-color: ${dark ? theme.system.gray80 : "none"};
  }
  .right_btn {
    path {
      stroke: ${dark ? theme.system.white : theme.system.textGray};
    }
    background-color: ${dark ? theme.system.gray80 : "none"};
  } */
`;
const getIconColor = (isActive, theme) => {
  const darkMode = isActive ? theme.system.white : theme.system.textGray;
  const lightMode = isActive ? theme.system.gray80 : theme.system.textGray;
  return theme.fontPreviewDarkMode ? darkMode : lightMode;
};
const getBackgroundColor = (isActive, theme) => {
  if (!isActive) return "transparent";
  return theme.fontPreviewDarkMode ? theme.system.gray80 : theme.system.gray20;
};
const STYLES_ALIGN_BUTTON = (isActive) => (theme) => css`
  background-color: ${getBackgroundColor(isActive, theme)};
  path {
    stroke: ${getIconColor(isActive, theme)};
  }
`;

export const ContentControl = ({ options, value, onChange, showLabel = true }) => {
  return (
    <div
      css={css`
        width: 100%;
      `}
    >
      {showLabel && <P css={STYLES_LABEL}>Content</P>}
      <Select
        inputStyle={STYLES_CONTENT_SELECT}
        options={options}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
const AlignmentControl = ({ vAlign, textAlign, options, onChange, updateTextAlign, disabled }) => {
  return (
    <div
      css={
        disabled &&
        css`
          opacity: 0.3;
          pointer-events: none;
        `
      }
    >
      <P css={STYLES_LABEL}>Alignment</P>
      <div css={css({ display: "flex", alignItems: "center" })}>
        <Select options={options} value={vAlign} onChange={onChange} />
        <div css={STYLES_ALIGNEMENT_BUTTON}>
          <button
            onClick={() => updateTextAlign("left")}
            css={STYLES_ALIGN_BUTTON(textAlign === "left")}
          >
            <SVG.AlignLeft height={16} width={16} />
          </button>
          <button
            onClick={() => updateTextAlign("center")}
            css={STYLES_ALIGN_BUTTON(textAlign === "center")}
          >
            <SVG.AlignCenter height={16} width={16} />
          </button>
          <button
            onClick={() => updateTextAlign("right")}
            css={STYLES_ALIGN_BUTTON(textAlign === "right")}
          >
            <SVG.AlignRight height={16} width={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const STYLES_LABEL = (theme) => css`
  font-size: 0.875rem;
  color: ${theme.fontPreviewDarkMode ? theme.system.gray70 : theme.system.textGrayLight};
  margin-bottom: 4px;
`;

const Controller = ({
  value,
  options,
  onChange,
  selectSuffix = "",
  label,
  min,
  max,
  step,
  disabled,
}) => {
  return (
    <div
      css={
        disabled &&
        css`
          opacity: 0.3;
          pointer-events: none;
        `
      }
    >
      <P css={STYLES_LABEL}>{label}</P>
      <div css={css({ display: "flex", alignItems: "center" })}>
        <Select
          options={options}
          value={value}
          onChange={onChange}
          placeholderSuffix={selectSuffix}
        />
        <div style={{ width: "100%" }}>
          <Slider
            discrete
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            containerStyle={{ height: "auto", marginLeft: "18px" }}
            sliderBarStyle={(theme) => css`
              background-color: ${theme.fontPreviewDarkMode
                ? theme.system.gray70
                : theme.system.gray30};
            `}
            activeBarStyle={(theme) => css`
              background-color: ${theme.fontPreviewDarkMode
                ? theme.system.white
                : theme.system.gray80};
            `}
            handleStyle={(theme) => css`
              background-color: ${theme.fontPreviewDarkMode
                ? theme.system.white
                : theme.system.gray80};

              :hover {
                box-shadow: 0 0 0 4px
                  ${theme.fontPreviewDarkMode
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(75, 74, 77, 0.1)"};
              }
              :active {
                box-shadow: 0 0 0 8px
                  ${theme.fontPreviewDarkMode
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(75, 74, 77, 0.2)"};
              }
            `}
          />
        </div>
      </div>
    </div>
  );
};
