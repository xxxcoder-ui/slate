import * as Environment from "~/node_common/environment";
import * as Data from "~/node_common/data";
import * as Utilities from "~/node_common/utilities";
import * as Serializers from "~/node_common/serializers";
import * as Validations from "~/common/validations";
import * as ViewerManager from "~/node_common/managers/viewer";
import * as RequestUtilities from "~/node_common/request-utilities";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationInternal(req, res);
  if (!userInfo) return;
  const { id, user } = userInfo;

  let updateResponse;
  if (req.body.data?.onboarding) {
    let onboarding = user.onboarding;
    if (!onboarding) {
      onboarding = {};
    }
    for (let key of req.body.data.onboarding) {
      onboarding[key] = true;
    }

    updateResponse = await Data.updateUserById({
      id: user.id,
      onboarding,
    });

    if (!updateResponse || updateResponse.error) {
      return res.status(500).send({
        decorator: "SERVER_STATUS_UPDATE_FAILED",
        error: true,
      });
    }
  } else {
    return res.status(500).send({
      decorator: "SERVER_STATUS_UPDATE_MUST_PROVIDE_UPDATE",
      error: true,
    });
  }

  ViewerManager.hydratePartial(id, { viewer: true });

  return res.status(200).send({
    decorator: "SERVER_STATUS_UPDATE",
    data: updateResponse,
  });
};
