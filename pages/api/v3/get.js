import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as RequestUtilities from "~/node_common/request-utilities";
import * as Conversions from "~/common/conversions";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationExternal(req, res);
  if (!userInfo) return;
  const { id, key, user } = userInfo;

  let reformattedUser = Conversions.convertToV3User(user);

  let slates = await Data.getSlatesByUserId({
    ownerId: id,
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

  return res.status(200).send({ decorator: "GET", user: reformattedUser, collections: slates });
};
