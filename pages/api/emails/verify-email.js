import * as Environment from "~/node_common/environment";
import * as Data from "~/node_common/data";
import * as Utilities from "~/node_common/utilities";
import * as SlateManager from "~/node_common/managers/slate";
import * as Monitor from "~/node_common/monitor";
import * as Validations from "~/common/validations";
import * as Strings from "~/common/strings";

export default async (req, res) => {
  if (!Strings.isEmpty(Environment.ALLOWED_HOST) && req.headers.host !== Environment.ALLOWED_HOST) {
    return res.status(403).send({ decorator: "SERVER_CREATE_USER_NOT_ALLOWED", error: true });
  }
};

const email = req.body.email.toLowerCase()
