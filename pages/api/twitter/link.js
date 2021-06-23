import * as Environment from "~/node_common/environment";
import * as Data from "~/node_common/data";
import * as Utilities from "~/node_common/utilities";
import * as Strings from "~/common/strings";
import * as Validations from "~/common/validations";
import * as Logging from "~/common/logging";

export default async (req, res) => {
  if (!Strings.isEmpty(Environment.ALLOWED_HOST) && req.headers.host !== Environment.ALLOWED_HOST) {
    return res.status(403).send({ decorator: "SERVER_TWITTER_OAUTH_NOT_ALLOWED", error: true });
  }

  if (Strings.isEmpty(req.body.data.token)) {
    return res.status(500).send({ decorator: "SERVER_TWITTER_OAUTH_NO_OAUTH_TOKEN", error: true });
  }

  if (Strings.isEmpty(req.body?.data?.username)) {
    return res
      .status(400)
      .send({ decorator: "SERVER_TWITTER_LINKING_INVALID_USERNAME", error: true });
  }

  if (!Validations.legacyPassword(req.body?.data?.password)) {
    return res
      .status(400)
      .send({ decorator: "SERVER_TWITTER_LINKING_INVALID_PASSWORD", error: true });
  }

  const { username, password, token } = req.body.data;

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

  if (!user || user.error) {
    return res
      .status(!user ? 404 : 500)
      .send({ decorator: "SERVER_SIGN_IN_USER_NOT_FOUND", error: true });
  }

  // Note(amine): Twitter users won't have a password,
  // we should think in the future how to handle this use case
  if ((!user.salt || !user.password) && user.twitterId) {
    return res.status(403).send({ decorator: "SERVER_CREATE_USER_TWITTER_EXISTS", error: true });
  }

  const hash = await Utilities.encryptPassword(password, user.salt);
  if (hash !== user.password) {
    return res
      .status(403)
      .send({ decorator: "SERVER_TWITTER_LINKING_WRONG_CREDENTIALS", error: true });
  }

  if (!user.email) {
    return res.status(200).send({ shouldMigrate: true });
  }

  const twitterUser = await Data.getTwitterToken({ token: token });
  if (!twitterUser) {
    return res.status(401).send({ decorator: "SERVER_TWITTER_LINKING_FAILED", error: true });
  }

  const updates = await Data.updateUserById({
    id: user.id,
    lastActive: new Date(),
    twitterId: twitterUser.id_str,
    data: {
      twitter: {
        username: twitterUser.screen_name,
        verified: twitterUser.verified,
      },
    },
  });

  if (updates.error) {
    return res.status(401).send({ decorator: "SERVER_TWITTER_LINKING_FAILED", error: true });
  }
  return res.status(200).send({ decorator: "SERVER_TWITTER_LINKING" });
};
