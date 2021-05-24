import { runQuery } from "~/node_common/data/utilities";

export default async ({ ids, ownerId }) => {
  return await runQuery({
    label: "DELETE_FILES_BY_IDS",
    queryFn: async (DB) => {
      // const repostedSlateFiles = await DB.from("slate_files")
      //   .join("slates", "slates.id", "=", "slate_files.slateId")
      //   .whereNot("slates.ownerId", "=", ownerId)
      //   .whereIn("slate_files.fileId", ids)
      //   .update({ "slate_files.fileId": null });
      const repostedSlateFiles = await DB.from("slate_files")
        .whereIn("id", function () {
          this.select("slate_files.id")
            .from("slate_files")
            .join("slates", "slates.id", "=", "slate_files.slateId")
            .whereIn("slate_files.fileId", ids)
            .whereNot("slates.ownerId", "=", ownerId);
        })
        .del();

      const slateFiles = await DB("slate_files").whereIn("fileId", ids).del().returning("slateId");

      let deletionCounts = {};
      for (let res of slateFiles) {
        const slateId = res.slateId;
        if (deletionCounts[slateId]) {
          deletionCounts[slateId] += 1;
        } else {
          deletionCounts[slateId] = 1;
        }
      }

      for (let [slateId, count] of Object.entries(deletionCounts)) {
        await DB("slates").where("id", slateId).decrement("fileCount", count);
      }

      const activity = await DB("activity").whereIn("fileId", ids).del();

      const likes = await DB("likes").whereIn("fileId", ids).del();

      const files = await DB("files").whereIn("id", ids).del().returning("*");

      const publicCount = files.reduce((count, file) => {
        if (file.isPublic) {
          return count + 1;
        }
        return count;
      });

      const summaryQuery = await DB.from("users")
        .where("id", ownerId)
        .decrement("fileCount", publicCount);

      return files.length === ids.length;
    },
    errorFn: async (e) => {
      return {
        error: true,
        decorator: "DELETE_FILES_BY_IDS",
      };
    },
  });
};
