import "isomorphic-fetch";

import * as React from "react";
import * as Styles from "~/common/styles";

import { AspectRatio, P, SVG } from "~/components/system";
import { useInView } from "~/common/hooks";
import { css } from "@emotion/react";

import PdfPlaceholder from "./placeholders/PDF";
import ObjectPreviewPremitive from "./ObjectPreviewPremitive";

const STYLES_PDF_CONTAINER = css`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  svg {
    overflow: visible !important;
    width: ${(123 / 248) * 100}%;
    height: ${(151 / 248) * 100}%;
  }
`;

const STYLES_TAG = (theme) => css`
  position: absolute;
  text-transform: uppercase;
  background-color: ${theme.system.bgLight};
  bottom: 27%;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 8px;
  border-radius: 4px;
`;

export default function ActivityPDFPreview({ url, file, type, ...props }) {
  return (
    <ObjectPreviewPremitive {...props}>
      <div css={STYLES_PDF_CONTAINER}>
        <PdfPlaceholder />
        <div css={STYLES_TAG}>
          <P css={Styles.SMALL_TEXT}>{type}</P>
        </div>
      </div>
    </ObjectPreviewPremitive>
  );
}
