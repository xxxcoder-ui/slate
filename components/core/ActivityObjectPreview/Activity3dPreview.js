import "isomorphic-fetch";

import * as React from "react";
import * as Styles from "~/common/styles";

import { AspectRatio, SVG, P } from "~/components/system";
import { useInView } from "~/common/hooks";
import { css } from "@emotion/react";

import ObjectPreviewPremitive from "./ObjectPreviewPremitive";
import ObjectPlaceholder from "./placeholders/3D";

const STYLES_TEXT_CONTAINER = css`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  svg {
    overflow: visible !important;
    width: ${(69 / 248) * 100}%;
    height: ${(76.65 / 248) * 100}%;
  }
`;

const STYLES_TAG = (theme) => css`
  position: absolute;
  text-transform: uppercase;
  background-color: ${theme.system.bgLight};
  bottom: 25%;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 8px;
  border-radius: 4px;
`;

export default function Activity3DPreview({ url, file, type, ...props }) {
  return (
    <ObjectPreviewPremitive {...props}>
      <div css={STYLES_TEXT_CONTAINER}>
        <ObjectPlaceholder />
        <div css={STYLES_TAG}>
          <P css={Styles.SMALL_TEXT}>{type}</P>
        </div>
      </div>
    </ObjectPreviewPremitive>
  );
}
