import * as Data from "~/node_common/data";
import * as Social from "~/node_common/social";

// export const createSlate = ({ owner, slate }) => {
//   if (!slate.isPublic) return;

//   Data.createActivity({
//     ownerId: owner.id,
//     slateId: slate.id,
//     type: "CREATE_SLATE",
//   });
// };

// export const createSlateObjects = ({ owner, slate, files }) => {
//   if (!slate.isPublic) return;

//   let activityItems = [];
//   for (let file of files) {
//     activityItems.push({
//       ownerId: owner.id,
//       slateId: slate.id,
//       fileId: file.id,
//       type: "CREATE_SLATE_OBJECT",
//     });
//   }

//   Data.createActivity(activityItems);
// };

// export const likeFile = ({ owner, file }) => {
//   Data.createActivity({
//     type: "LIKE_FILE",
//     ownerId: owner.id,
//     fileId: file.id,
//   });
// };

// export const createFiles = ({ owner, files }) => {
//   let activityItems = [];
//   for (let file of files) {
//     activityItems.push({
//       ownerId: owner.id,
//       fileId: file.id,
//       type: "CREATE_FILE",
//     });
//   }

//   Data.createActivity(activityItems);
// };

// export const saveCopies = ({ owner, files, slate }) => {
//   let activityItems = [];
//   for (let file of files) {
//     activityItems.push({
//       ownerId: owner.id,
//       slateId: slate?.id,
//       fileId: file.id,
//       type: "SAVE_COPY",
//     });
//   }

//   Data.createActivity(activityItems);
// };

// export const downloadFiles = ({ owner, files }) => {
//   let activityItems = [];
//   for (let file of files) {
//     activityItems.push({
//       ownerId: owner.id,
//       fileId: file.id,
//       type: "DOWNLOAD_FILE",
//     });
//   }

//   Data.createActivity(activityItems);
// };

// export const toggleSlatePublic = ({ owner, slate }) => {
//   Data.createActivity({
//     type: "SLATE_VISIBLE",
//     ownerId: owner.id,
//     slateId: slate.id,
//   });
// };

// export const toggleFilePublic = ({ owner, file }) => {
//   Data.createActivity({
//     type: "FILE_VISIBLE",
//     ownerId: owner.id,
//     fileId: file.id,
//   });
// };

// export const subscribeUser = ({ owner, user }) => {
//   try {
//     Data.createActivity({
//       type: "SUBSCRIBE_USER",
//       ownerId: owner.id,
//       userId: user.id,
//     });

//     const userProfileURL = `https://slate.host/${owner.username}`;
//     const userURL = `<${userProfileURL}|${owner.username}>`;

//     const targetUserProfileURL = `https://slate.host/${owner.username}`;
//     const targetUserURL = `<${targetUserProfileURL}|${owner.username}>`;

//     const message = `*${userURL}* subscribed to ${targetUserURL}`;
//     Social.sendSlackMessage(message);
//   } catch (e) {
//     console.log(e);
//   }
// };

// export const subscribeSlate = ({ owner, slate }) => {
//   try {
//     Data.createActivity({
//       type: "SUBSCRIBE_SLATE",
//       ownerId: owner.id,
//       slateId: slate.id,
//       userId: slate.ownerId,
//     });

//     const userProfileURL = `https://slate.host/${owner.username}`;
//     const userURL = `<${userProfileURL}|${owner.username}>`;

//     const targetSlatePageURL = `https://slate.host/$/${slate.id}`;
//     const targetSlateURL = `<${targetSlatePageURL}|${slate.id}>`;

//     const message = `*${userURL}* subscribed to collection:${targetSlateURL}`;
//     Social.sendSlackMessage(message);
//   } catch (e) {
//     console.log(e);
//   }
// };
