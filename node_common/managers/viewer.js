import * as Environment from "~/node_common/environment";
import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Constants from "~/node_common/constants";
import * as Serializers from "~/node_common/serializers";
import * as Social from "~/node_common/social";
import * as Strings from "~/common/strings";
import * as Window from "~/common/window";
import * as Websocket from "~/node_common/nodejs-websocket";
import * as Filecoin from "~/common/filecoin";
import * as Logging from "~/common/logging";

import WebSocket from "ws";

const websocketSend = async (type, data) => {
  if (Strings.isEmpty(Environment.PUBSUB_SECRET)) {
    return;
  }

  let ws = Websocket.get();
  if (!ws) {
    ws = Websocket.create();
    await Window.delay(2000);
  }

  const encryptedData = await Utilities.encryptWithSecret(
    JSON.stringify(data),
    Environment.PUBSUB_SECRET
  );

  // NOTE(jim): Only allow this to be passed around encrypted.
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({
        type,
        iv: encryptedData.iv,
        data: encryptedData.hex,
      })
    );
  }
};

export const hydratePartial = async (
  id,
  { viewer, slates, keys, library, subscriptions, following, followers }
) => {
  if (!id) return;

  let update = { id };

  if (viewer) {
    let user;
    if (library) {
      user = await Data.getUserById({
        id,
        includeFiles: true,
      });
    } else {
      user = await Data.getUserById({
        id,
      });
    }
    update = {
      ...update,
      hasCompletedSurvey: user.hasCompletedSurvey,
      hasCompletedUploadOnboarding: user.hasCompletedUploadOnboarding,
      hasCompletedSlatesOnboarding: user.hasCompletedSlatesOnboarding,
      username: user.username,
      email: user.email,
      library: user.library,
    };
  } else if (library) {
    library = await Data.getFilesByUserId({ id, publicOnly: false });
    update.library = library;
  }

  update.libraryCids =
    update?.library?.reduce((acc, file) => ({ ...acc, [file.cid]: true }), {}) || {};

  if (slates) {
    const slates = await Data.getSlatesByUserId({
      ownerId: id,
      sanitize: true,
      includeFiles: true,
    });
    update.slates = slates;
  }

  if (keys) {
    const keys = await Data.getAPIKeysByUserId({ userId: id });
    update.keys = keys;
  }

  if (subscriptions) {
    const subscriptions = await Data.getSubscriptionsByUserId({ ownerId: id });
    update.subscriptions = subscriptions;
  }

  if (following) {
    const following = await Data.getFollowingByUserId({ ownerId: id });
    update.following = following;
  }

  if (followers) {
    const followers = await Data.getFollowersByUserId({ userId: id });
    update.followers = followers;
  }

  websocketSend("UPDATE", update);
};

export const hydrate = async (id) => {
  let data = getById({ id });
  websocketSend("UPDATE", data);
};

//NOTE(martina): determines whether user is logged in and should be redirected to in-client view
export const shouldRedirect = async ({ id }) => {
  if (Strings.isEmpty(id)) {
    return false;
  }

  const user = await Data.getUserById({
    id,
  });
  if (user && user.id) {
    return true;
  }

  return false;
};

// TODO(jim): Work on better serialization when adoption starts occuring.
export const getById = async ({ id }) => {
  let user = await Data.getUserById({
    id,
    includeFiles: true,
  });

  if (!user) {
    return null;
  }

  if (user.error) {
    return null;
  }

  delete user.password;
  delete user.salt;

  Data.createUsageStat({ id }); //NOTE(martina): to record the person's usage of Slate for analytics

  // user.library = await Data.getFilesByUserId({ id });

  const [slates, keys, subscriptions, following, followers] = (
    await Promise.allSettled([
      Data.getSlatesByUserId({ ownerId: id, includeFiles: true }),
      Data.getAPIKeysByUserId({ userId: id }),
      Data.getSubscriptionsByUserId({ ownerId: id }),
      Data.getFollowingByUserId({ ownerId: id }),
      Data.getFollowersByUserId({ userId: id }),
    ])
  ).map((item) => item.value);

  const libraryCids =
    user?.library?.reduce((acc, file) => ({ ...acc, [file.cid]: true }), {}) || {};

  let cids = {};
  let bytes = 0;
  let imageBytes = 0;
  let videoBytes = 0;
  let audioBytes = 0;
  let epubBytes = 0;
  let pdfBytes = 0;
  for (let each of user.library) {
    if (cids[each.cid]) {
      continue;
    }

    cids[each.cid] = true;
    let { size } = each;
    if (typeof size === "number") {
      bytes += size;
      let { type } = each;
      if (type) {
        if (type.startsWith("image/")) {
          imageBytes += size;
        } else if (type.startsWith("video/")) {
          videoBytes += size;
        } else if (type.startsWith("audio/")) {
          audioBytes += size;
        } else if (type.startsWith("application/epub")) {
          epubBytes += size;
        } else if (type.startsWith("application/pdf")) {
          pdfBytes += size;
        }
      }
    }

    let { coverImage } = each;
    if (coverImage && !cids[coverImage.cid]) {
      cids[coverImage.cid] = true;
      size = coverImage.size;
      if (typeof size === "number") {
        imageBytes += size;
      }
    }
  }

  // const tags = Utilities.getUserTags({ library: user.library });

  let viewer = {
    ...user,
    stats: {
      bytes,
      maximumBytes: Constants.TEXTILE_ACCOUNT_BYTE_LIMIT,
      imageBytes,
      videoBytes,
      audioBytes,
      epubBytes,
      pdfBytes,
    },
    // tags,
    // userBucketCID: bucketRoot?.path || null,
    keys,
    slates,
    subscriptions,
    following,
    followers,
    libraryCids,
  };

  return viewer;
};

export const getDealHistory = async ({ id }) => {
  const user = await Data.getUserById({
    id,
  });

  if (!user) {
    return null;
  }

  if (user.error) {
    return null;
  }

  let deals = [];

  try {
    const FilecoinSingleton = await Utilities.getBucket({ user });
    const { filecoin } = FilecoinSingleton;

    const records = await filecoin.storageDealRecords({
      ascending: false,
      includePending: true,
      includeFinal: true,
    });

    for (let i = 0; i < records.length; i++) {
      const o = records[i];

      deals.push({
        dealId: o.dealInfo.dealId,
        rootCid: o.rootCid,
        proposalCid: o.dealInfo.proposalCid,
        pieceCid: o.dealInfo.pieceCid,
        addr: o.address,
        miner: o.dealInfo.miner,
        size: o.dealInfo.size,
        // NOTE(jim): formatted size.
        formattedSize: Strings.bytesToSize(o.dealInfo.size),
        pricePerEpoch: o.dealInfo.pricePerEpoch,
        startEpoch: o.dealInfo.startEpoch,
        // NOTE(jim): just for point of reference on the total cost.
        totalSpeculatedCost: Filecoin.formatAsFilecoinConversion(
          o.dealInfo.pricePerEpoch * o.dealInfo.duration
        ),
        duration: o.dealInfo.duration,
        formattedDuration: Strings.getDaysFromEpoch(o.dealInfo.duration),
        activationEpoch: o.dealInfo.activationEpoch,
        time: o.time,
        createdAt: Strings.toDateSinceEpoch(o.time),
        pending: o.pending,
        user: Serializers.sanitizeUser(user),
      });
    }
  } catch (e) {
    Logging.error(e);
    Social.sendTextileSlackMessage({
      file: "/node_common/managers/viewer.js",
      user,
      message: e.message,
      code: e.code,
      functionName: `filecoin.storageDealRecords`,
    });
  }

  return { deals };
};

export const getTextileById = async ({ id }) => {
  const user = await Data.getUserById({
    id,
  });

  if (!user) {
    return null;
  }

  if (user.error) {
    return null;
  }

  // NOTE(jim): This bucket is purely for staging data for other deals.
  const stagingData = await Utilities.getBucket({
    user,
    bucketName: Constants.textile.dealsBucket,
  });

  const FilecoinSingleton = await Utilities.getFilecoinAPIFromUserToken({
    user,
  });
  const { filecoin } = FilecoinSingleton;

  let r = null;
  try {
    r = await stagingData.buckets.list();
  } catch (e) {
    Social.sendTextileSlackMessage({
      file: "/node_common/managers/viewer.js",
      user,
      message: e.message,
      code: e.code,
      functionName: `buckets.list`,
    });
  }

  let addresses = null;
  try {
    addresses = await filecoin.addresses();
  } catch (e) {
    Social.sendTextileSlackMessage({
      file: "/node_common/managers/viewer.js",
      user,
      message: e.message,
      code: e.code,
      functionName: `filecoin.addresses`,
    });
  }

  let address = null;
  if (addresses && addresses.length) {
    address = {
      name: addresses[0].name,
      address: addresses[0].address,
      type: addresses[0].type,
      // TODO(jim): Serialize BigInt
      // balance: addresses[0].balance,
    };
  }

  let items = null;
  const dealBucket = r.find((bucket) => bucket.name === Constants.textile.dealsBucket);
  try {
    const path = await stagingData.buckets.listPath(dealBucket.key, "/");
    items = path.item.items;
  } catch (e) {
    Social.sendTextileSlackMessage({
      file: "/node_common/managers/viewer.js",
      user,
      message: e.message,
      code: e.code,
      functionName: `buckets.listPath`,
    });
  }

  const b = await Utilities.getBucket({ user });

  const settings = await b.buckets.defaultArchiveConfig(b.bucketKey);

  return {
    settings: {
      ...settings,
      addr: addresses[0].address,
      renewEnabled: settings.renew.enabled,
      renewThreshold: settings.renew.threshold,
    },
    address,
    deal: items ? items.filter((f) => f.name !== ".textileseed") : [],
  };
};
