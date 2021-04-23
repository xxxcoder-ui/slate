import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as Powergate from "~/node_common/powergate";

export default async (req, res) => {
  if (Strings.isEmpty(req.headers.authorization)) {
    return res.status(404).send({
      decorator: "NO_API_KEY_PROVIDED",
      error: true,
    });
  }

  const parsed = Strings.getKey(req.headers.authorization);

  const key = await Data.getAPIKeyByKey({
    key: parsed,
  });

  if (!key) {
    return res.status(403).send({
      decorator: "NO_MATCHING_API_KEY_FOUND",
      error: true,
    });
  }

  if (key.error) {
    return res.status(500).send({
      decorator: "ERROR_WHILE_VERIFYING_API_KEY",
      error: true,
    });
  }

  const user = await Data.getUserById({
    id: key.ownerId,
  });

  if (!user) {
    return res.status(404).send({ decorator: "API_KEY_OWNER_NOT_FOUND", error: true });
  }

  if (user.error) {
    return res.status(500).send({ decorator: "ERROR_WHILE_LOCATING_API_KEY_OWNER", error: true });
  }

  let slateId = req.body.data ? req.body.data.id : null;

  if (Strings.isEmpty(slateId)) {
    return res.status(400).send({ decorator: "NO_SLATE_ID_PROVIDED", error: true });
  }

  let slate = await Data.getSlateById({ id: slateId, includeFiles: true, sanitize: true });

  if (!slate) {
    return res.status(404).send({
      decorator: "SLATE_NOT_FOUND",
      error: true,
    });
  }

  if (slate.error) {
    return res.status(500).send({
      decorator: "ERROR_WHILE_LOCATING_SLATE",
      error: true,
    });
  }

  if (!slate.isPublic && slate.ownerId !== user.id) {
    return res.status(400).send({ decorator: "SLATE_IS_PRIVATE", error: true });
  }

  //NOTE(martina): convert the new database structure to the old structure
  let reformattedObjects = slate.objects.map((file) => {
    return {
      ...file,
      ...file.data,
      data: null,
      url: Strings.getURLfromCID(file.cid),
    };
  });

  let reformattedSlate = {
    id: slate.id,
    updated_at: slate.updatedAt,
    created_at: slate.createdAt,
    slatename: slate.slatename,
    data: {
      name: slate.data.name,
      public: slate.isPublic,
      objects: reformattedObjects,
      ownerId: slate.ownerId,
      layouts: slate.data.layouts,
    },
  };

  return res.status(200).send({ decorator: "V1_GET_SLATE", slate: reformattedSlate });
};
