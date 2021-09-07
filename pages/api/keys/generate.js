import * as Environment from "~/node_common/environment";
import * as Data from "~/node_common/data";
import * as Utilities from "~/node_common/utilities";
import * as ViewerManager from "~/node_common/managers/viewer";
import * as RequestUtilities from "~/node_common/request-utilities";

import { v4 as uuid } from "uuid";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationInternal(req, res);
  if (!userInfo) return;
  const { id, user } = userInfo;

  let keys = await Data.getAPIKeysByUserId({ userId: user.id });

  if (keys.length > 9) {
    return res.status(404).send({
      decorator: "SERVER_GENERATE_API_KEY_TOO_MANY_KEYS",
      error: true,
    });
  }

  const key = await Data.createAPIKey({
    userId: user.id,
    key: `SLA${uuid()}TE`,
  });

  if (!key) {
    return res.status(404).send({
      decorator: "SERVER_GENERATE_API_KEY_ERROR",
      error: true,
    });
  }

  if (key.error) {
    return res.status(500).send({
      decorator: "SERVER_GENERATE_API_KEY_ERROR",
      error: true,
    });
  }

  ViewerManager.hydratePartial(id, { keys: true });

  return res.status(200).send({ decorator: "SERVER_GENERATE_API_KEY", key });
};
