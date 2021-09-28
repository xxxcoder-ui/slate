import * as Constants from "~/node_common/constants";
import * as Utilities from "~/node_common/utilities";
import * as Social from "~/node_common/social";
import * as Strings from "~/common/strings";
import * as Logging from "~/common/logging";
import * as RequestUtilities from "~/node_common/request-utilities";

import { v4 as uuid } from "uuid";
import { MAX_BUCKET_COUNT, MIN_ARCHIVE_SIZE_BYTES } from "~/node_common/constants";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationInternal(req, res);
  if (!userInfo) return;
  const { id, user } = userInfo;

  let bucketName = Constants.textile.dealsBucket;
  if (req.body.data && req.body.data.bucketName) {
    bucketName = req.body.data.bucketName;
  }

  const { buckets, bucketKey } = await Utilities.getBucket({
    user,
    bucketName,
  });

  if (!buckets) {
    return res.status(500).send({
      decorator: "SERVER_NO_BUCKET_DATA",
      error: true,
    });
  }

  // NOTE(jim): Getting the appropriate bucket key

  let items = null;
  let bucketSizeBytes = 0;
  try {
    const path = await buckets.listPath(bucketKey, "/");
    items = path.item;
    bucketSizeBytes = path.item.size;
  } catch (e) {
    Social.sendTextileSlackMessage({
      file: "/pages/api/data/archive.js",
      user,
      message: e.message,
      code: e.code,
      functionName: `buckets.listPath`,
    });
  }

  if (!items) {
    return res.status(500).send({
      decorator: "SERVER_NO_BUCKET_DATA",
      error: true,
    });
  }

  Logging.log(`[ deal ] will make a deal for ${items.items.length} items`);
  if (items.items.length < 2) {
    return res.status(500).send({
      decorator: "SERVER_ARCHIVE_NO_FILES",
      error: true,
    });
  }

  Logging.log(`[ deal ] deal size: ${Strings.bytesToSize(bucketSizeBytes)}`);
  if (bucketSizeBytes < MIN_ARCHIVE_SIZE_BYTES) {
    return res.status(500).send({
      decorator: "SERVER_ARCHIVE_BUCKET_TOO_SMALL",
      message: `Your deal size of ${Strings.bytesToSize(
        bucketSizeBytes
      )} is too small. You must provide at least 100MB.`,
      error: true,
    });
  }

  // NOTE(jim): Make sure that you haven't hit the MAX_BUCKET_COUNT

  let userBuckets = [];
  try {
    userBuckets = await buckets.list();
  } catch (e) {
    Social.sendTextileSlackMessage({
      file: "/pages/api/data/archive.js",
      user: user,
      message: e.message,
      code: e.code,
      functionName: `buckets.list`,
    });

    return res.status(500).send({
      decorator: "SERVER_ARCHIVE_BUCKET_COUNT_VERIFICATION_FAILED",
      error: true,
    });
  }

  Logging.log(
    `[ encrypted ] user has ${userBuckets.length} out of ${MAX_BUCKET_COUNT} buckets used.`
  );
  if (userBuckets.length >= MAX_BUCKET_COUNT) {
    return res.status(500).send({
      decorator: "SERVER_ARCHIVE_MAX_NUMBER_BUCKETS",
      error: true,
    });
  }

  // NOTE(jim): Either encrypt the bucket or don't encrypt the bucket.
  let encryptThisDeal = false;
  if (bucketName !== Constants.textile.dealsBucket && user.allowEncryptedDataStorage) {
    encryptThisDeal = true;
  }

  if (req.body.data.forceEncryption) {
    encryptThisDeal = true;
  }

  let key = bucketKey;
  let encryptedBucketName = null;
  if (user.allowEncryptedDataStorage || req.body.data.forceEncryption) {
    encryptedBucketName = req.body.data.forceEncryption
      ? `encrypted-deal-${uuid()}`
      : `encrypted-data-${uuid()}`;

    Logging.log(`[ encrypted ] making an ${encryptedBucketName} for this storage deal.`);

    try {
      const newBucket = await buckets.create(encryptedBucketName, true, items.cid);
      key = newBucket.root.key;
    } catch (e) {
      Social.sendTextileSlackMessage({
        file: "/pages/api/data/archive.js",
        user: user,
        message: e.message,
        code: e.code,
        functionName: `buckets.create (encrypted)`,
      });

      return res.status(500).send({
        decorator: "SERVER_ARCHIVE_ENCRYPTION_FAILED",
        error: true,
      });
    }

    Logging.log(`[ encrypted ] ${encryptedBucketName}`);
    Logging.log(`[ encrypted ] ${key}`);
  } else {
    const newDealBucketName = `open-deal-${uuid()}`;

    try {
      const newBucket = await buckets.create(newDealBucketName, false, items.cid);
      key = newBucket.root.key;
    } catch (e) {
      Social.sendTextileSlackMessage({
        file: "/pages/api/data/archive.js",
        user: user,
        message: e.message,
        code: e.code,
        functionName: `buckets.create (normal, not encrypted)`,
      });

      return res.status(500).send({
        decorator: "SERVER_ARCHIVE_BUCKET_CLONING_FAILED",
        error: true,
      });
    }

    Logging.log(`[ normal ] ${newDealBucketName}`);
    Logging.log(`[ normal ] ${key}`);
  }

  // NOTE(jim): Finally make the deal

  let response = {};
  let error = {};
  try {
    Logging.log(`[ deal-maker ] deal being made for ${key}`);
    if (req.body.data && req.body.data.settings) {
      response = await buckets.archive(key, req.body.data.settings);
    } else {
      response = await buckets.archive(key);
    }
  } catch (e) {
    error.message = e.message;
    error.code = e.code;
    Logging.log(e.message);

    Social.sendTextileSlackMessage({
      file: "/pages/api/data/archive.js",
      user: user,
      message: e.message,
      code: e.code,
      functionName: `buckets.archive`,
    });

    return res.status(500).send({
      decorator: "SERVER_ARCHIVE_DEAL_FAILED",
      error: true,
      message: e.message,
    });
  }

  return res.status(200).send({
    decorator: "SERVER_ARCHIVE",
    data: { response, error },
  });
};
