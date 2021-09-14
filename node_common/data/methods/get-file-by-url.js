import * as Serializers from "~/node_common/serializers";

import { runQuery } from "~/node_common/data/utilities";

export default async ({ ownerId, url }) => {
  return await runQuery({
    label: "GET_FILE_BY_URL",
    queryFn: async (DB) => {
      let query = await DB.select("*").from("files").where({ ownerId, url }).first();

      if (!query || query.error) {
        return null;
      }

      return JSON.parse(JSON.stringify(query));
    },
    errorFn: async (e) => {
      return {
        error: true,
        decorator: "GET_FILE_BY_URL",
      };
    },
  });
};
