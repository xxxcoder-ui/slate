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

// MARK: - check what parameters are in each table

const printUsersTable = async () => {
  const users = await DB.select("*").from("users");
  let dataParams = {};
  let fileParams = {};
  let coverParams = {};
  for (let user of users) {
    for (let param of Object.keys(user.data)) {
      if (!dataParams[param]) {
        dataParams[param] = true;
      }
    }
    if (user.data?.library && user.data.library[0]?.children?.length) {
      let library = user.data.library[0].children;
      for (let file of library) {
        for (let param of Object.keys(file)) {
          if (!fileParams[param]) {
            fileParams[param] = true;
          }
        }
        if (file.coverImage) {
          for (let param of Object.keys(file.coverImage)) {
            if (!coverParams[param]) {
              coverParams[param] = true;
            }
          }
        }
      }
    }
  }
  Logging.log({ dataParams: Object.keys(dataParams) });
  Logging.log({ fileParams: Object.keys(fileParams) });
  Logging.log({ coverParams: Object.keys(coverParams) });
};

const printSlatesTable = async () => {
  const slates = await DB.select("*").from("slates");
  let dataParams = {};
  let fileParams = {};
  let coverParams = {};
  for (let slate of slates) {
    for (let param of Object.keys(slate.data)) {
      if (!dataParams[param]) {
        dataParams[param] = true;
      }
    }
    if (slate.data.objects?.length) {
      let objects = slate.data.objects;
      for (let file of objects) {
        for (let param of Object.keys(file)) {
          if (!fileParams[param]) {
            fileParams[param] = true;
          }
        }
        if (file.coverImage) {
          for (let param of Object.keys(file.coverImage)) {
            if (!coverParams[param]) {
              coverParams[param] = true;
            }
          }
        }
      }
    }
  }
  Logging.log({ dataParams: Object.keys(dataParams) });
  Logging.log({ fileParams: Object.keys(fileParams) });
  Logging.log({ coverParams: Object.keys(coverParams) });
};

// MARK: - add/modify tables

const addTables = async () => {
  await DB.schema.table("deals", function (table) {
    table.renameColumn("owner_user_id", "ownerId");
    table.renameColumn("created_at", "createdAt");
    table.renameColumn("updated_at", "updatedAt");
  });

  await DB.schema.table("orphans", function (table) {
    table.renameColumn("created_at", "createdAt");
  });

  await DB.schema.table("global", function (table) {
    table.renameColumn("created_at", "createdAt");
  });

  await DB.schema.table("stats", function (table) {
    table.renameColumn("created_at", "createdAt");
  });

  await DB.schema.renameTable("activity", "old_activity");

  await DB.schema.table("keys", function (table) {
    table.renameColumn("owner_id", "ownerId");
    table.renameColumn("created_at", "createdAt");
  });

  await DB.schema.createTable("files", function (table) {
    table.uuid("id").primary().unique().notNullable().defaultTo(DB.raw("uuid_generate_v4()"));
    table.uuid("ownerId").references("id").inTable("users");
    table.timestamp("createdAt").notNullable().defaultTo(DB.raw("now()"));
    table.string("cid").notNullable();
    table.string("filename").nullable();
    table.boolean("isPublic").notNullable().defaultTo(false);
    table.jsonb("data").nullable();
  });

  await DB.schema.createTable("slate_files", function (table) {
    table.uuid("id").primary().unique().notNullable().defaultTo(DB.raw("uuid_generate_v4()"));
    table.uuid("fileId").references("id").inTable("files");
    table.uuid("slateId").references("id").inTable("slates");
    table.timestamp("createdAt").notNullable().defaultTo(DB.raw("now()"));
  });

  await DB.schema.createTable("activity", function (table) {
    table.uuid("id").primary().unique().notNullable().defaultTo(DB.raw("uuid_generate_v4()"));
  });

  await DB.schema.table("activity", function (table) {
    table.uuid("ownerId").references("id").inTable("users");
    table.uuid("userId").references("id").inTable("users");
    table.uuid("slateId").references("id").inTable("slates");
    table.uuid("fileId").references("id").inTable("files");
    table.string("type");
    table.timestamp("createdAt").notNullable().defaultTo(DB.raw("now()"));
  });

  await DB.schema.table("slates", function (table) {
    table.renameColumn("created_at", "createdAt");
    table.renameColumn("updated_at", "updatedAt");
    table.dropColumn("published_at");
    table.uuid("ownerId").references("id").inTable("users");
    table.boolean("isPublic").notNullable().defaultTo(false);
  });

  await DB.schema.table("users", function (table) {
    table.string("email").unique().nullable();
    table.renameColumn("created_at", "createdAt");
    table.renameColumn("updated_at", "lastActive");
  });

  await DB.schema.table("subscriptions", function (table) {
    table.renameColumn("created_at", "createdAt");
    table.renameColumn("owner_user_id", "ownerId");
    table.renameColumn("target_slate_id", "slateId");
    table.renameColumn("target_user_id", "userId");
  });

  await DB.schema.table("subscriptions", function (table) {
    table.uuid("ownerId").references("id").inTable("users").alter();
    table.uuid("slateId").references("id").inTable("slates").alter();
    table.uuid("userId").references("id").inTable("users").alter();
  });

  Logging.log("finished adding tables");
};

// MARK: - populate new tables

const migrateUsersTable = async (testing = false) => {
  const users = await DB.select("*").from("users");
  let count = 0;
  for (let user of users) {
    if (user.data.library) {
      if (user.data?.library[0]?.children?.length) {
        let library = user.data.library[0].children;

        let libraryCids = {};

        let libraryIds = library.map((file) => file.id.replace("data-", ""));
        let conflicts = await DB.select("id").from("files").whereIn("id", libraryIds);
        conflicts = conflicts.map((res) => res.id);

        let newFiles = [];
        for (let file of library) {
          let cid;
          if (file.cid) {
            cid = file.cid;
          } else if (file.ipfs.includes("/ipfs/")) {
            cid = Strings.getCIDFromIPFS(file.ipfs);
          } else {
            cid = file.ipfs;
          }
          if (!cid) {
            Logging.log("file does not have cid or ipfs");
            Logging.log(file);
            return;
          }
          let id = file.id.replace("data-", "");

          if (id.length !== 36) {
            continue;
          }

          //NOTE(martina): to make sure there are no duplicate cids in the user's files
          if (libraryCids[cid]) {
            Logging.log(`skipped duplicate cid ${cid} in user ${user.username} files`);
            continue;
          }
          libraryCids[cid] = true;

          //NOTE(martina): to make sure there are no files in the user or in other users that have the same id (due to save copy). If so, change the id
          const hasConflict = conflicts.includes(id);
          conflicts.push(id);
          if (hasConflict) {
            Logging.log(`changing id for saved copy ${id} in ${user.username} files`);
            id = uuid();
          }

          let newFile = {
            id,
            ownerId: user.id,
            cid,
            isPublic: file.public,
            createdAt: file.date,
            filename: file.file ? file.file.substring(0, 255) : "",
            data: {
              name: file.name ? file.name.substring(0, 255) : "",
              blurhash: file.blurhash,
              size: file.size,
              type: file.type,
              tags: file.tags, //daniel is working on this, so keep it here
              link: file.link, //chris is working on this, so keep it here
            },
          };
          if (file.unityGameConfig || file.unityGameLoader) {
            newFile.data.unity = {
              config: file.unityGameConfig,
              loader: file.unityGameLoader,
            };
          }
          if (file.coverImage) {
            let coverImage = file.coverImage;
            let newCoverImage = {
              id: coverImage.id,
              cid: coverImage.cid,
              createdAt: coverImage.date,
              filename: coverImage.file,
              data: {
                name: coverImage.name,
                blurhash: coverImage.blurhash,
                size: coverImage.size,
                type: coverImage.type,
              },
            };
            newFile.data.coverImage = newCoverImage;
          }
          newFiles.push(newFile);
        }
        if (testing) {
          // Logging.log(newFiles);
        } else {
          await DB.insert(newFiles).into("files");
        }
        // if (testing) {
        //   if (count >= 10) {
        //     return;
        //   }
        // }
      }
    }
    if (count % 100 === 0) {
      Logging.log(`${count} users done`);
    }
    count += 1;
  }
  Logging.log("finished migrating users table");
};

const migrateSlatesTable = async (testing = false) => {
  const slates = await DB.select("*").from("slates").offset(3000);
  let count = 0;
  for (let slate of slates) {
    if (!slate.data.ownerId) {
      Logging.log({ slateMissingOwnerId: slate });
      continue;
    }
    if (slate.data.objects) {
      let objects = [];
      let slateCids = {};

      let fileIds = slate.data.objects
        .filter((file) => file.id)
        .map((file) => file.id.replace("data-", ""));
      let matchingFiles = await DB.select("*").from("files").whereIn("id", fileIds);

      for (let file of slate.data.objects) {
        if (!file.url || !file.ownerId || !file.id) {
          if (!file.ownerId) {
            Logging.log({ fileMissingOwnerId: file });
          }
          continue;
        }
        let cid = Strings.urlToCid(file.url);

        //NOTE(martina): make sure there are no duplicated cids in a slate
        if (slateCids[cid]) {
          Logging.log(`found duplicate file cid ${cid} in slate`);
          continue;
        }
        slateCids[cid] = true;

        const fileId = file.id.replace("data-", "");
        let matchingFile = matchingFiles.find((item) => item.id === fileId);

        if (!matchingFile) {
          matchingFile = await DB.select("*")
            .from("files")
            .where({ cid: cid, ownerId: file.ownerId })
            .first();
        }

        if (!matchingFile) {
          continue;
        }

        if (
          slate.data.ownerId === file.ownerId &&
          (file.name !== file.title ||
            !Strings.isEmpty(file.body) ||
            !Strings.isEmpty(file.source) ||
            !Strings.isEmpty(file.author))
        ) {
          if (!matchingFile.data) {
            Logging.log("Matching file did not have data");
            continue;
          }

          if (!testing) {
            await DB.from("files")
              .where({ cid: cid, ownerId: slate.data.ownerId })
              .update({
                data: {
                  ...matchingFile.data,
                  name: file.title ? file.title.substring(0, 255) : "",
                  body: file.body,
                  source: file.source,
                  author: file.author,
                },
              });
          } else {
            Logging.log({
              data: {
                ...matchingFile.data,
                name: file.title ? file.title.substring(0, 255) : "",
                body: file.body,
                source: file.source,
                author: file.author,
              },
            });
          }
        }
        let existingSlateFile = await DB.select("*")
          .from("slate_files")
          .where({ fileId: matchingFile.id, slateId: slate.id })
          .first();
        if (!existingSlateFile) {
          objects.push({ fileId: matchingFile.id, slateId: slate.id });
        }
      }
      if (!testing) {
        if (objects.length) {
          await DB.insert(objects).into("slate_files");
        }
      }
      if (count % 100 === 0) {
        Logging.log(`${count} slates done`);
      }
      // if (testing) {
      //   if (count >= 50) {
      //     return;
      //   }
      //   Logging.log(objects);
      // }
      count += 1;
    }
  }
  Logging.log("finished migrating slates table");
};

//make a function that double checks correctness: finds any duplicate fileId, ownerId in files. and any duplicate fileid slateid in slate_files

/*
    "CREATE_SLATE" - owner, slate
    "CREATE_SLATE_OBJECT" - owner, slate, file
    "CREATE_USER" - owner
    "USER_DEAL" - owner
    "SUBSCRIBE_USER" - owner, user
    "SUBSCRIBE_SLATE" - owner, slate
*/
const migrateActivityTable = async (testing = false) => {
  const query = await DB.select("*").from("old_activity");
  const activity = JSON.parse(JSON.stringify(query));
  let count = 0;
  for (let event of activity) {
    let type = event.data.type;
    if (type !== "CREATE_SLATE_OBJECT") {
      continue;
    }
    const id = event.id;
    const createdAt = event.created_at;
    let ownerId = event.data.actorUserId;
    let userId, slateId, fileId;

    slateId = event.data.context?.slate?.id;
    fileId = event.data.context?.file?.id;
    if (!slateId || !fileId) {
      // Logging.log(event.data);
      continue;
    }
    fileId = fileId.replace("data-", "");

    if (!testing) {
      try {
        await DB.insert({
          id,
          ownerId,
          userId,
          slateId,
          fileId,
          type,
          createdAt,
        }).into("activity");
      } catch (e) {
        Logging.log(e);
      }
    }

    if (testing) {
      Logging.log({
        id,
        ownerId,
        userId,
        slateId,
        fileId,
        type,
        createdAt,
      });
      if (count === 10) {
        return;
      }
      count += 1;
    }
  }
  Logging.log("finished migrating activity table");
};

// MARK: - adding new fields and reformatting

const modifySlatesTable = async (testing = false) => {
  const slates = await DB.select("*").from("slates");
  for (let slate of slates) {
    const id = slate.id;
    const ownerId = slate.data.ownerId;
    if (!ownerId) {
      Logging.log(slate);
      continue;
    }
    if (!testing) {
      await DB.from("slates").where("id", id).update({ ownerId, isPublic: slate.data.public });
    }
  }
  Logging.log("finished modify slates table");
};

const modifyUsersTable = async (testing = false) => {
  const users = await DB.select("*").from("users");
  let count = 0;
  for (let user of users) {
    const id = user.id;
    let data = {
      photo: user.data.photo,
      body: user.data.body,
      name: user.data.name,
      tokens: user.data.tokens,
      settings: {
        allow_automatic_data_storage: user.data.allow_automatic_data_storage,
        allow_encrypted_data_storage: user.data.allow_encrypted_data_storage,
        allow_filecoin_directory_listing: user.data.allow_filecoin_directory_listing,
        settings_deals_auto_approve: user.data.settings_deals_auto_approve,
      },
      onboarding: user.data.onboarding,
      status: user.data.status,
    };
    if (testing) {
      if (count === 10) {
        return;
      }
      Logging.log(data);
    } else {
      await Data.updateUserById({ id, data });
    }
  }
  Logging.log("finished modify users table");
};

// MARK: - deleting original data source

const cleanUsersTable = async () => {
  const users = await DB.select("*").from("users");
  for (let user of users) {
    const id = user.id;
    let data = {
      photo: user.data.photo,
      body: user.data.body,
      name: user.data.name,
      tokens: user.data.tokens,
      settings: user.data.settings,
      onboarding: user.data.onboarding,
      status: user.data.status,
    };
    // Logging.log(data);
    await DB.from("users").where("id", id).update({ data });
  }
};

const cleanSlatesTable = async () => {
  const slates = await DB.select("*").from("slates");
  for (let slate of slates) {
    let data = {
      body: slate.data.body,
      name: slate.data.name,
      preview: slate.data.preview,
      tags: slate.data.tags,
    };

    const { id } = slate;
    await DB.from("slates").where("id", id).update({ data });
  }
};

const dropOldTables = async () => {
  await Promise.all([
    DB.schema.dropTable("old_activity"),
    DB.schema.dropTable("trusted"),
    DB.schema.dropTable("pending"),
  ]);
};

// MARK: - reset table

const wipeNewTables = async () => {
  let numDeleted = await DB("slate_files").del();
  Logging.log(`${numDeleted} deleted from slate_files`);
  numDeleted = await DB("activity").del();
  Logging.log(`${numDeleted} deleted from activity`);
  numDeleted = await DB("files").del();
  Logging.log(`${numDeleted} deleted from files`);
};

const runScript = async () => {
  //NOTE(martina): if need to reset
  // await wipeNewTables();

  //NOTE(martina): before starting, make sure you have all the parameters accounted for
  // await printUsersTable();
  // await printSlatesTable();

  //NOTE(martina): add tables
  // await addTables();

  //NOTE(martina): put data into new tables
  // await DB("slate_files").del();
  let testing = false;
  // await migrateUsersTable(testing);
  // await migrateSlatesTable(testing);
  // await migrateActivityTable(testing);

  //NOTE(martina): fill in new fields and reformat
  // await modifySlatesTable(testing);
  // await modifyUsersTable(testing);

  //NOTE(martina): once certain you don't need the data anymore, delete the original data
  // await cleanUsersTable();
  // await cleanSlatesTable();
  await dropOldTables();

  Logging.log("Finished running. Hit CTRL + C to quit");
};

runScript();
