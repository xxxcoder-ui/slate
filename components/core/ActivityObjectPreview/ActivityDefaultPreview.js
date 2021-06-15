import * as React from "react";
import * as Styles from "~/common/styles";

import { P } from "~/components/system";
import { css } from "@emotion/react";

import ObjectPreviewPremitive from "./ObjectPreviewPremitive";
import FilePlaceholder from "./placeholders/File";

const STYLES_CONTAINER = css`
  height: 100%;
  svg {
    overflow: visible !important;
    width: ${(121 / 248) * 100}%;
    height: ${(151 / 248) * 100}%;
  }
`;

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

export default function ActivityDefaultPreview({ type, ...props }) {
  return (
    <ObjectPreviewPremitive {...props}>
      <div css={[Styles.CONTAINER_CENTERED, STYLES_CONTAINER]}>
        <FilePlaceholder />
        <div css={STYLES_TAG}>
          <P css={Styles.SMALL_TEXT}>{type}</P>
        </div>
      </div>
    </ObjectPreviewPremitive>
  );
}
