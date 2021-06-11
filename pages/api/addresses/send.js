import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Powergate from "~/node_common/powergate";
import * as Logging from "~/common/logging";

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

  const PG = Powergate.get(user);

  try {
    await PG.ffs.sendFil(req.body.data.source, req.body.data.target, req.body.data.amount);
  } catch (e) {
    Logging.error(e);
    return res.status(500).send({ decorator: "SERVER_SEND_FILECOIN_ACTION_FAILURE", error: true });
  }

  return res.status(200).send({ decorator: "SERVER_SEND_FILECOIN" });
};
