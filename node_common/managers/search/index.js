import {
  createUserIndex,
  createFileIndex,
  createSlateIndex,
  deleteUserIndex,
  deleteFileIndex,
  deleteSlateIndex,
} from "~/node_common/managers/search/manage";
import {
  searchMultiple,
  searchUser,
  searchSlate,
  searchFile,
  getUser,
  getSlate,
  getFile,
} from "~/node_common/managers/search/search";
import {
  indexUser,
  indexSlate,
  indexFile,
  updateUser,
  updateSlate,
  updateFile,
  deleteUser,
  deleteSlate,
  deleteFile,
} from "~/node_common/managers/search/update";

const SearchManager = {
  createUserIndex,
  createFileIndex,
  createSlateIndex,
  deleteUserIndex,
  deleteFileIndex,
  deleteSlateIndex,
  indexUser,
  indexSlate,
  indexFile,
  updateUser,
  updateSlate,
  updateFile,
  deleteUser,
  deleteSlate,
  deleteFile,
  searchMultiple,
  searchUser,
  searchSlate,
  searchFile,
  getUser,
  getSlate,
  getFile,
};

export default SearchManager;
