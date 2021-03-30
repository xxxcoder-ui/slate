import * as React from "react";

import { css } from "@emotion/react";

const STYLES_PARAGRAPH = (theme) => css`
  width: 100%;
  margin-top: 12px;
  color: ${theme.fontPreviewDarkMode ? theme.system.white : theme.system.pitchBlack};
  padding: 0px 32px 28px;
  word-break: break-word;
  white-space: pre-wrap;

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

export default function Paragraph({
  content,
  valign,
  textAlign,
  fontSize,
  lineHeight,
  tracking,
  column,
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
    <div style={{ display: "flex", height: "100%", alignItems: mapAlignToFlex[valign] }}>
      <div
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: `${lineHeight}%`,
          letterSpacing: `${tracking}em`,
          textAlign,
        }}
        css={[
          STYLES_PARAGRAPH,
          !isFocused && STYLES_TYPE_TO_EDIT,
          css`
            width: 100%;
            column-count: ${column};
            column-gap: 24px;
          `,
        ]}
        onKeyDown={(e) => e.stopPropagation()}
        onInput={(e) => (value.current = e.currentTarget.innerText)}
        onFocus={handleFocus}
        onBlur={() => {
          handleChange();
          handleBlur();
        }}
        contentEditable="true"
        suppressContentEditableWarning={true}
      >
        {content}
      </div>
    </div>
  );
}
