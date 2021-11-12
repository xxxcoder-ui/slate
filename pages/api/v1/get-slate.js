import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as RequestUtilities from "~/node_common/request-utilities";
import * as Conversions from "~/common/conversions";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationExternal(req, res);
  if (!userInfo) return;
  const { id, key, user } = userInfo;

  let slateId = req.body.data ? req.body.data.id : null;

  if (Strings.isEmpty(slateId)) {
    return res.status(400).send({ decorator: "NO_SLATE_ID_PROVIDED", error: true });
  }

  let slate = await Data.getSlateById({ id: slateId, includeFiles: true });

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

  let reformattedSlate = Conversions.convertToV1Slate(slate);

  return res.status(200).send({ decorator: "V1_GET_SLATE", slate: reformattedSlate });
};
