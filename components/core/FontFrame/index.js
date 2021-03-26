import * as React from "react";

import { css } from "@emotion/react";

import { useFont, useFontControls } from "./hooks";
import { Controls } from "./Controls/index";
import { FixedControls, MobileFixedControls } from "./Controls/FixedControls";

const GET_STYLES_CONTAINER = (theme) => css`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: ${theme.fontPreviewDarkMode ? theme.system.pitchBlack : theme.system.white};
  padding-top: 14px;
`;
const STYLES_MOBILE_HIDDEN = (theme) => css`
  @media (max-width: ${theme.sizes.mobile}px) {
    display: none;
  }
`;

const STYLES_MOBILE_ONLY = (theme) => css`
  @media (min-width: ${theme.sizes.mobile}px) {
    display: none;
  }
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
      resetLayout,
      getRandomLayout,
    },
  ] = useFontControls();

  return (
    <div css={GET_STYLES_CONTAINER} style={{ fontFamily: fontName }} {...props}>
      <div css={STYLES_MOBILE_HIDDEN}>
        <FixedControls
          onDarkMode={setDarkMode}
          onLightMode={setLightMode}
          onToggleSettings={toggleSettings}
          isDarkMode={currentState.context.darkmode}
          isSettingsVisible={currentState.context.showSettings}
        />
      </div>
      <div style={{ position: "relative", flexGrow: 1, overflowY: "scroll" }}>
        {isFontLoading && (
          <div
            css={(theme) =>
              css({
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                width: "100%",
                height: "100%",
                color: theme.fontPreviewDarkMode ? "#fff" : "#000",
                backgroundColor: theme.fontPreviewDarkMode
                  ? "rgba(0,0,0,0.5)"
                  : "rgba(255,255,255,0.8)",
              })
            }
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
      <div css={STYLES_MOBILE_HIDDEN}>
        {currentState.context.showSettings && (
          <Controls
            view={currentState.view}
            defaultOptions={currentState.defaultOptions}
            resetLayout={resetLayout}
            updateView={updateView}
            settings={currentState.context.settings}
            updateFontSize={updateFontSize}
            updateLineHeight={updateLineHeight}
            updateTracking={updateTracking}
            updateColumn={updateColumn}
            updateTextAlign={updateTextAlign}
            updateVerticalAlign={updateVerticalAlign}
            getRandomLayout={getRandomLayout}
          />
        )}
      </div>
      <div css={STYLES_MOBILE_ONLY}>
        <MobileFixedControls
          view={currentState.view}
          defaultOptions={currentState.defaultOptions}
          updateView={updateView}
          onDarkMode={setDarkMode}
          onLightMode={setLightMode}
        />
      </div>
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
  overflow: hidden;
`;
const Glyphs = ({}) => {
  const content = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?()@$#%*[]{}\:;_""-`;
  const glyphs = React.useMemo(() => new Array(6).fill(content).join("").split(""), []);
  return (
    <div css={STYLES_GLYPHS_WRAPPER}>
      <div css={STYLES_GLYPHS_LETTER}>Aa</div>
      <div css={STYLES_GLYPHS_GRID}>
        {glyphs.map((letter, i) => (
          <div
            key={letter + i}
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
