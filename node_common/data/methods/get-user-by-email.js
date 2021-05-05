import * as Serializers from "~/node_common/serializers";
import { runQuery } from "~/node_common/data/utilities";

//NOTE(toast): should only be used for checking if an email is taken
//ALWAYS sanitize it before sending result to frontend
export default async ({ email }) => {
  return await runQuery({
    label: "GET_USER_BY_EMAIL",
    queryFn: async (DB) => {
      const query = await DB.select("*").from("users").where({ email }).first();

      if (!query || query.error) {
        return null;
      }

      query = Serializers.sanitizeUser(query);

      return JSON.parse(JSON.stringify(query));
    },
    errorFn: async (e) => {
      return {
        error: true,
        decorator: "GET_USER_BY_EMAIL",
      };
    },
  });
};
