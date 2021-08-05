import * as React from "react";
import * as Validations from "~/common/validations";
import * as Strings from "~/common/strings";
import * as Styles from "~/common/styles";
import * as Utilities from "~/common/utilities";

import { css } from "@emotion/react";

// Note(amine): placeholders
import PdfPlaceholder from "~/components/core/ObjectPreview/placeholders/PDF";
import VideoPlaceholder from "~/components/core/ObjectPreview/placeholders/Video";
import AudioPlaceholder from "~/components/core/ObjectPreview/placeholders/Audio";
import EbookPlaceholder from "~/components/core/ObjectPreview/placeholders/EPUB";
import KeynotePlaceholder from "~/components/core/ObjectPreview/placeholders/Keynote";
import CodePlaceholder from "~/components/core/ObjectPreview/placeholders/Code";
import Object3DPlaceholder from "~/components/core/ObjectPreview/placeholders/3D";
import FilePlaceholder from "~/components/core/ObjectPreview/placeholders/File";

// NOTE(amine): previews
import ImageObjectPreview from "~/components/core/ObjectPreview/ImageObjectPreview";
import TextObjectPreview from "~/components/core/ObjectPreview/TextObjectPreview";
import FontObjectPreview from "~/components/core/ObjectPreview/FontObjectPreview";
import LinkObjectPreview from "~/components/core/ObjectPreview/LinkObjectPreview";
import ObjectPreviewPrimitive from "~/components/core/ObjectPreview/ObjectPreviewPrimitive";

const ObjectPreview = ({ file, ...props }) => {
  const { type, link } = file.data;

  const url = Strings.getURLfromCID(file.cid);

  if (link) {
    return <LinkObjectPreview file={file} {...props} />;
  }

  if (Validations.isPreviewableImage(type)) {
    return <ImageObjectPreview file={file} url={url} {...props} />;
  }

  if (type.startsWith("video/")) {
    const tag = type.split("/")[1];
    return (
      <PlaceholderWrapper tag={tag} file={file} {...props}>
        <VideoPlaceholder ratio={1.3} />
      </PlaceholderWrapper>
    );
  }

  if (Validations.isPdfType(type)) {
    return (
      <PlaceholderWrapper tag="PDF" file={file} {...props}>
        <PdfPlaceholder ratio={1.3} />
      </PlaceholderWrapper>
    );
  }

  if (type.startsWith("audio/")) {
    const tag = Utilities.getFileExtension(file.filename) || "audio";
    return (
      <PlaceholderWrapper tag={tag} file={file} {...props}>
        <AudioPlaceholder ratio={1.3} />
      </PlaceholderWrapper>
    );
  }

  if (type === "application/epub+zip") {
    return (
      <PlaceholderWrapper tag="epub" file={file} {...props}>
        <EbookPlaceholder ratio={1.3} />
      </PlaceholderWrapper>
    );
  }

  if (file.filename.endsWith(".key")) {
    return (
      <PlaceholderWrapper tag="keynote" file={file} {...props}>
        <KeynotePlaceholder ratio={1.3} />
      </PlaceholderWrapper>
    );
  }

  if (Validations.isCodeFile(file.filename)) {
    const tag = Utilities.getFileExtension(file.filename) || "code";
    return (
      <PlaceholderWrapper tag={tag} file={file} {...props}>
        <CodePlaceholder ratio={1.3} />
      </PlaceholderWrapper>
    );
  }

  if (Validations.isFontFile(file.filename)) {
    return <FontObjectPreview file={file} url={url} {...props} />;
  }

  if (Validations.isMarkdown(file.filename, type)) {
    return <TextObjectPreview file={file} url={url} {...props} />;
  }

  if (Validations.is3dFile(file.filename)) {
    return (
      <PlaceholderWrapper tag="3d" file={file} {...props}>
        <Object3DPlaceholder ratio={1.3} />
      </PlaceholderWrapper>
    );
  }

  return (
    <PlaceholderWrapper tag="file" file={file} {...props}>
      <FilePlaceholder ratio={1.3} />
    </PlaceholderWrapper>
  );
};

export default React.memo(ObjectPreview);

const STYLES_CONTAINER = css`
  height: 100%;
`;
const PlaceholderWrapper = ({ children, ...props }) => {
  return (
    <ObjectPreviewPrimitive {...props}>
      <div css={[Styles.CONTAINER_CENTERED, STYLES_CONTAINER]}>{children}</div>
    </ObjectPreviewPrimitive>
  );
};
