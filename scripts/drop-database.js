import * as Logging from "~/common/logging";

import configs from "~/knexfile";
import knex from "knex";

const envConfig = configs["development"];

Logging.log(`SETUP: database`, envConfig);

const db = knex(envConfig);

Logging.log(`RUNNING:  drop-database.js`);

Promise.all([
  db.schema.dropTable("users"),
  db.schema.dropTable("slates"),
  db.schema.dropTable("slate_files"),
  db.schema.dropTable("files"),
  db.schema.dropTable("activity"),
  db.schema.dropTable("subscriptions"),
  db.schema.dropTable("keys"),
  db.schema.dropTable("global"),
  db.schema.dropTable("stats"),
  db.schema.dropTable("deals"),
  db.schema.dropTable("orphans"),
  db.schema.dropTable("usage"),
]);

Logging.log(`FINISHED: drop-database.js`);
Logging.log(`          CTRL +C to return to terminal.`);
