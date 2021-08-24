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
  await DB.from("files").update({ isPublic: false });
  console.log("finished setting files to private");
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
    const subscriberCountFields = ["id", "subscriptions", "slateId", slateId];
    const subscriberCount = `(SELECT COUNT(??) FROM ?? WHERE ?? = ?)`;

    const fileCountFields = ["id", "slate_files", "slateId", slateId];
    const fileCount = `(SELECT COUNT(??) FROM ?? WHERE ?? = ?)`;

    const updateFields = [
      "slates",
      "fileCount",
      ...fileCountFields,
      "subscriberCount",
      ...subscriberCountFields,
      "id",
      slateId,
    ];
    const update = await DB.raw(
      `UPDATE ?? SET ?? = ${fileCount}, ?? = ${subscriberCount} WHERE ?? = ? RETURNING *`,
      updateFields
    );
  }
};

const getUserFollowerAndSlateCount = async () => {
  const users = await DB.select("*").from("users");
  for (let user of users) {
    const followerCountFields = ["id", "subscriptions", "userId", userId];
    const followerCount = `(SELECT COUNT(??) FROM ?? WHERE ?? = ?)`;

    const slateCountFields = ["id", "slates", "ownerId", userId, "isPublic", true];
    const slateCount = `(SELECT COUNT(??) FROM ?? WHERE ?? = ? AND ?? = ?)`;

    const updateFields = [
      "users",
      "slateCount",
      ...slateCountFields,
      "followerCount",
      ...followerCountFields,
      "id",
      userId,
    ];
    const update = await DB.raw(
      `UPDATE ?? SET ?? = ${slateCount}, ?? = ${followerCount} WHERE ?? = ? RETURNING *`,
      updateFields
    );
  }
};

const runScript = async () => {
  await makeFilesPublic();
  // await getSlateSubscriberAndFileCount();
  // await getUserFollowerAndSlateCount();

  Logging.log("Finished running. Hit CTRL + C to quit");
};

runScript();
