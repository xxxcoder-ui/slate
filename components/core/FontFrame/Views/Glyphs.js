import * as React from "react";

import { css } from "@emotion/react";

const STYLES_GLYPHS_WRAPPER = (theme) => css`
  padding: 0px 32px 28px;
  color: ${theme.fontPreviewDarkMode ? theme.system.white : theme.system.black};
`;
const STYLES_GLYPHS_LETTER = css`
  font-size: 128px;
  line-height: 192px;
  margin-bottom: 16px;
`;
const STYLES_GLYPHS_GRID = css`
  margin-top: -16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(32px, 1fr));
  grid-template-rows: repeat(12, 1fr);
  grid-column-gap: 28px;
  grid-auto-rows: 0px;
  overflow: hidden;
  font-size: 32px;
`;
export default function Glyphs() {
  const content = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890?!()[]{}&*^%$#@~`.split(
    ""
  );
  return (
    <div css={STYLES_GLYPHS_WRAPPER}>
      <div css={STYLES_GLYPHS_LETTER}>Aa</div>
      <div css={STYLES_GLYPHS_GRID}>
        {content.map((letter) => (
          <div
            key={letter}
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
}
