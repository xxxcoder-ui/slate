import * as Utilities from "~/node_common/utilities";
import * as Data from "~/node_common/data";
import * as LinkUtilities from "~/node_common/link-utilities";
import * as Strings from "~/common/strings";
import * as ViewerManager from "~/node_common/managers/viewer";
import * as ArrayUtilities from "~/node_common/array-utilities";
import * as Monitor from "~/node_common/monitor";
import * as RequestUtilities from "~/node_common/request-utilities";
import * as Conversions from "~/common/conversions";

import SearchManager from "~/node_common/managers/search";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationExternal(req, res);
  if (!userInfo) return;
  const { id, key, user } = userInfo;

  let decorator = "SERVER_CREATE_LINK";
  const slateId = req.body.data.slate?.id;
  let slate;
  if (slateId) {
    slate = await Data.getSlateById({ id: slateId, includeFiles: true });

    if (!slate || slate.error) {
      slate = null;
      decorator = "SLATE_NOT_FOUND";
    }
  }

  let urls;
  if (req.body?.data?.url) {
    urls = [req.body.data.url];
  } else if (req.body?.data?.urls) {
    urls = req.body.data.urls;
  } else {
    return res.status(400).send({ decorator: "NO_LINK_PROVIDED", error: true });
  }

  let files = [];
  for (let url of urls) {
    const cid = await LinkUtilities.getCIDofString(url);
    files.push({ cid, url });
  }

  let { duplicateFiles, filteredFiles } = await ArrayUtilities.removeDuplicateUserFiles({
    files,
    user,
  });

  if (!filteredFiles?.length) {
    return res.status(200).send({ decorator: "LINK_DUPLICATE", data: duplicateFiles });
  }

  files = [];

  for (let file of filteredFiles) {
    const url = file.url;
    const data = await LinkUtilities.fetchLinkData(url);
    if (!data) {
      continue;
    }

    const filename = Strings.createSlug(data.title);

    const domain = LinkUtilities.getDomainFromURL(url);

    const html = await LinkUtilities.fetchEmbed(url);

    const iFrameAllowed = await LinkUtilities.testIframe(url);

    const newFile = {
      filename,
      cid: file.cid,
      isLink: true,
      url: file.url,
      type: "link",
      name: data.title,
      body: data.description,
      linkName: data.title,
      linkBody: data.description,
      linkSource: data.publisher,
      linkAuthor: data.author,
      linkImage: data.image?.url,
      linkFavicon: data.logo?.url,
      linkDomain: domain,
      linkHtml: html,
      linkIFrameAllowed: iFrameAllowed,
    };

    files.push(newFile);
  }

  if (!files?.length) {
    return res.status(400).send({ decorator: "SERVER_CREATE_LINK_INVALID_LINK", error: true });
  }

  if (slate?.isPublic) {
    files = files.map((file) => {
      return { ...file, isPublic: true };
    });
  }

  let createdFiles = [];
  if (files?.length) {
    createdFiles = (await Data.createFile({ owner: user, files })) || [];

    if (!createdFiles?.length) {
      return res.status(404).send({ decorator: "SERVER_CREATE_LINK_FAILED", error: true });
    }

    if (createdFiles.error) {
      return res.status(500).send({ decorator: createdFiles.decorator, error: createdFiles.error });
    }
  }

  // for (let file of createdFiles) {
  //   LinkUtilities.uploadScreenshot(file, user);
  // }

  let filesToAddToSlate = createdFiles.concat(duplicateFiles); //NOTE(martina): files that are already owned by the user are included in case they aren't yet in that specific slate
  if (slate && filesToAddToSlate.length) {
    const { decorator: returnedDecorator, added: addedToSlate } = await Utilities.addToSlate({
      slate,
      files: filesToAddToSlate,
      user,
    });
    if (returnedDecorator) {
      decorator = returnedDecorator;
    }
  }

  SearchManager.indexFile(createdFiles);

  ViewerManager.hydratePartial(id, { library: true, slates: slate ? true : false });

  if (!slate) {
    Monitor.upload({ user, files });
  }

  return res.status(200).send({
    decorator,
    data: filesToAddToSlate,
  });
};
