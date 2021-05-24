import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as SearchManager from "~/node_common/managers/search";
import * as ViewerManager from "~/node_common/managers/viewer";
import * as Monitor from "~/node_common/monitor";

/**
 * Save copy is equivalent to downloading then reuploading. So an entirely new files table entry should
 * be created with a new id, ownerId, and createdAt
 */
export default async (req, res) => {
  const id = Utilities.getIdFromCookie(req);
  if (!id) {
    return res.status(401).send({ decorator: "SERVER_NOT_AUTHENTICATED", error: true });
  }

  if (!req.body.data.files?.length) {
    return res.status(400).send({
      decorator: "SERVER_SAVE_COPY_NO_CIDS",
      error: true,
    });
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

  const duplicateFiles = await Data.getFilesByCids({
    ownerId: user.id,
    cids: req.body.data.files.map((file) => file.cid),
  });

  const duplicateCids = duplicateFiles.map((file) => file.cid);

  const foundFiles = await Data.getFilesByIds({ ids: req.body.data.files.map((file) => file.id) });

  const foundIds = foundFiles.map((file) => file.id);

  let newFiles = [];
  for (let file of req.body.data.files) {
    const cid = file.cid;
    if (duplicateCids.includes(cid)) continue; //NOTE(martina): cannot have two of the same cid in a person's files

    if (!foundIds.includes(file.id)) continue; //NOTE(martina): make sure the file being copied exists

    let response = await Utilities.addExistingCIDToData({
      buckets,
      key: bucketKey,
      path: bucketRoot.path,
      cid,
    });

    if (!response || response.error) {
      continue;
    }

    //NOTE(martina): remove the old file's id, ownerId, createdAt, and privacy so new fields can be used
    delete file.createdAt;
    delete file.id;
    delete file.isPublic;
    newFiles.push(file);
  }
  let response = [];
  if (newFiles?.length) {
    response = await Data.createFile({ owner: user, files: newFiles, saveCopy: true });
  }

  ViewerManager.hydratePartial(id, { library: true });

  const added = response?.length || 0;
  const skipped = req.body.data.files.length - added;

  return res.status(200).send({
    decorator: "SERVER_SAVE_COPY",
    data: { added, skipped },
  });
};
