import * as Environment from "~/node_common/environment";
import * as Data from "~/node_common/data";
import * as Utilities from "~/node_common/utilities";
import * as Strings from "~/common/strings";
import * as Validations from "~/common/validations";
import * as Constants from "~/node_common/constants";

import SearchManager from "~/node_common/managers/search";
import JWT from "jsonwebtoken";

export default async (req, res) => {
  const { pin, username } = req.body.data;

  if (!Strings.isEmpty(Environment.ALLOWED_HOST) && req.headers.host !== Environment.ALLOWED_HOST) {
    return res.status(403).send({ decorator: "SERVER_TWITTER_OAUTH_NOT_ALLOWED", error: true });
  }

  if (Strings.isEmpty(req.body.data.token)) {
    return res.status(500).send({ decorator: "SERVER_TWITTER_OAUTH_NO_OAUTH_TOKEN", error: true });
  }

  if (!Validations.verificationPin(pin)) {
    return res
      .status(500)
      .send({ decorator: "SERVER_EMAIL_VERIFICATION_INVALID_PIN", error: true });
  }

  if (!Validations.username(username)) {
    return res.status(500).send({ decorator: "SERVER_CREATE_USER_INVALID_USERNAME", error: true });
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

  if (verification.type !== "email_twitter_verification") {
    return res.status(401).send({ decorator: "SERVER_EMAIL_VERIFICATION_FAILED", error: true });
  }

  if (verification.pin !== req.body.data.pin) {
    return res
      .status(401)
      .send({ decorator: "SERVER_EMAIL_VERIFICATION_INVALID_PIN", error: true });
  }

  const twitterUser = await Data.getTwitterToken({ token: verification.twitterToken });
  if (!twitterUser) {
    return res.status(401).send({ decorator: "SERVER_CREATE_USER_FAILED", error: true });
  }

  const userByTwitterId = await Data.getUserByTwitterId({ twitterId: twitterUser.id_str });
  // NOTE(Amine): If a user with TwitterId exists
  if (userByTwitterId) {
    return res.status(201).send({ decorator: "SERVER_CREATE_USER_TWITTER_EXISTS" });
  }

  const newUsername = Strings.createUsername(username);
  const newEmail = verification.email.toLowerCase();

  // NOTE(Amine): If there is an account with the user's twitter email
  const userByEmail = await Data.getUserByEmail({ email: newEmail });
  if (userByEmail) return res.status(201).send({ decorator: "SERVER_CREATE_USER_EMAIL_TAKEN" });

  // NOTE(Amine): If there is an account with the provided username
  const userByUsername = await Data.getUserByUsername({ username: newUsername });
  if (userByUsername) {
    return res.status(201).send({ decorator: "SERVER_CREATE_USER_USERNAME_TAKEN" });
  }

  const { textileKey, textileToken, textileThreadID, textileBucketCID } =
    await Utilities.createBucket({});

  if (!textileKey || !textileToken || !textileThreadID || !textileBucketCID) {
    return res
      .status(500)
      .send({ decorator: "SERVER_CREATE_USER_BUCKET_INIT_FAILURE", error: true });
  }

  const user = await Data.createUser({
    username: newUsername,
    email: newEmail,
    twitterId: twitterUser.id_str,
    twitterUsername: twitterUser.screen_name,
    twitterVerified: twitterUser.verified,
    textileKey,
    textileToken,
    textileThreadID,
    textileBucketCID,
  });

  if (!user) {
    return res.status(404).send({ decorator: "SERVER_CREATE_USER_FAILED", error: true });
  }

  if (user.error) {
    return res.status(500).send({ decorator: "SERVER_CREATE_USER_FAILED", error: true });
  }

  SearchManager.indexUser(user);

  const token = JWT.sign({ id: user.id, username: user.username }, Environment.JWT_SECRET);
  return res.status(200).send({ decorator: "SERVER_SIGN_IN", success: true, token });
};
