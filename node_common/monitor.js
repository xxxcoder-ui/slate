import * as Data from "~/node_common/data";
import * as Social from "~/node_common/social";

// export const deal = ({ userId, data }) => {
// try {
//   // NOTE(jim):
//   // <VIEWER>, CREATED DEAL
//   // Data.createActivity({
//   //   userId,
//   //   data: { type: "USER_DEAL", actorUserId: data.actorUserId, context: data.context },
//   // });

//   const userProfileURL = `https://slate.host/${data.context.username}`;
//   const userURL = `<${userProfileURL}|${data.context.username}>`;
//   const message = `*${userURL}* made a one-off storage deal with bucket "${data.context.bucketName}".`;

//   Social.sendSlackMessage(message);
// } catch (e) {
//   console.log(e);
// }
// };

// export const createUser = ({ user }) => {
// try {
//   // NOTE(jim):
//   // <VIEWER>, CREATED ACCOUNT
//   const userProfileURL = `https://slate.host/${user.username}`;
//   const userURL = `<${userProfileURL}|${user.username}>`;
//   const message = `*${userURL}* joined the movement.`;

//   Social.sendSlackMessage(message);
// } catch (e) {
//   console.log(e);
// }
// };

export const createSlate = ({ owner, slate }) => {
  if (!slate.isPublic) return;

  Data.createActivity({
    ownerId: owner.id,
    slateId: slate.id,
    type: "CREATE_SLATE",
  });

  // try {
  //   // NOTE(jim):
  //   // <VIEWER> CREATED <SLATE>
  //   Data.createActivity({
  //     ownerId: user.id,
  //     slateId: slate.id,
  //     type: "CREATE_SLATE",
  //   });

  //   const userProfileURL = `https://slate.host/${user.username}`;
  //   const userURL = `<${userProfileURL}|${user.username}>`;
  //   const message = `*${userURL}* created a collection: https://slate.host/${user.username}/${slate.slatename}`;

  //   Social.sendSlackMessage(message);
  // } catch (e) {
  //   console.log(e);
  // }
};

export const createSlateObjects = ({ owner, slate, files }) => {
  if (!slate.isPublic) return;

  let activityItems = [];
  for (let file of files) {
    activityItems.push({
      ownerId: owner.id,
      slateId: slate.id,
      fileId: file.id,
      type: "CREATE_SLATE_OBJECT",
    });
  }

  Data.createActivity(activityItems);

  // try {
  //   Data.createActivity(activityItems);

  //   const userProfileURL = `https://slate.host/${user.username}`;
  //   const userURL = `<${userProfileURL}|${user.username}>`;
  //   const objectURL = `<https://slate.host/${user.username}/${slate.slatename}/cid:${files[0].cid}|${files[0].cid}>`;
  //   const extra =
  //     files.length > 1
  //       ? `and ${files.length - 1} other file${files.length - 1 > 1 ? "s " : " "}`
  //       : "";
  //   const message = `*${userURL}* added ${objectURL} ${extra}to https://slate.host/${user.username}/${slate.slatename}`;

  //   Social.sendSlackMessage(message);
  // } catch (e) {
  //   console.log(e);
  // }
};

export const createFiles = ({ owner, files }) => {
  let activityItems = [];
  for (let file of files) {
    activityItems.push({
      ownerId: owner.id,
      fileId: file.id,
      type: "CREATE_FILE",
    });
  }

  Data.createActivity(activityItems);
};

export const saveCopies = ({ owner, files, slate }) => {
  let activityItems = [];
  for (let file of files) {
    activityItems.push({
      ownerId: owner.id,
      slateId: slate?.id,
      fileId: file.id,
      type: "SAVE_COPY",
    });
  }

  Data.createActivity(activityItems);
};

export const downloadFiles = ({ owner, files }) => {
  let activityItems = [];
  for (let file of files) {
    activityItems.push({
      ownerId: owner.id,
      fileId: file.id,
      type: "DOWNLOAD_FILE",
    });
  }

  Data.createActivity(activityItems);
};

export const toggleSlatePublic = ({ owner, slate }) => {
  Data.createActivity({
    type: "SLATE_VISIBLE",
    ownerId: owner.id,
    slateId: slate.id,
  });
};

export const toggleFilePublic = ({ owner, file }) => {
  Data.createActivity({
    type: "FILE_VISIBLE",
    ownerId: owner.id,
    fileId: file.id,
  });
};

export const subscribeUser = ({ owner, user }) => {
  try {
    Data.createActivity({
      type: "SUBSCRIBE_USER",
      ownerId: owner.id,
      userId: user.id,
    });

    const userProfileURL = `https://slate.host/${owner.username}`;
    const userURL = `<${userProfileURL}|${owner.username}>`;

    const targetUserProfileURL = `https://slate.host/${owner.username}`;
    const targetUserURL = `<${targetUserProfileURL}|${owner.username}>`;

    const message = `*${userURL}* subscribed to ${targetUserURL}`;
    Social.sendSlackMessage(message);
  } catch (e) {
    console.log(e);
  }
};

export const subscribeSlate = ({ owner, slate }) => {
  try {
    Data.createActivity({
      type: "SUBSCRIBE_SLATE",
      ownerId: owner.id,
      slateId: slate.id,
      userId: slate.ownerId,
    });

    const userProfileURL = `https://slate.host/${owner.username}`;
    const userURL = `<${userProfileURL}|${owner.username}>`;

    const targetSlatePageURL = `https://slate.host/$/${slate.id}`;
    const targetSlateURL = `<${targetSlatePageURL}|${slate.id}>`;

    const message = `*${userURL}* subscribed to collection:${targetSlateURL}`;
    Social.sendSlackMessage(message);
  } catch (e) {
    console.log(e);
  }
};
