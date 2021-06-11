import * as Logging from "~/common/logging";

import DB from "~/node_common/database";

export const runQuery = async ({ queryFn, errorFn, label }) => {
  let response;
  try {
    response = await queryFn(DB);
  } catch (e) {
    Logging.error(`DB:${label}: ${e.message}`);
    response = errorFn(e);
  }

  Logging.log(`DB:${label}`);
  return response;
};
