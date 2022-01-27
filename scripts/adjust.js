import * as Logging from "~/common/logging";

import configs from "~/knexfile";
import knex from "knex";

const envConfig = configs["development"];

Logging.log(`SETUP: database`, envConfig);

const db = knex(envConfig);

Logging.log(`RUNNING:  adjust.js`);

const dropColumnIfExists = async (tableName, columnName) => {
  const hasColumn = await db.schema.hasColumn(tableName, columnName);
  if (hasColumn) {
    return db.schema.alterTable(tableName, (table) => {
      table.dropColumn(columnName);
    });
  }
};

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

const dropOnboardingColumn = db.schema.table("users", function (table) {
  table.dropColumn("onboarding");
});

const createSurveysTable = async () => {
  const exists = await db.schema.hasTable("surveys");
  if (exists) {
    return Promise.all([
      dropColumnIfExists("surveys", "prevToolsDropbox"),
      dropColumnIfExists("surveys", "prevToolsGoogleDrive"),
      dropColumnIfExists("surveys", "useCasesPersonalStorage"),
      dropColumnIfExists("surveys", "useCasesPublicFileSharing"),
      dropColumnIfExists("surveys", "useCasesArchiving"),
      dropColumnIfExists("surveys", "useCasesBookmarking"),
      dropColumnIfExists("surveys", "useCasesMoodboarding"),
      db.schema.alterTable("surveys", (table) => {
        table.boolean("prevToolsNotesPlatform").defaultTo(false);

        table.boolean("useCasesBookmarkingImportantPages").defaultTo(false);
        table.boolean("useCasesSavingLinksToReadLater").defaultTo(false);
        table.boolean("useCasesSearchingYourBrowsedPages").defaultTo(false);
        table.boolean("useCasesSharingCollectionsOfLinks").defaultTo(false);
      }),
    ]);
  }

  return db.schema.createTable("surveys", function (table) {
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
};

const dropOnboardingTable = db.schema.dropTableIfExists("onboarding");

const addOnboardingColumnsToUsersTable = db.schema.table("users", function (table) {
  table.boolean("hasCompletedSurvey").defaultTo(false);
  table.boolean("hasCompletedUploadOnboarding").defaultTo(false);
  table.boolean("hasCompletedSlatesOnboarding").defaultTo(false);
});

const deleteSettingsColumnFromUserTable = (async () => {
  const hasColumn = await db.schema.hasColumn("users", "settings");
  if (hasColumn) {
    return db.schema.alterTable("users", (table) => {
      table.dropColumn("settings");
    });
  }
})();

const addIsFilterSidebarCollapsedToUsersTable = db.schema.table("users", function (table) {
  table.boolean("isFilterSidebarCollapsed").defaultTo(false);
});

// Promise.all([
//   dropOnboardingTable,
//   createSurveysTable,
//   addOnboardingColumnsToUsersTable,
//   deleteSettingsColumnFromUserTable,
//   addIsFilterSidebarCollapsedToUsersTable,
// ]);

Promise.all([dropOnboardingColumn]);

Logging.log(`FINISHED: adjust.js`);
Logging.log(`          CTRL +C to return to terminal.`);
