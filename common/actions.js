import "isomorphic-fetch";

import * as Websockets from "~/common/browser-websockets";
import * as Strings from "~/common/strings";

//NOTE(martina): call Websockets.checkWebsocket() before any api call that uses websockets to return updates
//  to make sure that websockets are properly connected (and to reconnect them if they are not)
//  otherwise updates may not occur properly

const REQUEST_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const DEFAULT_OPTIONS = {
  method: "POST",
  headers: REQUEST_HEADERS,
  credentials: "include",
};

const CORS_OPTIONS = {
  method: "POST",
  headers: REQUEST_HEADERS,
  credentials: "omit",
};

const returnJSON = async (route, options) => {
  const response = await fetch(route, options);
  const json = await response.json();

  return json;
};

export const createZipToken = async ({ files, resourceURI }) => {
  return await returnJSON(`${resourceURI}/api/download/create-zip-token`, {
    ...CORS_OPTIONS,
    body: JSON.stringify({ files }),
  });
};

export const downloadZip = ({ token, name, resourceURI }) =>
  `${resourceURI}/api/download/download-by-token?downloadId=${token}&name=${name}`;

export const health = async (data = {}) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/_`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data: { buckets: data.buckets } }),
  });
};

export const sendFilecoin = async (data) => {
  if (Strings.isEmpty(data.source)) {
    return null;
  }

  if (Strings.isEmpty(data.target)) {
    return null;
  }

  if (!data.amount) {
    return null;
  }
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/addresses/send`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const checkUsername = async (data) => {
  return await returnJSON(`/api/users/check-username`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const archive = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/data/archive`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const removeFromBucket = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/data/bucket-remove`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const getSlateById = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/slates/get`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const getSlatesByIds = async (data) => {
  return await returnJSON(`/api/slates/get`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const getSocial = async (data) => {
  return await returnJSON(`/api/users/get-social`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const deleteTrustRelationship = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/users/trust-delete`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const updateTrustRelationship = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/users/trust-update`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const createTrustRelationship = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/users/trust`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const createSubscription = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/subscribe`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const search = async (data) => {
  await Websockets.checkWebsocket();
  if (Strings.isEmpty(data.query)) {
    return { decorator: "NO_SERVER_TRIP", data: { results: [] } };
  }

  if (Strings.isEmpty(data.resourceURI)) {
    return { decorator: "NO_RESOURCE_URI", data: { results: [] } };
  }
  return await returnJSON(`${data.resourceURI}/search`, {
    ...CORS_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const createFile = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/data/create`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const addFileToSlate = async (data) => {
  console.log(data);
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/slates/add-file`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const updateViewer = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/users/update`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const signIn = async (data) => {
  return await returnJSON(`/api/sign-in`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const hydrateAuthenticatedUser = async () => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/hydrate`, {
    ...DEFAULT_OPTIONS,
  });
};

export const deleteViewer = async () => {
  return await returnJSON(`/api/users/delete`, {
    ...DEFAULT_OPTIONS,
  });
};

export const createUser = async (data) => {
  return await returnJSON(`/api/users/create`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const updateStatus = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/users/status-update`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const updateSearch = async (data) => {
  return await returnJSON(`/api/search/update`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

// export const checkCIDStatus = async (data) => {
//   return await returnJSON(`/api/data/cid-status`, {
//     ...DEFAULT_OPTIONS,
//     body: JSON.stringify({ data }),
//   });
// };

export const createSlate = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/slates/create`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const updateSlate = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/slates/update`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const updateSlateLayout = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/slates/update-layout`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const deleteSlate = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/slates/delete`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const removeFileFromSlate = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/slates/remove-file`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const generateAPIKey = async () => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/keys/generate`, {
    ...DEFAULT_OPTIONS,
  });
};

export const deleteAPIKey = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/keys/delete`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const saveCopy = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/data/save-copy`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const updateFile = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/data/update`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const toggleFilePrivacy = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/data/toggle-privacy`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const deleteFiles = async (data) => {
  await Websockets.checkWebsocket();
  return await returnJSON(`/api/data/delete`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const getSerializedSlate = async (data) => {
  return await returnJSON(`/api/slates/get-serialized`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const getSerializedProfile = async (data) => {
  return await returnJSON(`/api/users/get-serialized`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const createSupportMessage = async (data) => {
  return await returnJSON(`/api/support-message`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const getActivity = async (data) => {
  return await returnJSON(`/api/activity/get-activity`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const getExplore = async (data) => {
  return await returnJSON(`/api/activity/get-explore`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const getZipFilePaths = async (data) => {
  return await returnJSON(`/api/zip/get-paths`, {
    ...DEFAULT_OPTIONS,
    body: JSON.stringify({ data }),
  });
};

export const cleanDatabase = async () => {
  return await returnJSON(`api/clean-up/users`, {
    ...DEFAULT_OPTIONS,
  });
};
