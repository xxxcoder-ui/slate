import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as Powergate from "~/node_common/powergate";

export default async (req, res) => {
  if (Strings.isEmpty(req.headers.authorization)) {
    return res.status(404).send({
      decorator: "SERVER_API_KEY_MISSING",
      error: true,
    });
  }

  const parsed = Strings.getKey(req.headers.authorization);

  const key = await Data.getAPIKeyByKey({
    key: parsed,
  });

  if (!key) {
    return res.status(403).send({
      decorator: "V1_GET_SLATE_NOT_FOUND",
      error: true,
    });
  }

  if (key.error) {
    return res.status(500).send({
      decorator: "V1_GET_SLATE_NOT_FOUND",
      error: true,
    });
  }

  const user = await Data.getUserById({
    id: key.ownerId,
  });

  if (!user) {
    return res.status(404).send({ decorator: "V1_GET_SLATE_USER_NOT_FOUND", error: true });
  }

  if (user.error) {
    return res.status(500).send({ decorator: "V1_GET_SLATE_USER_NOT_FOUND", error: true });
  }

  let slateId = req.body.data ? req.body.data.id : null;

  if (Strings.isEmpty(slateId)) {
    return res.status(400).send({ decorator: "V1_GET_SLATE_NO_ID_PROVIDED", error: true });
  }

  let slate = await Data.getSlateById({ id: slateId, includeFiles: true, sanitize: true });

  if (!slate) {
    return res.status(404).send({
      decorator: "V1_GET_SLATE_NOT_FOUND",
      error: true,
    });
  }

  if (slate.error) {
    return res.status(500).send({
      decorator: "V1_GET_SLATE_SLATE_NOT_FOUND",
      error: true,
    });
  }

  if (!slate.isPublic) {
    return res.status(400).send({ decorator: "V1_GET_SLATE_NOT_PUBLIC", error: true });
  }

  //NOTE(martina): convert the new database structure to the old structure
  let reformattedObjects = slate.objects.map((file) => {
    return {
      id: file.id,
      name: file.filename,
      title: file.data.name,
      ownerId: file.ownerId,
      body: file.data.body,
      author: file.data.author,
      source: file.data.source,
      url: Strings.getURLfromCID(file.cid),
    };
  });

  let reformattedSlate = {
    id: slate.id,
    updated_at: slate.updatedAt,
    created_at: slate.createdAt,
    published_at: null,
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
