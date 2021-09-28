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
  table.string("cid").primary().unique().notNullable();
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
});

Promise.all([renameDealsTable]);

Logging.log(`FINISHED: adjust.js`);
Logging.log(`          CTRL +C to return to terminal.`);
