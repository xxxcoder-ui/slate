import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as Powergate from "~/node_common/powergate";
import * as RequestUtilities from "~/node_common/request-utilities";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationExternal(req, res);
  if (!userInfo) return;
  const { id, key, user } = userInfo;

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
