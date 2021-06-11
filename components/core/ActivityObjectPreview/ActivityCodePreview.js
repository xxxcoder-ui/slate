import "isomorphic-fetch";

import * as React from "react";
import * as Styles from "~/common/styles";

import { AspectRatio, P, SVG } from "~/components/system";
import { css } from "@emotion/react";

import ObjectPreviewPremitive from "./ObjectPreviewPremitive";
import CodePlaceholder from "./placeholders/Code";

const STYLES_CODE_CONTAINER = css`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
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
  bottom: 27%;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 8px;
  border-radius: 4px;
`;

export default function ActivityCodePreview({ url, file, type, ...props }) {
  return (
    <ObjectPreviewPremitive {...props}>
      <div css={STYLES_CODE_CONTAINER}>
        <CodePlaceholder />
        <div css={STYLES_TAG}>
          <P css={Styles.SMALL_TEXT}>{type}</P>
        </div>
      </div>
    </ObjectPreviewPremitive>
  );
}
