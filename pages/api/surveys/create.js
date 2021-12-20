import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as ViewerManager from "~/node_common/managers/viewer";
import * as RequestUtilities from "~/node_common/request-utilities";
import * as Environment from "~/node_common/environment";

export default async (req, res) => {
  if (!Strings.isEmpty(Environment.ALLOWED_HOST) && req.headers.host !== Environment.ALLOWED_HOST) {
    return res.status(403).send({ decorator: "SERVER_CREATE_SURVEYS_NOT_ALLOWED", error: true });
  }

  const surveyAnswers = req?.body?.data;
  if (!surveyAnswers) {
    return res.status(403).send({ decorator: "SERVER_CREATE_SURVEYS_INVALID_DATA", error: true });
  }

  const userInfo = await RequestUtilities.checkAuthorizationInternal(req, res);
  if (!userInfo) return;

  const { id } = userInfo;

  const surveyResponse = await Data.createSurvey({ ownerId: id, ...surveyAnswers });
  const userResponse = await Data.updateUserById({ id, hasCompletedSurvey: true });

  if (!surveyResponse) {
    return res.status(404).send({ decorator: "SERVER_CREATE_SURVEYS_FAILED", error: true });
  }

  if (surveyResponse.error || userResponse.error) {
    return res.status(500).send({ decorator: "SERVER_CREATE_SURVEYS_FAILED", error: true });
  }

  await ViewerManager.hydratePartial(id, { viewer: true });

  return res.status(200).send({ decorator: "SERVER_CREATE_SURVEYS_SUCCESS" });
};
