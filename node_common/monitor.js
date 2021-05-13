import * as Data from "~/node_common/data";
import * as Social from "~/node_common/social";

export const deal = ({ userId, data }) => {
  try {
    // Data.createOrUpdateStats(new Date(), { deals: 1 });

    // NOTE(jim):
    // <VIEWER>, CREATED DEAL
    // Data.createActivity({
    //   userId,
    //   data: { type: "USER_DEAL", actorUserId: data.actorUserId, context: data.context },
    // });

    const userProfileURL = `https://slate.host/${data.context.username}`;
    const userURL = `<${userProfileURL}|${data.context.username}>`;
    const message = `*${userURL}* made a one-off storage deal with bucket "${data.context.bucketName}".`;

    Social.sendSlackMessage(message);
  } catch (e) {
    console.log(e);
  }
};

export const createUser = ({ user }) => {
  try {
    // Data.createOrUpdateStats(new Date(), { users: 1 });

    // NOTE(jim):
    // <VIEWER>, CREATED ACCOUNT
    const userProfileURL = `https://slate.host/${user.username}`;
    const userURL = `<${userProfileURL}|${user.username}>`;
    const message = `*${userURL}* joined the movement.`;

    Social.sendSlackMessage(message);
  } catch (e) {
    console.log(e);
  }
};

// const createSlateActivityForEachSubscriber = async ({ userId, data }) => {
//   const subscriptions = await Data.getSubscriptionsToUserId({ userId });

//   if (subscriptions.length) {
//     for (let i = 0; i < subscriptions.length; i++) {
//       const s = subscriptions[i];

//       // NOTE(jim):
//       // <USER> CREATED <SLATE>
//       Data.createActivity({
//         userId: s.owner_user_id,
//         data: {
//           type: "SUBSCRIBED_CREATE_SLATE",
//           actorUserId: data.actorUserId,
//           context: data.context,
//         },
//       });
//     }
//   }

//   //NOTE(martina): creates the activity event used for explore/discover
//   Data.createActivity({
//     userId: "SLATE",
//     data: {
//       type: "SUBSCRIBED_CREATE_SLATE",
//       actorUserId: data.actorUserId,
//       context: data.context,
//     },
//   });
// };

export const createSlate = ({ user, slate }) => {
  // Data.createOrUpdateStats(new Date(), { slates: 1 });

  if (!slate.isPublic) return;

  try {
    // NOTE(jim):
    // <VIEWER> CREATED <SLATE>
    Data.createActivity({
      ownerId: user.id,
      slateId: slate.id,
      type: "CREATE_SLATE",
    });

    const userProfileURL = `https://slate.host/${user.username}`;
    const userURL = `<${userProfileURL}|${user.username}>`;
    const message = `*${userURL}* created a collection: https://slate.host/${user.username}/${slate.slatename}`;

    Social.sendSlackMessage(message);
  } catch (e) {
    console.log(e);
  }
};

// const createSlateObjectActivityForEachSubscriber = async ({ slateId, userId, data }) => {
//   let subscriptions = await Data.getSubscriptionsToUserId({ userId });

//   if (subscriptions.length) {
//     for (let i = 0; i < subscriptions.length; i++) {
//       const s = subscriptions[i];

//       // NOTE(jim):
//       // <VIEWER> WITNESS <USER> ADDED OBJECT TO <SLATE>
//       Data.createActivity({
//         userId: s.owner_user_id,
//         data: {
//           type: "SUBSCRIBED_ADD_TO_SLATE",
//           actorUserId: data.actorUserId,
//           context: data.context,
//         },
//       });
//     }
//   }

//   subscriptions = await Data.getSubscriptionsToSlateId({ slateId });

//   if (subscriptions.length) {
//     for (let i = 0; i < subscriptions.length; i++) {
//       const s = subscriptions[i];

//       // NOTE(jim):
//       // <VIEWER> WITNESS <USER> ADDED OBJECT TO <SLATE>
//       Data.createActivity({
//         userId: s.owner_user_id,
//         data: {
//           type: "SUBSCRIBED_ADD_TO_SLATE",
//           actorUserId: data.actorUserId,
//           context: data.context,
//         },
//       });
//     }
//   }

//   //NOTE(martina): creates the activity event used for explore/discover
//   Data.createActivity({
//     userId: "SLATE",
//     data: {
//       type: "SUBSCRIBED_ADD_TO_SLATE",
//       actorUserId: data.actorUserId,
//       context: data.context,
//     },
//   });
// };

// export const createSlateObject = ({ slateId, userId, data }) => {
//   Data.createOrUpdateStats(new Date(), { objects: 1 });

//   // TODO(jim): We may do some private tracking here.
//   if (data.context.private) {
//     return;
//   }

//   try {
//     // NOTE(jim):
//     // <USER> ADDED <SLATE OBJECT> TO <VIEWER-SLATE>
//     Data.createActivity({
//       slateId,
//       data: {
//         type: "CREATE_SLATE_OBJECT",
//         actorUserId: data.actorUserId,
//         context: data.context,
//       },
//     });

//     // NOTE(jim):
//     // <VIEWER> WITNESS <USER> ADDED OBJECT TO <SLATE>
//     createSlateObjectActivityForEachSubscriber({ slateId, userId, data });

//     const userProfileURL = `https://slate.host/${data.context.user.username}`;
//     const userURL = `<${userProfileURL}|${data.context.user.username}>`;
//     const objectURL = `<https://slate.host/${data.context.user.username}/${data.context.slate.slatename}/cid:${data.context.file.cid}|${data.context.file.cid}>`;
//     const message = `*${userURL}* added ${objectURL} to https://slate.host/${data.context.user.username}/${data.context.slate.slatename}`;

//     Social.sendSlackMessage(message);
//   } catch (e) {
//     console.log(e);
//   }
// };

export const createSlateObjects = ({ slate, user, files }) => {
  // Data.createOrUpdateStats(new Date(), { objects: files.length });
  if (!slate.isPublic) return;

  let activityItems = [];
  for (let file of files) {
    activityItems.push({
      ownerId: user.id,
      slateId: slate.id,
      fileId: file.id,
      type: "CREATE_SLATE_OBJECT",
    });
  }
  console.log(activityItems);
  try {
    Data.createActivity(activityItems);

    const userProfileURL = `https://slate.host/${user.username}`;
    const userURL = `<${userProfileURL}|${user.username}>`;
    const objectURL = `<https://slate.host/${user.username}/${slate.slatename}/cid:${files[0].cid}|${files[0].cid}>`;
    const extra =
      files.length > 1
        ? `and ${files.length - 1} other file${files.length - 1 > 1 ? "s " : " "}`
        : "";
    const message = `*${userURL}* added ${objectURL} ${extra}to https://slate.host/${user.username}/${slate.slatename}`;

    Social.sendSlackMessage(message);
  } catch (e) {
    console.log(e);
  }
};

// const createSubscribeUserActivityForEachSubscriber = async ({ userId, data }) => {
//   const subscriptions = await Data.getSubscriptionsToUserId({ userId });

//   if (subscriptions.length) {
//     for (let i = 0; i < subscriptions.length; i++) {
//       const s = subscriptions[i];

//       // NOTE(jim):
//       // <VIEWER>, <USER> SUBSCRIBED TO <SUBSCRIBED_USER>
//       Data.createActivity({
//         userId: s.owner_user_id,
//         data: {
//           type: "USER_SUBSCRIBED_TO_SUBSCRIBED_USER",
//           actorUserId: data.actorUserId,
//           context: data.context,
//         },
//       });
//     }
//   }
// };

export const subscribeUser = ({ user, targetUser }) => {
  // Data.createOrUpdateStats(new Date(), { subscribeUsers: 1 });

  try {
    // NOTE(jim):
    // <VIEWER>, YOU SUBSCRIBED TO <USER>
    // Data.createActivity({
    //   userId,
    //   data: {
    //     type: "SUBSCRIBE_USER",
    //     actorUserId: data.actorUserId,
    //     context: data.context,
    //   },
    // });

    // NOTE(jim):
    // <USER>. <VIEWER> SUBSCRIBED TO <USER>
    // Data.createActivity({
    //   userId: data.context.targetUserId,
    //   data: {
    //     type: "RECEIVED_SUBSCRIBER",
    //     actorUserId: data.actorUserId,
    //     context: data.context,
    //   },
    // });

    // NOTE(jim):
    // <VIEWER> WITNESSES <USER> SUBSCRIBE TO <SUBSCRIBED_USER>
    // createSubscribeUserActivityForEachSubscriber({ userId, data });

    const userProfileURL = `https://slate.host/${user.username}`;
    const userURL = `<${userProfileURL}|${user.username}>`;

    const targetUserProfileURL = `https://slate.host/${targetUser.username}`;
    const targetUserURL = `<${targetUserProfileURL}|${targetUser.username}>`;

    const message = `*${userURL}* subscribed to ${targetUserURL}`;
    Social.sendSlackMessage(message);
  } catch (e) {
    console.log(e);
  }
};

export const subscribeSlate = ({ user, targetSlate }) => {
  // Data.createOrUpdateStats(new Date(), { subscribeSlates: 1 });

  try {
    // NOTE(jim):
    // <VIEWER-SLATE>, <USER> HAS SUBSCRIBED
    // Data.createActivity({
    //   slateId,
    //   data: {
    //     type: "USER_SUBSCRIBED_SLATE",
    //     actorUserId: data.actorUserId,
    //     context: data.context,
    //   },
    // });

    // NOTE(jim):
    // <VIEWER>, YOU HAVE SUBSCRIBED TO <SLATE>
    // Data.createActivity({
    //   userId: data.actorUserId,
    //   data: {
    //     type: "SUBSCRIBE_SLATE",
    //     actorUserId: data.actorUserId,
    //     context: data.context,
    //   },
    // });

    const userProfileURL = `https://slate.host/${user.username}`;
    const userURL = `<${userProfileURL}|${user.username}>`;

    const targetSlatePageURL = `https://slate.host/$/${targetSlate.id}`;
    const targetSlateURL = `<${targetSlatePageURL}|${targetSlate.id}>`;

    const message = `*${userURL}* subscribed to collection:${targetSlateURL}`;
    Social.sendSlackMessage(message);
  } catch (e) {
    console.log(e);
  }
};

// export const requestPeer = ({ userId, data }) => {
//   // NOTE(jim): Don't track stats on this.

//   try {
//     // NOTE(jim):
//     // <VIEWER>, <USER> WANTS TO BE YOUR PEER.
//     Data.createActivity({
//       userId,
//       data: {
//         type: "REQUEST_PEER",
//         actorUserId: data.actorUserId,
//         context: data.context,
//       },
//     });

//     const userProfileURL = `https://slate.host/${data.context.username}`;
//     const userURL = `<${userProfileURL}|${data.context.username}>`;

//     const targetUserProfileURL = `https://slate.host/${data.context.targetUsername}`;
//     const targetUserURL = `<${targetUserProfileURL}|${data.context.targetUsername}>`;

//     const message = `*${userURL}* made a request to trust ${targetUserURL}`;
//     Social.sendSlackMessage(message);
//   } catch (e) {
//     console.log(e);
//   }
// };

// export const verifyPeer = ({ userId, data }) => {
//   // NOTE(jim): Don't track stats on this.

//   try {
//     // NOTE(jim):
//     // <VIEWER>, <USER> ACCEPTED YOUR REQUEST.
//     Data.createActivity({
//       userId,
//       data: {
//         type: "VERIFY_PEER",
//         actorUserId: data.actorUserId,
//         context: data.context,
//       },
//     });

//     const userProfileURL = `https://slate.host/${data.context.username}`;
//     const userURL = `<${userProfileURL}|${data.context.username}>`;

//     const targetUserProfileURL = `https://slate.host/${data.context.targetUsername}`;
//     const targetUserURL = `<${targetUserProfileURL}|${data.context.targetUsername}>`;

//     const message = `*${userURL}* has accepted a peer-to-peer relationship with ${targetUserURL}`;
//     Social.sendSlackMessage(message);
//   } catch (e) {
//     console.log(e);
//   }
// };
