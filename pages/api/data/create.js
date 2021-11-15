import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as ViewerManager from "~/node_common/managers/viewer";
import SearchManager from "~/node_common/managers/search";
import * as ArrayUtilities from "~/node_common/array-utilities";
import * as Monitor from "~/node_common/monitor";
import * as RequestUtilities from "~/node_common/request-utilities";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationInternal(req, res);
  if (!userInfo) return;
  const { id, user } = userInfo;

  let decorator = "SERVER_CREATE_FILE";
  const slateId = req.body.data.slate?.id;
  let slate;
  if (slateId) {
    slate = await Data.getSlateById({ id: slateId, includeFiles: true });

    if (!slate || slate.error) {
      slate = null;
      decorator = "SERVER_CREATE_FILE_SLATE_NOT_FOUND";
    }
  }

  let files;
  if (req.body.data.file) {
    files = [req.body.data.file];
  } else if (req.body.data.files) {
    files = req.body.data.files;
  } else {
    return res.status(400).send({ decorator: "SERVER_CREATE_FILE_NO_FILE_PROVIDED", error: true });
  }

  if (slate?.isPublic) {
    files = files.map((file) => {
      return { ...file, isPublic: true };
    });
  }

  let { duplicateFiles, filteredFiles } = await ArrayUtilities.removeDuplicateUserFiles({
    files,
    user,
  });

  // if (!newFiles.length) {
  //   return res.status(400).send({ decorator: "SERVER_CREATE_FILE_DUPLICATE", error: true });
  // }

  let createdFiles = [];
  if (filteredFiles?.length) {
    createdFiles = (await Data.createFile({ owner: user, files: filteredFiles })) || [];

    if (!createdFiles?.length) {
      return res.status(404).send({ decorator: "SERVER_CREATE_FILE_FAILED", error: true });
    }

    if (createdFiles.error) {
      return res.status(500).send({ decorator: createdFiles.decorator, error: createdFiles.error });
    }
  }

  let added = createdFiles?.length || 0;

  let filesToAddToSlate = createdFiles.concat(duplicateFiles); //NOTE(martina): files that are already owned by the user are included in case they aren't yet in that specific slate
  if (slate && filesToAddToSlate.length) {
    const { decorator: returnedDecorator, added: addedToSlate } = await Utilities.addToSlate({
      slate,
      files: filesToAddToSlate,
      user,
    });
    if (returnedDecorator) {
      decorator = returnedDecorator;
    }
    added = addedToSlate;
  }

  SearchManager.indexFile(createdFiles);

  ViewerManager.hydratePartial(id, { library: true, slates: slate ? true : false });

  if (!slate) {
    Monitor.upload({ user, files: filteredFiles });
  }

  return res.status(200).send({
    decorator,
    data: {
      added,
      skipped: files.length - added,
      // TODO(amine): merge upload and create endpoints
      cid: added ? createdFiles[0]?.cid : duplicateFiles[0]?.cid,
    },
  });
};
