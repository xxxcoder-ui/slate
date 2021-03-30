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
const STYLES_TYPE_TO_EDIT = (isFocused) => (theme) => css`
  ::after {
    content: " type to edit";
    color: ${theme.fontPreviewDarkMode ? theme.system.textGrayDark : theme.system.textGrayLight};
    opacity: ${isFocused ? 0 : 1};
  }
`;

const MemoizedChild = React.memo(
  ({ children }) => {
    return <div>{children}</div>;
  },
  (prevProps, nextProps) => !nextProps.shouldUpdateView
);

export default function Paragraph({
  shouldUpdateView,
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

  return (
    <div>
      <div style={{ display: "flex", height: "100%", alignItems: mapAlignToFlex[valign] }}>
        <div
          contentEditable="true"
          suppressContentEditableWarning={true}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: `${lineHeight}%`,
            letterSpacing: `${tracking}em`,
            textAlign,
          }}
          css={[
            STYLES_PARAGRAPH,
            STYLES_TYPE_TO_EDIT(isFocused),
            css`
              width: 100%;
              column-count: ${column};
              column-gap: 24px;
            `,
          ]}
          onKeyDown={(e) => e.stopPropagation()}
          onInput={(e) => {
            onChange(e.currentTarget.innerText);
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          <MemoizedChild shouldUpdateView={shouldUpdateView}>{content}</MemoizedChild>
        </div>
      </div>
    </div>
  );
}
