import * as Environment from "~/node_common/environment";
import * as Data from "~/node_common/data";
import * as Utilities from "~/node_common/utilities";
import * as ViewerManager from "~/node_common/managers/viewer";
import * as RequestUtilities from "~/node_common/request-utilities";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationInternal(req, res);
  if (!userInfo) return;
  const { id, user } = userInfo;

  const key = await Data.getAPIKey({ id: req.body.data.id });

  if (!key || key.ownerId !== user.id) {
    return res.status(403).send({
      decorator: "SERVER_DELETE_API_KEY_NOT_FOUND",
      error: true,
    });
  }

  if (!key) {
    return res.status(404).send({
      decorator: "SERVER_DELETE_API_KEY_NOT_FOUND",
      error: true,
    });
  }

  if (key.error) {
    return res.status(500).send({
      decorator: "SERVER_DELETE_API_KEY_NOT_FOUND",
      error: true,
    });
  }

  const response = await Data.deleteAPIKeyById({ id: req.body.data.id });

  if (!response) {
    return res.status(404).send({
      decorator: "SERVER_DELETE_API_KEY_ERROR",
      error: true,
    });
  }

  if (response.error) {
    return res.status(500).send({
      decorator: "SERVER_DELETE_API_KEY_ERROR",
      error: true,
    });
  }

  // let keys = await Data.getAPIKeysByUserId({ userId: user.id });
  // ViewerManager.hydratePartialKeys(keys, user.id);

  ViewerManager.hydratePartial(id, { keys: true });

  return res.status(200).send({ decorator: "SERVER_DELETE_API_KEY" });
};
