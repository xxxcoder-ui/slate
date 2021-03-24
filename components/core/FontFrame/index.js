import * as React from "react";
import * as SVG from "~/common/svg";

import { css } from "@emotion/react";

import { useFont, useFontControls } from "./hooks";
import { FixedControls, Controls } from "./Controls";

const Glyphs = ({ dark }) => (
  <div>
    <div>ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
    <div>abcdefghijklmnopqrstuvwxyz</div>
    <div>0123456789</div>
    <div>!?()[]{}@$#%</div>
  </div>
);

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
      <div style={{ position: "relative", flexGrow: 1 }}>
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
        <Sentence
          content="The sun is gone but I have a light The day is done but I'm having fun I think I'm dumb or maybe I'm just happy I think I'm just happy I think I'm just happy I'm not like them but I can pretend The sun is gone but I have a light The day is done but I'm having fun I think I'm dumb or maybe I'm just happy"
          valign={currentState.context.settings.valign}
          textAlign={currentState.context.settings.textAlign}
          fontSize={currentState.context.settings.fontSize}
          lineHeight={currentState.context.settings.lineHeight}
          tracking={currentState.context.settings.tracking}
        />
      </div>
      <Controls
        dark={currentState.context.darkmode}
        settings={currentState.context.settings}
        updateFontSize={updateFontSize}
        updateLineHeight={updateLineHeight}
        updateTracking={updateTracking}
        updateColumn={updateColumn}
        updateTextAlign={updateTextAlign}
        updateVerticalAlign={updateVerticalAlign}
      />
    </div>
  );
}

const STYLES_SENTENCE = (theme) => css`
  display: flex;
  height: 100%;
  flex-direction: column;
  width: 100%;
  margin-top: 12px;
  overflow-y: scroll;
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
    <div
      contentEditable="true"
      suppressContentEditableWarning={true}
      style={{
        fontSize: `${fontSize}px`,
        lineHeight: `${lineHeight}%`,
        letterSpacing: `${tracking}em`,
        justifyContent: mapAlignToFlex[valign],
        textAlign,
      }}
      css={STYLES_SENTENCE}
      onKeyDown={(e) => {
        e.stopPropagation();
      }}
    >
      {content}
    </div>
  );
};
