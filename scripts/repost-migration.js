import configs from "~/knexfile";
import knex from "knex";
import { v4 as uuid } from "uuid";

import * as Logging from "~/common/logging";
import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as Constants from "~/common/constants";

const envConfig = configs["production"];

const DB = knex(envConfig);

Logging.log(`RUNNING:  files-migration.js`);

const saveCopyReposts = async () => {
  let repostedFiles = await DB.column(
    "users.id",
    "users.data",
    "files.cid",
    "files.filename",
    "slates.isPublic",
    { fileData: "files.data" },
    { fileId: "files.id" }
  )
    .from("slate_files")
    .join("slates", "slates.id", "=", "slate_files.slateId")
    .join("files", "files.id", "=", "slate_files.fileId")
    .join("users", "users.id", "=", "slates.ownerId")
    .whereRaw("?? != ??", ["files.ownerId", "slates.ownerId"]);
  //   Logging.log(repostedFiles.length);

  for (let item of repostedFiles) {
    Logging.log(item);
    // continue;
    let user = { data: item.data };
    let { buckets, bucketKey, bucketRoot } = await Utilities.getBucket({ user });

    try {
      let response = await Utilities.addExistingCIDToData({
        buckets,
        key: bucketKey,
        path: bucketRoot?.path,
        cid: item.cid,
      });
    } catch (e) {
      Logging.log(e);
    }

    const duplicateFiles = await Data.getFilesByCids({
      ownerId: item.id,
      cids: [item.cid],
    });

    if (duplicateFiles.length) {
      if (!duplicateFiles[0].isPublic && item.isPublic) {
        Logging.log("UPDATE PUBLIC FOR FILE");
        await DB.from("files").where("id", item.fileId).update({ isPublic: true });
      }
    } else {
      const file = {
        cid: item.cid,
        ownerId: item.id,
        filename: item.filename,
        isPublic: item.isPublic,
        data: item.fileData,
      };
      await DB.insert(file).into("files");
    }
  }
};

const removeReposts = async () => {
  let repostedFiles = await DB.from("slate_files")
    .whereIn("id", function () {
      this.select("slate_files.id")
        .from("slate_files")
        .join("slates", "slates.id", "=", "slate_files.slateId")
        .join("files", "files.id", "=", "slate_files.fileId")
        .whereRaw("?? != ??", ["files.ownerId", "slates.ownerId"]);
    })
    .del()
    .returning("*");
  Logging.log(repostedFiles);
};

const runScript = async () => {
  await saveCopyReposts();
  //   await removeReposts();

  Logging.log("Finished running. Hit CTRL + C to quit");
};

runScript();
