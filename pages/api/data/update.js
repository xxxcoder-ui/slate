import * as Data from "~/node_common/data";
import * as Utilities from "~/node_common/utilities";
import * as ViewerManager from "~/node_common/managers/viewer";
import SearchManager from "~/node_common/managers/search";
import * as RequestUtilities from "~/node_common/request-utilities";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationInternal(req, res);
  if (!userInfo) return;
  const { id, user } = userInfo;

  if (!req.body.data) {
    return res.status(500).send({ decorator: "SERVER_EDIT_DATA_NO_FILE", error: true });
  }

  let updates = Array.isArray(req.body.data) ? req.body.data : [req.body.data];
  let currentFiles = await Data.getFilesByIds({ ids: updates.map((file) => file.id) });
  let idsToRemove = currentFiles.filter((file) => file.ownerId !== id).map((file) => file.id);
  if (idsToRemove.length) {
    updates = updates.filter((file) => !idsToRemove.includes(file.id));
  }

  let responses = [];
  for (let update of updates) {
    let response = await Data.updateFileById(update);

    if (response && !response.error) {
      responses.push(response);
    }
  }

  if (responses.length === 0) {
    return res.status(500).send({ decorator: "SERVER_EDIT_DATA_FAILED", error: true });
  }

  SearchManager.updateFile(responses);

  ViewerManager.hydratePartial(id, { library: true, slates: true });

  return res.status(200).send({
    decorator: "SERVER_EDIT_DATA",
    data: responses,
  });
};
