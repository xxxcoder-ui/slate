import * as React from "react";
import * as Constants from "~/common/constants";
import * as Validations from "~/common/validations";
import * as Utilities from "~/common/utilities";
import * as SVG from "~/common/svg";
import * as Strings from "~/common/strings";

import { css } from "@emotion/react";
import { FileTypeIcon } from "~/components/core/FileTypeIcon";
import { H4, P } from "~/components/system/components/Typography";
import { AspectRatio } from "~/components/system";
import { Blurhash } from "react-blurhash";
import { isBlurhashValid } from "blurhash";

import ActivityImagePreview from "./ActivityImagePreview";
import ActivityVideoPreview from "./ActivityVideoPreview";
import ActivityTextPreview from "./ActivityTextPreview";
import ActivityPdfPreview from "./ActivityPdfPreview";
import ActivityEpubPreview from "./ActivityEpubPreview";
import ActivityAudioPreview from "./ActivityAudioPreview";
import ActivityKeynotePreview from "./ActivityKeynotePreview";
import ActivityDefaultPreview from "./ActivityDefaultPreview";
import Activity3DPreview from "./Activity3dPreview";
import ActivityCodePreview from "./ActivityCodePreview";
import ActivityFontPreview from "./ActivityFontPreview";

export default function ActivityObjectPreview({ file, ...props }) {
  const title = file.data.name || file.filename;
  const likeCount = file.likeCount;
  const saveCount = file.saveCount;
  const type = file.data.type;
  const url = Validations.isPreviewableImage
    ? Strings.getURLfromCID(file.cid)
    : Strings.getURLfromCID(coverImage.cid);

  if (Validations.isPreviewableImage(type)) {
    const fileType = type.split("/")[1];
    return (
      <ActivityImagePreview
        type={fileType}
        title={title}
        likes={likeCount}
        saves={saveCount}
        file={file}
        url={url}
        {...props}
      />
    );
  }

  if (type.startsWith("video/")) {
    const fileExtension = type.split("/")[1];
    return (
      <ActivityVideoPreview
        title={title}
        likes={likeCount}
        saves={saveCount}
        type={fileExtension}
        url={url}
        {...props}
      />
    );
  }

  if (Validations.isPdfType(type)) {
    return (
      <ActivityPdfPreview type="PDF" title={title} likes={likeCount} saves={saveCount} {...props} />
    );
  }

  if (type.startsWith("audio/")) {
    const fileType = Utilities.getFileExtension(file.filename) || "audio";
    return (
      <ActivityAudioPreview type={fileType} title={title} likes={likeCount} saves={saveCount} />
    );
  }

  if (type === "application/epub+zip") {
    return (
      <ActivityEpubPreview
        type="EPUB"
        title={title}
        likes={likeCount}
        saves={saveCount}
        {...props}
      />
    );
  }

  if (file.filename.endsWith(".key")) {
    return (
      <ActivityKeynotePreview type="KEYNOTE" title={title} likes={likeCount} saves={saveCount} />
    );
  }

  if (Validations.isCodeFile(file.filename)) {
    const fileType = Utilities.getFileExtension(file.filename) || "code";
    return (
      <ActivityCodePreview
        type={fileType}
        title={title}
        likes={likeCount}
        saves={saveCount}
        {...props}
      />
    );
  }

  if (Validations.isFontFile(file.filename)) {
    const fileType = Utilities.getFileExtension(file.filename) || "font";
    return (
      <ActivityFontPreview
        file={file}
        type={fileType}
        url={url}
        title={title}
        likes={likeCount}
        saves={saveCount}
      />
    );
  }

  if (Validations.isMarkdown(file.filename, type)) {
    const fileType = Utilities.getFileExtension(file.filename) || "text";
    return (
      <ActivityTextPreview
        url={url}
        type={fileType}
        title={title}
        likes={likeCount}
        saves={saveCount}
        {...props}
      />
    );
  }

  if (Validations.is3dFile(file.filename)) {
    return (
      <Activity3DPreview type="3D" title={title} likes={likeCount} saves={saveCount} {...props} />
    );
  }

  return <ActivityDefaultPreview type="FILE" title={title} likes={likeCount} saves={saveCount} />;
}
