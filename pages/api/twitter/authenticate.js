import * as Environment from "~/node_common/environment";
import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";

import Storage from "node-storage";
import JWT from "jsonwebtoken";

import { createOAuthProvider } from "~/node_common/managers/twitter";

const storage = new Storage("file.txt");
const COOKIE_NAME = "oauth_token";

export default async (req, res) => {
  if (!Strings.isEmpty(Environment.ALLOWED_HOST) && req.headers.host !== Environment.ALLOWED_HOST) {
    return res.status(403).send({ decorator: "SERVER_TWITTER_OAUTH_NOT_ALLOWED", error: true });
  }

  if (Strings.isEmpty(req.body.data.authToken)) {
    return res.status(500).send({ decorator: "SERVER_TWITTER_OAUTH_NO_OAUTH_TOKEN", error: true });
  }

  if (Strings.isEmpty(req.body.data.authVerifier)) {
    return res
      .status(500)
      .send({ decorator: "SERVER_TWITTER_OAUTH_NO_OAUTH_VERIFIER", error: true });
  }

  const { authToken, authVerifier } = req.body.data;
  const storedAuthToken = req.cookies[COOKIE_NAME];

  if (authToken !== storedAuthToken) {
    return res.status(403).send({ decorator: "SERVER_TWITTER_OAUTH_INVALID_TOKEN", error: true });
  }

  try {
    const authSecretToken = storage.get(authToken);
    const { getOAuthAccessToken, getProtectedResource } = createOAuthProvider();

    const { authAccessToken, authSecretAccessToken } = await getOAuthAccessToken({
      authToken,
      authSecretToken,
      authVerifier,
    });

    const response = await getProtectedResource({
      url: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
      method: "GET",
      authAccessToken,
      authSecretAccessToken,
    });
    const twitterUser = JSON.parse(response.data);

    // const userFriends = await getProtectedResource({
    //   url: "https://api.twitter.com/1.1/friends/ids.json",
    //   method: "GET",
    //   authAccessToken,
    //   authSecretAccessToken,
    // });

    const user = await Data.getUserByTwitterId({ twitterId: twitterUser.id_str });
    // NOTE(Amine): If a user with TwitterId exists
    if (user) {
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
    }

    // NOTE(Amine): Twitter account doesn't have an email
    if (Strings.isEmpty(twitterUser.email)) {
      return res.status(201).send({ decorator: "SERVER_TWITTER_OAUTH_NO_EMAIL" });
    }

    // NOTE(Amine): If there is an account with the user's twitter email
    const userByEmail = await Data.getUserByEmail({ email: twitterUser.email });
    if (userByEmail.email === twitterUser.email) {
      await Data.updateUserById({
        id: userByEmail.id,
        twitterId: twitterUser.id_str,
      });
      const token = JWT.sign(
        { id: userByEmail.id, username: userByEmail.username },
        Environment.JWT_SECRET
      );
      return res.status(200).send({ decorator: "SERVER_SIGN_IN", success: true, token });
    }

    //NOTE(Amine): If we have twitter email but no user is associated with it
    return res
      .status(200)
      .json({ decorator: "SERVER_TWITTER_CONTINUE_SIGNUP", email: twitterUser.email });
  } catch (err) {
    console.log(err);
    res.status(403).end();
  }
};
