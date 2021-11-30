import * as React from "react";
import * as Constants from "~/common/constants";
import * as Strings from "~/common/strings";
import * as SVG from "~/common/svg";
import * as Actions from "~/common/actions";
import * as Events from "~/common/custom-events";
import * as Styles from "~/common/styles";

import { Link } from "~/components/core/Link";
import { css } from "@emotion/react";
import { ButtonPrimary, ButtonSecondary } from "~/components/system/components/Buttons";
import { SecondaryTabGroup } from "~/components/core/TabGroup";
import { LoaderSpinner } from "~/components/system/components/Loaders";

import DataView from "~/components/core/DataView";
import ProcessedText from "~/components/core/ProcessedText";
import EmptyState from "~/components/core/EmptyState";
import ProfilePhoto from "~/components/core/ProfilePhoto";
import CollectionPreviewBlock from "~/components/core/CollectionPreviewBlock";

const STYLES_PROFILE_BACKGROUND = css`
  background-color: ${Constants.system.white};
  width: 100%;
  padding: 104px 56px 24px 56px;
  @media (max-width: ${Constants.sizes.mobile}px) {
    padding: 80px 24px 16px 24px;
  }
`;

const STYLES_PROFILE = css`
  width: 100%;
  padding: 0px 56px 80px 56px;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  @media (max-width: ${Constants.sizes.mobile}px) {
    padding: 0px 24px 16px 24px;
  }
`;

const STYLES_PROFILE_INFO = css`
  line-height: 1.3;
  width: 50%;
  max-width: 800px;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  margin: 0 auto;
  @media (max-width: ${Constants.sizes.tablet}px) {
    width: 100%;
    max-width: 100%;
  }
`;

const STYLES_INFO = css`
  display: block;
  width: 100%;
  text-align: center;
  margin-bottom: 48px;
  overflow-wrap: break-word;
  white-space: pre-wrap;
`;

const STYLES_PROFILE_IMAGE = css`
  background-color: ${Constants.semantic.bgLight};
  background-size: cover;
  background-position: 50% 50%;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 8px;
  margin: 0 auto;
  position: relative;
  @media (max-width: ${Constants.sizes.mobile}px) {
    width: 64px;
    height: 64px;
  }
`;

const STYLES_STATUS_INDICATOR = css`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid ${Constants.system.green};
  background-color: ${Constants.system.green};
`;

const STYLES_NAME = css`
  font-size: ${Constants.typescale.lvl4};
  font-family: ${Constants.font.semiBold};
  max-width: 100%;
  font-weight: 400;
  margin: 16px auto;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  color: ${Constants.system.black};
  @media (max-width: ${Constants.sizes.mobile}px) {
    margin-bottom: 8px;
  }
`;

const STYLES_DESCRIPTION = css`
  font-size: ${Constants.typescale.lvl0};
  color: ${Constants.system.grayLight2};
  max-width: 100%;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  ul,
  ol {
    white-space: normal;
  }
  @media (max-width: ${Constants.sizes.mobile}px) {
    margin-top: 24px;
  }
`;

const STYLES_STATS = css`
  font-size: ${Constants.typescale.lvl0};
  margin: 16px auto;
  display: flex;
  justify-content: center;
  color: ${Constants.system.grayDark2};
`;

const STYLES_STAT = css`
  margin: 0px 12px;
  ${"" /* width: 112px; */}
  flex-shrink: 0;
`;

const STYLES_BUTTON = css`
  margin-bottom: 32px;
  @media (max-width: ${Constants.sizes.mobile}px) {
    margin-bottom: 16px;
  }
`;

// const STYLES_COPY_INPUT = css`
//   pointer-events: none;
//   position: absolute;
//   opacity: 0;
// `;

function CollectionsPage({
  user,
  viewer,
  fetched,
  subscriptions,
  tab = "collections",
  isOwner,
  onAction,
}) {
  let slates = [];
  if (tab === "collections") {
    slates = user.slates
      ? isOwner
        ? user.slates.filter((slate) => slate.isPublic === true)
        : user.slates
      : slates;
  } else {
    slates = subscriptions;
  }
  slates = slates || [];
  return (
    <div>
      <SecondaryTabGroup
        tabs={[
          { title: "Collections", value: { tab: "collections" } },
          { title: "Subscribed", value: { tab: "subscribed" } },
        ]}
        value={tab}
        onAction={onAction}
        style={{ margin: "0 0 24px 0" }}
      />
      {slates?.length ? (
        <div css={Styles.COLLECTIONS_PREVIEW_GRID}>
          {slates.map((collection) => (
            <Link key={collection.id} href={`/$/slate/${collection.id}`} onAction={onAction}>
              <CollectionPreviewBlock
                onAction={onAction}
                collection={collection}
                viewer={viewer}
                owner={tab === "collections" ? user : collection.owner}
              />
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState>
          {tab === "collections" || fetched ? (
            <React.Fragment>
              <SVG.Slate height="24px" style={{ marginBottom: 24 }} />
              {tab === "collections"
                ? `This user does not have any public collections yet`
                : `This user is not following any collections yet`}
            </React.Fragment>
          ) : (
            <LoaderSpinner style={{ height: 24, width: 24 }} />
          )}
        </EmptyState>
      )}
    </div>
  );
}

export default class Profile extends React.Component {
  _ref = null;

  state = {
    contextMenu: null,
    subscriptions: [],
    isFollowing:
      this.props.external || this.props.user.id === this.props.viewer?.id
        ? false
        : !!this.props.viewer?.following.some((entry) => {
            return entry.id === this.props.user.id;
          }),
    fetched: false,
    index: -1,
  };

  componentDidMount = () => {
    if (this.props.page.params?.tab === "subscribed") {
      this.fetchSocial();
    }
  };

  componentDidUpdate = (prevProps) => {
    if (
      !this.state.fetched &&
      this.props.page.params !== prevProps.page.params &&
      this.props.page.params?.tab === "subscribed"
    ) {
      this.fetchSocial();
    }
  };

  fetchSocial = async () => {
    if (this.state.fetched) return;
    if (this.props.page.params?.tab !== "subscribed") return;
    let subscriptions;
    if (this.props.user.id === this.props.viewer?.id) {
      subscriptions = this.props.viewer?.subscriptions;
    } else {
      const query = { id: this.props.user.id };
      let response = await Actions.getSocial(query);
      if (Events.hasError(response)) {
        return;
      }
      subscriptions = response.subscriptions;
    }
    this.setState({
      subscriptions: subscriptions,
      fetched: true,
    });
  };

  _handleHide = () => {
    this.setState({ contextMenu: null });
  };

  // _handleClick = (e, value) => {
  //   e.stopPropagation();
  //   if (this.state.contextMenu === value) {
  //     this._handleHide();
  //   } else {
  //     this.setState({ contextMenu: value });
  //   }
  // };

  _handleFollow = async (e, id) => {
    if (this.props.external) {
      this._handleLoginModal();
      return;
    }
    this._handleHide();
    e.stopPropagation();
    await Actions.createSubscription({
      userId: id,
    });
  };

  _handleLoginModal = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    Events.dispatchCustomEvent({ name: "slate-global-open-cta", detail: {} });
  };

  checkStatus = ({ id }) => {
    const { activeUsers } = this.props;
    return activeUsers && activeUsers.includes(id);
  };

  render() {
    let tab = this.props.page.params?.tab;
    let { user, isOwner } = this.props;
    // let fileCount = user.library?.length || 0;

    const showStatusIndicator = this.props.isAuthenticated;

    return (
      <div>
        {this.props.data.slates?.length && (
          <DataView
            key="scene-files-folder"
            type="collection"
            collection={this.props.data.slates[0]}
            onAction={this.props.onAction}
            viewer={this.props.viewer}
            items={this.props.data.slates[0].objects}
            view={"grid"}
            isOwner={isOwner}
            page={this.props.page}
          />
        )}
      </div>
    );

    return (
      <div>
        <div css={STYLES_PROFILE_BACKGROUND}>
          <div css={STYLES_PROFILE_INFO}>
            <div css={STYLES_PROFILE_IMAGE}>
              <ProfilePhoto user={user} size={{ base: 64, mobile: 120 }} />
              {showStatusIndicator && this.checkStatus({ id: user.id }) && (
                <div css={STYLES_STATUS_INDICATOR} />
              )}
            </div>
            <div css={STYLES_INFO}>
              <div css={STYLES_NAME}>{Strings.getPresentationName(user)}</div>
              {!isOwner && (
                <div css={STYLES_BUTTON}>
                  {this.state.isFollowing ? (
                    <ButtonSecondary
                      onClick={(e) => {
                        this.setState({ isFollowing: false });
                        this._handleFollow(e, this.props.user.id);
                      }}
                    >
                      Unfollow
                    </ButtonSecondary>
                  ) : (
                    <ButtonPrimary
                      onClick={(e) => {
                        this.setState({ isFollowing: true });
                        this._handleFollow(e, this.props.user.id);
                      }}
                    >
                      Follow
                    </ButtonPrimary>
                  )}
                </div>
              )}
              {user.body ? (
                <div css={STYLES_DESCRIPTION}>
                  <ProcessedText text={user.body} />
                </div>
              ) : null}
              <div css={STYLES_STATS}>
                {/* <div css={STYLES_STAT}>
                  <div style={{ fontFamily: `${Constants.font.text}` }}>
                    {fileCount}{" "}
                    <span style={{ color: `${Constants.system.grayLight2}` }}>Files</span>
                  </div>
                </div> */}
                <div css={STYLES_STAT}>
                  <div style={{ fontFamily: `${Constants.font.text}` }}>
                    {user.slates?.length || 0}{" "}
                    <span style={{ color: `${Constants.system.grayLight2}` }}>Collections</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div css={STYLES_PROFILE}>
          <CollectionsPage
            {...this.props}
            tab={tab}
            fetched={this.state.fetched}
            subscriptions={this.state.subscriptions}
          />
        </div>
      </div>
    );
  }
}
