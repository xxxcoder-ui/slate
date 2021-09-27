import {
  isImageType,
  isVideoType,
  isAudioType,
  isDocument,
  isTwitterLink,
  isYoutubeLink,
  isTwitchLink,
  isGithubLink,
  isInstagramLink,
} from "~/common/validations";

export const FILTER_VIEWS_IDS = {
  initial: "initial",
  browser: "browser",
};

export const FILTER_SUBVIEWS_IDS = {
  browser: { saved: "saved" },
};

export const FILTER_TYPES = {
  [FILTER_VIEWS_IDS.initial]: {
    filters: {
      initial: "library",
      library: "library",
      images: "images",
      videos: "videos",
      audios: "audios",
      documents: "documents",
    },
  },
  [FILTER_VIEWS_IDS.browser]: {
    filters: { all: "all", initial: "all" },
    subviews: {
      [FILTER_SUBVIEWS_IDS.browser.saved]: {
        filters: {
          initial: "all",
          all: "all",
          twitter: "twitter",
          youtube: "youtube",
          twitch: "twitch",
          github: "github",
          instagram: "instagram",
        },
      },
    },
  },
};

const FILTERING_HANDLERS = {
  [FILTER_VIEWS_IDS.initial]: {
    filters: {
      library: (object) => object,
      images: (object) => isImageType(object.type),
      videos: (object) => isVideoType(object.type),
      audios: (object) => isAudioType(object.type),
      documents: (object) => isDocument(object.filename, object.type),
    },
  },
  [FILTER_VIEWS_IDS.browser]: {
    filters: { all: (object) => object.isLink },
    subviews: {
      [FILTER_SUBVIEWS_IDS.browser.saved]: {
        filters: {
          all: (object) => object.isLink,
          twitter: isTwitterLink,
          youtube: isYoutubeLink,
          twitch: isTwitchLink,
          github: isGithubLink,
          instagram: isInstagramLink,
        },
      },
    },
  },
};

export const getViewData = (view) => {
  return FILTER_TYPES[view];
};

export const getFilterHandler = ({ view, subview, type }) => {
  const nextView = FILTERING_HANDLERS[view];
  if (subview) return nextView.subviews[subview].filters[type];
  return nextView.filters[type];
};
