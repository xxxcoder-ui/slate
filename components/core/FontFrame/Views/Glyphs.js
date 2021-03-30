import * as React from "react";

import { css } from "@emotion/react";

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
export default function Glyphs() {
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
}
