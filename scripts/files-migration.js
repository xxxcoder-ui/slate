import configs from "~/knexfile";
import knex from "knex";
import { v4 as uuid } from "uuid";

import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as Constants from "~/common/constants";

const envConfig = configs["development"];

const DB = knex(envConfig);

console.log(`RUNNING:  files-migration.js`);

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
    if (user.data?.library[0]?.children?.length) {
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
  console.log(Object.keys(dataParams));
  console.log(Object.keys(fileParams));
  console.log(Object.keys(coverParams));
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
  console.log(Object.keys(dataParams));
  console.log(Object.keys(fileParams));
  console.log(Object.keys(coverParams));
};

// MARK: - add/modify tables

const addTables = async () => {
  await DB.schema.table("deals", function (table) {
    table.renameColumn("owner_user_id", "ownerId"); //replaced
    table.renameColumn("created_at", "createdAt");
    table.renameColumn("updated_at", "updatedAt"); //replaced
  });

  await DB.schema.table("keys", function (table) {
    table.renameColumn("owner_id", "ownerId"); //replaced
    table.renameColumn("created_at", "createdAt");
  });

  await DB.schema.table("stats", function (table) {
    table.renameColumn("created_at", "createdAt");
  });

  await DB.schema.table("orphans", function (table) {
    table.renameColumn("created_at", "createdAt");
  });

  await DB.schema.table("global", function (table) {
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

  await DB.schema.renameTable("activity", "old_activity");

  await DB.schema.createTable("activity", function (table) {
    table.uuid("id").primary().unique().notNullable().defaultTo(DB.raw("uuid_generate_v4()"));
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
    table.string("email").secondary().unique().nullable();
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

  console.log("finished adding tables");
};

// MARK: - populate new tables

//strip out the "data-" in the id so it can be a uuid
//if there's a file with that id already existing, this is probably a save copy instance. So give this one a new id
//when matching slate fiels to files, if you can't find it by id, match it by cid and ownerId. should only be one match.

const migrateUsersTable = async (testing = false) => {
  const users = await DB.select("*").from("users");
  let count = 0;
  for (let user of users) {
    if (user.data.library) {
      if (user.data?.library[0]?.children?.length) {
        let library = user.data.library[0].children;
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
            console.log("file does not have cid or ipfs");
            console.log(file);
            return;
          }
          let id = file.id.replace("data-", "");
          let duplicates = await DB.select("*").from("files").where({ cid: cid, ownerId: user.id });
          if (duplicates.length) {
            console.log(duplicates);
            console.log(`skipped duplicate cid ${cid} in user ${user.id} ${user.username} files`);
            continue;
          }
          let conflicts = await DB.select("*").from("files").where("id", id);
          if (conflicts.length) {
            console.log(conflicts);
            console.log(`found conflicting id ${id} from saved copy in ${user.username} files`);
            id = uuid();
          }
          let newFile = {
            id,
            ownerId: user.id,
            cid,
            isPublic: file.public,
            createdAt: file.date,
            filename: file.file,
            data: {
              name: file.name,
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
          if (testing) {
            console.log(newFile);
          }

          await DB.insert(newFile).into("files");
        }
        if (testing) {
          if (count >= 10) {
            return;
          }
        }
      }
    }
    count += 1;
  }
  console.log("finished migrating users table");
};

const migrateSlatesTable = async (testing = false) => {
  const slates = await DB.select("*").from("slates");
  let count = 0;
  for (let slate of slates) {
    let objects = [];
    if (slate.data.objects) {
      for (let file of slate.data.objects) {
        let fileId = file.id.replace("data-", "");
        let cid = Strings.urlToCid(file.url);
        //NOTE(martina): skip duplicates of the same cid in a slate
        let matches = await DB.select("id").from("files").where({ id: fileId });
        if (matches.length !== 1) {
          //NOTE(martina): means that the id was changed b/c there was a saved copy somewhere, so we need to get that new id
          matches = await DB.select("*").from("files").where({ cid: cid, ownerId: file.ownerId });
          if (matches.length === 1) {
            //NOTE(martina): repairing the file id in the event it was changed in migrateUsersTable because it was a save copy and needed a unique id or b/c was a duplicate file and consolidated
            console.log(
              `repaired id for save copy for cid ${cid} in user ${file.ownerId} files in slate ${slate.id} ${slate.slatename}`
            );
            fileId = matches.pop().id;
          } else {
            console.log(
              `something went wrong repairing save copy id. there were ${matches.length} matching files with cid ${cid} and ownerId ${file.ownerId}`
            );
            console.log(matches);
            continue;
          }
        }
        //NOTE(martina): if you have the same cid file in data with different ids, just checking slateId and fileId match won't find it
        //this happens if it was duplicated in data (so has diff ids), then both added to the same slate
        //this function will catch same cid but diff id
        let duplicates = await DB.select("*")
          .from("slate_files")
          .join("files", "files.id", "=", "slate_files.fileId")
          .where({ "files.cid": cid, "slate_files.slateId": slate.id })
          .orWhere({ fileId: fileId, slateId: slate.id });
        if (duplicates.length) {
          console.log(`found duplicate file id ${fileId} in slate`);
          continue;
        }
        if (
          slate.data.ownerId === file.ownerId &&
          (file.name !== file.title ||
            !Strings.isEmpty(file.body) ||
            !Strings.isEmpty(file.source) ||
            !Strings.isEmpty(file.author))
        ) {
          let query = await DB.from("files").where("id", fileId).select("data");

          if (!query.length) {
            console.log("Could not find matching file for file in slate");
            continue;
          }
          let matchingFile = query[0];

          if (!matchingFile.data) {
            console.log("Matching file did not have data");
            continue;
          }

          if (!testing) {
            await DB.from("files")
              .where("id", fileId)
              .update({
                data: {
                  ...matchingFile.data,
                  name: file.title,
                  body: file.body,
                  source: file.source,
                  author: file.author,
                },
              });
          }
        }
        if (testing) {
          objects.push({ fileId: fileId, slateId: slate.id });
        } else {
          await DB.insert({ fileId: fileId, slateId: slate.id }).into("slate_files");
        }
      }
    }
    // if (testing) {
    //   if (count >= 10) {
    //     return;
    //   }
    //   console.log(objects);
    //   count += 1;
    // }
  }
  console.log("finished migrating slates table");
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
  let acceptedTypes = [
    "CREATE_SLATE",
    "CREATE_SLATE_OBJECT",
    // "CREATE_USER",
    // "USER_DEAL",
    // "SUBSCRIBE_USER",
    // "SUBSCRIBE_SLATE",
  ];
  const query = await DB.select("*").from("old_activity");
  const activity = JSON.parse(JSON.stringify(query));
  let count = 0;
  for (let event of activity) {
    let type = event.data.type;
    if (!acceptedTypes.includes(type)) {
      continue;
    }
    const id = event.id;
    const createdAt = event.created_at;
    let ownerId = event.data.actorUserId;
    let userId, slateId, fileId;
    if (type === "CREATE_SLATE") {
      slateId = event.data.context?.slate?.id;
      if (!slateId) {
        // console.log(event.data);
        continue;
      }
    } else if (type === "CREATE_SLATE_OBJECT") {
      slateId = event.data.context?.slate?.id;
      fileId = event.data.context?.file?.id;
      if (!slateId || !fileId) {
        // console.log(event.data);
        continue;
      }
      fileId = fileId.replace("data-", "");
    }
    // else if (type === "SUBSCRIBE_USER") {
    //   userId = event.data.context?.targetUserId;
    //   if (!userId) {
    //     // console.log(event.data);
    //     continue;
    //   }
    // } else if (type === "SUBSCRIBE_SLATE") {
    //   slateId = event.data.context?.slateId;
    //   if (!slateId) {
    //     // console.log(event.data);
    //     continue;
    //   }
    // }
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
        console.log(e);
      }
    }

    if (testing) {
      if (count === 10) {
        return;
      }
      count += 1;
    }
  }
  console.log("finished migrating activity table");
};

// MARK: - adding new fields and reformatting

const modifySlatesTable = async (testing = false) => {
  const slates = await DB.select("*").from("slates");
  for (let slate of slates) {
    const id = slate.id;
    const ownerId = slate.data.ownerId;
    if (!ownerId) {
      console.log(slate);
      continue;
    }
    if (!testing) {
      await DB.from("slates").where("id", id).update({ ownerId, isPublic: slate.data.public });
    }
  }
  console.log("finished modify slates table");
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
      console.log(data);
    } else {
      await Data.updateUserById({ id, data });
    }
  }
  console.log("finished modify users table");
};

// MARK: - deleting original data source

const cleanUsersTable = async () => {
  const users = await DB.select("*").from("users");
  for (let user of users) {
    const id = user.id;
    let data = user.data;
    delete user.data.library;
    let response = await Data.updateUserById({ id, data });
  }
};

const cleanSlatesTable = async () => {
  const slates = await DB.select("*").from("slates");
  for (let slate of slates) {
    const id = slate.id;
    let data = slate.data;
    delete data.ownerId;
    let layouts = slate.data.layouts;
    if (layouts.ver === "2.0") {
      for (let position of layouts.layout) {
        position.id = position.id.replace("data-", "");
      }
    }
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
  console.log(`${numDeleted} deleted from slate_files`);
  numDeleted = await DB("activity").del();
  console.log(`${numDeleted} deleted from activity`);
  numDeleted = await DB("files").del();
  console.log(`${numDeleted} deleted from files`);
};

const runScript = async () => {
  //NOTE(martina): if need to reset
  // await wipeNewTables();

  //NOTE(martina): before starting, make sure you have all the parameters accounted for
  //   await printUsersTable()
  //   await printSlatesTable()

  //NOTE(martina): add tables
  await addTables();

  //NOTE(martina): put data into new tables
  let testing = false;
  // await migrateUsersTable(testing);
  // await migrateSlatesTable(testing);
  // await migrateActivityTable(testing);

  //NOTE(martina): fill in new fields and reformat
  //   await modifySlatesTable(testing);
  //   await modifyUsersTable(testing);

  //NOTE(martina): once certain you don't need the data anymore, delete the original data
  // await cleanUsersTable()
  // await cleanSlatesTable()
  // await dropOldTables()
};

runScript();
