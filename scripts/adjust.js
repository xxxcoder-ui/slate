import * as Logging from "~/common/logging";

import configs from "~/knexfile";
import knex from "knex";

const envConfig = configs["development"];

Logging.log(`SETUP: database`, envConfig);

const db = knex(envConfig);

Logging.log(`RUNNING:  adjust.js`);

const editUsersTable1 = db.schema.table("users", function (table) {
  table.integer("authVersion").notNullable().defaultTo(1);
});

const editUsersTable2 = db.schema.table("users", function (table) {
  table.integer("authVersion").notNullable().defaultTo(2).alter();
  table.string("twitterId").unique().nullable();
});

const editFilesTable = db.schema.table("files", function (table) {
  table.jsonb("thumbnail").nullable();
});

const editVerificationTable = db.schema.table("verifications", function (table) {
  table.string("username").nullable();
  table
    .enu("type", [
      "email_verification",
      "email_twitter_verification",
      "password_reset",
      "user_migration",
    ])
    .defaultTo("email_verification");
  table.boolean("passwordChanged").nullable();
});

const editTwitterTokenTable = db.schema.table("twitterTokens", function (table) {
  table.string("token").primary().unique().notNullable();
  table.string("tokenSecret").notNullable();
  table.string("email").nullable();
  table.string("id_str").nullable();
  table.string("screen_name").nullable();
  table.string("verified").nullable();
});

Promise.all([editFilesTable]);
//Promise.all([editVerificationTable]);
// Promise.all([editUsersTable1]);
// Promise.all([editUsersTable2, editVerificationTable, editTwitterTokenTable]);

Logging.log(`FINISHED: adjust.js`);
Logging.log(`          CTRL +C to return to terminal.`);
