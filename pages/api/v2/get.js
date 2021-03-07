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
      decorator: "V2_GET_NOT_FOUND",
      error: true,
    });
  }

  if (key.error) {
    return res.status(500).send({
      decorator: "V2_GET_NOT_FOUND",
      error: true,
    });
  }

  const id = key.ownerId;

  let user = await Data.getUserById({
    id,
    includeFiles: true,
    sanitize: true,
  });

  if (!user) {
    return res.status(404).send({ decorator: "V2_GET_USER_NOT_FOUND", error: true });
  }

  if (user.error) {
    return res.status(500).send({ decorator: "V2_GET_USER_NOT_FOUND", error: true });
  }

  const slates = await Data.getSlatesByUserId({
    ownerId: id,
    sanitize: true,
    includeFiles: true,
  });

  if (!slates) {
    return res.status(404).send({
      decorator: "V2_GET_SLATES_NOT_FOUND",
      error: true,
    });
  }

  if (slates.error) {
    return res.status(500).send({
      decorator: "V2_GET_SLATES_NOT_FOUND",
      error: true,
    });
  }

  slates = slates.map((each) => {
    each.data.url = `https://slate.host/${user.username}/${each.slatename}`;
    return each;
  });

  return res.status(200).send({ decorator: "V2_GET", user, slates });
};
