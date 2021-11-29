import * as Actions from "~/common/actions";
import * as Events from "~/common/custom-events";

import create from "zustand";

const DEFAULT_STATE = {
  query: "",
  results: null,
  isSearching: false,
  isFetchingResults: false,
};

export const useSearchStore = create((set) => {
  const search = async ({ types, query, globalSearch, tagIds, grouped }) => {
    //for more context, look at node_common/managers/search/search.js
    //userId: (optional) the id of the user whose stuff we are searching through. If specified, globalSearch is disregarded since the search will be limited to that user's public items. Does not apply when searching for type USER
    //types: leaving it null searches everything. Doing ["SLATE"] searches just slates, doing ["USER", "FILE"] searches users and files.
    //globalSearch: whether you are just searching the user's files/slates or global files/slates. This option doesn't exist for searching users since there is no notion of public or private users
    //tagIds: only applies when searching files. the ids of the tags (aka collections) you are searching within. aka if you only want to search for files in a given slate, provide that slate's id. If no tag ids are provided, it searches all files
    //grouped: whether to group the results by type (slate, user, file) when searching multiple types. Doesn't apply when searching only one type e.g. types: ["SLATE"]
    set((prev) => ({ ...prev, isFetchingResults: true }));
    const response = await Actions.search({
      types,
      query,
      globalSearch,
      tagIds,
      grouped,
    });

    Events.hasError(response);
    const { results = [] } = response;
    const files = results?.files || results;
    const slates = results?.slates || [];

    set((prev) => ({ ...prev, results: { files, slates }, isFetchingResults: false }));
  };

  const clearSearch = () => set((prev) => ({ ...prev, ...DEFAULT_STATE }));

  const setQuery = (query) => set((prev) => ({ ...prev, isSearching: true, query }));

  return {
    ...DEFAULT_STATE,
    search,
    setQuery,
    clearSearch,
  };
});
