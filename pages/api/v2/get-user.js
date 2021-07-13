import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as Powergate from "~/node_common/powergate";
import * as RequestUtilities from "~/node_common/request-utilities";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationExternal(req, res);
  if (!userInfo) return;
  const { id, key, user } = userInfo;

  let userId = req.body?.data?.id;

  if (Strings.isEmpty(userId)) {
    return res.status(400).send({ decorator: "NO_USER_ID_PROVIDED", error: true });
  }

  let targetUser = await Data.getUserById({
    id: userId,
    sanitize: true,
    publicOnly: true,
    includeFiles: true,
  });

  if (!targetUser) {
    return res.status(404).send({
      decorator: "USER_NOT_FOUND",
      error: true,
    });
  }

  if (targetUser.error) {
    return res.status(500).send({
      decorator: "USER_NOT_FOUND",
      error: true,
    });
  }

  return res.status(200).send({ decorator: "GET_USER", user: targetUser });
};
