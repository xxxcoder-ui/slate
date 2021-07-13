import * as Data from "~/node_common/data";
import * as Utilities from "~/node_common/utilities";
import * as ViewerManager from "~/node_common/managers/viewer";
import * as SearchManager from "~/node_common/managers/search";
import * as RequestUtilities from "~/node_common/request-utilities";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationInternal(req, res);
  if (!userInfo) return;
  const { id, user } = userInfo;

  if (!req.body.data?.id) {
    return res.status(500).send({ decorator: "SERVER_TOGGLE_FILE_PRIVACY_NO_FILE", error: true });
  }
  let file = req.body.data;

  let response = await Data.updateFilePrivacy({
    ownerId: file.ownerId,
    id: file.id,
    isPublic: file.isPublic,
  });

  if (!response || response.error) {
    return res
      .status(500)
      .send({ decorator: "SERVER_TOGGLE_FILE_PRIVACY_UPDATE_FAILED", error: true });
  }

  if (response.isPublic) {
    SearchManager.updateFile(response, "ADD");
  } else {
    SearchManager.updateFile(response, "REMOVE");
  }

  ViewerManager.hydratePartial(id, { library: true, slates: true });

  return res.status(200).send({
    decorator: "SERVER_TOGGLE_FILE_PRIVACY",
    data: {},
  });
};
