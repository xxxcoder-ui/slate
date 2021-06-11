import configs from "~/knexfile";
import knex from "knex";

import * as Logging from "~/common/logging";

const envConfig = configs["development"];

Logging.log(`SETUP: database`, envConfig);

const db = knex(envConfig);

Logging.log(`RUNNING:  setup-database.js`);

Promise.all([db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')]);

Logging.log(`FINISHED: setup-database.js`);
Logging.log(`          CTRL +C to return to terminal.`);
