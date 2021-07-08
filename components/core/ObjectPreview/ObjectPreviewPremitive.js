import * as React from "react";
import * as Constants from "~/common/constants";
import * as Styles from "~/common/styles";
import * as Actions from "~/common/actions";
import * as Events from "~/common/custom-events";

import { css } from "@emotion/react";
import { H4, P } from "~/components/system/components/Typography";
import { AspectRatio } from "~/components/system";
import { LikeButton, SaveButton } from "./components";

import ImageObjectPreview from "./ImageObjectPreview";

const STYLES_BACKGROUND_LIGHT = (theme) => css`
  background-color: ${theme.system.grayLight5};
  box-shadow: ${theme.shadow.medium};
  border-radius: 8px;
`;

const STYLES_WRAPPER = css`
  border-radius: 8px;
  overflow: hidden;
`;

const STYLES_DESCRIPTION = (theme) => css`
  box-sizing: border-box;
  width: 100%;
  padding: 12px 16px 12px;
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: ${theme.system.white};

  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%);
    backdrop-filter: blur(75px);
    -webkit-backdrop-filter: blur(75px);
  }

  @media (max-width: ${theme.sizes.mobile}px) {
    padding: 8px;
  }
`;

const STYLES_DESCRIPTION_META = css`
  justify-content: space-between;
  margin-top: 12px;
`;

const STYLES_REACTIONS_CONTAINER = css`
  display: flex;
  & > * + * {
    margin-left: 32px;
  }
`;

const STYLES_REACTION = css`
  display: flex;
  & > * + * {
    margin-left: 8px;
  }
`;

const STYLES_PROFILE_IMAGE = css`
  background-color: ${Constants.system.foreground};
  background-size: cover;
  background-position: 50% 50%;
  flex-shrink: 0;
  height: 20px;
  width: 20px;
  border-radius: 2px;
`;

const STYLES_DESCRIPTION_TAG = (theme) => css`
  position: absolute;
  top: -32px;
  left: 12px;
  text-transform: uppercase;
  border: 1px solid ${theme.system.grayLight5};
  background-color: ${theme.system.bgLight};
  padding: 2px 8px;
  border-radius: 4px;
`;

const STYLES_SELECTED_RING = (theme) => css`
  box-shadow: 0 0 0 2px ${theme.system.blue};
`;

const useLikeHandler = ({ file, viewer }) => {
  const likedFile = React.useMemo(() => viewer?.likes?.find((item) => item.id === file.id), []);
  const [state, setState] = React.useState({
    isLiked: !!likedFile,
    likeCount: likedFile?.likeCount ?? file.likeCount,
  });

  const handleLikeState = () => {
    setState((prev) => {
      if (prev.isLiked) {
        return {
          isLiked: false,
          likeCount: prev.likeCount - 1,
        };
      }
      return {
        isLiked: true,
        likeCount: prev.likeCount + 1,
      };
    });
  };
  const like = async () => {
    // NOTE(amine): optimistic update
    handleLikeState();
    const response = await Actions.like({ id: file.id });
    if (Events.hasError(response)) {
      // NOTE(amine): revert back to old state if there is an error
      handleLikeState();
      return;
    }
  };

  return { like, ...state };
};
export default function ObjectPreviewPremitive({
  children,
  tag,
  file,
  isSelected,
  viewer,
  // NOTE(amine): internal prop used to display
  isImage,
}) {
  const { like, isLiked, likeCount } = useLikeHandler({ file, viewer });

  const title = file.data.name || file.filename;
  const { saveCount } = file;

  if (file?.data?.coverImage && !isImage) {
    return <ImageObjectPreview file={file} isSelected={isSelected} />;
  }
  const showSaveButton = viewer?.id !== file?.ownerId;
  return (
    <div
      css={[
        css({
          boxShadow: `0 0 0 0px ${Constants.system.blue}`,
          transition: "box-shadow 0.2s",
          borderRadius: 8,
        }),
        isSelected && STYLES_SELECTED_RING,
      ]}
    >
      <AspectRatio ratio={295 / 248} css={STYLES_BACKGROUND_LIGHT}>
        <div css={STYLES_WRAPPER}>
          <AspectRatio ratio={1}>
            <div>{children}</div>
          </AspectRatio>

          <article css={STYLES_DESCRIPTION}>
            {tag && (
              <div css={STYLES_DESCRIPTION_TAG}>
                <P variant="para-03">{tag}</P>
              </div>
            )}
            <H4 nbrOflines={1}>{title}</H4>

            <div css={[Styles.HORIZONTAL_CONTAINER_CENTERED, STYLES_DESCRIPTION_META]}>
              <div css={STYLES_REACTIONS_CONTAINER}>
                <div css={STYLES_REACTION}>
                  <LikeButton onClick={like} isLiked={isLiked} />
                  <P variant="para-02" color="textGrayDark">
                    {likeCount}
                  </P>
                </div>
                {showSaveButton && (
                  <div css={STYLES_REACTION}>
                    <SaveButton />
                    <P variant="para-02" color="textGrayDark">
                      {saveCount}
                    </P>
                  </div>
                )}
              </div>
              <span
                css={STYLES_PROFILE_IMAGE}
                style={{
                  backgroundImage: `url('https://slate.textile.io/ipfs/bafkreick3nscgixwfpq736forz7kzxvvhuej6kszevpsgmcubyhsx2pf7i')`,
                }}
              />
            </div>
          </article>
        </div>
      </AspectRatio>
    </div>
  );
}
