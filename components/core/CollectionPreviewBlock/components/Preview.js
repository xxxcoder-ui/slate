import * as React from "react";
import * as Validations from "~/common/validations";
import * as Typography from "~/components/system/components/Typography";
import * as Strings from "~/common/strings";
import * as Constants from "~/common/constants";

import { Logo } from "~/common/logo";
import { useInView } from "~/common/hooks";
import { isBlurhashValid } from "blurhash";
import { Blurhash } from "react-blurhash";
import { css } from "@emotion/react";

import ObjectPlaceholder from "~/components/core/ObjectPreview/placeholders";

const STYLES_PLACEHOLDER_CONTAINER = css`
  height: 100%;
  width: 100%;
`;

const STYLES_PREVIEW = css`
  flex-grow: 1;
  background-size: cover;
  overflow: hidden;
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
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

export default function Preview({ collection, children, ...props }) {
  const [isLoading, setLoading] = React.useState(true);
  const handleOnLoaded = () => setLoading(false);

  const previewerRef = React.useRef();
  const { isInView } = useInView({
    ref: previewerRef,
  });

  const object = React.useMemo(() => getObjectToPreview(collection.objects), [collection.objects]);

  const isCollectionEmpty = collection.objects.length === 0;
  if (isCollectionEmpty) {
    return (
      <div css={STYLES_EMPTY_CONTAINER} {...props}>
        {children}
        <Logo style={{ height: 24, marginBottom: 8, color: Constants.system.grayLight2 }} />
        <Typography.P2 color="grayLight2">This collection is empty</Typography.P2>
      </div>
    );
  }

  if (object.isImage) {
    const { coverImage } = object.data;
    const blurhash = getFileBlurHash(object);
    const previewImage = coverImage
      ? Strings.getURLfromCID(coverImage?.cid)
      : Strings.getURLfromCID(object.cid);

    return (
      <div ref={previewerRef} css={STYLES_PREVIEW} {...props}>
        {children}
        {isInView && (
          <>
            {isLoading && blurhash && (
              <Blurhash
                hash={blurhash}
                style={{ position: "absolute", top: 0, left: 0 }}
                height="100%"
                width="100%"
                resolutionX={32}
                resolutionY={32}
                punch={1}
              />
            )}
            <img src={previewImage} alt="Collection preview" onLoad={handleOnLoaded} />
          </>
        )}
      </div>
    );
  }

  return (
    <div css={STYLES_PREVIEW} {...props}>
      {children}
      <ObjectPlaceholder ratio={1} containerCss={STYLES_PLACEHOLDER_CONTAINER} file={object} />
    </div>
  );
}

const getFileBlurHash = (file) => {
  const coverImage = file?.data?.coverImage;
  const coverImageBlurHash = coverImage?.data?.blurhash;
  if (coverImage && isBlurhashValid(coverImageBlurHash)) return coverImageBlurHash;

  const blurhash = file?.data?.blurhash;
  if (isBlurhashValid(blurhash)) return blurhash;

  return null;
};

const getObjectToPreview = (objects = []) => {
  let objectIdx = 0;
  let isImage = false;

  objects.some((object, i) => {
    const isPreviewableImage = Validations.isPreviewableImage(object.data.type);
    if (isPreviewableImage) (objectIdx = i), (isImage = true);
    return isPreviewableImage;
  });

  return { ...objects[objectIdx], isImage };
};
