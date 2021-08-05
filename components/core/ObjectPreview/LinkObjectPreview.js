import * as React from "react";
import * as Styles from "~/common/styles";
import * as Constants from "~/common/constants";
import * as Typography from "~/components/system/components/Typography";

import { P3 } from "~/components/system/components/Typography";
import { css } from "@emotion/react";
import { Logo } from "~/common/logo";

import ObjectPreviewPrimitive from "~/components/core/ObjectPreview/ObjectPreviewPrimitive";

const STYLES_SOURCE_LOGO = css`
  height: 14px;
  width: 14px;
  border-radius: 4px;
`;

const STYLES_EMPTY_CONTAINER = css`
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

export default function LinkObjectPreview({ file, ...props }) {
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
      <P3 as="small" color="textGray" nbrOflines={1}>
        {link.source}
      </P3>
    </div>
  );

  return (
    <ObjectPreviewPrimitive file={file} tag={tag} {...props}>
      {link.image ? (
        <img src={link.image} alt="Link preview" css={Styles.IMAGE_FILL} />
      ) : (
        <div css={STYLES_EMPTY_CONTAINER}>
          <Logo style={{ height: 24, marginBottom: 8, color: Constants.system.grayLight2 }} />
          <Typography.P2 color="grayLight2">No image found</Typography.P2>
        </div>
      )}
    </ObjectPreviewPrimitive>
  );
}
