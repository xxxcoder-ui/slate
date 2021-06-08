import * as Environment from "~/node_common/environment";
import * as Data from "~/node_common/data";
import * as Utilities from "~/node_common/utilities";
import * as Strings from "~/common/strings";
import * as Validations from "~/common/validations";
import * as SlateManager from "~/node_common/managers/slate";
import * as Constants from "~/node_common/constants";

import JWT from "jsonwebtoken";

import { PrivateKey } from "@textile/hub";
import { Verification } from "~/components/core/Auth/components";

export default async (req, res) => {
  if (!Strings.isEmpty(Environment.ALLOWED_HOST) && req.headers.host !== Environment.ALLOWED_HOST) {
    return res.status(403).send({ decorator: "SERVER_MIGRATE_USER_NOT_ALLOWED", error: true });
  }

  if (Strings.isEmpty(req.body.data.token)) {
    return res.status(500).send({ decorator: "SERVER_MIGRATE_USER_NO_TOKEN", error: true });
  }

  if (!Validations.verificationPin(req.body.data.pin)) {
    return res.status(500).send({ decorator: "SERVER_MIGRATE_USER_INVALID_PIN", error: true });
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

  if (verification.type !== "user_migration") {
    return res.status(401).send({ decorator: "SERVER_EMAIL_VERIFICATION_FAILED", error: true });
  }

  if (verification.pin !== req.body.data.pin) {
    return res.status(401).send({ decorator: "SERVER_MIGRATE_USER_INVALID_PIN", error: true });
  }

  const username = verification.username;
  const email = verification.email;
  const user = await Data.getUserByUsername({ username });

  if (!user) {
    return res.status(404).send({ decorator: "SERVER_CREATE_VERIFICATION_FAILED", error: true });
  }

  if (user.error) {
    return res.status(500).send({ decorator: "SERVER_CREATE_VERIFICATION_FAILED", error: true });
  }

  await Data.updateUserById({ id: user.id, email });

  return res.status(200).send({ decorator: "SERVER_MIGRATE_USER", success: true });
};
