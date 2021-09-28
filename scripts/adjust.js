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

Promise.all([deleteStorageDealSettings]);

Logging.log(`FINISHED: adjust.js`);
Logging.log(`          CTRL +C to return to terminal.`);
