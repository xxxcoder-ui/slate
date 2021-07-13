import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Powergate from "~/node_common/powergate";
import * as Logging from "~/common/logging";
import * as RequestUtilities from "~/node_common/request-utilities";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationInternal(req, res);
  if (!userInfo) return;
  const { id, user } = userInfo;

  const PG = Powergate.get(user);

  try {
    await PG.ffs.sendFil(req.body.data.source, req.body.data.target, req.body.data.amount);
  } catch (e) {
    Logging.error(e);
    return res.status(500).send({ decorator: "SERVER_SEND_FILECOIN_ACTION_FAILURE", error: true });
  }

  return res.status(200).send({ decorator: "SERVER_SEND_FILECOIN" });
};
