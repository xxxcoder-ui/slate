import * as Data from "~/node_common/data";

export default async (req, res) => {
  const verification;

  if (req.body.data.sid) {
    verification = await Data.getVerificationBySid({
      sid: req.body.sid,
    });
  } else if (req.body.email) {
    verification = await Data.getVerificationByEmail({
      email: req.body.data.username.toLowerCase(),
    });
  } else {
    return res.status(400).send({
      decorator: "SERVER_GET_VERIFICATION_NO_VERIFICATION_PROVIDED",
      error: true,
    });
  }

  if (!verification) {
    return res.status(404).send({
      decorator: "SERVER_GET_VERIFICATION_VERIFICATION_NOT_FOUND",
      error: true,
    });
  }

  if (verification.error) {
    return res.status(500).send({
      decorator: "SERVER_GET_VERIFICATION_VERIFICATION_NOT_FOUND",
      error: true,
    });
  }

  return res.status(200).send({
    decorator: "SERVER_GET_VERIFICATION",
    data: verification,
  });
};
