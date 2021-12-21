import * as Logging from "~/common/logging";

import configs from "~/knexfile";
import knex from "knex";

const envConfig = configs["development"];

Logging.log(`SETUP: database`, envConfig);

const db = knex(envConfig);

Logging.log(`RUNNING:  adjust.js`);

const renameDealsTable = db.schema.renameTable("deals", "old_deals");

const deleteGlobalTable = db.schema.dropTable("global");

const deleteStatsTable = db.schema.dropTable("stats");

const createDealsTable = db.schema.createTable("deals", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.string("textileBucketCID").notNullable();
  table.string("pinCID").notNullable();
  table.string("requestId").notNullable();
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
});

const deleteStorageDealSettings = db.schema.table("users", function (table) {
  table.dropColumns(
    "settingsDealsAutoApprove",
    "allowEncryptedDataStorage",
    "allowAutomaticDataStorage"
  );
});

const deleteSourceAndAuthor = db.schema.table("files", function (table) {
  table.dropColumns("source", "author");
});

const addSlateCoverImage = db.schema.table("slates", function (table) {
  table.dropColumns("preview");
  table.jsonb("coverImage").nullable();
});

const createSurveysTable = db.schema.table("surveys", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.uuid("ownerId").references("id").inTable("users");

  // What do you currently use for saving things on the web?
  table.boolean("prevToolsDropbox").defaultTo(false);
  table.boolean("prevToolsArena").defaultTo(false);
  table.boolean("prevToolsPinterest").defaultTo(false);
  table.boolean("prevToolsGoogleDrive").defaultTo(false);
  table.boolean("prevToolsBrowserBookmarks").defaultTo(false);
  table.string("prevToolsOther").defaultTo(null);

  // What are you interested in using Slate for?
  table.boolean("useCasesPersonalStorage").defaultTo(false);
  table.boolean("useCasesPublicFileSharing").defaultTo(false);
  table.boolean("useCasesArchiving").defaultTo(false);
  table.boolean("useCasesBookmarking").defaultTo(false);
  table.boolean("useCasesMoodboarding").defaultTo(false);
  table.string("useCasesOther").defaultTo(null);

  // How did you find out about Slate?
  table.boolean("referralFriend").defaultTo(false);
  table.boolean("referralTwitter").defaultTo(false);
  table.boolean("referralIpfsFilecoinCommunity").defaultTo(false);
  table.string("referralOther").defaultTo(null);
});

const dropOnboardingTable = db.schema.dropTableIfExists("onboarding");
const addOnboardingColumnsToUsersTable = db.schema.table("users", function (table) {
  table.boolean("hasCompletedSurvey").defaultTo(false);
  table.boolean("hasCompletedUploadOnboarding").defaultTo(false);
  table.boolean("hasCompletedSlatesOnboarding").defaultTo(false);
});

Promise.all([dropOnboardingTable, createSurveysTable, addOnboardingColumnsToUsersTable]);

Logging.log(`FINISHED: adjust.js`);
Logging.log(`          CTRL +C to return to terminal.`);
