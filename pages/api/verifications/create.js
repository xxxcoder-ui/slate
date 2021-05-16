import * as Data from "~/node_common/data";
import * as Validations from "~/common/validations";

import crypto from "crypto";

export default async (req, res) => {
  if (!Strings.isEmpty(Environment.ALLOWED_HOST) && req.headers.host !== Environment.ALLOWED_HOST) {
    return res
      .status(403)
      .send({ decorator: "SERVER_CREATE_VERIFICATION_NOT_ALLOWED", error: true });
  }

  if (!Validations.username(req.body.data.username)) {
    return res
      .status(500)
      .send({ decorator: "SERVER_CREATE_VERIFICATION_INVALID_EMAIL", error: true });
  }

  const code = crypto.randomBytes(5).toString("hex");
  const verification = await Data.createVerification({ email: req.body.email, code: code });

  if (!verification) {
    return res.status(404).send({ decorator: "SERVER_CREATE_VERIFICATION_FAILED", error: true });
  }
  if (verification.error) {
    return res.status(404).send({ decorator: "SERVER_CREATE_VERIFICATION_FAILED", error: true });
  }
  return res.status(200).send({
    decorator: "SERVER_CREATE_VERIFICATION",
    user: { email: verification.email, sid: verification.sid },
  });
};
