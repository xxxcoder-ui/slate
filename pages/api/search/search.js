import * as RequestUtilities from "~/node_common/request-utilities";
import SearchManager from "~/node_common/managers/search";

//NOTE(martina): props
//               userId: (optional) the id of the user whose stuff we are searching through. If specified, globalSearch is disregarded since the search will be limited to that user's public items. Does not apply when searching for type USER
//               globalSearch: Whether we are searching all public stuff plus the user's own stuff (true) or just the user's stuff (false)
//               query: The search query
//               types: Which object types to search for. Can be a string or array of strings. Leaving it null or empty will search ALL object types. Potential values are: "USER", "SLATE", "FILE"
//               tagsIds: Applies when searching for only files. Will only search for files contained within the given tags
//               grouped: Applies when searching for multiple object types only. Specifies whether to group the results by object type in the form { users: [user1, user2, ...], slates: [slate1, slate2, ...], files: [file1, file2, ...]}
export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationInternal(req, res, true);
  if (!userInfo) return;
  const { id, user } = userInfo;

  if (!req.body.data || typeof req.body.data !== "object") {
    res.status(400).send({ decorator: "SERVER_SEARCH_DATA_NOT_INCLUDED", error: true });
  }

  const searchProps = { ...req.body.data, ownerId: id };

  if (!searchProps.types) {
    searchProps.types = [];
  } else if (!Array.isArray(searchProps.types)) {
    searchProps.types = [searchProps.types];
  }

  let results;
  let types = searchProps.types;
  if (types.length === 1) {
    if (types.includes("USER")) {
      results = await SearchManager.searchUser(searchProps);
    } else if (types.includes("SLATE")) {
      results = await SearchManager.searchSlate(searchProps);
    } else if (types.includes("FILE")) {
      results = await SearchManager.searchFile(searchProps);
    } else {
      res.status(400).send({ decorator: "SERVER_SEARCH_INVALID_TYPE", error: true });
    }
  } else {
    results = await SearchManager.searchMultiple(searchProps);
  }

  return res.status(200).send({ decorator: "SERVER_SEARCH", results });
};
