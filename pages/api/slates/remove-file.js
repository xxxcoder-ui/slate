import * as Constants from "~/node_common/constants";
import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as ViewerManager from "~/node_common/managers/viewer";
import * as SearchManager from "~/node_common/managers/search";
import * as RequestUtilities from "~/node_common/request-utilities";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationInternal(req, res);
  if (!userInfo) return;
  const { id, user } = userInfo;

  const fileIds = req.body.data.ids;

  if (!fileIds?.length) {
    return res.status(500).send({
      decorator: "SERVER_REMOVE_FROM_SLATE_NO_ID_PROVIDED",
      error: true,
    });
  }

  const slate = await Data.getSlateById({ id: req.body.data.slateId, includeFiles: true });

  if (!slate) {
    return res.status(404).send({
      decorator: "SERVER_REMOVE_FROM_SLATE_SLATE_NOT_FOUND",
      error: true,
    });
  }

  if (slate.error) {
    return res.status(500).send({
      decorator: "SERVER_REMOVE_FROM_SLATE_SLATE_NOT_FOUND",
      error: true,
    });
  }

  let response = await Data.deleteSlateFiles({ slateId: slate.id, ids: fileIds });

  if (!response || response.error) {
    return res.status(500).send({
      decorator: "SERVER_REMOVE_FROM_SLATE_FAILED",
      error: true,
    });
  }

  if (slate.isPublic) {
    Utilities.removeFromPublicCollectionUpdatePrivacy({ files: slate.objects });
  }

  ViewerManager.hydratePartial(id, { slates: true });

  return res.status(200).send({
    decorator: "SERVER_SLATE_REMOVE_FROM_SLATE",
    slate,
  });
};
