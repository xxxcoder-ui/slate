import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as ViewerManager from "~/node_common/managers/viewer";
import * as SearchManager from "~/node_common/managers/search";

/**
 * Save copy is equivalent to downloading then reuploading. So an entirely new files table entry should
 * be created with a new id, ownerId, and createdAt
 */
export default async (req, res) => {
  const id = Utilities.getIdFromCookie(req);
  if (!id) {
    return res.status(401).send({ decorator: "SERVER_NOT_AUTHENTICATED", error: true });
  }

  const user = await Data.getUserById({
    id,
  });

  if (!user) {
    return res.status(404).send({ decorator: "SERVER_USER_NOT_FOUND", error: true });
  }

  if (user.error) {
    return res.status(500).send({ decorator: "SERVER_USER_NOT_FOUND", error: true });
  }

  let { buckets, bucketKey, bucketRoot, bucketName } = await Utilities.getBucketAPIFromUserToken({
    user,
  });

  if (!buckets) {
    return res.status(500).send({
      decorator: "SERVER_NO_BUCKET_DATA",
      error: true,
    });
  }

  const files = req.body.data.files;
  if (!files?.length) {
    return res.status(400).send({
      decorator: "SERVER_SAVE_COPY_NO_CIDS",
      error: true,
    });
  }

  let decorator = "SERVER_SAVE_COPY";

  const slateId = req.body.data.slate?.id;

  let slate;
  if (slateId) {
    slate = await Data.getSlateById({ id: slateId });

    if (!slate || slate.error) {
      slate = null;
      decorator = "SERVER_SAVE_COPY_SLATE_NOT_FOUND";
    }
  }

  const duplicateFiles = await Data.getFilesByCids({
    ownerId: user.id,
    cids: files.map((file) => file.cid),
  });

  const duplicateCids = duplicateFiles.map((file) => file.cid);

  const foundFiles = await Data.getFilesByIds({ ids: files.map((file) => file.id) });

  const foundIds = foundFiles.map((file) => file.id);

  let newFiles = [];
  for (let file of files) {
    const cid = file.cid;
    if (duplicateCids.includes(cid)) continue; //NOTE(martina): cannot have two of the same cid in a person's files

    if (!foundIds.includes(file.id)) continue; //NOTE(martina): make sure the file being copied exists

    console.log("before add existing cid to data");
    let response = await Utilities.addExistingCIDToData({
      buckets,
      key: bucketKey,
      path: bucketRoot.path,
      cid,
    });
    console.log("after add existing cid to data");

    if (!response || response.error) {
      continue;
    }

    //NOTE(martina): remove the old file's id, ownerId, createdAt, and privacy so new fields can be used
    delete file.createdAt;
    delete file.id;
    delete file.likeCount;
    delete file.downloadCount;
    delete file.saveCount;
    file.isPublic = slate?.isPublic || false;
    newFiles.push(file);
  }
  let copiedFiles = [];
  if (newFiles?.length) {
    copiedFiles = (await Data.createFile({ owner: user, files: newFiles, saveCopy: true })) || [];
  }

  let added = copiedFiles?.length || 0;

  //NOTE(martina): adding to the slate if there is one
  const filesToAddToSlate = copiedFiles.concat(duplicateFiles); //NOTE(martina): files that are already owned by the user are included in case they aren't yet in that specific slate
  if (slate && filesToAddToSlate.length) {
    const { decorator: returnedDecorator, added: addedToSlate } = await addToSlate({
      slate,
      files: filesToAddToSlate,
      user,
    });

    if (returnedDecorator) {
      decorator = returnedDecorator;
    }
    added = addedToSlate;
  }

  ViewerManager.hydratePartial(id, { library: true, slates: slate ? true : false });

  return res.status(200).send({
    decorator,
    data: { added, skipped: files.length - added },
  });
};

const addToSlate = async ({ slate, files, user }) => {
  let duplicateCids = await Data.getSlateFilesByCids({
    slateId: slate.id,
    cids: files.map((file) => file.cid),
  });

  let newFiles = files;
  if (duplicateCids?.length) {
    duplicateCids = duplicateCids.map((file) => file.cid);
    newFiles = files.filter((file) => {
      if (duplicateCids.includes(file.cid)) return false;
      return true;
    });
  }

  if (!newFiles.length) {
    return { added: 0 };
  }

  let response = await Data.createSlateFiles({ owner: user, slate, files: newFiles });
  if (!response || response.error) {
    return { decorator: "SERVER_SAVE_COPY_ADD_TO_SLATE_FAILED", added: 0 };
  }

  await Data.updateSlateById({ id: slate.id, updatedAt: new Date() });

  if (slate.isPublic) {
    const privacyUpdate = await Data.updateFilesPublic({
      ids: files.map((file) => file.id),
      ownerId: user.id,
    });

    SearchManager.updateFile(files, "ADD");
  }
  return { added: response.length };
};
