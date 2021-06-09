import * as React from "react";
import * as Strings from "~/common/strings";

import { css } from "@emotion/react";

import {
  Controller,
  AlignmentControl,
  ContentControl,
  SettingsControl,
} from "~/components/core/FontFrame/Settings/Controls";

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

export const Controls = ({
  view,
  customView,
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
  const isCustomView = (value) => view === "custom" && customView === value;

  const arrayToSelectOptions = (arr) =>
    arr.reduce((acc, option) => [...acc, { value: option, name: Strings.capitalize(option) }], []);

  return (
    <div css={STYLES_CONTROLLER_WRAPPER}>
      <SettingsControl getRandomLayout={getRandomLayout} resetLayout={resetLayout} />
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
          { value: 8, name: "8px" },
          { value: 12, name: "12px" },
          { value: 14, name: "14px" },
          { value: 20, name: "20px" },
          { value: 24, name: "24px" },
          { value: 32, name: "32px" },
          { value: 40, name: "40px" },
          { value: 64, name: "64px" },
          { value: 96, name: "96px" },
          { value: 120, name: "120px" },
          { value: 184, name: "184px" },
          { value: 280, name: "280px" },
          { value: 320, name: "320px" },
        ]}
        value={settings.fontSize}
        onChange={(e) => {
          updateFontSize(e.target.value);
        }}
        selectMinWidth="67px"
        disabled={view === "glyphs"}
      />
      <Controller
        label="Line Height"
        selectSuffix="%"
        {...defaultOptions.LINE_HEIGHT_OPTIONS}
        options={[
          { value: 50, name: "50%" },
          { value: 100, name: "100%" },
          { value: 130, name: "130%" },
          { value: 150, name: "150%" },
          { value: 200, name: "200%" },
          { value: 300, name: "300%" },
        ]}
        value={settings.lineHeight}
        onChange={(e) => updateLineHeight(e.target.value)}
        selectMinWidth="63px"
        disabled={view === "glyphs"}
      />
      <Controller
        label="Tracking"
        selectSuffix="em"
        {...defaultOptions.TRACKING_OPTIONS}
        options={[
          { value: -0.1, name: "-0.1em" },
          { value: 0, name: "0em" },
          { value: 0.1, name: "0.1em" },
          { value: 0.2, name: "0.2em" },
        ]}
        value={settings.tracking}
        onChange={(e) => updateTracking(e.target.value)}
        selectMinWidth="82px"
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
        selectMinWidth="none"
        disabled={!(view === "paragraph" || isCustomView("paragraph"))}
      />
    </div>
  );
};
