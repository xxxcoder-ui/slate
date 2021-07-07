import * as React from "react";

import { css } from "@emotion/react";

import ContentEditable from "~/components/core/FontFrame/Views/ContentEditable";

const STYLES_SENTENCE_WRAPPER = (theme) => css`
  .font_frame_sentence {
    width: 100%;
    margin-top: 12px;
    color: ${theme.fontPreviewDarkMode ? theme.system.white : theme.system.black};
    padding: 0px 32px 28px;
    word-break: break-word;
    &:focus {
      outline: none;
    }
  }
`;
const STYLES_TYPE_TO_EDIT = (isFocused) => (theme) => css`
  .font_frame_sentence::after {
    content: " type to edit";
    color: ${theme.fontPreviewDarkMode
      ? theme.semantic.textGrayDark
      : theme.semantic.textGrayLight};
    opacity: ${isFocused ? 0 : 1};
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

  const mapAlignToFlex = {
    center: { marginTop: "auto", marginBottom: "auto" },
    top: { marginBottom: "auto" },
    bottom: { marginTop: "auto" },
  };
  return (
    <div
      style={{ display: "flex", height: "100%" }}
      css={[
        STYLES_SENTENCE_WRAPPER,
        STYLES_TYPE_TO_EDIT(isFocused),
        css({
          ".font_frame_sentence": {
            fontSize: `${fontSize}px`,
            lineHeight: `${lineHeight}%`,
            letterSpacing: `${tracking}em`,
            textAlign,
            ...mapAlignToFlex[valign],
          },
        }),
      ]}
    >
      <ContentEditable
        className="font_frame_sentence"
        contentEditable="true"
        suppressContentEditableWarning={true}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        html={content}
      />
    </div>
  );
}
