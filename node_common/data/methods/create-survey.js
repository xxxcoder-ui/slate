import { runQuery } from "~/node_common/data/utilities";

export default async ({ ownerId, prevTools, usecases, referrals }) => {
  return await runQuery({
    label: "CREATE_SURVEY",
    queryFn: async (DB) => {
      let query = await DB.insert({
        ownerId,
        prevTools,
        usecases,
        referrals,
      })
        .into("surveys")
        .returning("*");

      if (!query) {
        return null;
      }

      query = query.pop();

      return JSON.parse(JSON.stringify(query));
    },
    errorFn: async () => {
      return {
        error: true,
        decorator: "CREATE_SURVEY",
      };
    },
  });
};
