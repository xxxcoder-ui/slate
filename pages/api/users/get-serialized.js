import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as Utilities from "~/node_common/utilities";

export default async (req, res) => {
  let user;

  if (req.body.data.id) {
    user = await Data.getUserById({
      id: req.body.data.id,
      includeFiles: true,
      sanitize: true,
      publicOnly: true,
    });
  } else if (req.body.data.username) {
    user = await Data.getUserByUsername({
      username: req.body.data.username,
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

  let slates = await Data.getSlatesByUserId({
    ownerId: user.id,
    includeFiles: true,
    publicOnly: true,
  });

  if (slates && !slates.error) {
    user.slates = slates;
  } else {
    return res.status(200).send({
      decorator: "SERVER_GET_SERIALIZED_USER_MISSING_SERIALIZATION",
      data: user,
    });
  }

  return res.status(200).send({
    decorator: "SERVER_GET_SERIALIZED_USER",
    data: user,
  });
};
