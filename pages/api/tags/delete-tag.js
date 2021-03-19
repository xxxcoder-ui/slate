import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as ViewerManager from "~/node_common/managers/viewer";
import * as SearchManager from "~/node_common/managers/search";

export default async (req, res) => {
  const id = Utilities.getIdFromCookie(req);
  if (!id) {
    return res.status(500).send({ decorator: "SERVER_GET_SLATES_TAGS", error: true });
  }

  const user = await Data.getUserById({
    id,
  });

  if (!user) {
    return res.status(404).send({
      decorator: "SERVER_GET_SLATE_USER_NOT_FOUND",
      error: true,
    });
  }

  if (user.error) {
    return res.status(500).send({
      decorator: "SERVER_GET_SLATE_USER_NOT_FOUND",
      error: true,
    });
  }

  let response = await Data.getSlatesByUserId({ userId: id });
  if (!response) {
    return res.status(404).send({ decorator: "SERVER_GET_SLATES_NOT_FOUND", error: true });
  }

  if (response.error) {
    return res.status(500).send({ decorator: "SERVER_GET_SLATES_NOT_FOUND", error: true });
  }

  const tagToDelete = req.body.data.tag;
  const slates = response;

  let refreshSlates = false;

  for (const slate of slates) {
    let tags = slate.data.tags;
    let tagIndex = tags.indexOf(tagToDelete);

    if (tagIndex > -1) {
      tags.splice(tagIndex, 1);
    }

    let newSlate = await Data.updateSlateById({
      id: slate.id,
      updated_at: new Date(),
      data: {
        ...slate.data,
        tags,
      },
    });

    if (slate.data.ownerId === id) {
      refreshSlates = true;
    }
    SearchManager.updateSlate(newSlate, "EDIT");
  }

  let tags;
  if (refreshSlates) {
    let slates = await Data.getSlatesByUserId({ userId: id });
    ViewerManager.hydratePartialSlates(slates, id);

    tags = Utilities.getUserTags({ library: user.data.library[0].children, slates });
  }

  return res.status(200).send({ decorator: "SERVER_DELETE_TAGS", success: true, tags });
};
