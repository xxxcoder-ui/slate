import * as Data from "~/node_common/data";
import * as Serializers from "~/node_common/serializers";
import * as Utilities from "~/node_common/utilities";
import * as Strings from "~/common/strings";

export default async (req, res) => {
  let slate;
  if (req.body.data.id) {
    slate = await Data.getSlateById({ id: req.body.data.id, includeFiles: true });
  } else if (req.body.data.username && req.body.data.slatename) {
    slate = await Data.getSlateByName({
      username: req.body.data.username,
      slatename: req.body.data.slatename,
      includeFiles: true,
    });
  }

  if (!slate || slate.error) {
    return res.status(404).send({
      decorator: "SERVER_GET_SERIALIZED_SLATE_SLATE_NOT_FOUND",
      error: true,
    });
  }

  if (!slate.isPublic) {
    const id = Utilities.getIdFromCookie(req);

    if (slate.ownerId !== id) {
      return res.status(403).send({
        decorator: "SERVER_GET_SERIALIZED_SLATE_PRIVATE_ACCESS_DENIED",
        error: true,
      });
    }
  }

  let owner = await Data.getUserById({ id: slate.ownerId, sanitize: true });

  if (!owner || owner.error) {
    return res.status(200).send({
      decorator: "SERVER_GET_SERIALIZED_SLATE_OWNER_NOT_FOUND",
      data: slate,
    });
  }

  let slates = await Data.getSlatesByUserId({
    ownerId: owner.id,
    // includeFiles: true,
    publicOnly: true,
  });

  if (slates && !slates.error) {
    owner.slates = slates;
  }

  slate.owner = owner;

  return res.status(200).send({
    decorator: "SERVER_GET_SERIALIZED_SLATE",
    data: slate,
  });
};
