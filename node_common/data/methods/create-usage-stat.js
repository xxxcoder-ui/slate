import { runQuery } from "~/node_common/data/utilities";

//NOTE(martina): can be single activity item (an object) or multiple activity items (an array of objects)
export default async ({ id }) => {
  return await runQuery({
    label: "CREATE_USAGE_STAT",
    queryFn: async (DB) => {
      //TODO(martina): only one usage activity per person every 24 hours (by UTC time)
      let existing = await DB.select("*")
        .from("usage")
        .where({ userId: id })
        .whereRaw("?? >= now()::date", "createdAt")
        .first();
      if (existing) {
        console.log("existing stat");
        return;
      }

      let query = await DB.insert({ userId: id }).into("usage").returning("*");

      if (!query) {
        return null;
      }
      console.log("added stat");
      console.log(query);

      query = query.pop();

      return JSON.parse(JSON.stringify(query));
    },
    errorFn: async (e) => {
      return {
        error: true,
        decorator: "CREATE_ACTIVITY",
      };
    },
  });
};
