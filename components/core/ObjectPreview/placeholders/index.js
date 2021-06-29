import * as React from "react";
import * as Validations from "~/common/validations";

import PdfPlaceholder from "./PDF";
import AudioPlaceholder from "./Audio";
import CodePlaceholder from "./Code";
import EpubPlaceholder from "./EPUB";
import TextPlaceholder from "./Text";
import KeynotePlaceholder from "./Keynote";
import Object3DPlaceholder from "./3D";
import FilePlaceholder from "./File";

export default function Placeholders({ file, ratio }) {
  const { type } = file.data;

  //   if (type.startsWith("video/")) {
  //     const fileExtension = type.split("/")[1];
  //     return (
  //       <VideoObjectPreview
  //         title={title}
  //         likes={likeCount}
  //         saves={saveCount}
  //         type={fileExtension}
  //         url={url}
  //         {...props}
  //       />
  //     );
  //   }

  if (Validations.isPdfType(type)) {
    return <PdfPlaceholder ratio={ratio} />;
  }

  if (type.startsWith("audio/")) {
    return <AudioPlaceholder ratio={ratio} />;
  }

  if (type === "application/epub+zip") {
    return <EpubPlaceholder ratio={ratio} />;
  }

  if (file.filename.endsWith(".key")) {
    return <KeynotePlaceholder ratio={ratio} />;
  }

  if (Validations.isCodeFile(file.filename)) {
    return <CodePlaceholder ratio={ratio} />;
  }

  if (Validations.isMarkdown(file.filename, type)) {
    return <TextPlaceholder ratio={ratio} />;
  }

  if (Validations.is3dFile(file.filename)) {
    return <Object3DPlaceholder ratio={ratio} />;
  }

  return <FilePlaceholder ratio={ratio} />;
}
