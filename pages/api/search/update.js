import * as Environment from "~/node_common/environment";
import * as Data from "~/node_common/data";
import * as Utilities from "~/node_common/utilities";
import * as Social from "~/node_common/social";
import * as SearchManager from "~/node_common/managers/search";
import * as RequestUtilities from "~/node_common/request-utilities";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationInternal(req, res);
  if (!userInfo) return;
  const { id, user } = userInfo;

  let action;
  if (req.body.data === "create-user") {
    action = "ADD";
  } else if (req.body.data === "delete-user") {
    action = "REMOVE";
  }
  if (action) {
    SearchManager.updateUser(user, action);
  }

  return res.status(200).send({ decorator: "SERVER_SEARCH_UPDATE", updated: true });
};
