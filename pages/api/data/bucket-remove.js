import * as Data from "~/node_common/data";
import * as Utilities from "~/node_common/utilities";
import * as Strings from "~/common/strings";
import * as Social from "~/node_common/social";
import * as RequestUtilities from "~/node_common/request-utilities";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationInternal(req, res);
  if (!userInfo) return;
  const { id, user } = userInfo;

  if (Strings.isEmpty(req.body.data?.cid)) {
    return res.status(500).send({ decorator: "SERVER_BUCKET_REMOVE_NO_CID", error: true });
  }

  const { buckets, bucketKey } = await Utilities.getBucket({
    user,
    bucketName: req.body.data.bucketName,
  });

  if (!buckets) {
    return res.status(500).send({
      decorator: "SERVER_NO_BUCKET_DATA",
      error: true,
    });
  }

  // TODO(jim): Put this call into a file for all Textile related calls.
  let r = null;
  try {
    r = await buckets.list();
  } catch (e) {
    Social.sendTextileSlackMessage({
      file: "/pages/api/data/bucket-remove.js",
      user,
      message: e.message,
      code: e.code,
      functionName: `buckets.list`,
    });
  }

  if (!r) {
    return res.status(500).send({ decorator: "SERVER_NO_BUCKET_DATA", error: true });
  }

  const targetBucket = r.find((d) => d.name === req.body.data.bucketName);

  if (!targetBucket) {
    return res
      .status(404)
      .send({ decorator: "SERVER_BUCKET_REMOVE_BUCKET_NOT_FOUND", error: true });
  }

  let items = null;
  try {
    const path = await buckets.listPath(targetBucket.key, "/");
    items = path.item;
  } catch (e) {
    Social.sendTextileSlackMessage({
      file: "/pages/api/data/bucket-remove.js",
      user,
      message: e.message,
      code: e.code,
      functionName: `buckets.listPath`,
    });
  }

  if (!items) {
    return res.status(500).send({ decorator: "SERVER_BUCKET_REMOVE_NO_BUCKET_ITEMS", error: true });
  }

  let entity;
  for (let i = 0; i < items.items.length; i++) {
    if (items.items[i].cid === req.body.data.cid) {
      entity = items.items[i];
      break;
    }
  }

  if (!entity) {
    return res.status(500).send({ decorator: "SERVER_BUCKET_REMOVE_NO_MATCHING_CID", error: true });
  }

  let bucketRemoval;
  try {
    bucketRemoval = await buckets.removePath(bucketKey, entity.name);
  } catch (e) {
    Social.sendTextileSlackMessage({
      file: "/pages/api/data/bucket-remove.js",
      user,
      message: e.message,
      code: e.code,
      functionName: `buckets.removePath`,
    });

    return res.status(500).send({ decorator: "SERVER_BUCKET_REMOVE_FAILED", error: true });
  }

  return res.status(200).send({
    decorator: "SERVER_BUCKET_REMOVE",
    success: true,
    bucketItems: items.items,
  });
};
