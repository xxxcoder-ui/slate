import * as React from "react";
import * as Constants from "~/common/constants";
import * as Validations from "~/common/validations";
import * as Window from "~/common/window";
import * as SVG from "~/common/svg";
import * as Actions from "~/common/actions";
import * as Events from "~/common/custom-events";

import { GlobalCarousel } from "~/components/system/components/GlobalCarousel";
import { css } from "@emotion/react";
import { TabGroup, PrimaryTabGroup, SecondaryTabGroup } from "~/components/core/TabGroup";
import { LoaderSpinner } from "~/components/system/components/Loaders";

import EmptyState from "~/components/core/EmptyState";
import ScenePage from "~/components/core/ScenePage";
import SlateMediaObjectPreview from "~/components/core/SlateMediaObjectPreview";
import ScenePageHeader from "~/components/core/ScenePageHeader";

const STYLES_LOADER = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 400px);
  width: 100%;
`;

const STYLES_IMAGE_BOX = css`
  cursor: pointer;
  position: relative;
  box-shadow: ${Constants.shadow.light};
  margin: 10px;

  :hover {
    box-shadow: ${Constants.shadow.medium};
  }

  @media (max-width: ${Constants.sizes.mobile}px) {
    overflow: hidden;
    border-radius: 8px;
  }
`;

const STYLES_TEXT_AREA = css`
  position: absolute;
  top: 16px;
  left: 0px;
`;

const STYLES_TITLE = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${Constants.system.white};
  font-family: ${Constants.font.medium};
  margin-bottom: 4px;
  width: calc(100% - 32px);
  padding: 0px 16px;
  box-sizing: content-box;
`;

const STYLES_SECONDARY = css`
  ${STYLES_TITLE}
  font-size: ${Constants.typescale.lvlN1};
  width: 100%;
`;

const STYLES_SECONDARY_HOVERABLE = css`
  ${STYLES_SECONDARY}
  padding: 8px 16px;

  :hover {
    color: ${Constants.system.brand} !important;
  }
`;

const STYLES_GRADIENT = css`
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.2) 26.56%,
    rgba(0, 0, 0, 0) 100%
  );
  backdrop-filter: blur(2px);
  width: 100%;
  height: 72px;
  position: absolute;
  top: 0px;
  left: 0px;

  @media (max-width: ${Constants.sizes.mobile}px) {
    overflow: hidden;
    border-radius: 0px 0px 8px 8px;
  }
`;

const STYLES_ACTIVITY_GRID = css`
  margin: -10px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  @media (max-width: ${Constants.sizes.mobile}px) {
    margin-top: 24px;
  }
`;

class ActivitySquare extends React.Component {
  state = {
    showText: false,
  };

  render() {
    const item = this.props.item;
    const size = this.props.size;
    const isImage =
      Validations.isPreviewableImage(item.file.data.type) || !!item.file.data.coverImage;
    return (
      <div
        css={STYLES_IMAGE_BOX}
        style={{ width: size, height: size }}
        onMouseEnter={() => this.setState({ showText: true })}
        onMouseLeave={() => this.setState({ showText: false })}
      >
        <SlateMediaObjectPreview
          file={item.file}
          centeredImage
          // iconOnly
          style={{ border: "none" }}
          imageStyle={{ border: "none" }}
        />
        {this.state.showText || this.props.isMobile ? <div css={STYLES_GRADIENT} /> : null}
        {this.state.showText || this.props.isMobile ? (
          <div css={STYLES_TEXT_AREA} style={{ width: this.props.size }}>
            {/* {isImage ? null : (
              <div
                css={STYLES_TITLE}
                style={{
                  color: Constants.system.textGray,
                }}
              >
                {item.file.data.name || item.file.filename}
              </div>
            )} */}
            <span
              style={{
                color: Constants.system.white,
              }}
              css={this.props.onClick ? STYLES_SECONDARY_HOVERABLE : STYLES_SECONDARY}
              onClick={(e) => {
                e.stopPropagation();
                this.props.onClick();
              }}
            >
              <SVG.ArrowDownLeft
                height="10px"
                style={{ transform: "scaleX(-1)", marginRight: 4 }}
              />
              {item.slate.data.name || item.slate.slatename}
            </span>
          </div>
        ) : null}
      </div>
    );
  }
}

const ActivityRectangle = ({ item, width, height }) => {
  let file;
  for (let obj of item.slate?.objects || []) {
    if (Validations.isPreviewableImage(obj.type) || obj.coverImage) {
      file = obj;
    }
  }
  let numObjects = item.slate?.objects?.length || 0;
  return (
    <div css={STYLES_IMAGE_BOX} style={{ width, height }}>
      {file ? (
        <SlateMediaObjectPreview
          file={file}
          centeredImage
          iconOnly
          style={{ border: "none" }}
          imageStyle={{ border: "none" }}
        />
      ) : null}
      <div css={STYLES_GRADIENT} />
      <div css={STYLES_TEXT_AREA}>
        <div
          css={STYLES_TITLE}
          style={{
            fontFamily: Constants.font.semiBold,
            width,
          }}
        >
          {item.slate.data.name || item.slate.slatename}
        </div>
        <div
          css={STYLES_SECONDARY}
          style={{
            color: Constants.system.textGrayLight,
            width,
          }}
        >
          {numObjects} File{numObjects == 1 ? "" : "s"}
        </div>
      </div>
    </div>
  );
};

export default class SceneActivity extends React.Component {
  counter = 0;
  state = {
    imageSize: 200,
    tab: 0,
    loading: "loading",
  };

  async componentDidMount() {
    this.calculateWidth();
    this.debounceInstance = Window.debounce(this.calculateWidth, 200);
    this.scrollDebounceInstance = Window.debounce(this._handleScroll, 200);
    window.addEventListener("resize", this.debounceInstance);
    window.addEventListener("scroll", this.scrollDebounceInstance);
    this.fetchActivityItems(true);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tab !== this.props.tab) {
      this.fetchActivityItems(true);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.debounceInstance);
    window.removeEventListener("scroll", this.scrollDebounceInstance);
  }

  _handleScroll = (e) => {
    if (this.state.loading) {
      return;
    }
    const windowHeight =
      "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight - 600) {
      this.fetchActivityItems();
    }
  };

  fetchActivityItems = async (update = false) => {
    const isExplore = this.props.tab === 1;
    this.setState({ loading: "loading" });
    let activity = isExplore ? this.props.viewer.explore || [] : this.props.viewer.activity || [];

    let requestObject = {};
    if (activity.length) {
      if (update) {
        requestObject.latestTimestamp = activity[0].createdAt;
      } else {
        requestObject.earliestTimestamp = activity[activity.length - 1].createdAt;
      }
    }

    let response;
    if (isExplore) {
      response = await Actions.getExplore(requestObject);
    } else {
      requestObject.following = this.props.viewer.following.map((item) => item.id);
      requestObject.subscriptions = this.props.viewer.subscriptions.map((item) => item.id);

      response = await Actions.getActivity(requestObject);
    }

    if (Events.hasError(response)) {
      this.setState({ loading: "failed" });
      return;
    }

    let newItems = response.activity || response.explore;

    if (update) {
      activity.unshift(...newItems);
      this.counter = 0;
      activity = this.formatActivity(activity);
    } else {
      newItems = this.formatActivity(newItems);
      activity.push(...newItems);
    }

    if (this.props.tab === 0) {
      this.props.onUpdateViewer({ activity: activity });
    } else {
      this.props.onUpdateViewer({ explore: activity });
    }
    this.setState({ loading: false });
  };

  formatActivity = (userActivity) => {
    let activity = [];
    for (let item of userActivity) {
      if (item.slate && !item.slate.isPublic) {
        continue;
      }
      if (item.type === "CREATE_SLATE_OBJECT" && item.slate && item.file) {
        activity.push(item);
      } else if (item.type === "CREATE_SLATE" && item.slate) {
        activity.push(item);
      }
    }
    return activity; //NOTE(martina): because now it's only things of CREATE_SLATE_OBJECT type, so all square and don't need reordering
    //NOTE(martina): rearrange order to always get an even row of 6 squares
    //TODO(martina): improve this. will fail if there are no more squares left to "swap" with at the end, and you'll end up wtih an empty space
    // let activity = userActivity || [];
    // for (let i = 0; i < activity.length; i++) {
    //   let item = activity[i];
    //   if (item.type === "CREATE_SLATE") {
    //     this.counter += 2;
    //   } else if (item.type === "CREATE_SLATE_OBJECT") {
    //     this.counter += 1;
    //   }
    //   if (this.counter === 6) {
    //     this.counter = 0;
    //   } else if (this.counter > 6) {
    //     let j = i - 1;
    //     while (activity[j].type !== "CREATE_SLATE_OBJECT") {
    //       j -= 1;
    //     }
    //     let temp = activity[j];
    //     activity[j] = activity[i];
    //     activity[i] = temp;
    //     this.counter = 0;
    //     i -= 1;
    //   }
    // }
    // return activity;
  };

  _handleCreateSlate = () => {
    this.props.onAction({
      type: "NAVIGATE",
      value: "NAV_SLATES",
      data: null,
    });
  };

  calculateWidth = () => {
    let windowWidth = window.innerWidth;
    let imageSize;
    if (windowWidth < Constants.sizes.mobile) {
      imageSize = windowWidth - 2 * 24; //(windowWidth - 2 * 24 - 20) / 2;
    } else {
      imageSize = (windowWidth - 2 * 56 - 5 * 20) / 6;
    }
    this.setState({ imageSize });
  };

  getItemIndexById = (items, item) => {
    const id = item.file?.id;
    return items.findIndex((i) => i.id === id);
  };

  render() {
    let activity =
      this.props.tab === 0 ? this.props.viewer.activity || [] : this.props.viewer.explore || [];
    let items = activity
      .filter((item) => item.type === "CREATE_SLATE_OBJECT")
      .map((item) => {
        return {
          ...item.file,
          slate: item.slate,
          owner: item.owner?.username,
        };
      });

    return (
      <ScenePage>
        <ScenePageHeader
          title={
            this.props.isMobile ? (
              <TabGroup
                tabs={[
                  { title: "Files", value: "NAV_DATA" },
                  { title: "Slates", value: "NAV_SLATES" },
                  { title: "Activity", value: "NAV_ACTIVITY" },
                ]}
                value={2}
                onAction={this.props.onAction}
                onChange={(value) => this.setState({ tab: value })}
                style={{ marginTop: 0, marginBottom: 32 }}
                itemStyle={{ margin: "0px 12px" }}
              />
            ) : (
              <PrimaryTabGroup
                tabs={[
                  { title: "Files", value: "NAV_DATA" },
                  { title: "Slates", value: "NAV_SLATES" },
                  { title: "Activity", value: "NAV_ACTIVITY" },
                ]}
                value={2}
                onAction={this.props.onAction}
              />
            )
          }
          actions={
            <SecondaryTabGroup
              tabs={[
                { title: "My network", value: "NAV_ACTIVITY" },
                { title: "Explore", value: "NAV_EXPLORE" },
              ]}
              value={this.props.tab}
              onAction={this.props.onAction}
              style={{ margin: 0 }}
            />
          }
        />
        <GlobalCarousel
          carouselType="ACTIVITY"
          viewer={this.props.viewer}
          objects={items}
          onAction={this.props.onAction}
          isMobile={this.props.isMobile}
          isOwner={false}
        />
        {activity.length ? (
          <div>
            <div css={STYLES_ACTIVITY_GRID}>
              {activity.map((item, index) => {
                if (item.type === "CREATE_SLATE") {
                  return (
                    <span
                      key={item.id}
                      onClick={() =>
                        this.props.onAction({
                          type: "NAVIGATE",
                          value: "NAV_SLATE",
                          data: { decorator: "SLATE", ...item.slate },
                        })
                      }
                    >
                      <ActivityRectangle
                        width={
                          this.props.isMobile ? this.state.imageSize : this.state.imageSize * 2 + 20
                        }
                        height={this.state.imageSize}
                        item={item}
                      />
                    </span>
                  );
                } else if (item.type === "CREATE_SLATE_OBJECT") {
                  return (
                    <span
                      key={item.id}
                      onClick={
                        this.props.isMobile
                          ? () => {
                              this.props.onAction({
                                type: "NAVIGATE",
                                value: "NAV_SLATE",
                                data: {
                                  decorator: "SLATE",
                                  ...item.slate,
                                },
                              });
                            }
                          : () =>
                              Events.dispatchCustomEvent({
                                name: "slate-global-open-carousel",
                                detail: { index: this.getItemIndexById(items, item) },
                              })
                      }
                    >
                      <ActivitySquare
                        size={this.state.imageSize}
                        item={item}
                        isMobile={this.props.isMobile}
                        onClick={
                          this.props.isMobile
                            ? () => {}
                            : () => {
                                this.props.onAction({
                                  type: "NAVIGATE",
                                  value: "NAV_SLATE",
                                  data: {
                                    decorator: "SLATE",
                                    ...item.slate,
                                  },
                                });
                              }
                        }
                      />
                    </span>
                  );
                } else {
                  return null;
                }
              })}
            </div>
            <div css={STYLES_LOADER} style={{ height: 100 }}>
              {this.state.loading === "loading" ? <LoaderSpinner /> : null}
            </div>
          </div>
        ) : this.state.loading === "loading" ? (
          <div css={STYLES_LOADER}>
            <LoaderSpinner />
          </div>
        ) : (
          <EmptyState>
            <SVG.Users height="24px" />
            <div style={{ marginTop: 24 }}>
              Start following people and slates to see their activity here
            </div>
          </EmptyState>
        )}
      </ScenePage>
    );
  }
}
