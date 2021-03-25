import * as React from "react";

import { css } from "@emotion/react";

import { useFont, useFontControls } from "./hooks";
import { FixedControls, Controls } from "./Controls";

const GET_STYLES_CONTAINER = (theme) => css`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: ${theme.fontPreviewDarkMode ? theme.system.pitchBlack : theme.system.white};
  padding-top: 14px;
`;

export default function FontFrame({ cid, url, ...props }) {
  const { isFontLoading, fontName } = useFont({ url, name: cid }, [cid]);
  const [
    currentState,
    {
      updateView,
      setLightMode,
      setDarkMode,
      toggleSettings,
      updateFontSize,
      updateLineHeight,
      updateTracking,
      updateColumn,
      updateTextAlign,
      updateVerticalAlign,
    },
  ] = useFontControls();

  return (
    <div css={GET_STYLES_CONTAINER} style={{ fontFamily: fontName }} {...props}>
      <FixedControls
        onDarkMode={setDarkMode}
        onLightMode={setLightMode}
        onToggleSettings={toggleSettings}
        isDarkMode={currentState.context.darkmode}
        isSettingsVisible={currentState.context.showSettings}
      />
      <div style={{ position: "relative", flexGrow: 1, overflowY: "scroll" }}>
        {isFontLoading && (
          <div
            css={css({
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.4)",
            })}
          >
            <p>loading...</p>
          </div>
        )}
        {currentState.view === "glyphs" && <Glyphs />}
        {currentState.view === "sentence" && (
          <Sentence
            content="The sun is gone but I have a light The day is done but I'm having fun I think I'm dumb or maybe I'm just happy I think I'm just happy I think I'm just happy I'm not like them but I can pretend The sun is gone but I have a light The day is done but I'm having fun I think I'm dumb or maybe I'm just happy"
            valign={currentState.context.settings.valign}
            textAlign={currentState.context.settings.textAlign}
            fontSize={currentState.context.settings.fontSize}
            lineHeight={currentState.context.settings.lineHeight}
            tracking={currentState.context.settings.tracking}
          />
        )}
        {currentState.view === "paragraph" && (
          <Paragraph
            content="The sun is gone but I have a light The day is done but I'm having fun I think I'm dumb or maybe I'm just happy I think I'm just happy I think I'm just happy I'm not like them but I can pretend The sun is gone but I have a light The day is done but I'm having fun I think I'm dumb or maybe I'm just happy I think I'm just happy I think I'm just happy I think I'm just happy My heart is broke but I have some glue Help me inhale and mend it with you We'll float around and hang out on clouds Then we'll come down and have a hangover We'll have a hangover We'll have a hangover We'll have a hangover Skin the sun, fall asleep
            The sun is gone but I have a light The day is done but I'm having fun I think I'm dumb or maybe I'm just happy I think I'm just happy I think I'm just happy I'm not like them but I can pretend The sun is gone but I have a light The day is done but I'm having fun I think I'm dumb or maybe I'm just happy I think I'm just happy I think I'm just happy I think I'm just happy My heart is broke but I have some glue Help me inhale and mend it with you We'll float around and hang out on clouds Then we'll come down and have a hangover We'll have a hangover We'll have a hangover We'll have a hangover Skin the sun, fall asleep
            The sun is gone but I have a light The day is done but I'm having fun I think I'm dumb or maybe I'm just happy I think I'm just happy I think I'm just happy I'm not like them but I can pretend The sun is gone but I have a light The day is done but I'm having fun I think I'm dumb or maybe I'm just happy I think I'm just happy I think I'm just happy I think I'm just happy My heart is broke but I have some glue Help me inhale and mend it with you We'll float around and hang out on clouds Then we'll come down and have a hangover We'll have a hangover We'll have a hangover We'll have a hangover Skin the sun, fall asleep
            "
            valign={currentState.context.settings.valign}
            textAlign={currentState.context.settings.textAlign}
            fontSize={currentState.context.settings.fontSize}
            lineHeight={currentState.context.settings.lineHeight}
            tracking={currentState.context.settings.tracking}
            column={currentState.context.settings.column}
          />
        )}
      </div>
      {currentState.context.showSettings && (
        <Controls
          view={currentState.view}
          updateView={updateView}
          settings={currentState.context.settings}
          updateFontSize={updateFontSize}
          updateLineHeight={updateLineHeight}
          updateTracking={updateTracking}
          updateColumn={updateColumn}
          updateTextAlign={updateTextAlign}
          updateVerticalAlign={updateVerticalAlign}
        />
      )}
    </div>
  );
}

const STYLES_SENTENCE = (theme) => css`
  width: 100%;
  margin-top: 12px;
  color: ${theme.fontPreviewDarkMode ? theme.system.white : theme.system.pitchBlack};
  padding: 0px 32px 28px;
  &:focus {
    outline: none;
  }
`;
const Sentence = ({ content, valign, textAlign, fontSize, lineHeight, tracking }) => {
  const [value, setValue] = React.useState(`<p>${content}</p>`);
  const mapAlignToFlex = { center: "center", top: "flex-start", bottom: "flex-end" };
  return (
    <div style={{ display: "flex", alignItems: mapAlignToFlex[valign], height: "100%" }}>
      <div
        contentEditable="true"
        suppressContentEditableWarning={true}
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: `${lineHeight}%`,
          letterSpacing: `${tracking}em`,
          textAlign,
        }}
        css={STYLES_SENTENCE}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
      >
        {content}
      </div>
    </div>
  );
};

const Paragraph = ({ content, valign, textAlign, fontSize, lineHeight, tracking, column }) => {
  const [value, setValue] = React.useState(`<p>${content}</p>`);
  const mapAlignToFlex = { center: "center", top: "flex-start", bottom: "flex-end" };
  return (
    <div style={{ display: "flex", alignItems: mapAlignToFlex[valign], height: "100%" }}>
      <div
        contentEditable="true"
        suppressContentEditableWarning={true}
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: `${lineHeight}%`,
          letterSpacing: `${tracking}em`,
          textAlign,
          whiteSpace: "pre-wrap",
        }}
        css={[
          STYLES_SENTENCE,
          css`
            width: 100%;
            column-count: ${column};
            column-gap: 24px;
          `,
        ]}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
      >
        {content}
      </div>
    </div>
  );
};

const STYLES_GLYPHS_WRAPPER = (theme) => css`
  padding: 0px 32px 28px;
  color: ${theme.fontPreviewDarkMode ? theme.system.white : theme.system.pitchBlack};
`;
const STYLES_GLYPHS_LETTER = css`
  font-size: 128px;
  line-height: 192px;
  margin-bottom: 16px;
`;
const STYLES_GLYPHS_GRID = css`
  margin-top: -16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12px, 1fr));
  grid-template-rows: repeat(12, 1fr);
  grid-column-gap: 28px;
  grid-auto-rows: 0px;
  overflow-y: hidden;
`;
const Glyphs = ({}) => {
  const content = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?()@$#%*[]{}\:;_""-`;
  const glyphs = React.useMemo(() => new Array(5).fill(content).join("").split(""), []);
  return (
    <div css={STYLES_GLYPHS_WRAPPER}>
      <div css={STYLES_GLYPHS_LETTER}>Aa</div>
      <div css={STYLES_GLYPHS_GRID}>
        {glyphs.map((letter) => (
          <div
            css={css`
              margin-top: 16px;
            `}
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
  );
};
