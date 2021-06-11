import * as React from "react";

import { AspectRatio } from "~/components/system";
import { useInView } from "~/common/hooks";
import { Blurhash } from "react-blurhash";
import { isBlurhashValid } from "blurhash";

import { css } from "@emotion/react";
import ObjectPreviewPremitive from "./ObjectPreviewPremitive";

const STYLES_PLACEHOLDER_ABSOLUTE = css`
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
`;
const STYLES_PLACEHOLDER_CONTAINER = css`
  position: relative;
  width: 100%;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const ImagePlaceholder = ({ blurhash }) => (
  <div css={STYLES_PLACEHOLDER_ABSOLUTE}>
    <div css={STYLES_PLACEHOLDER_CONTAINER}>
      <AspectRatio ratio={186 / 302}>
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

const STYLES_IMAGE_CONTAINER = css`
  position: relative;
  width: 100%;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

export default function ActivityImagePreview({ url, file, ...props }) {
  const previewerRef = React.useRef();
  const [isLoading, setLoading] = React.useState(true);
  const handleOnLoaded = () => setLoading(false);

  const { isInView } = useInView({
    ref: previewerRef,
  });

  const coverImage = file?.data?.coverImage;
  const blurhash = React.useMemo(() => {
    return file.data.blurhash && isBlurhashValid(file.data.blurhash)
      ? file.data.blurhash
      : coverImage?.data.blurhash && isBlurhashValid(coverImage?.data.blurhash)
      ? coverImage?.data.blurhash
      : null;
  }, [file]);

  return (
    <ObjectPreviewPremitive {...props}>
      <div ref={previewerRef} css={STYLES_IMAGE_CONTAINER}>
        {isLoading && blurhash && <ImagePlaceholder blurhash={blurhash} />}
        {isInView && (
          <AspectRatio ratio={186 / 302}>
            {/** NOTE(amine): if it's loaded */}
            <img src={url} style={{ objectFit: "cover" }} onLoad={handleOnLoaded} />
          </AspectRatio>
        )}
      </div>
    </ObjectPreviewPremitive>
  );
}
