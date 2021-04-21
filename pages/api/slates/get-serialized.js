import * as Data from "~/node_common/data";
import * as Serializers from "~/node_common/serializers";
import * as Utilities from "~/node_common/utilities";
import * as Strings from "~/common/strings";

export default async (req, res) => {
  const id = Utilities.getIdFromCookie(req);
  if (!id) {
    return res.status(401).send({ decorator: "SERVER_NOT_AUTHENTICATED", error: true });
  }

  const user = await Data.getUserById({
    id,
  });

  if (!user) {
    return res.status(404).send({
      decorator: "SERVER_USER_NOT_FOUND",
      error: true,
    });
  }

  if (user.error) {
    return res.status(500).send({
      decorator: "SERVER_USER_NOT_FOUND",
      error: true,
    });
  }

  let slate;
  if (req.body.data.id) {
    slate = await Data.getSlateById({ id: req.body.data.id, includeFiles: true, sanitize: true });
  } else if (req.body.data.username && req.body.data.slatename) {
    slate = await Data.getSlateByName({
      username: req.body.data.username,
      slatename: req.body.data.slatename,
      includeFiles: true,
      sanitize: true,
    });
  }

  if (!slate || slate.error) {
    return res.status(404).send({
      decorator: "SERVER_GET_SERIALIZED_SLATE_SLATE_NOT_FOUND",
      error: true,
    });
  }

  if (!slate.isPublic && slate.ownerId !== id) {
    return res.status(403).send({
      decorator: "SERVER_GET_SERIALIZED_SLATE_PRIVATE_ACCESS_DENIED",
      error: true,
    });
  }

  let owner = await Data.getUserById({ id: slate.ownerId, sanitize: true });

  if (!owner || owner.error) {
    return res.status(200).send({
      decorator: "SERVER_GET_SERIALIZED_SLATE_OWNER_NOT_FOUND",
      data: slate,
    });
  }

  slate.user = owner;

  return res.status(200).send({
    decorator: "SERVER_GET_SERIALIZED_SLATE",
    slate,
  });
};
