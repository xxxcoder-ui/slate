import * as React from "react";
import * as Actions from "~/common/actions";
import * as Utilities from "~/common/utilities";
import * as Strings from "~/common/strings";
import * as Events from "~/common/custom-events";
import * as SVG from "~/common/svg";

import { css } from "@emotion/react";
import { LoaderSpinner } from "~/components/system/components/Loaders";

import ScenePage from "~/components/core/ScenePage";
import Profile from "~/components/core/Profile";
import EmptyState from "~/components/core/EmptyState";

const STYLES_LOADER = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90vh;
  width: 100%;
`;

export default class SceneProfile extends React.Component {
  state = {
    profile: null,
    notFound: false,
    isOwner: false,
    loading: true,
  };

  componentDidMount = async () => {
    this.fetchProfile();
  };

  componentDidUpdate = (prevProps) => {
    if (this.state.isOwner && this.props.viewer.library !== prevProps.viewer.library) {
      let filteredViewer = this.getFilteredViewer();
      this.setState({ profile: filteredViewer });
    } else if (this.props.page !== prevProps.page) {
      this.openCarouselToItem();
    }
  };

  fetchProfile = async () => {
    const username = this.props.page.user || this.props.page.data?.username;
    let isOwner = false;
    let query;
    let targetUser;
    if (username) {
      if (username === this.props.viewer.username) {
        isOwner = true;
        targetUser = this.getFilteredViewer();
      } else {
        query = { username: username };
      }
    } else if (this.props.data?.id) {
      if (this.props.data.id === this.props.viewer.id) {
        isOwner = true;
        targetUser = this.getFilteredViewer();
      } else {
        query = { id: this.props.data.id };
      }
    }

    if (!targetUser) {
      let response;
      if (query) {
        response = await Actions.getSerializedProfile(query);
      }

      if (!response || response.error) {
        this.setState({ notFound: true });
        return;
      }

      targetUser = response.data;
    }
    window.history.replaceState(
      { ...window.history.state, data: targetUser },
      "A slate user",
      `/${targetUser.username}`
    );
    this.props.onUpdateData(targetUser);
    this.setState({ isOwner, profile: targetUser, loading: false }, this.openCarouselToItem);
  };

  openCarouselToItem = () => {
    if (!this.state.profile?.library?.length) {
      return;
    }
    const { cid, fileId, index } = this.props.page;

    if (Strings.isEmpty(cid) && Strings.isEmpty(fileId) && typeof index === "undefined") {
      return;
    }

    const library = this.state.profile.library;

    let foundIndex = -1;
    if (index) {
      foundIndex = index;
    } else if (cid) {
      foundIndex = library.findIndex((object) => object.cid === cid);
    } else if (fileId) {
      foundIndex = library.findIndex((object) => object.id === fileId);
    }
    if (typeof foundIndex !== "undefined" && foundIndex !== -1) {
      Events.dispatchCustomEvent({
        name: "slate-global-open-carousel",
        detail: { index: foundIndex },
      });
    }
    // else {
    //   Events.dispatchCustomEvent({
    //     name: "create-alert",
    //     detail: {
    //       alert: {
    //         message:
    //           "The requested file could not be found. It could have been deleted or may be private",
    //       },
    //     },
    //   });
    // }
  };

  getFilteredViewer = () => {
    let viewer = this.props.viewer;
    const res = Utilities.getPublicAndPrivateFiles({ viewer });
    return { ...viewer, library: res.publicFiles };
  };

  render() {
    console.log(this.state.profile);
    if (this.state.notFound) {
      return (
        <ScenePage>
          <EmptyState>
            <SVG.Users height="24px" style={{ marginBottom: 24 }} />
            <div>We were unable to locate that user profile</div>
          </EmptyState>
        </ScenePage>
      );
    }

    if (this.state.loading) {
      return (
        <ScenePage>
          <div css={STYLES_LOADER}>
            <LoaderSpinner />
          </div>
        </ScenePage>
      );
    } else if (this.state.profile?.id) {
      return (
        <Profile
          {...this.props}
          user={this.state.profile}
          isOwner={this.state.isOwner}
          isAuthenticated={this.props.viewer !== null}
          key={this.state.profile.id}
        />
      );
    }
    return null;
  }
}
