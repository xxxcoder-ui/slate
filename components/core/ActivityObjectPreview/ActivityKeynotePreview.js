import "isomorphic-fetch";

import * as React from "react";
import * as Styles from "~/common/styles";

import { P } from "~/components/system";
import { css } from "@emotion/react";

import ObjectPreviewPremitive from "./ObjectPreviewPremitive";
import KeynotePlaceholder from "./placeholders/Keynote";

const STYLES_CONTAINER = css`
  height: 100%;
  svg {
    overflow: visible !important;
    width: ${(183 / 248) * 100}%;
    height: ${(115 / 248) * 100}%;
  }
`;

const STYLES_TAG = (theme) => css`
  position: absolute;
  text-transform: uppercase;
  background-color: ${theme.system.bgLight};
  bottom: 36%;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 8px;
  border-radius: 4px;
`;

export default function ActivityKeynotePreview({ type, ...props }) {
  return (
    <ObjectPreviewPremitive {...props}>
      <div css={[Styles.CONTAINER_CENTERED, STYLES_CONTAINER]}>
        <KeynotePlaceholder />
        <div css={STYLES_TAG}>
          <P css={Styles.SMALL_TEXT}>{type}</P>
        </div>
      </div>
    </ObjectPreviewPremitive>
  );
}
