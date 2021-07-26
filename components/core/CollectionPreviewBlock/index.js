import * as React from "react";
import * as Validations from "~/common/validations";
import * as Typography from "~/components/system/components/Typography";
import * as Styles from "~/common/styles";
import * as Strings from "~/common/strings";
import * as Constants from "~/common/constants";
import * as SVG from "~/common/svg";

import { Logo } from "~/common/logo";
import { useInView } from "~/common/hooks";
import { isBlurhashValid } from "blurhash";
import { Blurhash } from "react-blurhash";
import { css } from "@emotion/react";
import { FollowButton } from "~/components/core/CollectionPreviewBlock/components";
import { useFollowHandler } from "~/components/core/CollectionPreviewBlock/hooks";
import { Link } from "~/components/core/Link";
import { AnimatePresence, motion } from "framer-motion";

import ObjectPlaceholder from "~/components/core/ObjectPreview/placeholders";

const STYLES_CONTAINER = (theme) => css`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${theme.semantic.bgLight};
  box-shadow: 0 0 0 0.5px ${theme.semantic.bgGrayLight}, ${theme.shadow.lightSmall};
  border-radius: 16px;
  width: 100%;
  overflow: hidden;

  height: 304px;
  @media (max-width: ${theme.sizes.mobile}px) {
    height: 281px;
  }
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

const STYLES_DESCRIPTION_CONTAINER = (theme) => css`
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 9px 16px 12px;
  border-radius: 0px 0px 16px 16px;
  box-shadow: 0 -0.5px 0.5px ${theme.semantic.bgGrayLight};
  width: 100%;
  margin-top: auto;
`;

const STYLES_SPACE_BETWEEN = css`
  justify-content: space-between;
`;

const STYLES_PROFILE_IMAGE = (theme) => css`
  background-color: ${theme.semantic.bgLight};
  height: 16px;
  width: 16px;
  border-radius: 4px;
  object-fit: cover;
`;

const STYLES_METRICS = (theme) => css`
  margin-top: 7px;
  @media (max-width: ${theme.sizes.mobile}px) {
    margin-top: 12px;
  }
  ${Styles.CONTAINER_CENTERED};
  ${STYLES_SPACE_BETWEEN}
`;

const STYLES_PLACEHOLDER_CONTAINER = css`
  height: 100%;
  width: 100%;
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

const STYLES_CONTROLS = css`
  position: absolute;
  z-index: 1;
  right: 16px;
  top: 16px;
  & > * + * {
    margin-top: 8px !important;
  }
`;
const STYLES_TEXT_GRAY = (theme) => css`
  color: ${theme.semantic.textGray};
`;

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

const STYLES_DESCRIPTION_INNER = (theme) => css`
  background-color: ${theme.semantic.bgLight};
  border-radius: 16px;
`;

const Preview = ({ collection, children, ...props }) => {
  const [isLoading, setLoading] = React.useState(true);
  const handleOnLoaded = () => setLoading(false);

  const previewerRef = React.useRef();
  const { isInView } = useInView({
    ref: previewerRef,
  });

  const isCollectionEmpty = collection.fileCount === 0;
  if (isCollectionEmpty) {
    return (
      <div css={STYLES_EMPTY_CONTAINER} {...props}>
        {children}
        <Logo style={{ height: 18, marginBottom: 8 }} />
        <Typography.P1 color="textGrayDark">No files in this collection</Typography.P1>
      </div>
    );
  }

  const object = getObjectToPreview(collection.objects);
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
};

export default function CollectionPreview({ collection, viewer, owner, onAction }) {
  const [areControlsVisible, setShowControls] = React.useState(false);
  const showControls = () => setShowControls(true);
  const hideControls = () => setShowControls(false);

  // const [isBodyVisible, setShowBody] = React.useState(false);
  // const showBody = () => setShowBody(true);
  // const hideBody = () => setShowBody(false);
  // const body = collection?.data?.body;

  const { follow, followCount, isFollowed } = useFollowHandler({ collection, viewer });

  const { fileCount } = collection;

  return (
    <div css={STYLES_CONTAINER}>
      <Preview collection={collection} onMouseEnter={showControls} onMouseLeave={hideControls}>
        <AnimatePresence>
          {areControlsVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              css={STYLES_CONTROLS}
            >
              <FollowButton
                onClick={follow}
                isFollowed={isFollowed}
                followCount={followCount}
                disabled={collection.ownerId === viewer?.id}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Preview>
      <div
        css={STYLES_DESCRIPTION_CONTAINER}
        //  onMouseEnter={showBody} onMouseLeave={hideBody}
      >
        <div
          css={STYLES_DESCRIPTION_INNER}
          // initial={{ y: 0 }}
          // animate={{ y: isBodyVisible ? -170 : 0 }}
          // transition={{ type: "spring", stiffness: 170, damping: 26 }}
        >
          <div css={[Styles.HORIZONTAL_CONTAINER_CENTERED, STYLES_SPACE_BETWEEN]}>
            <Typography.H5 color="textBlack" nbrOflines={1}>
              {collection.slatename}
            </Typography.H5>
          </div>

          {/* {isBodyVisible && (
            <div
            style={{ marginTop: 4 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isBodyVisible ? 1 : 0 }}
            >
              <Typography.P2 color="textGrayDark" nbrOflines={5}>
                {body || "sorry, no description available."}
              </Typography.P2>
            </div>
          )} */}
        </div>

        <div css={STYLES_METRICS}>
          <div css={[Styles.CONTAINER_CENTERED, STYLES_TEXT_GRAY]}>
            <SVG.Box />
            <Typography.P3 style={{ marginLeft: 4 }} color="textGray">
              {fileCount}
            </Typography.P3>
          </div>
          {owner && (
            <div style={{ alignItems: "end" }} css={Styles.CONTAINER_CENTERED}>
              <Link
                href={`/$/user/${owner.id}`}
                onAction={onAction}
                aria-label={`Visit ${owner.username}'s profile`}
                title={`Visit ${owner.username}'s profile`}
              >
                <img
                  css={STYLES_PROFILE_IMAGE}
                  src={owner?.data?.photo}
                  alt={`${owner.username} profile`}
                  onError={(e) => (e.target.src = Constants.profileDefaultPicture)}
                />
              </Link>
              <Link
                href={`/$/user/${owner.id}`}
                onAction={onAction}
                aria-label={`Visit ${owner.username}'s profile`}
                title={`Visit ${owner.username}'s profile`}
              >
                <Typography.P3 style={{ marginLeft: 8 }} color="textGray">
                  {owner.username}
                </Typography.P3>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
