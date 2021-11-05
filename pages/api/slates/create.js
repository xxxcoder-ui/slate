import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as RequestUtilities from "~/node_common/request-utilities";
import * as Strings from "~/common/strings";
import * as ViewerManager from "~/node_common/managers/viewer";
import SearchManager from "~/node_common/managers/search";
import * as Monitor from "~/node_common/monitor";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationInternal(req, res);
  if (!userInfo) return;
  const { id, user } = userInfo;

  const slatename = Strings.createSlug(req.body.data.name);

  const existingSlate = await Data.getSlateByName({
    slatename,
    ownerId: user.id,
  });

  if (existingSlate) {
    return res
      .status(500)
      .send({ decorator: "SERVER_CREATE_SLATE_EXISTING_SLATE_NAME", error: true });
  }

  if (req.body.data.body && req.body.data.body.length > 2000) {
    return res.status(400).send({ decorator: "SERVER_CREATE_SLATE_MAX_BODY_LENGTH", error: true });
  }

  const slate = await Data.createSlate({
    ownerId: id,
    slatename: Strings.createSlug(req.body.data.name),
    isPublic: req.body.data.isPublic,
    name: req.body.data.name,
    body: req.body.data.body,
  });

  if (!slate || slate.error) {
    return res.status(500).send({ decorator: "SERVER_CREATE_SLATE_FAILED", error: true });
  }

  const { hydrateViewer = true } = req.body.data;
  if (hydrateViewer) ViewerManager.hydratePartial(id, { slates: true });

  SearchManager.indexSlate(slate);

  Monitor.createSlate({ user, slate });

  return res.status(200).send({ decorator: "SERVER_CREATE_SLATE", slate });
};
