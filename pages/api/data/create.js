import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Monitor from "~/node_common/monitor";
import * as ViewerManager from "~/node_common/managers/viewer";

export default async (req, res) => {
  const id = Utilities.getIdFromCookie(req);
  if (!id) {
    return res.status(401).send({ decorator: "SERVER_NOT_AUTHENTICATED", error: true });
  }

  const user = await Data.getUserById({
    id,
  });

  if (!user) {
    return res.status(404).send({ decorator: "SERVER_USER_NOT_FOUND", error: true });
  }

  if (user.error) {
    return res.status(500).send({ decorator: "SERVER_USER_NOT_FOUND", error: true });
  }

  let files;
  if (req.body.data.file) {
    files = [req.body.data.file];
  }
  if (req.body.data.files) {
    files = req.body.data.files;
  } else {
    return res.status(400).send({ decorator: "CREATE_FILE_NO_FILE_PROVIDED", error: true });
  }

  const duplicateFiles = await Data.getFilesByCids({
    ownerId: user.id,
    cids: files.map((file) => file.cid),
  });
  const duplicateCids = duplicateFiles.map((file) => file.cid);

  let newFiles = files.filter((file) => !duplicateCids.includes(file.cid));

  if (!newFiles.length) {
    return res.status(400).send({ decorator: "CREATE_FILE_DUPLICATE", error: true });
  }

  newFiles = newFiles.map((file) => {
    return { ...file, ownerId: user.id };
  });

  const response = await Data.createFile(newFiles);

  if (!response) {
    return res.status(404).send({ decorator: "CREATE_FILE_FAILED", error: true });
  }

  if (response.error) {
    return res.status(500).send({ decorator: response.decorator, error: response.error });
  }

  Monitor.createFiles({ owner: user, files: response });

  ViewerManager.hydratePartial(id, { library: true });

  return res.status(200).send({
    decorator: "CREATE_FILE",
    data: response,
  });
};
