import * as Logging from "~/common/logging";
import * as Data from "~/node_common/data";

import configs from "~/knexfile";
import knex from "knex";

import { deleteUser } from "~/pages/api/users/delete";

const envConfig = configs["development"];

const db = knex(envConfig);

Logging.log(`RUNNING:  delete-user.js`);

const run = async () => {
  const user = await Data.getUserByUsername({
    username: process.argv[3],
  });

  Logging.log(user);

  if (user) {
    Logging.log(`deleting ${user.username}`);
    await deleteUser(user);
  }

  Logging.log(`FINISHED: delete-user.js`);
  Logging.log(`          CTRL +C to return to terminal.`);
};

run();
