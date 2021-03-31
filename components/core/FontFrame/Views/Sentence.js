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
const STYLES_TYPE_TO_EDIT = (isFocused) => (theme) => css`
  ::after {
    content: " type to edit";
    color: ${theme.fontPreviewDarkMode ? theme.system.textGrayDark : theme.system.textGrayLight};
    opacity: ${isFocused ? 0 : 1};
  }
`;

const MemoizedChild = React.memo(
  ({ children }) => children,
  (prevProps, nextProps) => !nextProps.shouldUpdateView
);

export default function Sentence({
  shouldUpdateView,
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

  const mapAlignToFlex = {
    center: { marginTop: "auto", marginBottom: "auto" },
    top: { marginBottom: "auto" },
    bottom: { marginTop: "auto" },
  };
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div
        contentEditable="true"
        suppressContentEditableWarning={true}
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: `${lineHeight}%`,
          letterSpacing: `${tracking}em`,
          textAlign,
          ...mapAlignToFlex[valign],
        }}
        css={[STYLES_SENTENCE, STYLES_TYPE_TO_EDIT(isFocused)]}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        onInput={(e) => {
          onChange(e.currentTarget.innerHTML);
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <MemoizedChild shouldUpdateView={shouldUpdateView}>{content}</MemoizedChild>
      </div>
    </div>
  );
}
