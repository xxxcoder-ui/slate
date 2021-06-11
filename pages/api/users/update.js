import * as Environment from "~/node_common/environment";
import * as Data from "~/node_common/data";
import * as Utilities from "~/node_common/utilities";
import * as Serializers from "~/node_common/serializers";
import * as Validations from "~/common/validations";
import * as Social from "~/node_common/social";
import * as ViewerManager from "~/node_common/managers/viewer";
import * as SearchManager from "~/node_common/managers/search";
import * as Logging from "~/common/logging";

import BCrypt from "bcrypt";

export default async (req, res) => {
  const id = Utilities.getIdFromCookie(req);
  if (!id) {
    return res.status(401).send({ decorator: "SERVER_NOT_AUTHENTICATED", error: true });
  }

  const user = await Data.getUserById({
    id,
  });

  if (!user) {
    return res.status(404).send({ decorator: "SERVER_USER_NOT_FOUND", error: true });
  }

  if (user.error) {
    return res.status(500).send({ decorator: "SERVER_USER_NOT_FOUND", error: true });
  }

  let updates = req.body.data;

  if (updates.username && updates.username !== user.username) {
    if (!Validations.username(req.body.data.username)) {
      return res.status(400).send({
        decorator: "SERVER_USER_UPDATE_INVALID_USERNAME",
        error: true,
      });
    }

    const existing = await Data.getUserByUsername({
      username: req.body.data.username.toLowerCase(),
    });

    if (existing && existing.id !== id) {
      return res
        .status(500)
        .send({ decorator: "SERVER_USER_UPDATE_USERNAME_IS_TAKEN", error: true });
    }
  }

  if (updates.email && updates.email !== user.email) {
    if (!Validations.email(req.body.data.email)) {
      return res.status(400).send({
        decorator: "SERVER_USER_UPDATE_INVALID_EMAIL",
        error: true,
      });
    }

    const existing = await Data.getUserByEmail({
      email: req.body.data.email.toLowerCase(),
    });

    if (existing && existing.id !== id) {
      return res.status(500).send({ decorator: "SERVER_USER_UPDATE_EMAIL", error: true });
    }
  }

  if (req.body.data.type === "SAVE_DEFAULT_ARCHIVE_CONFIG") {
    let b;
    try {
      b = await Utilities.getBucketAPIFromUserToken({
        user,
        bucketName: "data",
      });
    } catch (e) {
      Logging.error(e);
      Social.sendTextileSlackMessage({
        file: "/pages/api/users/update.js",
        user,
        message: e.message,
        code: e.code,
        functionName: `Utilities.getBucketAPIFromUserToken`,
      });

      return res.status(500).send({ decorator: "SERVER_NO_BUCKET_DATA", error: true });
    }

    try {
      const configResponse = await b.buckets.setDefaultArchiveConfig(
        b.bucketKey,
        req.body.data.config
      );
    } catch (e) {
      Logging.error(e);
      Social.sendTextileSlackMessage({
        file: "/pages/api/users/update.js",
        user,
        message: e.message,
        code: e.code,
        functionName: `b.buckets.setDefaultArchiveConfig`,
      });

      return res
        .status(500)
        .send({ decorator: "SERVER_USER_UPDATE_DEFAULT_ARCHIVE_CONFIG", error: true });
    }
  }

  if (req.body.data.type === "CHANGE_PASSWORD" && req.body.data.password) {
    if (!Validations.password(req.body.data.password)) {
      return res
        .status(500)
        .send({ decorator: "SERVER_USER_UPDATE_INVALID_PASSWORD", error: true });
    }

    const rounds = Number(Environment.LOCAL_PASSWORD_ROUNDS);
    const salt = await BCrypt.genSalt(rounds);
    const hash = await Utilities.encryptPassword(req.body.data.password, salt);

    updates.salt = salt;
    updates.password = hash;
  }

  let unsafeResponse = await Data.updateUserById({ id, ...updates });

  if (unsafeResponse && !unsafeResponse.error) {
    if (
      user.username !== unsafeResponse.username ||
      user.data.name !== unsafeResponse.data.name ||
      user.data.photo !== unsafeResponse.data.photo
    ) {
      SearchManager.updateUser(unsafeResponse, "EDIT");
    }
  }

  ViewerManager.hydratePartial(id, { viewer: true });

  return res.status(200).send({ decorator: "SERVER_USER_UPDATE" });
};
