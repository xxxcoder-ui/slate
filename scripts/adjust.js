import configs from "~/knexfile";
import knex from "knex";

const envConfig = configs["development"];

console.log(`SETUP: database`, envConfig);

const db = knex(envConfig);

console.log(`RUNNING:  adjust.js`);

const editActivityTable = db.schema.table("activity", function (table) {
  table.boolean("ignore").notNullable().defaultTo(false);
});

const editSlatesTable = db.schema.table("slates", function (table) {
  table.integer("subscriberCount").notNullable().defaultTo(0);
  table.integer("fileCount").notNullable().defaultTo(0);
});

const editUsersTable = db.schema.table("users", function (table) {
  table.integer("followerCount").notNullable().defaultTo(0);
  table.integer("fileCount").notNullable().defaultTo(0);
  table.integer("slateCount").notNullable().defaultTo(0);
});

const editFilesTable = db.schema.table("files", function (table) {
  table.integer("likeCount").notNullable().defaultTo(0);
  table.integer("downloadCount").notNullable().defaultTo(0);
});

const addLikesTable = db.schema.createTable("likes", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.uuid("userId").references("id").inTable("users");
  table.uuid("fileId").references("id").inTable("files");
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
});

Promise.all([editActivityTable, editSlatesTable, editUsersTable, editFilesTable, addLikesTable]);

console.log(`FINISHED: adjust.js`);
console.log(`          CTRL +C to return to terminal.`);
