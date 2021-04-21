import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as ViewerManager from "~/node_common/managers/viewer";

export default async (req, res) => {
  if (!req.body.data) {
    return res.status(500).send({
      decorator: "SERVER_UPDATE_SLATE_LAYOUT_MUST_PROVIDE_DATA",
      error: true,
    });
  }

  const slate = await Data.getSlateById({ id: req.body.data.id });

  if (!slate) {
    return res.status(404).send({ decorator: "SERVER_UPDATE_SLATE_LAYOUT_NOT_FOUND", error: true });
  }

  if (slate.error) {
    return res.status(500).send({ decorator: "SERVER_UPDATE_SLATE_LAYOUT_NOT_FOUND", error: true });
  }

  let update = await Data.updateSlateById({
    id: slate.id,
    data: {
      ...slate.data,
      layouts: req.body.data.layouts,
    },
  });

  if (!update) {
    return res.status(404).send({ decorator: "SERVER_UPDATE_SLATE_LAYOUT", error: true });
  }

  if (update.error) {
    return res.status(500).send({ decorator: "SERVER_UPDATE_SLATE_LAYOUT", error: true });
  }

  const id = Utilities.getIdFromCookie(req);

  if (id && slate.ownerId === id) {
    ViewerManager.hydratePartial(id, { slates: true });
  }

  return res.status(200).send({ decorator: "SERVER_UPDATE_SLATE_LAYOUT", slate });
};
