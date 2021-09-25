import * as Logging from "~/common/logging";

import configs from "~/knexfile";
import knex from "knex";

const envConfig = configs["development"];

Logging.log(`SETUP: database`, envConfig);

const db = knex(envConfig);

Logging.log(`RUNNING:  adjust.js`);

const renameExistingColumn = db.schema.table("users", function (table) {
  table.renameColumn("textileToken", "textileKey");
});

const addNewColumns = db.schema.table("users", function (table) {
  table.string("textileToken").nullable();
  table.string("textileThreadID").nullable();
  table.string("textileBucketCID").nullable();
});

const editColumnLength = db.schema.table("users", function (table) {
  table.string("textileToken", 400).nullable().alter();
});

const addNewFieldsSlates = db.schema.table("slates", function (table) {
  table.string("name").nullable();
  table.string("body").nullable();
  table.string("preview").nullable();
});

Promise.all([editColumnLength]);

Logging.log(`FINISHED: adjust.js`);
Logging.log(`          CTRL +C to return to terminal.`);
