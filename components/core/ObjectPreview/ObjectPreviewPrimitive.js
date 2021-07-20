import * as React from "react";

import { css } from "@emotion/react";
import { H5, P3 } from "~/components/system/components/Typography";
import { AspectRatio } from "~/components/system";
import { LikeButton, SaveButton } from "./components";
import { useLikeHandler, useSaveHandler } from "~/common/hooks";
import { motion, AnimatePresence } from "framer-motion";

import ImageObjectPreview from "./ImageObjectPreview";

const STYLES_WRAPPER = (theme) => css`
  position: relative;
  background-color: ${theme.semantic.bgLight};
  transition: box-shadow 0.2s;
  box-shadow: 0 0 0 0.5px ${theme.semantic.bgGrayLight}, ${theme.shadow.lightSmall};
  border-radius: 16px;
  overflow: hidden;
`;

const STYLES_DESCRIPTION = (theme) => css`
  box-shadow: 0 -0.5px 0.5px ${theme.semantic.bgGrayLight};
  border-radius: 0px 0px 16px 16px;
  box-sizing: border-box;
  width: 100%;
  padding: 9px 16px 8px;

  @media (max-width: ${theme.sizes.mobile}px) {
    padding: 8px;
  }
`;
const STYLES_PREVIEW = css`
  overflow: hidden;
`;

const STYLES_SELECTED_RING = (theme) => css`
  box-shadow: 0 0 0 2px ${theme.system.blue};
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

export default function ObjectPreviewPrimitive({
  children,
  tag = "FILE",
  file,
  isSelected,
  viewer,
  owner,
  // NOTE(amine): internal prop used to display
  isImage,
  onAction,
}) {
  const { like, isLiked, likeCount } = useLikeHandler({ file, viewer });
  const { save, isSaved, saveCount } = useSaveHandler({ file, viewer });

  const [showControls, setShowControls] = React.useState(false);
  const showControlsVisibility = () => setShowControls(true);
  const hideControlsVisibility = () => setShowControls(false);

  const title = file.data.name || file.filename;

  if (file?.data?.coverImage && !isImage) {
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
  const showSaveButton = viewer?.id !== file?.ownerId;
  return (
    <div
      onMouseEnter={showControlsVisibility}
      onMouseLeave={hideControlsVisibility}
      css={[
        STYLES_WRAPPER,
        css({
          borderRadius: 16,
        }),
        isSelected && STYLES_SELECTED_RING,
      ]}
    >
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            css={STYLES_CONTROLS}
          >
            <LikeButton onClick={like} isLiked={isLiked} likeCount={likeCount} />
            {showSaveButton && <SaveButton onSave={save} isSaved={isSaved} saveCount={saveCount} />}
          </motion.div>
        )}
      </AnimatePresence>
      <AspectRatio ratio={248 / 248}>
        <div css={STYLES_PREVIEW}>{children}</div>
      </AspectRatio>
      <article css={STYLES_DESCRIPTION}>
        <div>
          <H5 nbrOflines={1} color="textBlack">
            {title}
          </H5>
          <P3
            css={css({
              marginTop: 3,
              textTransform: "uppercase",
            })}
            color="textGray"
          >
            {tag}
          </P3>
        </div>
      </article>
    </div>
  );
}
