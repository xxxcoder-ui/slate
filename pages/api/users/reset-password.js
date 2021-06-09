import * as Environment from "~/node_common/environment";
import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as Validations from "~/common/validations";
import * as Constants from "~/node_common/constants";
import BCrypt from "bcrypt";

export default async (req, res) => {
  if (!Strings.isEmpty(Environment.ALLOWED_HOST) && req.headers.host !== Environment.ALLOWED_HOST) {
    return res.status(403).send({ decorator: "SERVER_RESET_PASSWORD_NOT_ALLOWED", error: true });
  }

  if (Strings.isEmpty(req.body.data.token)) {
    return res.status(500).send({ decorator: "SERVER_RESET_PASSWORD_FAILED", error: true });
  }

  if (!Validations.password(req.body.data.password)) {
    return res.status(500).send({ decorator: "SERVER_RESET_PASSWORD_NO_PASSWORD", error: true });
  }

  const token = req.body.data.token;
  const verification = await Data.getVerificationBySid({
    sid: token,
  });

  if (!verification) {
    return res.status(401).send({ decorator: "SERVER_RESET_PASSWORD_FAILED", error: true });
  }

  if (verification.error) {
    return res.status(401).send({ decorator: "SERVER_RESET_PASSWORD_FAILED", error: true });
  }

  const isTokenExpired =
    new Date() - new Date(verification.createdAt) > Constants.TOKEN_EXPIRATION_TIME;
  if (isTokenExpired) {
    return res.status(401).send({ decorator: "SERVER_RESET_PASSWORD_FAILED", error: true });
  }

  if (
    verification.type !== "password_reset" ||
    !verification.isVerified ||
    verification.passwordChanged
  ) {
    return res.status(401).send({ decorator: "SERVER_RESET_PASSWORD_FAILED", error: true });
  }

  const email = verification.email;
  const user = await Data.getUserByEmail({ email });

  if (!user) {
    return res.status(404).send({ decorator: "SERVER_RESET_PASSWORD_FAILED", error: true });
  }

  if (user.error) {
    return res.status(500).send({ decorator: "SERVER_RESET_PASSWORD_FAILED", error: true });
  }

  const rounds = Number(Environment.LOCAL_PASSWORD_ROUNDS);
  const salt = await BCrypt.genSalt(rounds);
  const hash = await Utilities.encryptPassword(req.body.data.password, salt);

  await Data.updateUserById({
    id: user.id,
    salt,
    password: hash,
    authVersion: 2,
    lastActive: new Date(),
  });

  await Data.updateVerification({ sid: token, passwordChanged: true });

  res.status(200).send({ decorator: "SERVER_PASSWORD_RESET", success: true });
};
