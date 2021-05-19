import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as Validations from "~/common/validations";
import * as Serializers from "~/node_common/serializers";
import * as ViewerManager from "~/node_common/managers/viewer";
import * as SearchManager from "~/node_common/managers/search";
import * as Monitor from "~/node_common/monitor";

export default async (req, res) => {
  const id = Utilities.getIdFromCookie(req);
  if (!id) {
    return res.status(401).send({ decorator: "SERVER_NOT_AUTHENTICATED", error: true });
  }

  let user = await Data.getUserById({ id });

  if (!user) {
    return res.status(404).send({
      decorator: "SERVER_USER_NOT_FOUND",
      error: true,
    });
  }

  if (user.error) {
    return res.status(500).send({
      decorator: "SERVER_USER_NOT_FOUND",
      error: true,
    });
  }

  if (!req.body.data) {
    return res.status(500).send({
      decorator: "SERVER_UPDATE_SLATE_MUST_PROVIDE_DATA",
      error: true,
    });
  }

  let updates = req.body.data;

  const slate = await Data.getSlateById({ id: updates.id, includeFiles: true });

  if (!slate) {
    return res.status(404).send({ decorator: "SERVER_UPDATE_SLATE_NOT_FOUND", error: true });
  }

  if (slate.error) {
    return res.status(500).send({ decorator: "SERVER_UPDATE_SLATE_NOT_FOUND", error: true });
  }

  if (typeof updates.isPublic !== "undefined" && slate.isPublic !== updates.isPublic) {
    let privacyResponse = await Data.updateSlatePrivacy({
      id: slate.id,
      isPublic: updates.isPublic,
    });

    if (!privacyResponse) {
      return res
        .status(404)
        .send({ decorator: "SERVER_UPDATE_SLATE_UPDATE_PRIVACY_FAILED", error: true });
    }

    if (privacyResponse.error) {
      return res
        .status(500)
        .send({ decorator: "SERVER_UPDATE_SLATE_UPDATE_PRIVACY_FAILED", error: true });
    }

    if (!updates.isPublic) {
      //NOTE(martina): if any of the files in it are now private (because they are no longer in any public slates) remove them from search
      const files = slate.objects;

      const publicFiles = await Data.getFilesByIds({
        ids: files.map((file) => file.id),
        publicOnly: true,
      });
      const publicIds = publicFiles.map((file) => file.id);

      let privateFiles = files.filter((file) => !publicIds.includes(file.id));

      if (privateFiles.length) {
        SearchManager.updateFile(privateFiles, "REMOVE");
      }
    } else {
      //NOTE(martina): make sure all the now-public files are in search if they weren't already
      const files = slate.objects;

      SearchManager.updateFile(files, "ADD");
    }
  }

  if (updates.data.name && updates.data.name !== slate.data.name) {
    if (!Validations.slatename(slate.data.name)) {
      return res.status(400).send({
        decorator: "SERVER_UPDATE_SLATE_INVALID_NAME",
        error: true,
      });
    }

    const existingSlate = await Data.getSlateByName({
      slatename: updates.data.name,
      ownerId: user.id,
    });

    if (existingSlate) {
      return res.status(500).send({
        decorator: "SERVER_UPDATE_SLATE_NAME_TAKEN",
        error: true,
      });
    } else {
      updates.slatename = Strings.createSlug(updates.data.name);
    }
  }

  updates.updatedAt = new Date();

  let response = await Data.updateSlateById(updates);

  if (!response) {
    return res.status(404).send({ decorator: "SERVER_UPDATE_SLATE_FAILED", error: true });
  }

  if (response.error) {
    return res.status(500).send({ decorator: "SERVER_UPDATE_SLATE_FAILED", error: true });
  }

  ViewerManager.hydratePartial(id, { slates: true });

  if (slate.isPublic && !updates.isPublic) {
    SearchManager.updateSlate(response, "REMOVE");
  } else if (!slate.isPublic && updates.isPublic) {
    SearchManager.updateSlate(response, "ADD");
    Monitor.toggleSlatePublic({ owner: user, slate: response });
  } else {
    SearchManager.updateSlate(response, "EDIT");
  }

  return res.status(200).send({ decorator: "SERVER_UPDATE_SLATE", slate: response });
};
