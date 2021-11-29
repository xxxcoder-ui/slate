import * as React from "react";
import * as Styles from "~/common/styles";
import * as Constants from "~/common/constants";
import * as SVG from "~/common/svg";
import * as Validations from "~/common/validations";
import * as Utilities from "~/common/utilities";

import { css } from "@emotion/react";
import { FollowButton, ShareButton } from "~/components/core/CollectionPreviewBlock/components";
import { useFollowHandler } from "~/components/core/CollectionPreviewBlock/hooks";
import { Link } from "~/components/core/Link";
import { motion, useAnimation } from "framer-motion";
import { Preview } from "~/components/core/CollectionPreviewBlock/components";
import { AspectRatio } from "~/components/system";
import { P3, H5, P2 } from "~/components/system/components/Typography";
import { useMediaQuery, useMounted } from "~/common/hooks";

import ProfilePhoto from "~/components/core/ProfilePhoto";

const STYLES_CONTAINER = (theme) => css`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${theme.semantic.bgLight};
  box-shadow: 0 0 0 1px ${theme.system.grayLight4}, ${theme.shadow.lightSmall};
  border-radius: 16px;
  width: 100%;
  overflow: hidden;
`;

const STYLES_DESCRIPTION = (theme) => css`
  position: relative;
  border-radius: 0px 0px 16px 16px;
  box-sizing: border-box;
  width: 100%;
  background-color: ${theme.semantic.bgLight};
  z-index: 1;
`;

const STYLES_INNER_DESCRIPTION = (theme) => css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: ${theme.semantic.bgLight};
  padding: 9px 16px 0px;
  border-top: 1px solid ${theme.system.grayLight4};
`;

const STYLES_SPACE_BETWEEN = css`
  justify-content: space-between;
`;

const STYLES_PROFILE_IMAGE = (theme) => css`
  display: block;
  background-color: ${theme.semantic.bgLight};
  height: 16px;
  width: 16px;
  border-radius: 4px;
  object-fit: cover;
`;

const STYLES_METRICS = css`
  position: relative;
  z-index: 1;
  margin-top: auto;
  padding: 4px 16px 8px;
  ${Styles.CONTAINER_CENTERED};
  ${STYLES_SPACE_BETWEEN}
`;

const STYLES_CONTROLS = css`
  position: absolute;
  z-index: 1;
  right: 16px;
  top: 16px;
  ${Styles.VERTICAL_CONTAINER};
  align-items: flex-end;
  & > * + * {
    margin-top: 8px !important;
  }
`;

const STYLES_TEXT_GRAY = (theme) => css`
  color: ${theme.semantic.textGray};
`;

const STYLES_SECURITY_LOCK_WRAPPER = (theme) => css`
  background-color: ${theme.semantic.bgDark};
  border-radius: 4px;
  padding: 4px;
  color: ${theme.semantic.textGrayLight};
`;

export default function CollectionPreview({ collection, viewer, owner, onAction }) {
  const [areControlsVisible, setShowControls] = React.useState(false);
  const showControls = () => setShowControls(true);
  const hideControls = () => setShowControls(false);

  const description = collection?.body;
  const media = useMediaQuery();
  const { isDescriptionVisible, showDescription, hideDescription } = useShowDescription({
    disabled: !description || media.mobile,
  });

  const extendedDescriptionRef = React.useRef();
  const descriptionRef = React.useRef();

  const animationController = useAnimateDescription({
    extendedDescriptionRef: extendedDescriptionRef,
    descriptionRef: descriptionRef,
    isDescriptionVisible,
  });

  const { follow, followCount, isFollowed } = useFollowHandler({ collection, viewer });

  const { fileCount, isPublic } = collection;
  const title = collection.name || collection.slatename;
  const isOwner = viewer?.id === collection.ownerId;

  const preview = React.useMemo(
    () => getObjectToPreview(collection.coverImage),
    [collection.coverImage]
  );

  return (
    <div css={STYLES_CONTAINER}>
      <AspectRatio ratio={248 / 382}>
        <div css={Styles.VERTICAL_CONTAINER}>
          <Preview
            file={preview.object}
            type={preview.type}
            onMouseEnter={showControls}
            onMouseLeave={hideControls}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: areControlsVisible ? 1 : 0 }}
              css={STYLES_CONTROLS}
            >
              <FollowButton
                onClick={follow}
                isFollowed={isFollowed}
                followCount={followCount}
                disabled={viewer && collection.ownerId === viewer.id}
              />
              <ShareButton user={owner} preview={preview} collection={collection} />
            </motion.div>
          </Preview>

          <motion.article css={STYLES_DESCRIPTION}>
            <div style={{ position: "relative", paddingTop: 9 }}>
              <H5 nbrOflines={1} style={{ visibility: "hidden" }}>
                {title?.slice(0, 5)}
              </H5>

              {description && (
                <div ref={descriptionRef}>
                  <P3
                    style={{ paddingTop: 3, visibility: "hidden" }}
                    nbrOflines={1}
                    color="textGrayDark"
                  >
                    {description?.slice(0, 5)}
                  </P3>
                </div>
              )}

              <motion.div
                css={STYLES_INNER_DESCRIPTION}
                initial={false}
                animate={isDescriptionVisible ? "hovered" : "initial"}
                variants={animationController.containerVariants}
                onMouseMove={showDescription}
                onMouseLeave={hideDescription}
              >
                <div
                  css={[
                    Styles.HORIZONTAL_CONTAINER_CENTERED,
                    css({ justifyContent: "space-between" }),
                  ]}
                >
                  <H5 color="textBlack" nbrOflines={1} title={title}>
                    {title}
                  </H5>
                  {!isPublic && (
                    <div css={STYLES_SECURITY_LOCK_WRAPPER} style={{ marginLeft: 8 }}>
                      <SVG.SecurityLock height={8} style={{ display: "block" }} />
                    </div>
                  )}
                </div>
                {!isDescriptionVisible && (
                  <P3 style={{ paddingTop: 3 }} nbrOflines={1} color="textGrayDark">
                    {description}
                  </P3>
                )}
                {description && (
                  <div ref={extendedDescriptionRef}>
                    <P2
                      as={motion.p}
                      style={{ paddingTop: 3 }}
                      nbrOflines={7}
                      initial={{ opacity: 0 }}
                      color="textGrayDark"
                      animate={animationController.descriptionControls}
                    >
                      {description}
                    </P2>
                  </div>
                )}
              </motion.div>
            </div>
            <Metrics owner={owner} isOwner={isOwner} fileCount={fileCount} onAction={onAction} />
          </motion.article>
        </div>
      </AspectRatio>
    </div>
  );
}

function Metrics({ fileCount, owner, isOwner, onAction }) {
  return (
    <div css={STYLES_METRICS}>
      <div css={[Styles.CONTAINER_CENTERED, STYLES_TEXT_GRAY]}>
        <SVG.Box height={16} width={16} />
        <P3 style={{ marginLeft: 4 }} color="textGray">
          {fileCount}
        </P3>
      </div>

      <div style={{ alignItems: "end" }} css={Styles.CONTAINER_CENTERED}>
        {isOwner && (
          <>
            <Link
              href={`/$/user/${owner.id}`}
              onAction={onAction}
              aria-label={`Visit ${owner.username}'s profile`}
              title={`Visit ${owner.username}'s profile`}
            >
              <ProfilePhoto user={owner} style={{ borderRadius: "4px" }} size={16} />
            </Link>
            <Link
              href={`/$/user/${owner.id}`}
              onAction={onAction}
              aria-label={`Visit ${owner.username}'s profile`}
              title={`Visit ${owner.username}'s profile`}
            >
              <P3 style={{ marginLeft: 8 }} color="textGray">
                {owner.username}
              </P3>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

const useShowDescription = ({ disabled }) => {
  const [isDescriptionVisible, setShowDescription] = React.useState(false);
  const timeoutId = React.useRef();

  const showDescription = () => {
    if (disabled) return;

    clearTimeout(timeoutId.current);
    const id = setTimeout(() => setShowDescription(true), 250);
    timeoutId.current = id;
  };
  const hideDescription = () => {
    if (disabled) return;

    clearTimeout(timeoutId.current);
    setShowDescription(false);
  };

  return { isDescriptionVisible, showDescription, hideDescription };
};

const useAnimateDescription = ({
  extendedDescriptionRef,
  descriptionRef,
  isDescriptionVisible,
}) => {
  const descriptionHeights = React.useRef({
    extended: 0,
    static: 0,
  });

  React.useEffect(() => {
    const extendedDescriptionElement = extendedDescriptionRef.current;
    const descriptionElement = descriptionRef.current;
    if (descriptionElement && extendedDescriptionElement) {
      descriptionHeights.current.static = descriptionElement.offsetHeight;
      descriptionHeights.current.extended = extendedDescriptionElement.offsetHeight;
    }
  }, []);

  const containerVariants = {
    initial: {
      borderRadius: "0px",
      y: 0,
      transition: {
        type: "spring",
        stiffness: 170,
        damping: 26,
      },
    },
    hovered: {
      borderRadius: "16px",
      y: -descriptionHeights.current.extended + descriptionHeights.current.static,
      transition: {
        type: "spring",
        stiffness: 170,
        damping: 26,
      },
    },
  };
  const descriptionControls = useAnimation();

  useMounted(() => {
    const extendedDescriptionElement = extendedDescriptionRef.current;
    if (!extendedDescriptionElement) return;

    if (isDescriptionVisible) {
      extendedDescriptionElement.style.opacity = 1;
      descriptionControls.start({ opacity: 1, transition: { delay: 0.2 } });
      return;
    }

    extendedDescriptionElement.style.opacity = 0;
  }, [isDescriptionVisible]);

  return { containerVariants, descriptionControls };
};

const getObjectToPreview = (coverImage) => {
  if (!coverImage) return { type: "EMPTY" };

  let coverImageUrl = Utilities.getImageUrlIfExists(coverImage);

  return { object: coverImage, type: coverImageUrl ? "IMAGE" : "PLACEHOLDER" };
};
