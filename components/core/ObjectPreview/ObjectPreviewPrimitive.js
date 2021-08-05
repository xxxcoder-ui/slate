import * as React from "react";

import { css } from "@emotion/react";
import { H5, P3 } from "~/components/system/components/Typography";
import { AspectRatio } from "~/components/system";
// import { LikeButton, SaveButton } from "./components";
// import { useLikeHandler, useSaveHandler } from "~/common/hooks";
import { motion } from "framer-motion";

import ImageObjectPreview from "./ImageObjectPreview";

const STYLES_WRAPPER = (theme) => css`
  position: relative;
  background-color: ${theme.semantic.bgLight};
  transition: box-shadow 0.2s;
  box-shadow: 0 0 0 0.5px ${theme.system.grayLight4}, ${theme.shadow.card};
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
`;

const STYLES_DESCRIPTION = (theme) => css`
  position: relative;
  box-shadow: 0 -0.5px 0.5px ${theme.system.grayLight4};
  border-radius: 0px 0px 16px 16px;
  box-sizing: border-box;
  width: 100%;
  background-color: ${theme.semantic.bgLight};
  border-radius: 16px;
  height: calc(170px + 61px);
  padding: 9px 16px 8px;
  z-index: 1;

  @media (max-width: ${theme.sizes.mobile}px) {
    padding: 8px;
  }
`;

const STYLES_PREVIEW = css`
  overflow: hidden;
  position: relative;
  bottom: 0.5px;
`;

const STYLES_SELECTED_RING = (theme) => css`
  box-shadow: 0 0 0 2px ${theme.system.blue};
`;

// const STYLES_CONTROLS = css`
//   position: absolute;
//   z-index: 1;
//   right: 16px;
//   top: 16px;
//   & > * + * {
//     margin-top: 8px !important;
//   }
// `;

const STYLES_UPPERCASE = css`
  text-transform: uppercase;
`;

export default function ObjectPreviewPrimitive({
  children,
  tag = "FILE",
  file,
  isSelected,
  // viewer,
  owner,
  // NOTE(amine): internal prop used to display
  isImage,
  onAction,
}) {
  const { isDescriptionVisible, showDescription, hideDescription } = useShowDescription();
  // const { like, isLiked, likeCount } = useLikeHandler({ file, viewer });
  // const { save, isSaved, saveCount } = useSaveHandler({ file, viewer });
  // const showSaveButton = viewer?.id !== file?.ownerId;

  // const [areControlsVisible, setShowControls] = React.useState(false);
  // const showControls = () => setShowControls(true);
  // const hideControls = () => setShowControls(false);

  const body = file?.data?.body;
  const { isLink } = file;

  const title = file.data.name || file.filename;

  if (file?.data?.coverImage && !isImage && !isLink) {
    return (
      <ImageObjectPreview
        file={file}
        owner={owner}
        tag={tag}
        isSelected={isSelected}
        onAction={onAction}
      />
    );
  }

  return (
    <div css={[STYLES_WRAPPER, isSelected && STYLES_SELECTED_RING]}>
      <div
        css={STYLES_PREVIEW}
        //  onMouseEnter={showControls} onMouseLeave={hideControls}
      >
        {/* <AnimatePresence>
          {areControlsVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              css={STYLES_CONTROLS}
            >
              <LikeButton onClick={like} isLiked={isLiked} likeCount={likeCount} />
              {showSaveButton && (
                <SaveButton onSave={save} isSaved={isSaved} saveCount={saveCount} />
              )}
            </motion.div>
          )}
        </AnimatePresence> */}
        <AspectRatio ratio={192 / 248}>
          <div>{children}</div>
        </AspectRatio>
      </div>
      <div style={{ maxHeight: 61 }}>
        <motion.article
          css={STYLES_DESCRIPTION}
          onMouseMove={showDescription}
          onMouseLeave={hideDescription}
          initial={{ y: 0 }}
          animate={{
            y: isDescriptionVisible ? -170 : 0,
            borderRadius: isDescriptionVisible ? "16px" : "0px",
          }}
          transition={{ type: "spring", stiffness: 170, damping: 26 }}
        >
          <H5 as="h2" nbrOflines={1} color="textBlack" title={title}>
            {title}
          </H5>
          <div style={{ marginTop: 3, display: "flex" }}>
            {typeof tag === "string" ? (
              <P3 as="small" css={STYLES_UPPERCASE} color="textGray">
                {tag}
              </P3>
            ) : (
              tag
            )}
          </div>
          <H5
            as={motion.p}
            initial={{ opacity: 0 }}
            animate={{ opacity: isDescriptionVisible ? 1 : 0 }}
            style={{ marginTop: 5 }}
            nbrOflines={8}
            color="textGrayDark"
          >
            {body || ""}
          </H5>
        </motion.article>
      </div>
    </div>
  );
}

const useShowDescription = () => {
  const [isDescriptionVisible, setShowDescription] = React.useState(false);
  const timeoutId = React.useRef();

  const showDescription = () => {
    clearTimeout(timeoutId.current);
    const id = setTimeout(() => setShowDescription(true), 250);
    timeoutId.current = id;
  };
  const hideDescription = () => {
    clearTimeout(timeoutId.current);
    setShowDescription(false);
  };

  return { isDescriptionVisible, showDescription, hideDescription };
};
