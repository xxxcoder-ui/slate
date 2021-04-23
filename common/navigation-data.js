import * as Strings from "~/common/strings";

// NOTE(jim):
// Recursion for nested entities (any number).
export const getCurrent = ({ id, data }) => {
  let target = null;
  let activeIds = {};

  const findById = (state, id) => {
    for (let i = 0; i < state.length; i++) {
      if (state[i].id === id) {
        target = state[i];
        activeIds[state[i].id] = true;

        if (target.id === "NAV_SLATE") {
          target.slateId = data && data.id;
        }
      }

      // if (!target && state[i].children) {
      //   activeIds[state[i].id] = true;
      //   findById(state[i].children, id);

      //   if (!target) {
      //     activeIds[state[i].id] = false;
      //   }
      // }
    }
  };

  findById(navigation, id);

  return { target, activeIds };
};

export const navigation = [
  {
    id: "NAV_DATA",
    decorator: "DATA",
    name: "Home",
    pageTitle: "Welcome back!",
  },
  {
    id: "NAV_ACTIVITY",
    decorator: "ACTIVITY",
    name: "Activity",
    pageTitle: "Activity",
    ignore: true,
  },
  {
    id: "NAV_EXPLORE",
    decorator: "EXPLORE",
    name: "Explore",
    pageTitle: "Welcome back!",
    ignore: true,
  },
  {
    id: "NAV_SLATES",
    decorator: "SLATES",
    name: "Collections",
    pageTitle: "Collections",
    ignore: true,
  },
  {
    id: "NAV_SLATES_FOLLOWING",
    decorator: "SLATES_FOLLOWING",
    name: "Collections following",
    pageTitle: "Collections following",
    ignore: true,
  },
  {
    id: "NAV_DIRECTORY",
    decorator: "DIRECTORY",
    name: "Directory",
    pageTitle: "Your directory",
  },
  {
    id: "NAV_DIRECTORY_FOLLOWERS",
    decorator: "DIRECTORY_FOLLOWERS",
    name: "Directory",
    pageTitle: "Your directory",
    ignore: true,
  },
  {
    id: "NAV_SLATE",
    decorator: "SLATE",
    name: "Collection",
    pageTitle: "Collection",
    ignore: true,
  },
  {
    id: "NAV_FILECOIN",
    decorator: "FILECOIN",
    name: "Filecoin",
    pageTitle: "Archive on Filecoin",
    filecoin: true,
  },
  {
    id: "NAV_STORAGE_DEAL",
    decorator: "STORAGE_DEAL",
    name: "Storage Deal",
    filecoin: true,
    pageTitle: "Make a one-off Filecoin storage deal",
  },
  {
    id: "NAV_API",
    decorator: "API",
    name: "API",
    pageTitle: "Developer API",
  },
  {
    id: "NAV_SETTINGS",
    decorator: "SETTINGS",
    name: "Profile & Account Settings",
    pageTitle: "Your Profile & Account Settings",
    ignore: true,
  },
  {
    id: "NAV_PROFILE_FILES",
    decorator: "PROFILE_FILES",
    name: "Profile",
    pageTitle: "Profile",
    ignore: true,
  },
  {
    id: "NAV_PROFILE",
    decorator: "PROFILE",
    name: "Profile",
    pageTitle: "Profile",
    ignore: true,
  },
  {
    id: "NAV_PROFILE_PEERS",
    decorator: "PROFILE_PEERS",
    name: "Profile",
    pageTitle: "Profile",
    ignore: true,
  },
  {
    id: "NAV_FILE",
    decorator: "FILE",
    name: "File",
    pageTitle: "File",
    ignore: true,
  },
];
