import * as React from "react";

import { css } from "@emotion/react";

const STYLES_SENTENCE = (theme) => css`
  width: 100%;
  margin-top: 12px;
  color: ${theme.fontPreviewDarkMode ? theme.system.white : theme.system.pitchBlack};
  padding: 0px 32px 28px;
  word-break: break-word;
  &:focus {
    outline: none;
  }
`;
const STYLES_TYPE_TO_EDIT = (theme) => css`
  ::after {
    content: " type to edit";
    color: ${theme.fontPreviewDarkMode ? theme.system.textGrayDark : theme.system.textGrayLight};
  }
`;

export default function Sentence({
  content,
  valign,
  textAlign,
  fontSize,
  lineHeight,
  tracking,
  onChange,
}) {
  const [isFocused, setFocus] = React.useState();
  const handleFocus = () => setFocus(true);
  const handleBlur = () => setFocus(false);

  const mapAlignToFlex = { center: "center", top: "flex-start", bottom: "flex-end" };
  const value = React.useRef(null);
  const handleChange = () => {
    if (!value.current) return;
    onChange(value.current);
  };

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
        css={[STYLES_SENTENCE, !isFocused && STYLES_TYPE_TO_EDIT]}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        onInput={(e) => {
          value.current = e.currentTarget.innerText;
        }}
        onFocus={handleFocus}
        onBlur={() => {
          handleChange();
          handleBlur();
        }}
      >
        {content}
      </div>
    </div>
  );
}
