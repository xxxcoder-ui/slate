import * as Environment from "~/node_common/environment";
import * as Data from "~/node_common/data";
import * as Utilities from "~/node_common/utilities";
import * as Social from "~/node_common/social";
import * as RequestUtilities from "~/node_common/request-utilities";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationInternal(req, res);
  if (!userInfo) return;
  const { id, user } = userInfo;

  const { buckets, bucketKey } = await Utilities.getBucket({ user });

  if (!buckets) {
    return res.status(500).send({ decorator: "SERVER_NO_BUCKET_DATA", error: true });
  }

  // TODO(jim): Put this call into a file for all Textile related calls.
  let r = null;
  try {
    r = await buckets.list();
  } catch (e) {
    Social.sendTextileSlackMessage({
      file: "/pages/api/data/get-bucket.js",
      user,
      message: e.message,
      code: e.code,
      functionName: `buckets.list`,
    });
  }

  if (!r) {
    return res.status(500).send({ decorator: "SERVER_NO_BUCKET_DATA", error: true });
  }

  // TODO(jim): Put this call into a file for all Textile related calls.
  let items = null;
  try {
    items = await buckets.listIpfsPath(r[0].path);
  } catch (e) {
    Social.sendTextileSlackMessage({
      file: "/pages/api/data/get.js",
      user,
      message: e.message,
      code: e.code,
      functionName: `buckets.listIpfsPath`,
    });
  }

  if (!items) {
    return res.status(500).send({ decorator: "SERVER_NO_BUCKET_DATA", error: true });
  }

  return res.status(200).send({
    decorator: "SERVER_GET",
    data: items.items,
  });
};
