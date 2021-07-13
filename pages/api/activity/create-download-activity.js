import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Serializers from "~/node_common/serializers";
import * as Strings from "~/common/strings";
import * as Monitor from "~/node_common/monitor";
import * as RequestUtilities from "~/node_common/request-utilities";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationInternal(req, res);
  if (!userInfo) return;
  const { id, user } = userInfo;

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
  Monitor.download({ user, files });

  return res.status(200).send({ decorator: "SERVER_CREATE_DOWNLOAD_ACTIVITY", data: true });
};
