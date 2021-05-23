import * as Data from "~/node_common/data";

export default async (req, res) => {
  const verification;

  if (req.body.data.sid) {
    verification = await Data.deleteVerificationBySid({
      sid: req.body.sid,
    });
  } else if (req.body.email) {
    verification = await Data.deleteVerificationByEmail({
      email: req.body.data.username.toLowerCase(),
    });
  } else {
    return res.status(400).send({
      decorator: "SERVER_DELETE_VERIFICATION_NO_VERIFICATION_PROVIDED",
      error: true,
    });
  }

  if (!verification) {
    return res.status(404).send({
      decorator: "SERVER_DELETE_VERIFICATION_ERROR",
      error: true,
    });
  }

  if (verification.error) {
    return res.status(500).send({
      decorator: "SERVER_GET_VERIFICATION_ERROR",
      error: true,
    });
  }

  return res.status(200).send({
    decorator: "SERVER_DELETE_VERIFICATION",
  });
};
