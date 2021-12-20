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

const addSettingsColumnToUsersTable = db.schema
  .table("users", (table) => {
    table.jsonb("settings").defaultTo("{}");
  })
  .then(() =>
    db("users").update(
      "settings",
      db.raw("jsonb_build_object('filecoin', users.data -> 'settings' )")
    )
  );

const dropOnboardingTable = db.schema.dropTableIfExists("onboarding");
const addOnboardingColumnsToUsersTable = db.schema.table("users", function (table) {
  table.boolean("hasCompletedSurvey").defaultTo(false);
  table.boolean("hasCompletedUploadOnboarding").defaultTo(false);
  table.boolean("hasCompletedSlatesOnboarding").defaultTo(false);
});

Promise.all([dropOnboardingTable, addSettingsColumnToUsersTable, addOnboardingColumnsToUsersTable]);

Logging.log(`FINISHED: adjust.js`);
Logging.log(`          CTRL +C to return to terminal.`);
