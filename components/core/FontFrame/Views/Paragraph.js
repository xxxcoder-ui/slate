import * as React from "react";

import ContentEditable from "~/components/core/FontFrame/Views/ContentEditable";

import { css } from "@emotion/react";

const STYLES_PARAGRAPH_WRAPPER = (theme) => css`
  display: flex;
  height: 100%;
  .font_frame_paragraph {
    width: 100%;
    margin-top: 12px;
    color: ${theme.fontPreviewDarkMode ? theme.system.white : theme.system.black};
    padding: 0px 32px 28px;
    word-break: break-word;
    white-space: pre-wrap;

    &:focus {
      outline: none;
    }
  }
`;
const STYLES_TYPE_TO_EDIT = (isFocused) => (theme) => css`
  .font_frame_paragraph::after {
    content: " type to edit";
    color: ${theme.fontPreviewDarkMode
      ? theme.semantic.textGrayDark
      : theme.semantic.textGrayLight};
    opacity: ${isFocused ? 0 : 1};
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

  const mapAlignToFlex = {
    center: { marginTop: "auto", marginBottom: "auto" },
    top: { marginBottom: "auto" },
    bottom: { marginTop: "auto" },
  };

  return (
    <div
      css={[
        STYLES_PARAGRAPH_WRAPPER,
        STYLES_TYPE_TO_EDIT(isFocused),
        css({
          ".font_frame_paragraph": {
            fontSize: `${fontSize}px`,
            lineHeight: `${lineHeight}%`,
            letterSpacing: `${tracking}em`,
            textAlign,
            columnCount: column,
            columnGap: "24px",
            ...mapAlignToFlex[valign],
          },
        }),
      ]}
    >
      <ContentEditable
        className="font_frame_paragraph"
        contentEditable="true"
        suppressContentEditableWarning={true}
        onKeyDown={(e) => e.stopPropagation()}
        html={content}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
}
