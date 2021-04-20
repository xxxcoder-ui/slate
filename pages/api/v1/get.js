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

  let user = await Data.getUserById({
    id: key.ownerId,
  });

  if (!user) {
    return res.status(404).send({ decorator: "API_KEY_OWNER_NOT_FOUND", error: true });
  }

  if (user.error) {
    return res.status(500).send({ decorator: "ERROR_WHILE_LOCATING_API_KEY_OWNER", error: true });
  }

  let reformattedUser = {
    username: user.username,
    data: {
      name: user.data.name,
      photo: user.data.photo,
      body: user.data.body,
    },
  };

  let slates = await Data.getSlatesByUserId({
    ownerId: user.id,
    sanitize: true,
    includeFiles: true,
    publicOnly: !req.body.data?.private,
  });

  if (!slates) {
    return res.status(404).send({
      decorator: "COULD_NOT_FETCH_SLATES",
      error: true,
    });
  }

  if (slates.error) {
    return res.status(500).send({
      decorator: "COULD_NOT_FETCH_SLATES",
      error: true,
    });
  }

  let reformattedSlates = slates.map((slate) => {
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

    return {
      id: slate.id,
      updated_at: slate.updatedAt,
      created_at: slate.createdAt,
      slatename: slate.slatename,
      url: `https://slate.host/${user.username}/${slate.slatename}`,
      data: {
        name: slate.data.name,
        public: slate.isPublic,
        objects: reformattedObjects,
        ownerId: slate.ownerId,
        layouts: slate.data.layouts,
      },
    };
  });

  return res
    .status(200)
    .send({ decorator: "V1_GET", slates: reformattedSlates, user: reformattedUser });
};
