import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Serializers from "~/node_common/serializers";
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
    return res.status(404).send({ decorator: "SERVER_USER_NOT_FOUND", error: true });
  }

  if (user.error) {
    return res.status(500).send({ decorator: "SERVER_USER_NOT_FOUND", error: true });
  }

  let files;
  if (req.body.data.files) {
    files = req.body.data.files;
  } else if (req.body.data.file) {
    files = [req.body.data.file];
  } else {
    return res
      .status(400)
      .send({ decorator: "SERVER_CREATE_DOWNLOAD_ACTIVITY_NO_FILE_PROVIDED", error: true });
  }

  await Data.createDownload({ userId: id, files });

  return res.status(200).send({ decorator: "SERVER_CREATE_DOWNLOAD_ACTIVITY", data: true });
};
