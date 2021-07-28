import * as React from "react";
import * as Styles from "~/common/styles";

import { H5, P3 } from "~/components/system/components/Typography";
import { css } from "@emotion/react";

import ObjectPreviewPrimitive from "~/components/core/ObjectPreview/ObjectPreviewPrimitive";

const STYLES_SOURCE_LOGO = css`
  height: 14px;
  width: 14px;
  border-radius: 4px;
`;

export default function LinkObjectPreview({ file }) {
  const {
    data: { link },
  } = file;

  const tag = (
    <div css={Styles.HORIZONTAL_CONTAINER_CENTERED} style={{ transform: "translateY(3px)" }}>
      {link.logo && (
        <img
          src={link.logo}
          alt="Link source logo"
          style={{ marginRight: 4 }}
          css={STYLES_SOURCE_LOGO}
        />
      )}
      <P3 as="small" color="textGray">
        {link.source}
      </P3>
    </div>
  );

  return (
    <ObjectPreviewPrimitive file={file} tag={tag}>
      <img src={link.image} alt="link preview" css={Styles.IMAGE_FILL} />
    </ObjectPreviewPrimitive>
  );
}
