import * as Actions from "~/common/actions";
import * as Strings from "~/common/strings";

export const getById = (id, viewer) => {
  let target;

  if (id) {
    target = navigation.find((each) => each.id === id);
  }
  if (!target) {
    return { ...errorPage };
  }

  if (viewer && target.id === authPage.id) {
    return { ...activityPage }; //NOTE(martina): authenticated users should be redirected to the home page rather than the
  }

  if (!viewer && !target.externalAllowed) {
    return { ...authPage }; //NOTE(martina): redirect to sign in page if try to access internal page while logged out
  }

  return { ...target };
};

export const getByHref = (href, viewer) => {
  let pathname;
  if (href) {
    pathname = href.split("?")[0];
  }
  if (!pathname) {
    return { page: { ...errorPage } };
  }
  if (pathname === "/_") {
    return { page: { ...activityPage } };
  }

  let page = navigation.find((each) => pathname.startsWith(each.pathname));

  let details;
  if (page) {
    page = { ...page };
    if (page.id === "NAV_SLATE" || page.id === "NAV_PROFILE") {
      details = {
        id: pathname.replace(page.pathname, ""),
      };
    }
  } else {
    let params = pathname.slice(1).split("/");
    if (params.length === 1) {
      page = { ...profilePage };
      details = {
        username: params[0],
      };
    } else if (params.length === 2) {
      page = { ...slatePage };
      details = {
        username: params[0],
        slatename: params[1],
      };
    }
  }
  page.pathname = href;

  let redirected = false;

  if (viewer && page === authPage) {
    redirected = true;
    page = { ...activityPage };
  }

  if (!viewer && !page.externalAllowed) {
    redirected = true;
    page = { ...authPage }; //NOTE(martina): redirect to sign in page if try to access internal page while logged out
  }

  if (!page) {
    window.location.replace("/_/404");
  }

  //NOTE(martina): to transform query params into more easily usable key value pairs in page
  if (!redirected) {
    let params = Strings.getParamsFromUrl(href);
    if (page.id === "NAV_PROFILE" && page.cid) {
      params.tab = "FILES";
    }
    page.params = params;
  }
  return { page, details };
};

const authPage = {
  id: "NAV_SIGN_IN",
  name: "Sign in",
  pageTitle: "Sign in & Sign up",
  ignore: true,
  pathname: "/_/auth",
  externalAllowed: true,
};

const dataPage = {
  id: "NAV_DATA",
  name: "My Slate",
  pageTitle: "My Slate",
  pathname: "/_/data",
  mainNav: true,
};

const activityPage = {
  id: "NAV_ACTIVITY",
  name: "Activity",
  pageTitle: "Activity",
  ignore: true,
  externalAllowed: true,
  pathname: "/_/activity",
  mainNav: true,
};

const slatePage = {
  id: "NAV_SLATE",
  name: "Collection",
  pageTitle: "A Collection",
  ignore: true,
  externalAllowed: true,
  pathname: "/$/slate/",
};

const profilePage = {
  id: "NAV_PROFILE",
  name: "Profile",
  pageTitle: "A Profile",
  ignore: true,
  externalAllowed: true,
  pathname: "/$/user/",
};

const errorPage = {
  id: "NAV_ERROR",
  name: "404",
  pageTitle: "404 Not found",
  ignore: true,
  externalAllowed: true,
  pathname: "/_/404",
};

export const navigation = [
  errorPage,
  authPage,
  activityPage,
  dataPage,
  {
    id: "NAV_SLATES",
    name: "Collections",
    pageTitle: "Your Collections",
    ignore: true,
    pathname: "/_/collections",
    mainNav: true,
  },
  // {
  //   id: "NAV_SEARCH",
  //   name: "Search",
  //   pageTitle: "Search Slate",
  //   ignore: true,
  //   pathname: "/_/search",
  // mainNav: true,
  // },
  {
    id: "NAV_DIRECTORY",
    name: "Directory",
    pageTitle: "Your Following",
    pathname: "/_/directory",
  },
  slatePage,
  {
    id: "NAV_FILECOIN",
    name: "Filecoin",
    pageTitle: "Archive on Filecoin",
    pathname: "/_/filecoin",
  },
  {
    id: "NAV_STORAGE_DEAL",
    name: "Storage Deal",
    pageTitle: "Filecoin Storage Deal",
    pathname: "/_/storage-deal",
  },
  {
    id: "NAV_API",
    name: "API",
    pageTitle: "Developer API",
    pathname: "/_/api",
  },
  {
    id: "NAV_SETTINGS",
    name: "Settings",
    pageTitle: "Profile & Account Settings",
    ignore: true,
    pathname: "/_/settings",
  },
  profilePage,
  // {
  //   id: "NAV_FILE",
  //   name: "File",
  //   pageTitle: "A File",
  //   ignore: true,
  //   externalAllowed: true,
  // },
];
