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

/* Check which properties exist */

const printUsersTable = async () => {
  const users = await DB.select("*").from("users");
  let dataParams = {};
  let twitterParams = {};
  let statusParams = {};
  let onboardingParams = {};
  let settingsParams = {};
  let tokensParams = {};
  for (let user of users) {
    for (let param of Object.keys(user.data)) {
      if (!dataParams[param]) {
        dataParams[param] = true;
      }
    }
    if (user.data.twitter) {
      for (let param of Object.keys(user.data.twitter)) {
        if (!twitterParams[param]) {
          twitterParams[param] = true;
        }
      }
    }
    if (user.data.status) {
      for (let param of Object.keys(user.data.status)) {
        if (!statusParams[param]) {
          statusParams[param] = true;
        }
      }
    }
    if (user.data.onboarding) {
      for (let param of Object.keys(user.data.onboarding)) {
        if (!onboardingParams[param]) {
          onboardingParams[param] = true;
        }
      }
    }
    if (user.data.settings) {
      for (let param of Object.keys(user.data.settings)) {
        if (!settingsParams[param]) {
          settingsParams[param] = true;
        }
      }
    }
    if (user.data.tokens) {
      for (let param of Object.keys(user.data.tokens)) {
        if (!tokensParams[param]) {
          tokensParams[param] = true;
        }
      }
    }
  }
  Logging.log({ dataParams: Object.keys(dataParams) });
  Logging.log({ twitterParams: Object.keys(twitterParams) });
  Logging.log({ statusParams: Object.keys(statusParams) });
  Logging.log({ onboardingParams: Object.keys(onboardingParams) });
  Logging.log({ settingsParams: Object.keys(settingsParams) });
  Logging.log({ tokensParams: Object.keys(tokensParams) });
};

const printSlatesTable = async () => {
  const slates = await DB.select("*").from("slates");
  let dataParams = {};
  for (let slate of slates) {
    for (let param of Object.keys(slate.data)) {
      if (!dataParams[param]) {
        dataParams[param] = true;
      }
    }
  }
  Logging.log({ dataParams: Object.keys(dataParams) });
};

const printFilesTable = async () => {
  const files = await DB.select("*").from("files");
  let dataParams = {};
  let linkParams = {};
  for (let file of files) {
    for (let param of Object.keys(file.data)) {
      if (!dataParams[param]) {
        dataParams[param] = true;
      }
    }
    if (file.data.link) {
      for (let param of Object.keys(file.data.link)) {
        if (!linkParams[param]) {
          linkParams[param] = true;
        }
      }
    }
  }
  Logging.log({ dataParams: Object.keys(dataParams) });
  Logging.log({ linkParams: Object.keys(linkParams) });
};

/* Add columns (including tags) */

const createSurveysTable = async () => {
  await DB.schema.createTable("surveys", function (table) {
    table.uuid("id").primary().unique().notNullable().defaultTo(DB.raw("uuid_generate_v4()"));
    table.uuid("ownerId").references("id").inTable("users");

    // What do you currently use for saving things on the web?
    table.boolean("prevToolsBrowserBookmarks").defaultTo(false);
    table.boolean("prevToolsPinterest").defaultTo(false);
    table.boolean("prevToolsArena").defaultTo(false);
    table.boolean("prevToolsNotesPlatform").defaultTo(false);
    table.string("prevToolsOther").defaultTo(null);

    // What are you interested in using Slate for?
    table.boolean("useCasesBookmarkingImportantPages").defaultTo(false);
    table.boolean("useCasesSavingLinksToReadLater").defaultTo(false);
    table.boolean("useCasesSearchingYourBrowsedPages").defaultTo(false);
    table.boolean("useCasesSharingCollectionsOfLinks").defaultTo(false);
    table.string("useCasesOther").defaultTo(null);

    // How did you find out about Slate?
    table.boolean("referralFriend").defaultTo(false);
    table.boolean("referralTwitter").defaultTo(false);
    table.boolean("referralIpfsFilecoinCommunity").defaultTo(false);
    table.string("referralOther").defaultTo(null);
  });
};

const addUserTextileColumns = async () => {
  await DB.schema.table("users", function (table) {
    table.string("textileKey").nullable();
    table.string("textileToken", 400).nullable();
    table.string("textileThreadID").nullable();
    table.string("textileBucketCID").nullable();
  });
};

const addUserColumns = async () => {
  await DB.schema.table("users", function (table) {
    table.string("body", 2000).nullable();
    table.string("photo").nullable();
    table.string("name").nullable();
    table.string("twitterUsername").nullable();
    table.boolean("twitterVerified").notNullable().defaultTo(false);
    table.boolean("hasCompletedSurvey").defaultTo(false);
    table.boolean("hasCompletedUploadOnboarding").defaultTo(false);
    table.boolean("hasCompletedSlatesOnboarding").defaultTo(false);
    table.boolean("isFilterSidebarCollapsed").defaultTo(false);
  });
};

const addSlateColumns = async () => {
  await DB.schema.table("slates", function (table) {
    table.string("body", 2000).nullable();
    table.string("name").nullable();
    table.jsonb("coverImage").nullable();
  });
};

//apply this to all other databases as well
const alterFileColumns = async () => {
  await DB.schema.alterTable("files", function (table) {
    table.string("linkImage", 2000).nullable().alter();
    table.string("url", 2000).nullable().alter();
    table.string("linkFavicon", 2000).nullable().alter();
  });
};

const addFileColumns = async () => {
  await DB.schema.table("files", function (table) {
    table.renameColumn("data", "oldData");
  });
  await DB.schema.table("files", function (table) {
    table.string("name").nullable();
    table.integer("size").notNullable().defaultTo(0);
    table.string("type").notNullable().defaultTo("link");
    table.string("blurhash").nullable();
    table.string("body", 2000).nullable();
    table.jsonb("coverImage").nullable();
    table.jsonb("data").nullable(); //where you'll move unity stuff
    table.string("linkName").nullable();
    table.string("linkBody", 2000).nullable();
    table.string("linkAuthor").nullable();
    table.string("linkSource").nullable();
    table.string("linkDomain").nullable();
    table.string("linkImage", 2000).nullable();
    table.string("linkFavicon", 2000).nullable();
    table.text("linkHtml").nullable();
    table.boolean("linkIFrameAllowed").nullable().defaultTo(false);
    table.jsonb("tags").nullable();
  });
};

/* Migrate over to new columns (and denormalize tags) */

const defaultPhotos = [
  "https://slate.host/static/a1.jpg",
  "https://slate.textile.io/ipfs/bafkreigjofaa2wvmcoi5vbe3h32cbqh35d35wdhodfxwgmfky3gcur6s5i",
  "https://slate.textile.io/ipfs/bafkreiaycwt6m3jabhetfqnsb63z2lx65vzepp5ejk2b56vxypwxiet6c4",
  "https://slate.textile.io/ipfs/bafkreifvdvygknj66bfqdximxmxobqelwhd3xejiq3vfplhzkopcfdetrq",
  "https://slate.textile.io/ipfs/bafkreihm3srxvhfppm2dvldw224v4m3prcc3b6pwe3rtuxpsu6wwjpgzpa",
  "https://slate.textile.io/ipfs/bafkreiardkkfxj3ip373ee2tf6ffivjqclq7ionemt6pw55e6hv7ws5pvu",
  "https://slate.textile.io/ipfs/bafkreick3nscgixwfpq736forz7kzxvvhuej6kszevpsgmcubyhsx2pf7i",
  "https://slate.textile.io/ipfs/bafkreibf3hoiyuk2ywjyoy24ywaaclo4k5rz53flesvr5h4qjlyzxamozm",
];

const defaultBody = ["A user of Slate.", "", "A slate."];

const migrateUserTable = async () => {
  const users = await DB.select("id", "data").from("users");
  let count = 0;
  for (let user of users) {
    if (count % 1000 === 0) {
      console.log(count);
    }
    count += 1;
    let data = user.data;
    let newUser = {
      name: data.name,
      body: data.body.slice(0, 2000),
      photo: data.photo,
      textileKey: data.tokens?.api,
      twitterUsername: data.twitter?.username,
      twitterVerified: data.twitter?.verified,
    };

    if (defaultPhotos.includes(data.photo)) {
      // console.log(`replaced default photo ${data.photo} with null`);
      newUser.photo = null;
    }
    if (defaultBody.includes(data.body)) {
      // console.log(`replaced default body with null`);
      newUser.body = null;
    }
    // console.log({ data });
    // console.log({ id: user.id, newUser });
    const response = await DB.from("users").where("id", user.id).update(newUser).returning("*");
    // console.log({ response });
  }
};

const deleteEmptySlates = async () => {
  let emptySlates = await DB("slates")
    .select("id")
    .whereNotExists(function () {
      this.select("id").from("slate_files").whereRaw('"slate_files"."slateId" = "slates"."id"');
    });
  for (let slate of emptySlates) {
    await Data.deleteSlateById(slate);
  }
};

const migrateSlateTable = async () => {
  const slateFiles = () =>
    DB.raw("coalesce(json_agg(?? order by ?? asc) filter (where ?? is not null), '[]') as ??", [
      "files",
      "slate_files.createdAt",
      "files.id",
      "objects",
    ]);

  const slates = await DB.select("slates.id", "slates.data", slateFiles())
    .from("slates")
    .leftJoin("slate_files", "slate_files.slateId", "=", "slates.id")
    .leftJoin("files", "slate_files.fileId", "=", "files.id")
    .groupBy("slates.id");

  for (let slate of slates) {
    let coverImage = Utilities.selectSlateCoverImage(slate.objects);

    let data = slate.data;
    let newSlate = {
      name: data.name,
      body: data.body ? data.body.slice(0, 2000) : null,
      coverImage,
    };

    if (defaultBody.includes(data.body)) {
      // console.log(`replaced default body with null`);
      newSlate.body = null;
    }

    // console.log({ data });
    // console.log({ newSlate });
    const response = await DB.from("slates").where("id", slate.id).update(newSlate);
  }
};

const migrateFileTable = async () => {
  const files = await DB.select("id", "oldData").from("files").where({ size: 0 });
  let count = 0;
  for (let file of files) {
    console.log(count);
    count += 1;
    let data = file.oldData;
    if (!data) {
      console.log(`no data for file with id ${file.id}`);
      continue;
    }

    let newFile = {
      name: data.name ? data.name.slice(0, 255) : null,
      body: data.body ? data.body.slice(0, 2000) : null,
      size: Math.min(data.size, 2147483647),
      type: data.type,
      blurhash: !data.blurhash || data.blurhash.length > 40 ? null : data.blurhash,
      linkName: data.link?.name ? data.link?.name.slice(0, 255) : null,
      linkBody: data.link?.body ? data.link?.body.slice(0, 2000) : null,
      linkAuthor: data.link?.author ? data.link?.author.slice(0, 255) : null,
      linkSource: data.link?.source ? data.link?.source.slice(0, 255) : null,
      linkDomain: data.link?.domain,
      linkImage: !data.link?.image || data.link?.image.length > 2000 ? null : data.link?.image,
      linkFavicon: !data.link?.logo || data.link?.logo.length > 2000 ? null : data.link?.logo,
      linkHtml: data.link?.html,
      linkIFrameAllowed: data.link?.iFrameAllowed,
    };

    if (data.unity) {
      newFile.data = { unity: data.unity };
    }
    // if (newFile.data) {
    //   console.log({ unity: newFile.data.unity });
    // }

    let coverImage = data.coverImage;
    if (coverImage) {
      // console.log({ coverImage });
      let newCoverImage = {
        ...coverImage.data,
        ...coverImage,
      };
      delete newCoverImage.data;
      newFile.coverImage = newCoverImage;
      // console.log({ newCoverImage });
    }

    // let tags = await DB.select("slates.id", "slates.slatename", "slates.name")
    //   .from("slates")
    //   .join("slate_files", "slate_files.slateId", "=", "slates.id")
    //   .where("slate_files.fileId", file.id);

    let tags = await DB.select("id", "slatename", "name")
      .from("slates")
      .whereExists(function () {
        this.select("id")
          .from("slate_files")
          .whereRaw('"slate_files"."slateId" = "slates"."id"')
          .where({ "slate_files.fileId": file.id });
      });

    if (tags?.length) {
      newFile.tags = JSON.stringify(tags);
    }

    // console.log({ newFile });
    const response = await DB.from("files").where("id", file.id).update(newFile).returning("*");
    console.log(response);
  }
};

/* Delete the old data */

const deleteOldData = async () => {
  await DB.schema.table("users", function (table) {
    table.dropColumn("data");
  });
  await DB.schema.table("slates", function (table) {
    table.dropColumn("data");
  });
  await DB.schema.table("files", function (table) {
    table.dropColumn("oldData");
  });
};

const runScript = async () => {
  // await printUsersTable();
  // await printSlatesTable();
  // await printFilesTable();

  // await createSurveysTable();
  // await addUserTextileColumns();
  // await addUserColumns();
  // await addSlateColumns();
  // await addFileColumns();

  // await alterFileColumns();
  await migrateUserTable();
  // await deleteEmptySlates();
  // await migrateSlateTable();
  // await migrateFileTable();

  // await deleteOldData();
  console.log("SCRIPT FINISHED. HIT CTRL + C TO END");
};

runScript();

/*
Users
[
    'data.name', -> 'name' MIGRATED
    'data.body', -> 'body' MIGRATED
    'data.photo', -> 'photo' MIGRATED
    'data.status', -> 'onboarding.hidePrivacyAlert' MIGRATED
    'data.tokens.api', -> 'textileKey' MIGRATED
    'data.onboarding', -> 'onboarding' MIGRATED
    'data.twitter.username', -> 'twitterUsername' MIGRATED
    'data.twitter.verified', -> 'twitterVerified' MIGRATED
]

Slates
[ 
    'data.name', -> 'name' MIGRATED
    'data.body', -> 'body' MIGRATED
    'data.preview', -> 'coverImage' MIGRATED
]

Files
[
    'data.name', -> 'name' MIGRATED
    'data.size', -> 'size' MIGRATED
    'data.type', -> 'type' MIGRATED
    'data.blurhash', -> 'blurhash' MIGRATED
    'data.body', -> 'body' MIGRATED
    'data.coverImage', -> 'coverImage' MIGRATED
    'data.unity', -> 'data.unity' MIGRATED
    'data.link.name', -> 'linkName' MIGRATED
    'data.link.body', -> 'linkBody' MIGRATED
    'data.link.author', -> 'linkAuthor' MIGRATED
    'data.link.source', -> 'linkSource' MIGRATED
    'data.link.domain', -> 'linkDomain' MIGRATED
    'data.link.image', -> 'linkImage' MIGRATED
    'data.link.logo', -> 'linkFavicon' MIGRATED
    'data.link.html', -> 'linkHtml' MIGRATED
    'data.link.iFrameAllowed', -> 'linkIFrameAllowed' MIGRATED
    ADD 'tags'
]
*/
