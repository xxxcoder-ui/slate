import * as Data from "~/node_common/data";
import * as SearchManager from "~/node_common/managers/search";

export default async (req, res) => {
  if (Strings.isEmpty(req.headers.authorization)) {
    return res.status(404).send({
      decorator: "SERVER_API_KEY_MISSING",
      error: true,
    });
  }

  const parsed = Strings.getKey(req.headers.authorization);

  const key = await Data.getAPIKeyByKey({
    key: parsed,
  });

  if (!key) {
    return res.status(403).send({
      decorator: "V2_UPDATE_FILE_NOT_FOUND",
      error: true,
    });
  }

  if (key.error) {
    return res.status(500).send({
      decorator: "V2_UPDATE_FILE_NOT_FOUND",
      error: true,
    });
  }

  const user = await Data.getUserById({
    id: key.ownerId,
  });

  if (!user) {
    return res.status(404).send({
      decorator: "V2_UPDATE_FILE_USER_NOT_FOUND",
      error: true,
    });
  }

  if (user.error) {
    return res.status(500).send({
      decorator: "V2_UPDATE_FILE_USER_NOT_FOUND",
      error: true,
    });
  }

  if (!req.body.data?.id) {
    return res.status(500).send({ decorator: "V2_UPDATE_FILE_NO_FILE_PROVIDED", error: true });
  }

  //NOTE(martina): cleans the input to remove fields they should not be changing like ownerId, createdAt, filename, size, type etc.
  let updates = {
    id: req.body.data.id,
    isPublic: req.body.data.isPublic,
    data: {
      name: req.body.data.data?.name,
      body: req.body.data.data?.body,
      source: req.body.data.data?.source,
      author: req.body.data.data?.author,
    },
  };

  const file = await Data.getFileById({ id: updates.id });

  if (typeof updates.isPublic !== "undefined" && updates.isPublic !== file.id) {
    let response = await Data.updateFilePrivacy({
      ownerId: updates.ownerId,
      id: updates.id,
      isPublic: updates.isPublic,
    });

    if (!response || response.error) {
      return res.status(500).send({ decorator: "V2_UPDATE_FILE_PRIVACY_FAILED", error: true });
    }

    if (response.isPublic) {
      SearchManager.updateFile(response, "ADD");
    } else {
      SearchManager.updateFile(response, "REMOVE");
    }
  }

  let response = await Data.updateFileById(updates);

  if (!response || response.error) {
    return res.status(500).send({ decorator: "V2_UPDATE_FILE_FAILED", error: true });
  }

  if (response.isPublic) {
    SearchManager.updateFile(publicFiles, "EDIT");
  }

  return res.status(200).send({
    decorator: "V2_UPDATE_FILE",
    file: response,
  });
};
