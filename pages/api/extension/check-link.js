import * as Data from "~/node_common/data";
import * as RequestUtilities from "~/node_common/request-utilities";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationExternal(req, res);
  if (!userInfo) return;
  const { id, key, user } = userInfo;

  const url = req.body.data.url;
  if (!url) {
    return res.status(400).send({ decorator: "SERVER_CHECK_LINK_NO_LINK_PROVIDED", error: true });
  }

  const existingLink = await Data.getFileByUrl({ ownerId: user.id, url });

  if (existingLink) {
    return res.status(200).send({
      decorator: "LINK_FOUND",
      data: existingLink,
    });
  } else {
    return res.status(200).send({
      decorator: "LINK_NOT_FOUND",
    });
  }
};
