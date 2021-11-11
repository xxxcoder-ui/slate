import { runQuery } from "~/node_common/data/utilities";

export default async ({ userId, prevTools, usecases, referrals }) => {
  return await runQuery({
    label: "CREATE_ONBOARDING",
    queryFn: async (DB) => {
      let query = await DB.insert({
        userId,
        prevTools,
        usecases,
        referrals,
      })
        .into("onboarding")
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
        decorator: "CREATE_ONBOARDING",
      };
    },
  });
};
