import { runQuery } from "~/node_common/data/utilities";

export default async ({ cids }) => {
  return await runQuery({
    label: "CREATE_DEAL",
    queryFn: async (DB) => {
      let query = await DB.insert(cids).into("deals").returning("*");

      if (!query || query.error) {
        return [];
      }

      return JSON.parse(JSON.stringify(query));
    },
    errorFn: async (e) => {
      return {
        error: true,
        decorator: CREATE_DEAL,
      };
    },
  });
};
