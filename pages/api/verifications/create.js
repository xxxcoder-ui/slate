import * as Data from "~/node_common/data";
import * as Validations from "~/common/validations";
import * as Strings from "~/common/strings";
import * as Environment from "~/node_common/environment";
import * as Utilities from "~/common/utilities";
import { sendTemplate } from "~/node_common/managers";

export default async (req, res) => {
  if (!Strings.isEmpty(Environment.ALLOWED_HOST) && req.headers.host !== Environment.ALLOWED_HOST) {
    return res
      .status(403)
      .send({ decorator: "SERVER_CREATE_VERIFICATION_NOT_ALLOWED", error: true });
  }

  if (!Validations.email(req.body?.data?.email)) {
    return res
      .status(500)
      .send({ decorator: "SERVER_CREATE_VERIFICATION_INVALID_EMAIL", error: true });
  }

  const userEmail = req.body.data.email.toLowerCase();

  const pin = Utilities.generateRandomNumberInRange(111111, 999999);
  const verification = await Data.createVerification({ email: userEmail, pin });
  const confTemplateId = "d-823d8ae5e838452f903e94ee4115bffc";
  const slateEmail = "hello@slate.host",

  const sentEmail = await sendTemplate({userEmail, slateEmail, confTemplateId, pin});
  if (sentEmail.error) {
    res.status(500).send({ decorator: email.decorator, error: true });
  }

  if (!verification) {
    return res.status(404).send({ decorator: "SERVER_CREATE_VERIFICATION_FAILED", error: true });
  }
  if (verification.error) {
    return res.status(404).send({ decorator: "SERVER_CREATE_VERIFICATION_FAILED", error: true });
  }
  return res.status(200).send({
    decorator: "SERVER_CREATE_VERIFICATION",
    token: verification.sid,
  });
};
