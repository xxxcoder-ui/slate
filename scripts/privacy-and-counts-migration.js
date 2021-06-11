import configs from "~/knexfile";
import knex from "knex";

import { v4 as uuid } from "uuid";

import * as Logging from "~/common/logging";
import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as Constants from "~/common/constants";

const envConfig = configs["development"];

const DB = knex(envConfig);

Logging.log(`RUNNING:  files-migration.js`);

const makeFilesPublic = async () => {
  let publicFiles = await DB.from("files")
    .whereIn("id", function () {
      this.select("slate_files.fileId")
        .from("slate_files")
        .join("slates", "slates.id", "=", "slate_files.slateId")
        .where("slates.isPublic", true);
    })
    .update({ isPublic: true });
};

const getSlateSubscriberAndFileCount = async () => {
  const slates = await DB.select("*").from("slates");
  for (let slate of slates) {
    let subscriberCount = await DB("subscriptions").where("slateId", slate.id).count();
    subscriberCount = subscriberCount.pop().count;
    let fileCount = await DB("slate_files").where("slateId", slate.id).count();
    fileCount = fileCount.pop().count;
    // Logging.log(slate.id);
    // Logging.log(subscriberCount);
    // Logging.log(fileCount);

    await DB("slates").where("id", slate.id).update({
      subscriberCount,
      fileCount,
    });
  }
};

const getUserFollowerAndFileAndSlateCount = async () => {
  const users = await DB.select("*").from("users");
  for (let user of users) {
    let followerCount = await DB("subscriptions").where("userId", user.id).count();
    followerCount = followerCount.pop().count;
    let fileCount = await DB("files").where({ ownerId: user.id, isPublic: true }).count();
    fileCount = fileCount.pop().count;
    let slateCount = await DB("slates").where({ ownerId: user.id, isPublic: true }).count();
    slateCount = slateCount.pop().count;
    Logging.log(user.id);
    Logging.log(followerCount);
    Logging.log(fileCount);
    Logging.log(slateCount);
    // await DB("users").where("id", user.id).update({
    //   followerCount,
    //   fileCount,
    //   slateCount,
    // });
  }
};

const runScript = async () => {
  //   await makeFilesPublic();
  //   await getSlateSubscriberAndFileCount();
  await getUserFollowerAndFileAndSlateCount();

  Logging.log("Finished running. Hit CTRL + C to quit");
};

runScript();
