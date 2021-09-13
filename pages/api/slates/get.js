import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Serializers from "~/node_common/serializers";
import * as Strings from "~/common/strings";

export default async (req, res) => {
  const response = await Data.getSlateById({
    id: req.body.data.id,
    includeFiles: true,
  });

  if (!response) {
    return res.status(404).send({ decorator: "SERVER_GET_SLATE_NOT_FOUND", error: true });
  }

  if (response.error) {
    return res.status(500).send({ decorator: "SERVER_GET_SLATE_NOT_FOUND", error: true });
  }

  if (!response.isPublic) {
    const id = Utilities.getIdFromCookie(req);

    if (!ownerId || response.ownerId !== id) {
      return res.status(403).send({
        decorator: "SERVER_GET_SLATE_PRIVATE_ACCESS_DENIED",
        error: true,
      });
    }
  }

  return res.status(200).send({ decorator: "SERVER_GET_SLATE", slate: response });
};
