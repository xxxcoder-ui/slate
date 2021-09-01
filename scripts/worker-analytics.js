import configs from "~/knexfile";
import knex from "knex";

import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as Logging from "~/common/logging";

const envConfig = configs["development"];
const db = knex(envConfig);

Logging.log(`RUNNING: worker-analytics.js`);

function sortObject(obj) {
  var arr = [];
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      arr.push({
        key: prop,
        value: obj[prop],
      });
    }
  }
  arr.sort(function (a, b) {
    return b.value - a.value;
  });
  //arr.sort(function(a, b) { a.value.toLowerCase().localeCompare(b.value.toLowerCase()); }); //use this to sort as strings
  return arr; // returns array
}

const run = async () => {
  const response = await Data.getEveryUser();

  let count = 0;
  let bytes = 0;
  let userMap = {};

  response.forEach((user) => {
    count = count + 1;

    let userBytes = 0;
    user.library.forEach((each) => {
      userBytes = each.size + userBytes;
      bytes = each.size + bytes;
    });

    userMap[user.username] = userBytes;
  });

  userMap = sortObject(userMap);
  userMap = userMap.map((each, index) => {
    return { ...each, index, value: Strings.bytesToSize(each.value) };
  });
  Logging.log(userMap);
  Logging.log("TOTAL USER COUNT", count);
  Logging.log("TOTAL BYTES", bytes);
  Logging.log("TOTAL BYTES (CONVERTED)", Strings.bytesToSize(bytes));
};

// run();

Logging.log(`FINISHED: worker-analytics.js`);
Logging.log(`          CTRL +C to return to terminal.`);
