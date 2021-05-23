import * as Data from "~/node_common/data";
export default async (req, res) => {
  //NOTE(toast): restrict pruning old verifications to backend to prevent DoS
  if (!Strings.isEmpty(Environment.ALLOWED_HOST) && req.headers.host !== Environment.ALLOWED_HOST) {
    return res
      .status(403)
      .send({ decorator: "SERVER_PRUNE_VERIFICATION_NOT_ALLOWED", error: true });
  }
  prune = await Data.pruneVerifications();

  if (prune.error || !prune) {
    return res.status(404).send({
      decorator: "SERVER_PRUNE_VERIFICATIONS_FAILED",
    });
  }

  return res.status(200).send({
    decorator: "SERVER_PRUNE_VERIFICATIONS",
  });
};
