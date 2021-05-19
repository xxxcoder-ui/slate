import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as Monitor from "~/node_common/monitor";
import * as ViewerManager from "~/node_common/managers/viewer";
import * as SearchManager from "~/node_common/managers/search";

export default async (req, res) => {
  const id = Utilities.getIdFromCookie(req);
  if (!id) {
    return res.status(401).send({ decorator: "SERVER_NOT_AUTHENTICATED", error: true });
  }

  const user = await Data.getUserById({
    id,
  });

  if (!user) {
    return res.status(404).json({
      decorator: "SERVER_USER_NOT_FOUND",
      error: true,
    });
  }

  if (user.error) {
    return res.status(500).json({
      decorator: "SERVER_USER_NOT_FOUND",
      error: true,
    });
  }

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
    data: {
      name: req.body.data.name,
      body: req.body.data.body,
      tags: req.body.data.tags,
    },
  });

  if (!slate || slate.error) {
    return res.status(500).send({ decorator: "SERVER_CREATE_SLATE_FAILED", error: true });
  }

  ViewerManager.hydratePartial(id, { slates: true });

  SearchManager.updateSlate(slate, "ADD");

  if (slate.isPublic) {
    Monitor.createSlate({ owner: user, slate });
  }

  return res.status(200).send({ decorator: "SERVER_CREATE_SLATE", slate });
};
