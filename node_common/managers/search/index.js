import {
  createUserIndex,
  createFileIndex,
  createSlateIndex,
  deleteUserIndex,
  deleteFileIndex,
  deleteSlateIndex,
} from "~/node_common/managers/search/create";
import {
  searchAll,
  searchUser,
  searchSlate,
  searchFile,
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

export default {
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
  searchAll,
  searchUser,
  searchSlate,
  searchFile,
};
