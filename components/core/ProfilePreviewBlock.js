import * as React from "react";
import * as Styles from "~/common/styles";
import * as Typography from "~/components/system/components/Typography";
import * as Strings from "~/common/strings";
import * as Events from "~/common/custom-events";
import * as Actions from "~/common/actions";

import { Divider } from "~/components/system/components/Divider";
import { Logo } from "~/common/logo";
import { ButtonPrimary, ButtonTertiary } from "~/components/system/components/Buttons";
import { css } from "@emotion/react";
import { LikeButton, SaveButton } from "~/components/core/ObjectPreview/components";

import ObjectPlaceholder from "~/components/core/ObjectPreview/placeholders";

const STYLES_CONTROLLS = css`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const useCollectionCarrousel = ({ objects }) => {
  const [selectedIdx, setSelectedIdx] = React.useState(0);
  const selectBatchIdx = (idx) => setSelectedIdx(idx);
  const selectedBatch = objects[selectedIdx];
  return { selectBatchIdx, selectedBatch, selectedIdx };
};

const STYLES_HIGHLIGHT_BUTTON = (theme) => css`
  box-sizing: border-box;
  display: block;
  padding: 4px 16px 4px 12px;
  border: none;
  background-color: unset;
  div {
    width: 8px;
    height: 8px;
    background-color: ${theme.system.gray};
    border-radius: 50%;
  }
`;

const STYLES_PLACEHOLDER = css`
  height: 64px;
  min-width: 86px;
  width: 86px;
`;

const CollectionPreviewFile = ({ file }) => {
  const title = file.data.name || file.filename;
  const { body } = file.data;

  const likeCount = file.likeCount || 0;
  const saveCount = file.saveCount || 0;

  return (
    <div css={[Styles.HORIZONTAL_CONTAINER]}>
      <ObjectPlaceholder ratio={1.1} file={file} containerCss={STYLES_PLACEHOLDER} showTag />
      <div style={{ marginLeft: 16 }} css={Styles.VERTICAL_CONTAINER}>
        <Typography.H5 color="textBlack" nbrOflines={1}>
          {title}
        </Typography.H5>
        <Typography.P variant="para-03" nbrOflines={1} color="textGrayDark">
          {body}
        </Typography.P>
        <div style={{ marginTop: "auto" }} css={Styles.HORIZONTAL_CONTAINER}>
          <div css={Styles.CONTAINER_CENTERED}>
            <LikeButton />
            <Typography.P style={{ marginLeft: 8 }} variant="para-01" color="textGrayDark">
              {likeCount}
            </Typography.P>
          </div>
          <div style={{ marginLeft: 48 }} css={Styles.CONTAINER_CENTERED}>
            <SaveButton />
            <Typography.P style={{ marginLeft: 8 }} variant="para-01" color="textGrayDark">
              {saveCount}
            </Typography.P>
          </div>
        </div>
      </div>
    </div>
  );
};

const STYLES_CONTAINER = (theme) => css`
  border-radius: 8px;
  overflow: hidden;
  background-color: ${theme.system.bgGrayLight};
`;

const STYLES_PROFILE_DESCRIPTION = (theme) => css`
  background-color: ${theme.system.white};
  padding: 16px;
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

const STYLES_FILES_PREVIEWS = css`
  padding: 16px;
  padding-right: 0px;
  height: 176px;
`;

const useProfileFollow = ({ onAction, user, viewer, external }) => {
  const [isFollowing, setFollowing] = React.useState(false);

  React.useLayoutEffect(() => {
    setFollowing(
      external || user.id === viewer?.id
        ? false
        : !!viewer?.following.some((entry) => {
            return entry.id === user.id;
          })
    );
  }, [external]);

  const handleFollow = (userId) => async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (external) {
      Events.dispatchCustomEvent({ name: "slate-global-open-cta", detail: {} });
      return;
    }

    setFollowing((prev) => !prev);
    await Actions.createSubscription({
      userId,
    });

    onAction({
      type: "UPDATE_VIEWER",
      viewer: {
        following: isFollowing
          ? viewer.following.filter((user) => user.id !== userId)
          : viewer.following.concat([
              {
                id: user.id,
                data: user.data,
                fileCount: user.fileCount,
                followerCount: user.followerCount + 1,
                slateCount: user.slateCount,
                username: user.username,
              },
            ]),
      },
    });
  };

  return { handleFollow, isFollowing };
};

export default function PorfilePreviewBlock({ onAction, viewer, profile, external }) {
  const filePreviews = React.useMemo(() => {
    const files = profile?.objects || [];
    let previews = [];
    for (let i = 0; i < files.length; i++) {
      const batch = [];
      if (files[i * 2]) batch.push(files[i * 2]);
      if (files[i * 2 + 1]) batch.push(files[i * 2 + 1]);
      if (batch.length > 0) previews.push(batch);
      if (previews.length === 3 || batch.length < 2) break;
    }
    return previews;
  }, [profile]);

  const { selectBatchIdx, selectedBatch, selectedIdx } = useCollectionCarrousel({
    objects: filePreviews,
  });

  const { handleFollow, isFollowing } = useProfileFollow({
    onAction,
    viewer,
    user: profile,
    external,
  });

  const isOwner = viewer?.id === profile.id;

  const nbrOfFiles = profile?.objects?.length || 0;
  const isCollectionEmpty = nbrOfFiles === 0;

  return (
    <div css={STYLES_CONTAINER}>
      <div css={[STYLES_PROFILE_DESCRIPTION, Styles.HORIZONTAL_CONTAINER]}>
        <img css={STYLES_PROFILE_PREVIEW} src={profile.data.photo} alt={`${profile.username}`} />
        <div style={{ marginLeft: 16 }} css={Styles.VERTICAL_CONTAINER}>
          <div>
            <Typography.H4>{profile.username}</Typography.H4>
            {profile?.data?.body && (
              <Typography.P variant="para-02" color="gray" style={{ marginTop: 2 }}>
                {profile.data.body}
              </Typography.P>
            )}
          </div>
          <div style={{ marginTop: 8 }} css={Styles.HORIZONTAL_CONTAINER}>
            <Typography.H5>
              {profile.fileCount} {Strings.pluralize("file", profile.fileCount)}
            </Typography.H5>
            <Typography.H5 style={{ marginLeft: 16 }}>
              {profile.slateCount} {Strings.pluralize("collection", profile.slateCount)}
            </Typography.H5>
          </div>

          {!isOwner &&
            (isFollowing ? (
              <ButtonTertiary
                style={{ marginTop: "auto", maxWidth: "91px" }}
                onClick={handleFollow(profile.id)}
              >
                Following
              </ButtonTertiary>
            ) : (
              <ButtonPrimary
                style={{ marginTop: "auto", maxWidth: "91px" }}
                onClick={handleFollow(profile.id)}
              >
                Follow
              </ButtonPrimary>
            ))}
        </div>
      </div>
      <div css={STYLES_FILES_PREVIEWS} style={{ display: "flex" }}>
        <div style={{ width: "100%" }}>
          {!isCollectionEmpty ? (
            selectedBatch.map((file, i) => (
              <React.Fragment key={file.id}>
                {i === 1 && <Divider color="grayLight4" style={{ margin: "8px 0px" }} />}
                <CollectionPreviewFile file={file} />
              </React.Fragment>
            ))
          ) : (
            <div
              style={{ height: "100%" }}
              css={[Styles.CONTAINER_CENTERED, Styles.VERTICAL_CONTAINER]}
            >
              <Logo style={{ height: 18, marginBottom: 8 }} />
              <Typography.P color="textGrayDark">No files in this collection</Typography.P>
            </div>
          )}
        </div>
        {
          <div css={STYLES_CONTROLLS}>
            {filePreviews.map((preview, i) => (
              <button
                key={i}
                css={[Styles.HOVERABLE, STYLES_HIGHLIGHT_BUTTON]}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  selectBatchIdx(i);
                }}
                aria-label="Next Preview Image"
              >
                <div style={{ opacity: i === selectedIdx ? 1 : 0.3 }} />
              </button>
            ))}
          </div>
        }
      </div>
    </div>
  );
}
