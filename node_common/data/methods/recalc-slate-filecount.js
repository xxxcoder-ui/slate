import * as Data from "~/node_common/data";

import { runQuery } from "~/node_common/data/utilities";

export default async ({ slateId }) => {
  return await runQuery({
    label: "RECALC_SLATE_FILECOUNT",
    queryFn: async (DB) => {
      const fileCountFields = ["id", "slate_files", "slateId", slateId];
      const selectFileCount = await DB.raw(
        `SELECT COUNT(??) FROM ?? WHERE ?? = ?`,
        fileCountFields
      );
      const fileCount = Number.parseInt(selectFileCount.rows[0].count);
      if (fileCount === 0) {
        await Data.deleteSlateById({ id: slateId });
        return true;
      } else {
        const updateFields = ["slates", "fileCount", fileCount, "id", slateId];
        const update = await DB.raw(`UPDATE ?? SET ?? = ? WHERE ?? = ? RETURNING *`, updateFields);
        return true;
      }
    },
    errorFn: async (e) => {
      return {
        error: true,
        decorator: "RECALC_SLATE_FILECOUNT",
      };
    },
  });
};
