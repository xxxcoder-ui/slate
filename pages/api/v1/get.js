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

  let user = await Data.getUserById({
    id: key.ownerId,
  });

  if (!user) {
    return res.status(404).send({ decorator: "V1_GET_SLATE_USER_NOT_FOUND", error: true });
  }

  if (user.error) {
    return res.status(500).send({ decorator: "V1_GET_SLATE_USER_NOT_FOUND", error: true });
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
    publicOnly: req.body.data && req.body.data.private ? false : true,
  });

  if (!slates) {
    return res.status(404).send({
      decorator: "V1_GET_SLATES_NOT_FOUND",
      error: true,
    });
  }

  if (slates.error) {
    return res.status(500).send({
      decorator: "V1_GET_SLATES_NOT_FOUND",
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
      published_at: null,
      slatename: slate.slatename,
      url: `https://slate.host/${user.username}/${each.slatename}`,
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
