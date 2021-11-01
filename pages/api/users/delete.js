import * as Environment from "~/node_common/environment";
import * as Data from "~/node_common/data";
import * as Utilities from "~/node_common/utilities";
import * as Social from "~/node_common/social";
import SearchManager from "~/node_common/managers/search";
import * as RequestUtilities from "~/node_common/request-utilities";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationInternal(req, res);
  if (!userInfo) return;
  const { id, user } = userInfo;

  // NOTE(jim): remove their public slates and files from the search cache.
  let slates = await Data.getSlatesByUserId({ ownerId: id, publicOnly: true });
  SearchManager.deleteSlate(slates);

  let files = await Data.getFilesByUserId({ id, publicOnly: true });
  SearchManager.deleteFile(files);

  //NOTE(migration): may be able to just condense these two parts since they return it from delete anyways
  // NOTE(jim): delete all of their public and private slates.
  slates = await Data.deleteSlatesByUserId({ ownerId: id });

  // NOTE(martina): delete all of their public and private files.
  files = await Data.deleteFilesByUserId({ ownerId: id });

  const defaultData = await Utilities.getBucket({ user });

  // NOTE(jim): delete every bucket
  try {
    const roots = await defaultData.buckets.list();

    for (let i = 0; i < roots.length; i++) {
      await defaultData.buckets.remove(roots[i].key);
    }
  } catch (e) {
    Social.sendTextileSlackMessage({
      file: "/pages/api/users/delete.js",
      user,
      message: e.message,
      code: e.code,
      functionName: `b.remove`,
    });
  }

  SearchManager.deleteUser(user);

  // NOTE(jim): remove orphan
  await Data.createOrphan({
    data: { token: user.textileKey },
  });

  // NOTE(jim): finally delete user by id (irreversible)
  const deleted = await Data.deleteUserById({ id: user.id });

  if (!deleted || deleted.error) {
    return res.status(500).send({ decorator: "SERVER_USER_DELETE", error: true });
  }

  return res.status(200).send({ decorator: "SERVER_USER_DELETE", deleted });
};
