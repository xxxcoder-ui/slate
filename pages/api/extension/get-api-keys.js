import * as Data from "~/node_common/data";
import * as Utilities from "~/node_common/utilities";

export default async (req, res) => {
  let token = req.body.data?.token;
  if (!token) {
    return res.status(400).send({ decorator: "NO_TOKEN_PROVIDED", error: true });
  }

  const id = Utilities.getIdFromCookieValue(token);

  if (!id) {
    return res.status(401).send({ decorator: "SERVER_NOT_AUTHENTICATED", error: true });
  }

  const keys = await Data.getAPIKeysByUserId({
    userId: id,
  });

  if (!keys) {
    return res.status(404).send({
      decorator: "SERVER_USER_NOT_FOUND",
      error: true,
    });
  }

  if (keys.error) {
    return res.status(500).send({
      decorator: "SERVER_USER_NOT_FOUND",
      error: true,
    });
  }

  return res.status(200).send({ decorator: "SERVER_GET_API_KEYS", data: keys });
};
