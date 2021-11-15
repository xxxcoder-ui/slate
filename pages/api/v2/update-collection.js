import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as Strings from "~/common/strings";
import * as Validations from "~/common/validations";
import * as ViewerManager from "~/node_common/managers/viewer";
import * as RequestUtilities from "~/node_common/request-utilities";
import * as Conversions from "~/common/conversions";

import SearchManager from "~/node_common/managers/search";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationExternal(req, res);
  if (!userInfo) return;
  const { id, key, user } = userInfo;

  if (!req.body?.data?.id) {
    return res.status(500).send({
      decorator: "UPDATE_COLLECTION_MUST_PROVIDE_DATA",
      error: true,
    });
  }

  const slate = await Data.getSlateById({ id: req.body.data.id, includeFiles: true });

  if (!slate) {
    return res.status(404).send({ decorator: "COLLECTION_NOT_FOUND", error: true });
  }

  if (slate.error) {
    return res.status(500).send({ decorator: "COLLECTION_NOT_FOUND", error: true });
  }

  if (slate.ownerId !== user.id) {
    return res.status(400).send({
      decorator: "NOT_COLLECTION_OWNER_UPDATE_NOT_PERMITTED",
      error: true,
    });
  }

  //NOTE(martina): cleans the input to remove fields they should not be changing like ownerId, createdAt, etc.
  let updates = {
    id: req.body.data.id,
    updatedAt: new Date(),
    isPublic: req.body.data.isPublic,
    name: req.body.data.data?.name,
    body: req.body.data.data?.body,
  };

  if (typeof updates.isPublic !== "undefined" && slate.isPublic !== updates.isPublic) {
    let privacyResponse = await Data.updateSlatePrivacy({
      ownerId: user.id,
      id: updates.id,
      isPublic: updates.isPublic,
    });

    if (!privacyResponse) {
      return res.status(404).send({ decorator: "UPDATE_COLLECTION_PRIVACY_FAILED", error: true });
    }

    if (privacyResponse.error) {
      return res.status(500).send({ decorator: "UPDATE_COLLECTION_PRIVACY_FAILED", error: true });
    }
  }

  if (updates.name && updates.name !== slate.name) {
    if (!Validations.slatename(slate.name)) {
      return res.status(400).send({
        decorator: "INVALID_COLLECTION_NAME",
        error: true,
      });
    }

    const existingSlate = await Data.getSlateByName({
      slatename: updates.name,
      ownerId: user.id,
    });

    if (existingSlate) {
      return res.status(500).send({
        decorator: "COLLECTION_NAME_TAKEN",
        error: true,
      });
    } else {
      updates.slatename = Strings.createSlug(updates.name);
    }
  }

  let updatedSlate = await Data.updateSlateById(updates);

  if (!updatedSlate) {
    return res.status(404).send({ decorator: "UPDATE_COLLECTION_FAILED", error: true });
  }

  if (updatedSlate.error) {
    return res.status(500).send({ decorator: "UPDATE_COLLECTION_FAILED", error: true });
  }

  let updatedFiles;
  if (slate.isPublic && !updates.isPublic) {
    updatedFiles = await Utilities.removeFromPublicCollectionUpdatePrivacy({
      files: slate.objects,
    });
  } else if (!slate.isPublic && updates.isPublic) {
    updatedFiles = await Utilities.addToPublicCollectionUpdatePrivacy({ files: slate.objects });
  }

  if (updatedFiles.length) {
    SearchManager.updateFile(updatedFiles);
  }

  SearchManager.updateSlate(updatedSlate);

  ViewerManager.hydratePartial(user.id, { slates: true });

  let reformattedSlate = Conversions.convertToV2Slate(updatedSlate);

  return res.status(200).send({ decorator: "UPDATE_COLLECTION", collection: reformattedSlate });
};
