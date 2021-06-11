import "isomorphic-fetch";

import * as React from "react";
import * as Styles from "~/common/styles";

import { AspectRatio, SVG, P } from "~/components/system";
import { useInView } from "~/common/hooks";
import { css } from "@emotion/react";

import ObjectPreviewPremitive from "./ObjectPreviewPremitive";
import TextPlaceholder from "./placeholders/Text";
import FontObjectPreview from "~/components/core/FontFrame/Views/FontObjectPreview";
import { useFont } from "~/components/core/FontFrame/hooks";

const STYLES_TAG = (theme) => css`
  position: absolute;
  text-transform: uppercase;
  background-color: ${theme.system.bgLight};
  bottom: 26%;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 8px;
  border-radius: 4px;
`;

const STYLES_TEXT_PREVIEW = (theme) =>
  css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    height: "100%",
    margin: "8px",
    top: "8px",
    backgroundColor: "#FFF",
    borderRadius: "8px",
    boxShadow: theme.shadow.large,
  });

const STYLES_LETTER = (theme) => css`
  overflow: hidden;
  font-size: ${theme.typescale.lvl8};
`;

export default function ActivityFontPreview({ url, file, type, ...props }) {
  const { isFontLoading, error, fontName } = useFont({ cid: file.cid }, [file.cid]);

  return (
    <ObjectPreviewPremitive type={type} {...props}>
      <div css={STYLES_TEXT_PREVIEW}>
        <div style={{ fontFamily: fontName }}>
          <div css={STYLES_LETTER}>Aa</div>
        </div>
      </div>
    </ObjectPreviewPremitive>
  );
}
