import * as Environment from "~/node_common/environment";
import * as Data from "~/node_common/data";
import * as Utilities from "~/node_common/utilities";
import * as SlateManager from "~/node_common/managers/slate";
import * as Monitor from "~/node_common/monitor";
import * as Validations from "~/common/validations";
import * as Strings from "~/common/strings";

import BCrypt from "bcrypt";

import { PrivateKey } from "@textile/hub";

export default async (req, res) => {
  if (!Strings.isEmpty(Environment.ALLOWED_HOST) && req.headers.host !== Environment.ALLOWED_HOST) {
    return res.status(403).send({ decorator: "SERVER_CREATE_USER_NOT_ALLOWED", error: true });
  }

  if (Strings.isEmpty(req.body.data.accepted)) {
    return res.status(403).send({ decorator: "SERVER_CREATE_USER_ACCEPT_TERMS", error: true });
  }

  const existing = await Data.getUserByUsername({
    username: req.body.data.username.toLowerCase(),
  });

  if (existing) {
    return res.status(403).send({ decorator: "SERVER_CREATE_USER_USERNAME_TAKEN", error: true });
  }

  if (!Validations.username(req.body.data.username)) {
    return res.status(500).send({ decorator: "SERVER_CREATE_USER_INVALID_USERNAME", error: true });
  }

  if (!Validations.password(req.body.data.password)) {
    return res.status(500).send({ decorator: "SERVER_CREATE_USER_INVALID_PASSWORD", error: true });
  }

  const rounds = Number(Environment.LOCAL_PASSWORD_ROUNDS);
  const salt = await BCrypt.genSalt(rounds);
  const hash = await Utilities.encryptPassword(req.body.data.password, salt);

  // TODO(jim):
  // Single Key Textile Auth.
  const identity = await PrivateKey.fromRandom();
  const api = identity.toString();

  // TODO(jim):
  // Don't do this once you refactor.
  const newUsername = req.body.data.username.toLowerCase();

  //NOTE(toast): usually this is validated during the confirmation stage,
  //but we have legacy users that we have to insert emails for
  newEmail = req.body.data.email.toLowerCase();

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
    password: hash,
    salt,
    username: newUsername,
    email: newEmail,
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
    },
  });

  if (!user) {
    return res.status(404).send({ decorator: "SERVER_CREATE_USER_FAILED", error: true });
  }

  if (user.error) {
    return res.status(500).send({ decorator: "SERVER_CREATE_USER_FAILED", error: true });
  }

  Monitor.createUser({ user });

  return res.status(200).send({
    decorator: "SERVER_CREATE_USER",
    user: { username: user.username, id: user.id },
  });
};
