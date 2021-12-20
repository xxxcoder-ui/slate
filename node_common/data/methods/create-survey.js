import { runQuery } from "~/node_common/data/utilities";

export default async ({
  ownerId,
  prevToolsDropbox,
  prevToolsArena,
  prevToolsPinterest,
  prevToolsGoogleDrive,
  prevToolsBrowserBookmarks,
  prevToolsOther,

  useCasesPersonalStorage,
  useCasesPublicFileSharing,
  useCasesArchiving,
  useCasesBookmarking,
  useCasesMoodboarding,
  useCasesOther,

  referralFriend,
  referralTwitter,
  referralIpfsFilecoinCommunity,
  referralOther,
}) => {
  return await runQuery({
    label: "CREATE_SURVEYS",
    queryFn: async (DB) => {
      let query = await DB.insert({
        ownerId,

        prevToolsDropbox,
        prevToolsArena,
        prevToolsPinterest,
        prevToolsGoogleDrive,
        prevToolsBrowserBookmarks,
        prevToolsOther,

        useCasesPersonalStorage,
        useCasesPublicFileSharing,
        useCasesArchiving,
        useCasesBookmarking,
        useCasesMoodboarding,
        useCasesOther,

        referralFriend,
        referralTwitter,
        referralIpfsFilecoinCommunity,
        referralOther,
      })
        .into("surveys")
        .returning("*");

      if (!query) {
        return null;
      }

      query = query.pop();

      return JSON.parse(JSON.stringify(query));
    },
    errorFn: async () => {
      return {
        error: true,
        decorator: "CREATE_SURVEYS",
      };
    },
  });
};
