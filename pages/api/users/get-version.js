import * as Data from "~/node_common/data";
import * as Validations from "~/common/validations";
import * as Strings from "~/common/strings";
import * as Environment from "~/node_common/environment";

export default async (req, res) => {
  if (!Strings.isEmpty(Environment.ALLOWED_HOST) && req.headers.host !== Environment.ALLOWED_HOST) {
    return res.status(403).send({ decorator: "SERVER_CREATE_USER_NOT_ALLOWED", error: true });
  }

  const username = req.body.data.username.toLowerCase();
  let user;
  if (Validations.email(username)) {
    try {
      user = await Data.getUserByEmail({ email: username });
    } catch (e) {
      console.log(e);
    }
  } else {
    try {
      user = await Data.getUserByUsername({
        username: req.body.data.username.toLowerCase(),
      });
    } catch (e) {
      console.log(e);
    }
  }

  if (!user) {
    return res.status(200).send({ decorator: "SERVER_USER_NOT_FOUND" });
  }

  if (user.error) {
    return res.status(500).send({ decorator: "SERVER_USER_NOT_FOUND", error: true });
  }

  return res
    .status(200)
    .send({ decorator: "SERVER_GET_USER_VERSION", data: { version: user.authVersion } });
};
