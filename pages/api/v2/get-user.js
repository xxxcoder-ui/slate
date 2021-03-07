import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as Powergate from "~/node_common/powergate";

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
      decorator: "V2_GET_USER_NOT_FOUND",
      error: true,
    });
  }

  if (key.error) {
    return res.status(500).send({
      decorator: "V2_GET_USER_NOT_FOUND",
      error: true,
    });
  }

  const user = await Data.getUserById({
    id: key.ownerId,
  });

  if (!user) {
    return res.status(404).send({ decorator: "V2_GET_USER_NOT_FOUND", error: true });
  }

  if (user.error) {
    return res.status(500).send({ decorator: "V2_GET_USER_NOT_FOUND", error: true });
  }

  let userId = req.body.data ? req.body.data.id : null;

  if (Strings.isEmpty(userId)) {
    return res.status(400).send({ decorator: "V2_GET_USER_NO_ID_PROVIDED", error: true });
  }

  let targetUser = await Data.getUserById({
    id: userId,
    sanitize: true,
    publicOnly: true,
    includeFiles: true,
  });

  if (!targetUser) {
    return res.status(404).send({
      decorator: "V2_GET_USER_FAILED",
      error: true,
    });
  }

  if (targetUser.error) {
    return res.status(500).send({
      decorator: "V2_GET_USER_FAILED",
      error: true,
    });
  }

  return res.status(200).send({ decorator: "V2_GET_USER", user: targetUser });
};
