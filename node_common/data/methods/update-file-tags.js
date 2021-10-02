import * as Serializers from "~/node_common/serializers";

import { runQuery } from "~/node_common/data/utilities";

export default async ({ fileId }) => {
  return await runQuery({
    label: "UPDATE_FILE_TAGS",
    queryFn: async (DB) => {
      let tags = await DB.select("id", "slatename", "name")
        .from("slates")
        .whereExists(function () {
          this.select("id")
            .from("slate_files")
            .whereRaw('"slate_files"."slateId" = "slates"."id"')
            .where({ "slate_files.fileId": fileId });
        });

      const response = await DB("files")
        .where({ id: fileId })
        .update({ tags: JSON.stringify(tags) })
        .returning("*");

      const index = response ? response.pop() : null;
      return JSON.parse(JSON.stringify(index));
    },
    errorFn: async (e) => {
      return {
        error: true,
        decorator: "UPDATE_FILE_TAGS",
      };
    },
  });
};
