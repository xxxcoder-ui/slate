import "isomorphic-fetch";

import * as React from "react";
import * as Styles from "~/common/styles";

import { P } from "~/components/system";
import { css } from "@emotion/react";

import PdfPlaceholder from "./placeholders/PDF";
import ObjectPreviewPremitive from "./ObjectPreviewPremitive";

const STYLES_CONTAINER = css`
  position: relative;
  height: 100%;
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

export default function PDFObjectPreview({ type, ...props }) {
  return (
    <ObjectPreviewPremitive {...props}>
      <div css={[Styles.CONTAINER_CENTERED, STYLES_CONTAINER]}>
        <PdfPlaceholder />
        <div css={STYLES_TAG}>
          <P css={Styles.SMALL_TEXT}>{type}</P>
        </div>
      </div>
    </ObjectPreviewPremitive>
  );
}
