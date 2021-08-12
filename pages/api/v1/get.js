import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as Powergate from "~/node_common/powergate";
import * as RequestUtilities from "~/node_common/request-utilities";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationExternal(req, res);
  if (!userInfo) return;
  const { id, key, user } = userInfo;

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
        ...file,
        ...file.data,
        data: null,
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
      },
    };
  });

  return res
    .status(200)
    .send({ decorator: "V1_GET", slates: reformattedSlates, user: reformattedUser });
};
