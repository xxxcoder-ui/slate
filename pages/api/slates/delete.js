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

  const slate = await Data.getSlateById({ id: req.body.data.id, includeFiles: true });

  if (!slate) {
    return res.status(404).send({ decorator: "SERVER_DELETE_SLATE_SLATE_NOT_FOUND", error: true });
  }

  if (slate.error) {
    return res.status(500).send({ decorator: "SERVER_DELETE_SLATE_SLATE_NOT_FOUND", error: true });
  }

  const deleteResponse = await Data.deleteSlateById({ id: slate.id });

  if (!deleteResponse) {
    return res.status(404).send({ decorator: "SERVER_DELETE_SLATE_FAILED", error: true });
  }

  if (deleteResponse.error) {
    return res.status(500).send({ decorator: "SERVER_DELETE_SLATE_FAILED", error: true });
  }

  ViewerManager.hydratePartial(id, { slates: true });

  SearchManager.updateSlate(slate, "REMOVE");

  if (slate.isPublic) {
    //NOTE(martina): if any of the files in it are now private (because they are no longer in any public slates) remove them from search
    const files = slate.objects;

    const publicFiles = await Data.getFilesByIds({
      ids: files.map((file) => file.id),
      publicOnly: true,
    });
    const publicIds = publicFiles.map((file) => file.id);

    let privateFiles = files.filter((file) => !publicIds.includes(file.id));

    if (privateFiles.length) {
      SearchManager.updateFile(privateFiles, "REMOVE");
    }
  }

  return res.status(200).send({ decorator: "SERVER_DELETE_SLATE", error: false });
};
