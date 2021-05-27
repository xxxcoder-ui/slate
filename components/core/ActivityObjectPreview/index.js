import * as React from "react";
import * as Constants from "~/common/constants";
import * as Validations from "~/common/validations";
import * as SVG from "~/common/svg";
import * as Strings from "~/common/strings";

import { css } from "@emotion/react";
import { FileTypeIcon } from "~/components/core/FileTypeIcon";
import { H4, P } from "~/components/system/components/Typography";
import { AspectRatio } from "~/components/system";
import { Blurhash } from "react-blurhash";
import { isBlurhashValid } from "blurhash";

import ObjectPreviewPremitive from "./ObjectPreviewPremitive";
import ActivityImagePreview from "./ActivityImagePreview";

export default function ActivityObjectPreview({ file, ...props }) {
  const title = file.data.name || file.filename;
  const likeCount = file.likeCount;
  const saveCount = file.saveCount;
  const type = file.data.type;
  const url = Validations.isPreviewableImage
    ? Strings.getURLfromCID(file.cid)
    : Strings.getURLfromCID(coverImage.cid);

  if (Validations.isPdfType(type)) {
    return (
      <ObjectPreviewPremitive
        type="PDF"
        title={title}
        likes={likeCount}
        saves={saveCount}
        {...props}
      />
    );
  }

  if (Validations.isPreviewableImage(type)) {
    const fileExtension = type.split("/")[1];
    return (
      <ActivityImagePreview
        type={fileExtension}
        title={title}
        likes={likeCount}
        saves={saveCount}
        file={file}
        url={url}
        {...props}
      />
    );
  }

  if (Validations.isFontFile(file.filename)) {
    return (
      <ObjectPreviewPremitive
        title={title}
        likes={likeCount}
        saves={saveCount}
        type="FONT"
        {...props}
      />
    );
  }

  return (
    <ObjectPreviewPremitive
      title={title}
      likes={likeCount}
      saves={saveCount}
      type="NONE"
      {...props}
    />
  );
}
