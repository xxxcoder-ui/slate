import * as React from "react";
import * as Typography from "~/components/system/components/Typography";
import * as Strings from "~/common/strings";
import * as Constants from "~/common/constants";
import * as Utilities from "~/common/utilities";

import { Logo } from "~/common/logo";
import { useInView } from "~/common/hooks";
import { isBlurhashValid } from "blurhash";
import { Blurhash } from "react-blurhash";
import { css } from "@emotion/react";

import ObjectPlaceholder from "~/components/core/ObjectPreview/placeholders";

const STYLES_PLACEHOLDER_CONTAINER = css`
  height: 100%;
  width: 100%;
  min-width: auto;
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

const EmptyFallbackDefault = ({ children, ...props }) => {
  return (
    <div css={STYLES_EMPTY_CONTAINER} {...props}>
      {children}
      <Logo style={{ height: 24, marginBottom: 8, color: Constants.system.grayLight2 }} />
      <Typography.P2 color="grayLight2">This collection is empty</Typography.P2>
    </div>
  );
};
// NOTE(amine): type can be either "EMPTY" || "PLACEHOLDER" || "IMAGE"
export default function Preview({
  file,
  type,
  css,
  children,
  EmptyFallback = EmptyFallbackDefault,
  placeholderRatio = 1,
  ...props
}) {
  const [isLoading, setLoading] = React.useState(true);
  const handleOnLoaded = () => setLoading(false);

  const previewerRef = React.useRef();
  const { isInView } = useInView({
    ref: previewerRef,
  });

  if (type === "EMPTY") {
    return <EmptyFallback {...props}>{children}</EmptyFallback>;
  }

  if (type === "IMAGE") {
    const blurhash = getFileBlurHash(file);
    const previewImage = Utilities.getImageUrlIfExists(file);

    return (
      <div ref={previewerRef} css={[STYLES_PREVIEW, css]} {...props}>
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
    <div css={[STYLES_PREVIEW, css]} {...props}>
      {children}
      <ObjectPlaceholder
        ratio={placeholderRatio}
        containerCss={STYLES_PLACEHOLDER_CONTAINER}
        file={file}
      />
    </div>
  );
}

const getFileBlurHash = (file) => {
  const coverImage = file?.coverImage;
  const coverImageBlurHash = coverImage?.blurhash;
  if (coverImage && isBlurhashValid(coverImageBlurHash).result) return coverImageBlurHash;

  const blurhash = file?.blurhash;
  if (isBlurhashValid(blurhash).result) return blurhash;

  return null;
};
