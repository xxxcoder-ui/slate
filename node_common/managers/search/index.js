import {
  createUserIndex,
  createFileIndex,
  createSlateIndex,
  deleteIndex,
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
  deleteUser,
  deleteSlate,
  deleteFile,
} from "~/node_common/managers/search/update";

export default {
  createUserIndex,
  createFileIndex,
  createSlateIndex,
  deleteIndex,
  indexUser,
  indexSlate,
  indexFile,
  deleteUser,
  deleteSlate,
  deleteFile,
  searchAll,
  searchUser,
  searchSlate,
  searchFile,
};
