import * as React from "react";
import * as SVG from "~/common/svg";
import * as Constants from "~/common/constants";

import { P } from "~/components/system/components/Typography";
import { Slider } from "~/components/system/components/Slider";
import { css } from "@emotion/react";

import Select from "./Select";

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
`;

const CONTROLS_DARKMODE_WRAPPER = (theme) => css`
  display: flex;
  border-radius: 4px;
  border: 1px solid ${theme.fontPreviewDarkMode ? theme.system.textGrayDark : theme.system.gray20};
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
  svg {
    display: block;
  }
  .lightmode_btn {
    path {
      stroke: ${theme.fontPreviewDarkMode ? theme.system.gray50 : theme.system.black};
    }
    background-color: ${!theme.fontPreviewDarkMode ? theme.system.gray20 : "none"};
  }
  .darkmode_btn {
    path {
      stroke: ${theme.fontPreviewDarkMode ? theme.system.white : theme.system.textGray};
    }
    background-color: ${theme.fontPreviewDarkMode ? theme.system.gray80 : "none"};
  }
`;

const CONTROLS_SETTINGS_BUTTON = (isActive) => (theme) => css`
  padding: 8px 12px;
  margin: 0;
  border-radius: 4px;
  background: none;
  border: 1px solid ${theme.fontPreviewDarkMode ? theme.system.textGrayDark : theme.system.gray20};
  cursor: pointer;
  ${isActive &&
  css`
    background-color: ${theme.fontPreviewDarkMode ? theme.system.gray80 : theme.system.gray20};
  `};
  path {
    ${isActive
      ? css`
          stroke: ${theme.fontPreviewDarkMode ? theme.system.white : theme.system.black};
        `
      : css`
          stroke: ${theme.fontPreviewDarkMode ? theme.system.gray50 : theme.system.textGray};
        `}
  }
`;

export const FixedControls = ({ onDarkMode, onLightMode, onToggleSettings, isSettingsVisible }) => {
  return (
    <div css={CONTROLS_STYLES_WRAPPER}>
      <div>
        <button css={CONTROLS_SETTINGS_BUTTON(isSettingsVisible)} onClick={onToggleSettings}>
          <SVG.Sliders />
        </button>
      </div>
      <div css={CONTROLS_DARKMODE_WRAPPER}>
        <button onClick={onLightMode} className="lightmode_btn">
          <SVG.Sun />
        </button>
        <button onClick={onDarkMode} className="darkmode_btn">
          <SVG.Moon />
        </button>
      </div>
    </div>
  );
};

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
export const Controls = ({
  view,
  settings,
  updateView,
  updateFontSize,
  updateLineHeight,
  updateTracking,
  updateColumn,
  updateTextAlign,
  updateVerticalAlign,
}) => {
  const VerticalOptions = [
    { value: "top", name: "Top" },
    { value: "center", name: "Center" },
    { value: "bottom", name: "Bottom" },
  ];

  return (
    <div css={STYLES_CONTROLLER_WRAPPER}>
      <div>
        <p css={STYLES_LABEL}>Content</p>
        <Select
          inputStyle={STYLES_CONTENT_SELECT}
          options={[
            { value: "sentence", name: "Sentence" },
            { value: "paragraph", name: "Paragraph" },
            { value: "glyphs", name: "Glyphs" },
          ]}
          value={view}
          onChange={(e) => updateView(e.target.value)}
        />
      </div>
      <AlignmentControl
        options={VerticalOptions}
        vAlign={settings.valign}
        textAlign={settings.textAlign}
        onChange={(e) => updateVerticalAlign(e.target.value)}
        updateTextAlign={updateTextAlign}
      />
      <Controller
        selectSuffix="px"
        label="Size"
        min={12}
        max={72}
        step={2}
        options={[
          { value: 12, name: "12px" },
          { value: 14, name: "14px" },
        ]}
        value={settings.fontSize}
        onChange={(e) => {
          updateFontSize(e.target.value);
        }}
      />
      <Controller
        label="Line Height"
        selectSuffix="%"
        min={40}
        max={400}
        step={20}
        options={[
          { value: 100, name: "100%" },
          { value: 200, name: "200%" },
          { value: 300, name: "300%" },
          { value: 400, name: "400%" },
        ]}
        value={settings.lineHeight}
        onChange={(e) => updateLineHeight(e.target.value)}
      />
      <Controller
        label="Tracking"
        selectSuffix="em"
        min={-1}
        max={1.5}
        step={0.05}
        options={[
          { value: -1, name: "-1em" },
          { value: 0, name: "0em" },
          { value: 1, name: "1em" },
          { value: 2, name: "2em" },
        ]}
        value={settings.tracking}
        onChange={(e) => updateTracking(e.target.value)}
      />
      <Controller
        label="Column"
        min={1}
        max={6}
        step={1}
        options={[
          { value: 1, name: "1" },
          { value: 2, name: "2" },
          { value: 3, name: "3" },
          { value: 4, name: "4" },
        ]}
        value={settings.column}
        onChange={(e) => updateColumn(e.target.value)}
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

const AlignmentControl = ({ vAlign, textAlign, options, onChange, updateTextAlign }) => {
  return (
    <div>
      <p css={STYLES_LABEL}>Alignment</p>
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

const Controller = ({ value, options, onChange, selectSuffix = "", label, min, max, step }) => {
  return (
    <div>
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
