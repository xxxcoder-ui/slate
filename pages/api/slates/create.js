import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as RequestUtilities from "~/node_common/request-utilities";
import * as Strings from "~/common/strings";
import * as ViewerManager from "~/node_common/managers/viewer";
import * as SearchManager from "~/node_common/managers/search";
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

  ViewerManager.hydratePartial(id, { slates: true });

  SearchManager.updateSlate(slate, "ADD");

  Monitor.createSlate({ user, slate });

  return res.status(200).send({ decorator: "SERVER_CREATE_SLATE", slate });
};
