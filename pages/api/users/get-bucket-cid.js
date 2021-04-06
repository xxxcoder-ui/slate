import * as Data from "~/node_common/data";
import * as Utilities from "~/node_common/utilities";

export default async (req, res) => {
  const username = req.body.data.username;
  if (!username) {
    return res.status(500).send({ decorator: "SERVER_EDIT_DATA", error: true });
  }

  const user = await Data.getUserByUsername({ username });

  if (!user || user.error) {
    return res.status(403).send({ decorator: "SERVER_EDIT_DATA_USER_NOT_FOUND", error: true });
  }

  const { bucketRoot } = await Utilities.getBucketAPIFromUserToken({
    user,
  });

  return res.status(200).send({
    decorator: "SERVER_EDIT_DATA",
    data: bucketRoot?.path,
  });
};
