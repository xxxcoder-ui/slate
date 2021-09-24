import * as React from "react";
import * as Styles from "~/common/styles";
import * as Strings from "~/common/strings";

import { AspectRatio } from "~/components/system";
import { useInView } from "~/common/hooks";
import { Blurhash } from "react-blurhash";
import { isBlurhashValid } from "blurhash";

import { css } from "@emotion/react";
import ObjectPreviewPrimitive from "./ObjectPreviewPrimitive";

const STYLES_PLACEHOLDER_ABSOLUTE = css`
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
`;
const STYLES_FLUID_CONTAINER = css`
  position: relative;
  width: 100%;
  height: 100%;
`;

const STYLES_IMAGE = css`
  object-fit: cover;
  height: 100%;
  width: 100%;
`;

const ImagePlaceholder = ({ blurhash }) => (
  <div css={STYLES_PLACEHOLDER_ABSOLUTE}>
    <div css={[Styles.CONTAINER_CENTERED, STYLES_FLUID_CONTAINER]}>
      <AspectRatio ratio={1}>
        <div>
          <Blurhash
            hash={blurhash}
            height="100%"
            width="100%"
            resolutionX={32}
            resolutionY={32}
            punch={1}
          />
        </div>
      </AspectRatio>
    </div>
  </div>
);

// NOTE(amine): cache
const cidsLoaded = {};

export default function ImageObjectPreview({
  url,
  file,
  //NOTE(amine): ImageObjectPreview is used to display cover image for other objects, so we need to pass the tag down
  tag,
  ...props
}) {
  const isCached = cidsLoaded[file.cid];

  const previewerRef = React.useRef();
  const [isLoading, setLoading] = React.useState(isCached);
  const handleOnLoaded = () => {
    cidsLoaded[file.cid] = true;
    setLoading(false);
  };

  const { isInView } = useInView({
    ref: previewerRef,
  });

  const { type, coverImage } = file;
  const imgTag = type.split("/")[1];

  const blurhash = React.useMemo(() => {
    return file.blurhash && isBlurhashValid(file.blurhash).result
      ? file.blurhash
      : coverImage?.blurhash && isBlurhashValid(coverImage?.blurhash).result
      ? coverImage?.blurhash
      : null;
  }, [file]);

  const shouldShowPlaceholder = isLoading && blurhash;

  const imageUrl = coverImage ? coverImage?.url || Strings.getURLfromCID(coverImage?.cid) : url;

  return (
    <ObjectPreviewPrimitive file={file} tag={tag || imgTag} isImage {...props}>
      <div ref={previewerRef} css={[Styles.CONTAINER_CENTERED, STYLES_FLUID_CONTAINER]}>
        {isInView && (
          <img
            css={STYLES_IMAGE}
            src={imageUrl}
            alt={`${file.name} preview`}
            onLoad={handleOnLoaded}
          />
        )}
        {shouldShowPlaceholder && <ImagePlaceholder blurhash={blurhash} />}
      </div>
    </ObjectPreviewPrimitive>
  );
}
