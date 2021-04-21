import * as Data from "~/node_common/data";
import * as Serializers from "~/node_common/serializers";
import * as Strings from "~/common/strings";

export default async (req, res) => {
  let user;

  if (req.body.data.id) {
    user = await Data.getUserById({
      id: req.body.data.id,
      sanitize: true,
      includeFiles: true,
      publicOnly: true,
    });
  } else if (req.body.data.username) {
    user = await Data.getUserByUsername({
      username: req.body.data.username.toLowerCase(),
      includeFiles: true,
      sanitize: true,
      publicOnly: true,
    });
  } else {
    return res.status(400).send({
      decorator: "SERVER_GET_USER_NO_USER_PROVIDED",
      error: true,
    });
  }

  if (!user) {
    return res.status(404).send({
      decorator: "SERVER_GET_USER_USER_NOT_FOUND",
      error: true,
    });
  }

  if (user.error) {
    return res.status(500).send({
      decorator: "SERVER_GET_USER_USER_NOT_FOUND",
      error: true,
    });
  }

  return res.status(200).send({
    decorator: "SERVER_GET_USER",
    data: user,
  });
};
