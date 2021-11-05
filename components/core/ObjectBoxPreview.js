import * as React from "react";
import * as Validations from "~/common/validations";
import * as Strings from "~/common/strings";

import { css } from "@emotion/react";

import ObjectPlaceholder from "~/components/core/ObjectPreview/placeholders";

const STYLES_PLACEHOLDER_CONTAINER = css`
  height: 100%;
  width: 100%;
  min-width: auto;
`;

const STYLES_PREVIEW = css`
  height: 100%;
  width: 100%;
  background-size: cover;
  overflow: hidden;
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
`;

export default function BlobObjectPreview({ file, css, placeholderRatio = 1, ...props }) {
  const isImage = Validations.isPreviewableImage(file.type);
  const url = Strings.getURLfromCID(file.cid);

  if (isImage) {
    return (
      <div css={[STYLES_PREVIEW, css]} {...props}>
        <img src={url} alt="File preview" />
      </div>
    );
  }

  return (
    <div css={[STYLES_PREVIEW, css]} {...props}>
      <ObjectPlaceholder
        ratio={placeholderRatio}
        containerCss={STYLES_PLACEHOLDER_CONTAINER}
        file={file}
      />
    </div>
  );
}
