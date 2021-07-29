import * as Logging from "~/common/logging";
import * as Environment from "~/node_common/environment";
import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as Validations from "~/common/validations";

import { encryptPasswordClient } from "~/common/utilities";

import JWT from "jsonwebtoken";

export default async (req, res) => {
  if (!Strings.isEmpty(Environment.ALLOWED_HOST) && req.headers.host !== Environment.ALLOWED_HOST) {
    return res.status(403).send({ decorator: "SERVER_SIGN_IN_NOT_ALLOWED", error: true });
  }

  // NOTE(jim): We don't need to validate here.
  if (Strings.isEmpty(req.body.data.username)) {
    return res.status(500).send({ decorator: "SERVER_SIGN_IN_NO_USERNAME", error: true });
  }

  if (Strings.isEmpty(req.body.data.password)) {
    return res.status(500).send({ decorator: "SERVER_SIGN_IN_NO_PASSWORD", error: true });
  }

  const username = req.body.data.username.toLowerCase();
  let user;
  if (Validations.email(username)) {
    try {
      user = await Data.getUserByEmail({ email: username });
    } catch (e) {
      Logging.error(e);
    }
  } else {
    try {
      user = await Data.getUserByUsername({
        username: req.body.data.username.toLowerCase(),
      });
    } catch (e) {
      Logging.error(e);
    }
  }

  if (!user) {
    return res.status(404).send({ decorator: "SERVER_SIGN_IN_USER_NOT_FOUND", error: true });
  }

  if (user.error) {
    return res.status(500).send({ decorator: "SERVER_SIGN_IN_USER_NOT_FOUND", error: true });
  }

  // Note(amine): Twitter users won't have a password,
  // we should think in the future how to handle this use case
  if ((!user.salt || !user.password) && user.twitterId) {
    return res.status(403).send({ decorator: "SERVER_TWITTER_LOGIN_ONLY", error: true });
  }

  let userUpdates = { id: user.id, lastActive: new Date() };

  let hash = await Utilities.encryptPassword(req.body.data.password, user.salt);

  let updatePassword = user.authVersion === 1; //NOTE(martina): if they are v1, we may need to update their password
  if (hash !== user.password) {
    //NOTE(martina): this was added to deal with a specific case where the passwords of some v1 users could either be the v1 hashing schema or v2 (so we try both)
    if (user.authVersion === 1) {
      const clientHash = await encryptPasswordClient(req.body.data.password);
      hash = await Utilities.encryptPassword(clientHash, user.salt);
      if (hash !== user.password) {
        return res.status(403).send({ decorator: "SERVER_SIGN_IN_WRONG_CREDENTIALS", error: true });
      }
      updatePassword = false; //NOTE(martina): means the user's password is already v2 hashed, and doesn't need to be updated
    } else {
      return res.status(403).send({ decorator: "SERVER_SIGN_IN_WRONG_CREDENTIALS", error: true });
    }
  }

  if (user.authVersion === 1) {
    userUpdates.authVersion = 2;
    userUpdates.revertedVersion = false;
  }

  if (updatePassword) {
    const newHash = await encryptPasswordClient(req.body.data.password);
    const doubledHash = await Utilities.encryptPassword(newHash, user.salt);
    userUpdates.password = doubledHash;
  }

  await Data.updateUserById(userUpdates);

  if (!user.email) {
    return res
      .status(200)
      .send({ decorator: "SERVER_SIGN_IN_SHOULD_MIGRATE", shouldMigrate: true });
  }
  const authorization = Utilities.parseAuthHeader(req.headers.authorization);
  if (authorization && !Strings.isEmpty(authorization.value)) {
    const verfied = JWT.verify(authorization.value, Environment.JWT_SECRET);

    if (user.username === verfied.username) {
      return res.status(200).send({
        message: "You are already authenticated. Welcome back!",
        viewer: user,
      });
    }
  }

  const token = JWT.sign({ id: user.id, username: user.username }, Environment.JWT_SECRET);

  return res.status(200).send({ decorator: "SERVER_SIGN_IN", success: true, token });
};
