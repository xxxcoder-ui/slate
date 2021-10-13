import searchClient from "~/node_common/managers/search/search-client";

export const indexUser = async ({ id, username, name, body, photo, followerCount, slateCount }) => {
  try {
    const result = await searchClient.index({
      id,
      index: "users",
      body: { id, username, name, body, photo, followerCount, slateCount },
    });
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

export const indexSlate = async ({
  id,
  slatename,
  name,
  body,
  preview,
  ownerId,
  isPublic,
  subscriberCount,
  fileCount,
}) => {
  try {
    const result = await searchClient.index({
      id,
      index: "slates",
      body: { id, slatename, name, body, preview, ownerId, isPublic, subscriberCount, fileCount },
    });
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

export const indexFile = async ({
  id,
  cid,
  ownerId,
  filename,
  name,
  size,
  blurhash,
  coverImage,
  body,
  author,
  source,
  type,
  isPublic,
  downloadCount,
  saveCount,
  data,
  url,
  isLink,
  linkName,
  linkBody,
  linkAuthor,
  linkSource,
  linkDomain,
  linkImage,
  linkFavicon,
  linkHtml,
  linkIFrameAllowed,
  tags,
}) => {
  // const tagIds = tags.map((tag) => tag.id);
  try {
    const result = await searchClient.index({
      id,
      index: "files",
      body: {
        id,
        cid,
        ownerId,
        filename,
        name,
        size,
        blurhash,
        coverImage,
        body,
        author,
        source,
        type,
        isPublic,
        downloadCount,
        saveCount,
        data,
        url,
        isLink,
        linkName,
        linkBody,
        linkAuthor,
        linkSource,
        linkDomain,
        linkImage,
        linkFavicon,
        linkHtml,
        linkIFrameAllowed,
        tags,
        // tagIds,
      },
    });
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

export const deleteUser = async ({ id }) => {
  try {
    let result = await searchClient.delete({
      id,
      index: "users",
    });
  } catch (e) {
    console.log(e);
  }
};

export const deleteSlate = async ({ id }) => {
  try {
    let result = await searchClient.delete({
      id,
      index: "slates",
    });
  } catch (e) {
    console.log(e);
  }
};

export const deleteFile = async ({ id }) => {
  try {
    let result = await searchClient.delete({
      id,
      index: "files",
    });
  } catch (e) {
    console.log(e);
  }
};
