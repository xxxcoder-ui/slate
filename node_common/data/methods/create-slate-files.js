import { runQuery } from "~/node_common/data/utilities";

//NOTE(martina): this is the endpoint used when adding an existing file to a slate. Creates a slate_files entry
export default async ({ owner, slate, files }) => {
  let slateFiles = files.map((file) => {
    return { slateId: slate.id, fileId: file.id };
  });

  return await runQuery({
    label: "CREATE_SLATE_FILES",
    queryFn: async (DB) => {
      const query = await DB.insert(slateFiles).into("slate_files").returning("*");

      if (slate.isPublic) {
        let activityItems = [];
        for (let slateFile of query) {
          if (slate.isPublic) {
            activityItems.push({
              ownerId: owner.id,
              slateId: slate.id,
              fileId: slateFile.fileId,
              type: "CREATE_SLATE_OBJECT",
            });
          } else {
            activityItems.push({
              ownerId: owner.id,
              slateId: slate.id,
              fileId: file.id,
              type: "CREATE_SLATE_OBJECT",
              ignore: true,
            });
          }
        }

        const activityQuery = await DB.insert(activityItems).into("activity");
      }

      const summaryQuery = await DB("slates")
        .where("id", slate.id)
        .increment("fileCount", files.length);

      if (!query) {
        return null;
      }

      return JSON.parse(JSON.stringify(query));
    },
    errorFn: async (e) => {
      return {
        error: true,
        decorator: "CREATE_SLATE_FILES",
      };
    },
  });
};
