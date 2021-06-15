import "isomorphic-fetch";

import * as React from "react";
import * as Styles from "~/common/styles";

import { css } from "@emotion/react";

import ObjectPreviewPremitive from "./ObjectPreviewPremitive";
import { useFont } from "~/components/core/FontFrame/hooks";

const STYLES_TEXT_PREVIEW = (theme) => css`
  position: relative;
  height: 100%;
  margin: 8px;
  background-color: ${theme.system.white};
  border-radius: 8px;
  box-shadow: ${theme.shadow.large};
`;

const STYLES_LETTER = (theme) => css`
  transform: translateY(-25%);
  overflow: hidden;
  font-size: ${theme.typescale.lvl8};
`;

export default function ActivityFontPreview({ file, type, ...props }) {
  const { fontName } = useFont({ cid: file.cid }, [file.cid]);

  return (
    <ObjectPreviewPremitive type={type} {...props}>
      <div css={[Styles.CONTAINER_CENTERED, STYLES_TEXT_PREVIEW]}>
        <div style={{ fontFamily: fontName }}>
          <div css={STYLES_LETTER}>Aa</div>
        </div>
      </div>
    </ObjectPreviewPremitive>
  );
}
