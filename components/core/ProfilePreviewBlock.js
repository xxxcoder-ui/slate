import * as React from "react";
import * as Styles from "~/common/styles";
import * as Typography from "~/components/system/components/Typography";
import * as Strings from "~/common/strings";
import * as Constants from "~/common/constants";
import * as SVG from "~/common/svg";

import { ButtonPrimary, ButtonTertiary } from "~/components/system/components/Buttons";
import { css } from "@emotion/react";
import { useFollowProfileHandler } from "~/common/hooks";

const STYLES_CONTAINER = (theme) => css`
  width: 100%;
  position: relative;
  background-color: ${theme.semantic.bgLight};
  box-shadow: 0 0 0 0.5px ${theme.semantic.bgGrayLight}, ${theme.shadow.lightSmall};
  border-radius: 16px;
  padding: 24px 16px 16px;
  ${Styles.VERTICAL_CONTAINER_CENTERED}
`;

const STYLES_PROFILE_PREVIEW = (theme) => css`
  height: 120px;
  width: 120px;
  border-radius: 8px;
  object-fit: cover;
  @media (max-width: ${theme.sizes.mobile}px) {
    height: 104px;
    width: 104px;
  }
`;

export default function ProfilePreviewBlock({ onAction, viewer, profile }) {
  const { handleFollow, isFollowing } = useFollowProfileHandler({
    onAction,
    viewer,
    user: profile,
  });

  const isOwner = viewer?.id === profile.id;

  return (
    <div css={STYLES_CONTAINER}>
      <img
        css={STYLES_PROFILE_PREVIEW}
        src={profile.photo}
        alt={`${profile.username}`}
        onError={(e) => (e.target.src = Constants.profileDefaultPicture)}
      />
      <div>
        <Typography.H5 style={{ marginTop: 17 }}>{profile.username}</Typography.H5>
      </div>

      <div
        css={Styles.HORIZONTAL_CONTAINER}
        style={{ marginTop: 6, color: Constants.semantic.textGray }}
      >
        <div css={Styles.HORIZONTAL_CONTAINER} style={{ marginLeft: 16 }}>
          <SVG.Layers height={16} width={16} />
          <Typography.P3 color="textGray" style={{ marginLeft: 4 }}>
            {profile.slateCount} {Strings.pluralize("collection", profile.slateCount)}
          </Typography.P3>
        </div>
      </div>

      <Typography.P2
        color="gray"
        nbrOflines={1}
        style={{ marginTop: 8, textIndent: 8, opacity: profile?.body ? 1 : 0 }}
      >
        {profile?.body || "No Description"}
      </Typography.P2>

      {!isOwner &&
        (isFollowing ? (
          <ButtonTertiary
            style={{ marginTop: 16 }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleFollow(profile.id);
            }}
            full
          >
            Following
          </ButtonTertiary>
        ) : (
          <ButtonPrimary
            style={{ marginTop: 16 }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleFollow(profile.id);
            }}
            full
          >
            Follow
          </ButtonPrimary>
        ))}
    </div>
  );
}
