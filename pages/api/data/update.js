import * as Data from "~/node_common/data";
import * as Utilities from "~/node_common/utilities";
import * as ViewerManager from "~/node_common/managers/viewer";
import * as SearchManager from "~/node_common/managers/search";

export default async (req, res) => {
  const id = Utilities.getIdFromCookie(req);
  if (!id) {
    return res.status(401).send({ decorator: "SERVER_NOT_AUTHENTICATED", error: true });
  }

  const user = await Data.getUserById({ id });

  if (!user) {
    return res.status(404).send({ decorator: "SERVER_USER_NOT_FOUND", error: true });
  }

  if (user.error) {
    return res.status(500).send({ decorator: "SERVER_USER_NOT_FOUND", error: true });
  }

  if (!req.body.data) {
    return res.status(500).send({ decorator: "SERVER_EDIT_DATA_NO_FILE", error: true });
  }

  let updates = Array.isArray(req.body.data) ? req.body.data : [req.body.data];

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

  const publicFiles = await Data.getFilesByIds({
    ids: responses.map((file) => file.id),
    publicOnly: true,
  });

  if (publicFiles.length) {
    SearchManager.updateFile(publicFiles, "EDIT");
  }

  ViewerManager.hydratePartial(id, { library: true, slates: true });

  return res.status(200).send({
    decorator: "SERVER_EDIT_DATA",
    data: responses,
  });
};
