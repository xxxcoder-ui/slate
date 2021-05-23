import * as Environment from "~/node_common/environment";
import * as Data from "~/node_common/data";
import * as Utilities from "~/node_common/utilities";
import * as Strings from "~/common/strings";
import * as Validations from "~/common/validations";
import * as SlateManager from "~/node_common/managers/slate";
import * as Monitor from "~/node_common/monitor";

import JWT from "jsonwebtoken";

import { PrivateKey } from "@textile/hub";

const COOKIE_NAME = "oauth_token";

export default async (req, res) => {
  const { authToken, email, username } = req.body.data;

  if (!Strings.isEmpty(Environment.ALLOWED_HOST) && req.headers.host !== Environment.ALLOWED_HOST) {
    return res.status(403).send({ decorator: "SERVER_TWITTER_OAUTH_NOT_ALLOWED", error: true });
  }

  if (Strings.isEmpty(authToken)) {
    return res.status(500).send({ decorator: "SERVER_TWITTER_OAUTH_NO_OAUTH_TOKEN", error: true });
  }

  if (!Validations.email(email)) {
    return res.status(500).send({ decorator: "SERVER_CREATE_USER_INVALID_EMAIL", error: true });
  }

  if (!Validations.username(username)) {
    return res.status(500).send({ decorator: "SERVER_CREATE_USER_INVALID_USERNAME", error: true });
  }

  const storedAuthToken = req.cookies[COOKIE_NAME];

  if (authToken !== storedAuthToken) {
    return res.status(403).send({ decorator: "SERVER_TWITTER_OAUTH_INVALID_TOKEN", error: true });
  }

  try {
    const twitterUser = await Data.getTwitterToken({ token: authToken });

    if (twitterUser.email !== email) {
      return res
        .status(401)
        .send({ decorator: "SERVER_TWITTER_NEED_EMAIL_VALIDATION", error: true });
    }

    const userByTwitterId = await Data.getUserByTwitterId({ twitterId: twitterUser.id_str });
    // NOTE(Amine): If a user with TwitterId exists
    if (userByTwitterId) {
      return res.status(201).send({ decorator: "SERVER_TWITTER_ACCOUNT_ALREADY_LINKED" });
    }

    // NOTE(Amine): If there is an account with the user's twitter email
    const userByEmail = await Data.getUserByEmail({ email: twitterUser.email });
    if (userByEmail) {
      return res.status(201).send({ decorator: "SERVER_CREATE_USER_EMAIL_TAKEN" });
    }

    // NOTE(Amine): If there is an account with the provided username
    const userByUsername = await Data.getUserByUsername({ username });
    if (userByUsername) {
      return res.status(201).send({ decorator: "SERVER_CREATE_USER_USERNAME_TAKEN" });
    }

    // TODO(jim):
    // Single Key Textile Auth.
    const identity = await PrivateKey.fromRandom();
    const api = identity.toString();

    // TODO(jim):
    // Don't do this once you refactor.
    const newUsername = username.toLowerCase();
    const newEmail = email.toLowerCase();

    const { buckets, bucketKey, bucketName } = await Utilities.getBucketAPIFromUserToken({
      user: {
        username: newUsername,
        data: { tokens: { api } },
      },
    });

    if (!buckets) {
      return res
        .status(500)
        .send({ decorator: "SERVER_CREATE_USER_BUCKET_INIT_FAILURE", error: true });
    }

    const photo = await SlateManager.getRandomSlateElementURL({
      id: Environment.AVATAR_SLATE_ID,
      fallback:
        "https://slate.textile.io/ipfs/bafkreick3nscgixwfpq736forz7kzxvvhuej6kszevpsgmcubyhsx2pf7i",
    });

    const user = await Data.createUser({
      username: newUsername,
      email: newEmail,
      twitterId: twitterUser.id_str,
      data: {
        photo,
        body: "",
        settings: {
          settings_deals_auto_approve: false,
          allow_filecoin_directory_listing: false,
          allow_automatic_data_storage: true,
          allow_encrypted_data_storage: true,
        },
        tokens: { api },
        twitter: {
          username: twitterUser.screen_name,
          verified: twitterUser.verified,
        },
      },
    });

    if (!user) {
      return res.status(404).send({ decorator: "SERVER_CREATE_USER_FAILED", error: true });
    }

    if (user.error) {
      return res.status(500).send({ decorator: "SERVER_CREATE_USER_FAILED", error: true });
    }

    Monitor.createUser({ user });

    const token = JWT.sign({ id: user.id, username: user.username }, Environment.JWT_SECRET);
    return res.status(200).send({ decorator: "SERVER_SIGN_IN", success: true, token });
  } catch (err) {
    console.log(err);
    res.status(403).end();
  }
};
