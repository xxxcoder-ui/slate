import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as Environment from "~/node_common/environment";
import * as EmailManager from "~/node_common/managers/emails";
import * as Constants from "~/node_common/constants";

// NOTE(amine): this endpoint is rate limited in ./server.js,
export default async (req, res) => {
  if (!Strings.isEmpty(Environment.ALLOWED_HOST) && req.headers.host !== Environment.ALLOWED_HOST) {
    return res
      .status(403)
      .send({ decorator: "SERVER_EMAIL_VERIFICATION_NOT_ALLOWED", error: true });
  }

  if (Strings.isEmpty(req.body.data.token)) {
    return res
      .status(500)
      .send({ decorator: "SERVER_EMAIL_VERIFICATION_INVALID_TOKEN", error: true });
  }

  const verification = await Data.getVerificationBySid({
    sid: req.body.data.token,
  });

  if (!verification) {
    return res.status(404).send({ decorator: "SERVER_EMAIL_VERIFICATION_FAILED", error: true });
  }
  if (verification.error) {
    return res.status(404).send({ decorator: "SERVER_EMAIL_VERIFICATION_FAILED", error: true });
  }

  const isTokenExpired =
    new Date() - new Date(verification.createdAt) > Constants.TOKEN_EXPIRATION_TIME;
  if (isTokenExpired) {
    return res.status(401).send({ decorator: "SERVER_EMAIL_VERIFICATION_FAILED", error: true });
  }

  const confTemplateId = "d-823d8ae5e838452f903e94ee4115bffc";
  const slateEmail = "hello@slate.host";

  const sentEmail = await EmailManager.sendTemplate({
    to: verification.email,
    from: slateEmail,
    templateId: confTemplateId,
    templateData: { confirmation_code: verification.pin },
  });

  if (sentEmail?.error) {
    return res.status(500).send({ decorator: sentEmail.decorator, error: true });
  }

  return res.status(200).send({
    decorator: "SERVER_EMAIL_VERIFICATION_RESEND_SUCCESS",
  });
};
