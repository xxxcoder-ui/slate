import "isomorphic-fetch";

import * as Environment from "~/node_common/environment";
import * as Constants from "~/node_common/constants";
import * as Strings from "~/common/strings";
import * as Logging from "~/common/logging";

import configs from "~/knexfile";
import knex from "knex";

import { Buckets, PrivateKey, Filecoin, Client, ThreadID } from "@textile/hub";

const envConfig = configs["development"];

const DB = knex(envConfig);

const TEXTILE_KEY_INFO = {
  key: Environment.TEXTILE_HUB_KEY,
  secret: Environment.TEXTILE_HUB_SECRET,
};

const recordTextileBucketInfoProduction = async (props) => {
  const users = await DB.select("id", "data").from("users").where({ textileToken: null });
  let userUpdates = [];
  let i = 0;
  for (let user of users) {
    if (i % 50 === 0) {
      console.log(i);
      if (userUpdates.length) {
        await pushUserUpdates(userUpdates);
        userUpdates = [];
      }
    }
    i += 1;
    try {
      const textileKey = user.data?.tokens?.api;
      if (!textileKey) {
        console.log(`ERROR: user ${user.id} does not have textile key`);
        return;
      }
      let buckets = await Buckets.withKeyInfo(TEXTILE_KEY_INFO);

      const identity = PrivateKey.fromString(textileKey);
      const textileToken = await buckets.getToken(identity);
      buckets.context.withToken(textileToken);

      const client = new Client(buckets.context);
      const res = await client.getThread("buckets");
      const textileThreadID =
        typeof res.id === "string" ? res.id : ThreadID.fromBytes(res.id).toString();
      buckets.context.withThread(textileThreadID);

      const roots = await buckets.list();
      const existing = roots.find((bucket) => bucket.name === Constants.textile.mainBucket);

      if (!existing) {
        console.log(`ERROR ${user.id} missing existing bucket. Listed buckets:`);
        console.log(roots);
      }

      let ipfs = existing.path;
      const textileBucketCID = Strings.ipfsToCid(ipfs);

      if (!textileToken || !textileThreadID || !textileBucketCID) {
        console.log(`ERROR ${user.id} missing some value`);
        return;
      }
      // console.log({ textileToken, textileThreadID, textileBucketCID });
      userUpdates.push({
        id: user.id,
        textileKey,
        textileToken,
        textileThreadID,
        textileBucketCID,
      });
    } catch (e) {
      console.log(e);
    }
  }
  if (userUpdates.length) {
    await pushUserUpdates(userUpdates);
  }
  console.log("SCRIPT FINISHED");
};

const pushUserUpdates = async (userUpdates) => {
  let query = userUpdates.map((user) => "(?::uuid, ?, ?, ?, ?)").join(", ");
  let values = [];
  for (let user of userUpdates) {
    values.push(
      user.id,
      user.textileKey,
      user.textileToken,
      user.textileThreadID,
      user.textileBucketCID
    );
  }

  await DB.raw(
    `UPDATE ?? as u SET ?? = ??, ?? = ??, ?? = ??, ?? = ?? from (values ${query}) as c(??, ??, ??, ??, ??) WHERE ?? = ??`,
    [
      "users",
      "textileKey",
      "c.textileKey",
      "textileToken",
      "c.textileToken",
      "textileThreadID",
      "c.textileThreadID",
      "textileBucketCID",
      "c.textileBucketCID",
      ...values,
      "id",
      "textileKey",
      "textileToken",
      "textileThreadID",
      "textileBucketCID",
      "c.id",
      "u.id",
    ]
  );
};

const recordTextileBucketInfo = async (props) => {
  const users = await DB.select("users.id", "users.textileKey")
    .from("users")
    .where({ "users.textileToken": null });
  const userUpdates = [];
  for (let user of users) {
    try {
      let buckets = await Buckets.withKeyInfo(TEXTILE_KEY_INFO);

      const identity = PrivateKey.fromString(user.textileKey);
      const textileToken = await buckets.getToken(identity);
      buckets.context.withToken(textileToken);

      const client = new Client(buckets.context);
      const res = await client.getThread("buckets");
      const textileThreadID =
        typeof res.id === "string" ? res.id : ThreadID.fromBytes(res.id).toString();
      buckets.context.withThread(textileThreadID);

      const roots = await buckets.list();
      const existing = roots.find((bucket) => bucket.name === Constants.textile.mainBucket);

      let ipfs = existing.path;
      const textileBucketCID = Strings.ipfsToCid(ipfs);

      if (!textileToken || !textileThreadID || !textileBucketCID) {
        console.log("ERROR missing some value");
        continue;
      }
      // console.log({ textileToken, textileThreadID, textileBucketCID });
      userUpdates.push({ id: user.id, textileToken, textileThreadID, textileBucketCID });
    } catch (e) {
      console.log(e);
      console.log(user.id);
    }
  }
  let query = userUpdates.map((user) => "(?::uuid, ?, ?, ?)").join(", ");
  let values = [];
  for (let user of userUpdates) {
    values.push(user.id, user.textileToken, user.textileThreadID, user.textileBucketCID);
  }

  await DB.raw(
    `UPDATE ?? as u SET ?? = ??, ?? = ??, ?? = ?? from (values ${query}) as c(??, ??, ??, ??) WHERE ?? = ??`,
    [
      "users",
      "textileToken",
      "c.textileToken",
      "textileThreadID",
      "c.textileThreadID",
      "textileBucketCID",
      "c.textileBucketCID",
      ...values,
      "id",
      "textileToken",
      "textileThreadID",
      "textileBucketCID",
      "c.id",
      "u.id",
    ]
  );
  console.log("SCRIPT FINISHED");
};

const run = async (props) => {
  let successful = [];
  let i = 0;
  const users = await DB.select("id", "textileBucketCID")
    .from("users")
    .whereExists(function () {
      this.select("id")
        .from("files")
        .whereRaw('users.id = "files"."ownerId"')
        .where("files.isLink", false);
    })
    .whereNotExists(function () {
      this.select("id")
        .from("deals")
        .whereRaw('"users"."textileBucketCID" = "deals"."textileBucketCID"');
    });
  for (let user of users) {
    if (i % 500 === 0) {
      console.log(i);
      if (successful.length) {
        await DB.insert(successful).into("deals");
        successful = [];
      }
    }
    i += 1;
    let json = await addToEstuary(user.textileBucketCID);
    if (json?.pin?.cid && json?.requestid) {
      successful.push({
        textileBucketCID: user.textileBucketCID,
        pinCID: json.pin.cid,
        requestId: json.requestid,
      });
    } else {
      console.log(`ERROR storage deal for ${user.id}`);
    }
  }
  if (successful.length) {
    await DB.insert(successful).into("deals");
  }
  console.log("SCRIPT FINISHED");
};

const addToEstuary = async (cid) => {
  try {
    let res = await fetch("https://api.estuary.tech/content/add-ipfs", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Environment.ESTUARY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "",
        root: cid,
      }),
    });
    let json = await res.json();
    return json;
  } catch (e) {
    Logging.error({
      error: e,
      decorator: "ADD_CID_TO_ESTUARY",
    });
  }
  console.log("SCRIPT FINISHED");
};

// recordTextileBucketInfoProduction();
// recordTextileBucketInfo();
run();
// addToEstuary();
