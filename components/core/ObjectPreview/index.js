import * as React from "react";
import * as Validations from "~/common/validations";
import * as Utilities from "~/common/utilities";
import * as Strings from "~/common/strings";

import ImageObjectPreview from "./ImageObjectPreview";
import VideoObjectPreview from "./VideoObjectPreview";
import TextObjectPreview from "./TextObjectPreview";
import PdfObjectPreview from "./PdfObjectPreview";
import EpubObjectPreview from "./EpubObjectPreview";
import AudioObjectPreview from "./AudioObjectPreview";
import KeynoteObjectPreview from "./KeynoteObjectPreview";
import DefaultObjectPreview from "./DefaultObjectPreview";
import Object3DPreview from "./3dObjectPreview";
import CodeObjectPreview from "./CodeObjectPreview";
import FontObjectPreview from "./FontObjectPreview";

const ObjectPreview = ({ file, ...props }) => {
  const title = file.data.name || file.filename;
  const { likeCount, saveCount } = file;
  const { type, coverImage } = file.data;

  const url = Validations.isPreviewableImage(type)
    ? Strings.getURLfromCID(file.cid)
    : Strings.getURLfromCID(coverImage?.cid);

  if (Validations.isPreviewableImage(type)) {
    const fileType = type.split("/")[1];
    return (
      <ImageObjectPreview
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
      <VideoObjectPreview
        title={title}
        likes={likeCount}
        saves={saveCount}
        type={fileExtension}
        file={file}
        url={url}
        {...props}
      />
    );
  }

  if (Validations.isPdfType(type)) {
    return (
      <PdfObjectPreview type="PDF" title={title} likes={likeCount} saves={saveCount} {...props} />
    );
  }

  if (type.startsWith("audio/")) {
    const fileType = Utilities.getFileExtension(file.filename) || "audio";
    return (
      <AudioObjectPreview
        type={fileType}
        title={title}
        likes={likeCount}
        saves={saveCount}
        file={file}
        {...props}
      />
    );
  }

  if (type === "application/epub+zip") {
    return (
      <EpubObjectPreview type="EPUB" title={title} likes={likeCount} saves={saveCount} {...props} />
    );
  }

  if (file.filename.endsWith(".key")) {
    return (
      <KeynoteObjectPreview
        type="KEYNOTE"
        title={title}
        likes={likeCount}
        saves={saveCount}
        file={file}
        {...props}
      />
    );
  }

  if (Validations.isCodeFile(file.filename)) {
    const fileType = Utilities.getFileExtension(file.filename) || "code";
    return (
      <CodeObjectPreview
        type={fileType}
        title={title}
        likes={likeCount}
        saves={saveCount}
        file={file}
        {...props}
      />
    );
  }

  if (Validations.isFontFile(file.filename)) {
    const fileType = Utilities.getFileExtension(file.filename) || "font";
    return (
      <FontObjectPreview
        file={file}
        type={fileType}
        url={url}
        title={title}
        likes={likeCount}
        saves={saveCount}
        {...props}
      />
    );
  }

  if (Validations.isMarkdown(file.filename, type)) {
    const fileType = Utilities.getFileExtension(file.filename) || "text";
    return (
      <TextObjectPreview
        url={url}
        type={fileType}
        title={title}
        likes={likeCount}
        saves={saveCount}
        file={file}
        {...props}
      />
    );
  }

  if (Validations.is3dFile(file.filename)) {
    return (
      <Object3DPreview
        type="3D"
        file={file}
        title={title}
        likes={likeCount}
        saves={saveCount}
        {...props}
      />
    );
  }

  return (
    <DefaultObjectPreview
      type="FILE"
      title={title}
      likes={likeCount}
      saves={saveCount}
      file={file}
      {...props}
    />
  );
};

export default React.memo(ObjectPreview);
