import configs from "~/knexfile";
import knex from "knex";

import * as Logging from "~/common/logging";

const envConfig = configs["development"];

Logging.log(`SETUP: database`, envConfig);

const db = knex(envConfig);

Logging.log(`RUNNING:  seed-database.js`);

const createTableIfNotExists = async (tableName, callback) => {
  const exists = await db.schema.hasTable(tableName);
  if (exists) return;
  return db.schema.createTable(tableName, callback);
};

// --------------------------
// SCRIPTS
// --------------------------

//replace createdat, updatedat, ownerid, owneruserid

const createDealsTable = createTableIfNotExists("deals", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.string("textileBucketCID").notNullable();
  table.string("pinCID").notNullable();
  table.string("requestId").notNullable();
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
});

const createUsersTable = createTableIfNotExists("users", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.string("email").unique().nullable();
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
  table.timestamp("lastActive").notNullable().defaultTo(db.raw("now()"));
  table.string("username").unique().notNullable();
  table.string("password").nullable();
  table.string("salt").nullable();
  table.string("name").nullable();
  table.string("body", 2000).nullable();
  table.string("photo").nullable();
  table.string("twitterId").unique().nullable();
  table.string("twitterUsername").nullable();
  table.boolean("twitterVerified").notNullable().defaultTo(false);
  table.string("textileKey").nullable();
  table.string("textileToken", 400).nullable();
  table.string("textileThreadID").nullable();
  table.string("textileBucketCID").nullable();
  table.integer("followerCount").notNullable().defaultTo(0);
  table.integer("slateCount").notNullable().defaultTo(0);
  table.integer("authVersion").notNullable().defaultTo(2);
  table.boolean("hasCompletedSurvey").defaultTo(false);
  table.boolean("hasCompletedUploadOnboarding").defaultTo(false);
  table.boolean("hasCompletedSlatesOnboarding").defaultTo(false);
  table.boolean("isFilterSidebarCollapsed").defaultTo(false);
});

const createSlatesTable = createTableIfNotExists("slates", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.uuid("ownerId").references("id").inTable("users");
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
  table.timestamp("updatedAt").notNullable().defaultTo(db.raw("now()"));
  table.string("slatename").notNullable();
  table.string("body", 2000).nullable();
  table.string("name").nullable();
  table.jsonb("coverImage").nullable();
  table.boolean("isPublic").notNullable().defaultTo(false);
  table.integer("subscriberCount").notNullable().defaultTo(0);
  table.integer("fileCount").notNullable().defaultTo(0);
});

const createKeysTable = createTableIfNotExists("keys", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.string("key").unique().nullable();
  table.uuid("ownerId").notNullable();
  table.integer("level").defaultTo(0);
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
});

const createFilesTable = createTableIfNotExists("files", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.uuid("ownerId").references("id").inTable("users");
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
  table.string("cid").notNullable();
  table.string("filename").nullable();
  table.boolean("isPublic").notNullable().defaultTo(false);
  table.string("name").nullable();
  table.bigInteger("size").notNullable().defaultTo(0);
  table.string("type").notNullable().defaultTo("link");
  table.string("blurhash").nullable();
  table.string("body", 2000).nullable();
  table.jsonb("coverImage").nullable();
  table.jsonb("data").nullable();
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
  table.integer("downloadCount").notNullable().defaultTo(0);
  table.integer("saveCount").notNullable().defaultTo(0);
  table.string("url", 2000).nullable();
  table.boolean("isLink").notNullable().defaultTo(false);
});

const createSlateFilesTable = createTableIfNotExists("slate_files", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.uuid("fileId").references("id").inTable("files");
  table.uuid("slateId").references("id").inTable("slates");
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
});

const createSubscriptionsTable = createTableIfNotExists("subscriptions", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.uuid("ownerId").references("id").inTable("users");
  table.uuid("slateId").references("id").inTable("slates");
  table.uuid("userId").references("id").inTable("users");
  table.jsonb("data").nullable();
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
});

const createActivityTable = createTableIfNotExists("activity", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.uuid("ownerId").references("id").inTable("users");
  table.uuid("userId").references("id").inTable("users");
  table.uuid("slateId").references("id").inTable("slates");
  table.uuid("fileId").references("id").inTable("files");
  table.string("type");
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
  table.boolean("ignore").notNullable().defaultTo(false);
});

const createStatsTable = createTableIfNotExists("stats", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.jsonb("data").nullable();
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
});

const createOrphansTable = createTableIfNotExists("orphans", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.jsonb("data").nullable();
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
});

const createGlobalTable = createTableIfNotExists("global", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.jsonb("data").nullable();
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
});

const createUsageTable = createTableIfNotExists("usage", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.uuid("userId").references("id").inTable("users");
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
});
//NOTE(toast): making sid pkey and letting emails dupe allows for multiple keys per user,
//stops people from getting dos'd on verification
const createVerificationsTable = createTableIfNotExists("verifications", function (table) {
  table.uuid("sid").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.string("email").nullable();
  table.string("twitterToken").unique().nullable();
  table.string("pin", 6).unique().notNullable();
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
  table.boolean("isVerified").notNullable().defaultTo(false);
  table
    .enu("type", [
      "email_verification",
      "email_twitter_verification",
      "password_reset",
      "user_migration",
    ])
    .defaultTo("email_verification");
  table.string("username").nullable();
  table.boolean("passwordChanged").nullable();
});

const createTwitterTokensTable = createTableIfNotExists("twitterTokens", function (table) {
  table.string("token").primary().unique().notNullable();
  table.string("tokenSecret").notNullable();
  table.string("email").nullable();
  table.string("id_str").nullable();
  table.string("screen_name").nullable();
  table.string("verified").nullable();
});

const createSurveysTable = createTableIfNotExists("surveys", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
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

// --------------------------
// RUN
// --------------------------

Promise.all([
  createDealsTable,
  createUsersTable,
  createSlatesTable,
  createKeysTable,
  createFilesTable,
  createSlateFilesTable,
  createSubscriptionsTable,
  createActivityTable,
  createStatsTable,
  createOrphansTable,
  createVerificationsTable,
  createGlobalTable,
  createUsageTable,
  createTwitterTokensTable,
  createSurveysTable,
]);

Logging.log(`FINISHED: seed-database.js`);
Logging.log(`          CTRL +C to return to terminal.`);
