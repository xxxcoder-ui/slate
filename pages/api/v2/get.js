import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as Powergate from "~/node_common/powergate";
import * as RequestUtilities from "~/node_common/request-utilities";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationExternal(req, res);
  if (!userInfo) return;
  const { id, key, user } = userInfo;

  let slates = await Data.getSlatesByUserId({
    ownerId: id,
    sanitize: true,
    includeFiles: true,
  });

  if (!slates) {
    return res.status(404).send({
      decorator: "COULD_NOT_FETCH_COLLECTIONS",
      error: true,
    });
  }

  if (slates.error) {
    return res.status(500).send({
      decorator: "COULD_NOT_FETCH_COLLECTIONS",
      error: true,
    });
  }

  slates = slates.map((each) => {
    each.data.url = `https://slate.host/${user.username}/${each.slatename}`;
    return each;
  });

  return res.status(200).send({ decorator: "GET", user, collections: slates });
};
