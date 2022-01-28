import * as Constants from "~/node_common/constants";
import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as ViewerManager from "~/node_common/managers/viewer";
import SearchManager from "~/node_common/managers/search";
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

  if (slate.ownerId !== id) {
    return res
      .status(403)
      .send({ decorator: "SERVER_REMOVE_FROM_SLATE_SLATE_NOT_FOUND", error: true });
  }

  let response = await Data.deleteSlateFiles({ slateId: slate.id, ids: fileIds });

  if (!response || response.error) {
    return res.status(500).send({
      decorator: "SERVER_REMOVE_FROM_SLATE_FAILED",
      error: true,
    });
  }

  //NOTE(martina): if slate was auto-deleted b/c there were no files left in it, updatedSlate will be null
  let updatedSlate = await Data.getSlateById({ id: req.body.data.slateId });

  if (slate.isPublic) {
    let updatedFiles = await Utilities.removeFromPublicCollectionUpdatePrivacy({
      files: slate.objects,
    });
    if (updatedFiles.length) {
      SearchManager.updateFile(updatedFiles);
    }
  }

  if (updatedSlate) {
    Utilities.removeFromSlateCheckCoverImage(slate, fileIds);
  } else {
    SearchManager.deleteSlate(slate);
  }

  // if (fileIds.length >= slate.objects.length) {
  //   let updatedSlate = await Data.getSlateById({ id: req.body.data.slateId, includeFiles: true });

  //   if (!updatedSlate.objects.length) {
  //     const deleteResponse = await Data.deleteSlateById({ id: slate.id });

  //     if (!deleteResponse) {
  //       return res.status(404).send({ decorator: "SERVER_DELETE_SLATE_FAILED", error: true });
  //     }

  //     if (deleteResponse.error) {
  //       return res.status(500).send({ decorator: "SERVER_DELETE_SLATE_FAILED", error: true });
  //     }

  //     SearchManager.deleteSlate(slate);
  //   }
  // }

  ViewerManager.hydratePartial(id, { slates: true });

  return res.status(200).send({
    decorator: "SERVER_SLATE_REMOVE_FROM_SLATE",
    slate,
  });
};
