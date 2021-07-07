import * as Logging from "~/common/logging";

import configs from "~/knexfile";
import knex from "knex";

const envConfig = configs["development"];

Logging.log(`SETUP: database`, envConfig);

const db = knex(envConfig);

Logging.log(`RUNNING:  adjust.js`);

const addNewFieldsLinks = db.schema.table("files", function (table) {
  table.string("url").nullable();
  table.boolean("isLink").notNullable().defaultTo(false);
});

const addNewFieldsFiles = db.schema.table("files", function (table) {
  table.string("type").nullable();
  table.integer("size").notNullable().defaultTo(0);
  table.string("name").nullable();
  table.string("body").nullable();
  table.jsonb("coverImage").nullable();
  table.string("author").nullable();
  table.string("source").nullable();
});

const addNewFieldsUsers = db.schema.table("users", function (table) {
  table.string("name").nullable();
  table.string("body").nullable();
  table.string("photo").nullable();
  table.string("twitter").nullable();
  table.boolean("twitterVerified").notNullable().defaultTo(false);
});

const addNewFieldsSlates = db.schema.table("slates", function (table) {
  table.string("name").nullable();
  table.string("body").nullable();
  table.string("preview").nullable();
});

Promise.all([addNewFieldsLinks]);

Logging.log(`FINISHED: adjust.js`);
Logging.log(`          CTRL +C to return to terminal.`);
