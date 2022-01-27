import * as React from "react";
import * as NavigationData from "~/common/navigation-data";
import * as Actions from "~/common/actions";
import * as Strings from "~/common/strings";
import * as Styles from "~/common/styles";
import * as Constants from "~/common/constants";
import * as Window from "~/common/window";
import * as Websockets from "~/common/browser-websockets";
import * as UserBehaviors from "~/common/user-behaviors";
import * as Events from "~/common/custom-events";
import * as Logging from "~/common/logging";
import * as Environment from "~/common/environment";

// NOTE(jim):
// Scenes each have an ID and can be navigated to with _handleAction
import SceneError from "~/scenes/SceneError";
import SceneEditAccount from "~/scenes/SceneEditAccount";
import SceneFilesFolder from "~/scenes/SceneFilesFolder";
import SceneSlates from "~/scenes/SceneSlates";
import SceneSettingsDeveloper from "~/scenes/SceneSettingsDeveloper";
import SceneAuth from "~/scenes/SceneAuth";
import SceneSlate from "~/scenes/SceneSlate";
import SceneActivity from "~/scenes/SceneActivity";
// import SceneDirectory from "~/scenes/SceneDirectory";
import SceneProfile from "~/scenes/SceneProfile";
import SceneSurvey from "~/scenes/SceneSurvey";

// NOTE(jim):
// Sidebars each have a decorator and can be shown to with _handleAction
import SidebarCreateSlate from "~/components/sidebars/SidebarCreateSlate";
import SidebarCreateWalletAddress from "~/components/sidebars/SidebarCreateWalletAddress";
import SidebarWalletSendFunds from "~/components/sidebars/SidebarWalletSendFunds";
import SidebarAddFileToSlate from "~/components/sidebars/SidebarAddFileToSlate";
import SidebarDragDropNotice from "~/components/sidebars/SidebarDragDropNotice";
import SidebarSingleSlateSettings from "~/components/sidebars/SidebarSingleSlateSettings";
import SidebarHelp from "~/components/sidebars/SidebarHelp";
import SidebarFAQ from "~/components/sidebars/SidebarFAQ";
import SidebarEditTags from "~/components/sidebars/SidebarEditTags";

// NOTE(jim):
// Core components to the application structure.
import ApplicationHeader from "~/components/core/ApplicationHeader";
import ApplicationLayout from "~/components/core/ApplicationLayout";
import CTATransition from "~/components/core/CTATransition";
import Filter from "~/components/core/Filter";

import { GlobalModal } from "~/components/system/components/GlobalModal";
import { LoaderSpinner } from "~/components/system/components/Loaders";

const SIDEBARS = {
  SIDEBAR_WALLET_SEND_FUNDS: <SidebarWalletSendFunds />,
  SIDEBAR_CREATE_WALLET_ADDRESS: <SidebarCreateWalletAddress />,
  SIDEBAR_ADD_FILE_TO_SLATE: <SidebarAddFileToSlate />,
  SIDEBAR_CREATE_SLATE: <SidebarCreateSlate />,
  SIDEBAR_DRAG_DROP_NOTICE: <SidebarDragDropNotice />,
  SIDEBAR_SINGLE_SLATE_SETTINGS: <SidebarSingleSlateSettings />,
  SIDEBAR_HELP: <SidebarHelp />,
  SIDEBAR_FAQ: <SidebarFAQ />,
  SIDEBAR_EDIT_TAGS: <SidebarEditTags />,
};

const SCENES = {
  NAV_ERROR: <SceneError />,
  NAV_SIGN_IN: <SceneAuth />,
  ...(Environment.ACTIVITY_FEATURE_FLAG ? { NAV_ACTIVITY: <SceneActivity /> } : {}),
  // NAV_DIRECTORY: <SceneDirectory />,
  NAV_PROFILE: <SceneProfile />,
  NAV_DATA: <SceneFilesFolder />,
  NAV_SLATE: <SceneSlate />,
  NAV_API: <SceneSettingsDeveloper />,
  NAV_SETTINGS: <SceneEditAccount />,
  NAV_SLATES: <SceneSlates />,
};

let mounted;

export default class ApplicationPage extends React.Component {
  _body;

  state = {
    selected: {},
    viewer: this.props.viewer,
    page: this.props.page || {},
    data: this.props.data,
    activePage: this.props.page?.id,
    sidebar: null,
    online: null,
    isMobile: this.props.isMobile,
    activeUsers: null,
    loading: false,
  };

  async componentDidMount() {
    // window.iframely && iframely.load();
    this._handleWindowResize();
    if (mounted) {
      return false;
    }

    mounted = true;

    window.addEventListener("online", this._handleOnlineStatus);
    window.addEventListener("offline", this._handleOnlineStatus);
    window.addEventListener("resize", this._handleWindowResize);
    window.onpopstate = this._handleBackForward;

    if (this.state.viewer) {
      await this._handleSetupWebsocket();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("online", this._handleOnlineStatus);
    window.removeEventListener("offline", this._handleOnlineStatus);
    window.removeEventListener("resize", this._handleWindowResize);

    mounted = false;

    let wsclient = Websockets.getClient();
    if (wsclient) {
      Websockets.deleteClient();
    }
  }

  _handleUpdateViewer = ({ viewer, callback }) => {
    // _handleUpdateViewer = (newViewerState, callback) => {
    // let setAsyncState = (newState) =>
    //   new Promise((resolve) =>
    //     this.setState(
    //       {
    //         viewer: { ...this.state.viewer, ...newState, type: "VIEWER" },
    //       },
    //       resolve
    //     )
    //   );
    // await setAsyncState(newViewerState);

    //NOTE(martina): if updating viewer affects this.state.data (e.g. you're viewing your own slate), update data as well
    if (viewer?.slates?.length) {
      const { page } = this.state;
      if (page?.id === "NAV_SLATE" && this.state.data?.ownerId === this.state.viewer.id) {
        let { data } = this.state;
        for (let slate of viewer.slates) {
          if (slate.id === data.id) {
            data = slate;
            break;
          }
        }
        this.setState(
          {
            viewer: { ...this.state.viewer, ...viewer },
            data,
          },
          () => {
            if (callback) {
              callback();
            }
          }
        );
        return;
      }
    }

    // if (viewer?.onboarding) {
    //   this.setState(
    //     {
    //       viewer: {
    //         ...this.state.viewer,
    //         ...viewer,
    //         onboarding: { ...this.state.viewer.onboarding, ...viewer.onboarding },
    //       },
    //     },
    //     () => {
    //       if (callback) callback();
    //     }
    //   );
    //   return;
    // }

    this.setState(
      {
        viewer: { ...this.state.viewer, ...viewer },
      },
      () => {
        if (callback) {
          callback();
        }
      }
    );
  };

  _handleUpdateData = ({ data, callback }) => {
    // _handleUpdateData = (data, callback) => {
    //TODO(martina): maybe add a default window.history.replacestate where it pushes the new data to browser?
    this.setState({ data }, () => {
      if (callback) {
        callback();
      }
    });
  };

  _handleSetupWebsocket = async () => {
    let wsclient = Websockets.getClient();
    if (wsclient) {
      await Websockets.deleteClient();
      wsclient = null;
    }
    if (!this.state.viewer) {
      Logging.error("WEBSOCKET: NOT AUTHENTICATED");
      return;
    }
    wsclient = Websockets.init({
      resource: Environment.URI_FIJI,
      viewer: this.state.viewer,
      onUpdate: this._handleUpdateViewer,
      onNewActiveUser: this._handleNewActiveUser,
    });
    if (!wsclient) {
      Events.dispatchMessage({
        message:
          "We cannot connect to our live update server. You may have to refresh to see updates.",
      });
    }
    return;
  };

  _handleNewActiveUser = (users) => {
    this.setState({ activeUsers: users });
  };

  _handleWindowResize = () => {
    const { width } = Window.getViewportSize();

    // (1) is Window.isMobileBrowser checks, that one holds.
    // (2) then if the viewport is smaller than the width
    let isMobile = width > Constants.sizes.mobile ? this.props.isMobile : true;

    // only change if necessary.
    if (this.state.isMobile !== isMobile) {
      Logging.log("changing to mobile?", isMobile);
      this.setState({ isMobile });
    }
  };

  _handleOnlineStatus = async () => {
    if (navigator.onLine) {
      Events.dispatchMessage({ message: "Back online!", status: "INFO" });
    } else {
      Events.dispatchMessage({ message: "Offline. Trying to reconnect" });
    }
    this.setState({ online: navigator.onLine });
  };

  _withAuthenticationBehavior = (authenticate) => async (href = "/_/data", state) => {
    let response = await authenticate(state);
    if (Events.hasError(response)) {
      return response;
    }
    if (response.shouldMigrate) {
      return response;
    }
    let viewer = await UserBehaviors.hydrate();
    if (Events.hasError(viewer)) {
      return viewer;
    }

    this.setState({ viewer });
    await this._handleSetupWebsocket();

    // if (!redirected) {
    //   this._handleAction({ type: "NAVIGATE", value: "NAV_DATA" });
    // }
    this._handleNavigateTo({ href, redirect: true });

    return response;
  };

  _handleSelectedChange = (e) => {
    this.setState({
      selected: { ...this.state.selected, [e.target.name]: e.target.value },
    });
  };

  _handleDismissSidebar = () => {
    this.setState({ sidebar: null, sidebarData: null });
  };

  _handleAction = (options) => {
    if (options.type === "NAVIGATE") {
      return this._handleNavigateTo(options);
    }

    if (options.type === "UPDATE_VIEWER") {
      return this._handleUpdateViewer(options);
    }

    if (options.type === "UPDATE_PARAMS") {
      return this._handleUpdatePageParams(options);
    }

    if (options.type === "SIDEBAR") {
      return this.setState({
        sidebar: options.value,
        sidebarData: options.data,
      });
    }

    if (options.type === "NEW_WINDOW") {
      return window.open(options.value);
    }

    Logging.error("Error: Failed to _handleAction because TYPE did not match any known actions");
  };

  _handleNavigateTo = async ({ href, redirect = false, popstate = false }) => {
    const { page, details } = NavigationData.getByHref(href, this.state.viewer);

    Events.dispatchCustomEvent({ name: "slate-global-close-carousel", detail: {} });

    if (redirect || popstate) {
      window.history.replaceState(null, "Slate", page.pathname);
    } else {
      window.history.pushState(null, "Slate", page.pathname);
    }

    let state = { data: null, sidebar: null, page };
    // eslint-disable-next-line no-undef
    if (!next.ignore) {
      state.activePage = page.id;
    }

    if (page.id === "NAV_SLATE" || page.id === "NAV_PROFILE") {
      state.loading = true;
      state.data = { id: details.id };
    }
    if (page.id === "NAV_SLATE" || page.id === "NAV_PROFILE") {
      this.updateDataAndPathname({ page, details, state, popstate });
    } else {
      this.setState(state, () => {
        let body = document.documentElement || document.body;
        if (!popstate) {
          body.scrollTo(0, 0);
        }
      });
    }
  };

  updateDataAndPathname = async ({ page, details, state, popstate }) => {
    let pathname = page.pathname.split("?")[0];
    let search = Strings.getQueryStringFromParams(page.params);
    let data;
    if (page?.id === "NAV_SLATE") {
      let response = await Actions.getSerializedSlate(details);
      if (!response || response.error) {
        this.setState({ loading: false });
        this._handleNavigateTo({ href: "/_/404", redirect: true });
        return;
      }
      data = response.data;
      pathname = `/${data.owner.username}/${data.slatename}${search}`;
    } else if (page?.id === "NAV_PROFILE") {
      if (details.id === this.state.viewer?.id) {
        this.setState({ loading: false });
        this._handleNavigateTo({ href: "/_/data", redirect: true });
        return;
      }
      let response = await Actions.getSerializedProfile(details);
      if (!response || response.error) {
        this.setState({ loading: false });
        this._handleNavigateTo({ href: "/_/404", redirect: true });
        return;
      }
      data = response.data;
      if (data.slates?.length) {
        this.setState({ loading: false });
        this._handleNavigateTo({
          href: `/${data.username}/${data.slates[0].slatename}`,
          redirect: true,
        });
        return;
      }

      pathname = `/${data.username}${search}`;
    }

    this.setState({ ...state, data, loading: false }, () => {
      if (!popstate) {
        let body = document.documentElement || document.body;
        body.scrollTo(0, 0);
      }
    });

    window.history.replaceState(null, "Slate", pathname);
  };

  _handleUpdatePageParams = ({ params, callback, redirect = false }) => {
    const href = Strings.getCurrentURL(params);
    if (redirect) {
      window.history.replaceState(null, "Slate", href);
    } else {
      window.history.pushState(null, "Slate", href);
    }
    this.setState({ page: { ...this.state.page, params } }, () => {
      if (callback) {
        callback();
      }
    });
  };

  _handleBackForward = () => {
    let href = window.location.pathname.concat(
      window.location.search ? `${window.location.search}` : ""
    );
    this._handleNavigateTo({ href, popstate: true });
  };

  render() {
    let { page } = this.state;
    if (!page?.id) page = NavigationData.getById(null, this.state.viewer);
    const isSurveySceneVisible = this.state.viewer && !this.state.viewer?.hasCompletedSurvey;

    let headerElement;
    const isHeaderDisabled = page.id === "NAV_SIGN_IN" || isSurveySceneVisible;
    if (!isHeaderDisabled) {
      headerElement = (
        <ApplicationHeader
          viewer={this.state.viewer}
          data={this.state.data}
          page={page}
          navigation={NavigationData.navigation}
          onAction={this._handleAction}
          isMobile={this.state.isMobile}
          isMac={this.props.isMac}
          activePage={this.state.activePage}
        />
      );
    }

    const scene = React.cloneElement(SCENES[page.id], {
      key: this.state.data?.id,
      page: page,
      data: this.state.data,
      viewer: this.state.viewer,
      selected: this.state.selected,
      onSelectedChange: this._handleSelectedChange,
      onAuthenticate: this._withAuthenticationBehavior(UserBehaviors.authenticate),
      onTwitterAuthenticate: this._withAuthenticationBehavior(UserBehaviors.authenticateViaTwitter),
      onAction: this._handleAction,
      isMobile: this.state.isMobile,
      isMac: this.props.isMac,
      activeUsers: this.state.activeUsers,
      external: !this.state.viewer,
    });

    let sidebarElement;
    if (this.state.sidebar) {
      sidebarElement = React.cloneElement(SIDEBARS[this.state.sidebar], {
        page: page,
        selected: this.state.selected,
        viewer: this.state.viewer,
        data: this.state.data,
        sidebarData: this.state.sidebarData,
        onSelectedChange: this._handleSelectedChange,
        onCancel: this._handleDismissSidebar,
        onAction: this._handleAction,
      });
    }

    const isProfilePage =
      (page.id === "NAV_SLATE" && this.state.data?.ownerId !== this.state.viewer?.id) ||
      page.id === "NAV_PROFILE";

    let pageContent = null;
    switch (true) {
      case this.state.viewer && !this.state.viewer?.hasCompletedSurvey:
        pageContent = <SceneSurvey onAction={this._handleAction} />;
        break;

      case this.state.loading:
        pageContent = (
          <div css={Styles.CONTAINER_CENTERED} style={{ width: "100%", height: "100vh" }}>
            <LoaderSpinner style={{ height: 32, width: 32 }} />
          </div>
        );
        break;

      default:
        pageContent = scene;
    }

    return (
      <React.Fragment>
        <ApplicationLayout
          sidebarName={this.state.sidebar}
          page={page}
          onAction={this._handleAction}
          header={headerElement}
          sidebar={sidebarElement}
          onDismissSidebar={this._handleDismissSidebar}
          isMobile={this.state.isMobile}
          isMac={this.props.isMac}
          viewer={this.state.viewer}
        >
          <Filter
            isProfilePage={isProfilePage}
            disabled={isSurveySceneVisible || page.id === "NAV_SIGN_IN" || page.id === "NAV_ERROR"}
            viewer={this.state.viewer}
            page={page}
            data={this.state.data}
            isMobile={this.props.isMobile}
            onAction={this._handleAction}
          >
            {pageContent}
          </Filter>
        </ApplicationLayout>
        <GlobalModal />
        <CTATransition onAction={this._handleAction} page={page} />
        {/* {!this.state.loaded ? (
            <div
              style={{
                position: "absolute",
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Logo style={{ width: "20vw", maxWidth: "200px" }} />
            </div>
          ) : null} */}
      </React.Fragment>
    );
  }
}
