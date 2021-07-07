import * as Environment from "~/node_common/environment";
import * as Data from "~/node_common/data";
import * as Utilities from "~/node_common/utilities";
import * as Serializers from "~/node_common/serializers";

export default async (req, res) => {
  const user = await Data.getUserByUsername({
    username: req.body.data.username.toLowerCase(),
  });

  if (!user) {
    return res.status(200).send({ decorator: "SERVER_CHECK_USERNAME" });
  }

  if (user.error) {
    return res.status(500).send({ decorator: "SERVER_USER_NOT_FOUND", error: true });
  }

  return res.status(200).send({ decorator: "SERVER_CHECK_USERNAME", data: true });
};
