import configs from "~/knexfile";
import knex from "knex";

const envConfig = configs["development"];

console.log(`SETUP: database`, envConfig);

const db = knex(envConfig);

console.log(`RUNNING:  seed-database.js`);

// --------------------------
// SCRIPTS
// --------------------------

//replace createdat, updatedat, ownerid, owneruserid

const createDealsTable = db.schema.createTable("deals", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.string("ownerId").nullable();
  table.jsonb("data").nullable();
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
  table.timestamp("updatedAt").notNullable().defaultTo(db.raw("now()"));
});

const createUsersTable = db.schema.createTable("users", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.string("email").unique().nullable();
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
  table.timestamp("lastActive").notNullable().defaultTo(db.raw("now()"));
  table.string("username").unique().notNullable();
  table.string("twitterId").unique().nullable();
  table.string("password").nullable();
  table.string("salt").nullable();
  table.jsonb("data").nullable();
});

const createSlatesTable = db.schema.createTable("slates", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.uuid("ownerId").references("id").inTable("users");
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
  table.timestamp("updatedAt").notNullable().defaultTo(db.raw("now()"));
  table.string("slatename").notNullable();
  table.boolean("isPublic").notNullable().defaultTo(false);
  table.jsonb("data").nullable();
});

const createKeysTable = db.schema.createTable("keys", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.string("key").unique().nullable();
  table.uuid("ownerId").notNullable();
  table.integer("level").defaultTo(0);
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
});

const createFilesTable = await db.schema.createTable("files", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.uuid("ownerId").references("id").inTable("users");
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
  table.string("cid").notNullable();
  table.string("filename").nullable();
  table.boolean("isPublic").notNullable().defaultTo(false);
  table.jsonb("data").nullable();
});

const createSlateFilesTable = await db.schema.createTable("slate_files", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.uuid("fileId").references("id").inTable("files");
  table.uuid("slateId").references("id").inTable("slates");
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
});

const createSubscriptionsTable = await db.schema.createTable("subscriptions", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.uuid("ownerId").references("id").inTable("users");
  table.uuid("slateId").references("id").inTable("slates");
  table.uuid("userId").references("id").inTable("users");
  table.jsonb("data").nullable();
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
});

const createActivityTable = await db.schema.createTable("activity", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.uuid("ownerId").references("id").inTable("users");
  table.uuid("userId").references("id").inTable("users");
  table.uuid("slateId").references("id").inTable("slates");
  table.uuid("fileId").references("id").inTable("files");
  table.string("type");
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
});

const createStatsTable = db.schema.createTable("stats", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.jsonb("data").nullable();
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
});

const createOrphansTable = db.schema.createTable("orphans", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.jsonb("data").nullable();
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
});

const createGlobalTable = db.schema.createTable("global", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.jsonb("data").nullable();
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
});

const createUsageTable = db.schema.createTable("usage", function (table) {
  table.uuid("id").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.uuid("userId").references("id").inTable("users");
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
});
//NOTE(toast): making sid pkey and letting emails dupe allows for multiple keys per user,
//stops people from getting dos'd on verification
const createVerificationsTable = db.schema.createTable("verifications", function (table) {
  table.uuid("sid").primary().unique().notNullable().defaultTo(db.raw("uuid_generate_v4()"));
  table.string("email").nullable();
  table.string("twitterToken").unique().nullable();
  table.string("pin", 6).unique().notNullable();
  table.timestamp("createdAt").notNullable().defaultTo(db.raw("now()"));
  table.boolean("isVerified").notNullable().defaultTo(false);
});

const createTwitterTokensTable = db.schema.createTable("twitterTokens", function (table) {
  table.string("token").primary().unique().notNullable();
  table.string("tokenSecret").notNullable();
  table.string("email").nullable();
  table.string("id_str").nullable();
  table.string("screen_name").nullable();
  table.string("verified").nullable();
});

// --------------------------
// RUN
// --------------------------

Promise.all([
  createDealsTable,
  createUsersTable,
  createSlatesTable,
  createKeysTable,
  createFilesTable,
  createSlateFilesTable,
  createSubscriptionsTable,
  createActivityTable,
  createStatsTable,
  createOrphansTable,
  createVerificationsTable,
  createGlobalTable,
  createUsageTable,
  createTwitterTokensTable,
]);

console.log(`FINISHED: seed-database.js`);
console.log(`          CTRL +C to return to terminal.`);
