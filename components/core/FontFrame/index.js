import * as React from "react";

import { css } from "@emotion/react";

import Controls from "./Controls";
import { useFont, useFontControls } from "./hooks";

const Glyphs = ({ dark }) => (
  <div>
    <div>ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
    <div>abcdefghijklmnopqrstuvwxyz</div>
    <div>0123456789</div>
    <div>!?()[]{}@$#%</div>
  </div>
);

const GET_STYLES_CONTAINER = (dark) => (theme) => css`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: ${dark ? theme.system.pitchBlack : theme.system.white};
  padding: 14px 32px 28px;
`;

export default function FontFrame({ cid, url, ...props }) {
  const { isFontLoading, fontName } = useFont({ url, name: cid }, [cid]);
  const [currentState, { setLightMode, setDarkMode, toggleSettings }] = useFontControls();

  return (
    <div
      css={GET_STYLES_CONTAINER(currentState.context.darkmode)}
      style={{ fontFamily: fontName }}
      {...props}
    >
      <Controls
        onDarkMode={setDarkMode}
        onLightMode={setLightMode}
        onToggleSettings={toggleSettings}
        isDarkMode={currentState.context.darkmode}
        isSettingsVisible={currentState.context.showSettings}
      />
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
        letterSpacing={currentState.context.settings.tracking}
        dark={currentState.context.darkmode}
      />
    </div>
  );
}

const Sentence = ({ content, valign, textAlign, fontSize, lineHeight, tracking, dark }) => {
  const [value, setValue] = React.useState(`<p>${content}</p>`);
  return (
    <div
      contentEditable="true"
      suppressContentEditableWarning={true}
      dangerouslySetInnerHTML={{ __html: value }}
      onInput={(e) => setValue(e.target.innerText)}
      css={(theme) =>
        css({
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          width: "100%",
          marginTop: "12px",
          overflowY: "scroll",
          color: dark ? theme.system.white : theme.system.pitchBlack,
          justifyContent: valign,
          textAlign,
          fontSize,
          lineHeight,
          letterSpacing: tracking,
        })
      }
      onKeyDown={(e) => {
        e.stopPropagation();
      }}
    ></div>
  );
};
