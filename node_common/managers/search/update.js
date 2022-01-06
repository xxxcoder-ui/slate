import * as Logging from "~/common/logging";

import {
  searchClient,
  usersIndex,
  slatesIndex,
  filesIndex,
} from "~/node_common/managers/search/search-client";

const cleanUser = ({ id, username, name, body, photo, followerCount, slateCount }) => {
  return {
    id,
    username,
    name,
    body,
    photo,
    followerCount,
    slateCount,
  };
};

const cleanSlate = ({
  id,
  slatename,
  name,
  body,
  coverImage,
  ownerId,
  isPublic,
  subscriberCount,
  fileCount,
}) => {
  return {
    id,
    slatename,
    name,
    body,
    coverImage,
    ownerId,
    isPublic,
    subscriberCount,
    fileCount,
  };
};

const cleanFile = ({
  id,
  cid,
  ownerId,
  filename,
  name,
  size,
  blurhash,
  coverImage,
  body,
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
  return {
    id,
    cid,
    ownerId,
    filename,
    name,
    size,
    blurhash,
    coverImage,
    body,
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
  };
};

const indexObject = async (objects, cleanObject, index) => {
  try {
    if (Array.isArray(objects)) {
      let body = [];
      for (let object of objects) {
        body.push({ index: { _index: index, _id: object.id } });
        body.push(cleanObject(object));
      }
      const result = await searchClient.bulk({
        body,
      });
    } else {
      let object = objects;
      const result = await searchClient.index({
        id: object.id,
        index: index,
        body: cleanObject(object),
      });
    }
  } catch (e) {
    Logging.error(e);
  }
};

export const indexUser = async (users) => {
  indexObject(users, cleanUser, usersIndex);
};

export const indexSlate = async (slates) => {
  indexObject(slates, cleanSlate, slatesIndex);
};

export const indexFile = async (files) => {
  indexObject(files, cleanFile, filesIndex);
};

const updateObject = async (objects, cleanObject, index) => {
  try {
    if (Array.isArray(objects)) {
      let body = [];
      for (let object of objects) {
        body.push({ update: { _index: index, _id: object.id } });
        body.push({ doc: cleanObject(object) });
      }
      const result = await searchClient.bulk({
        body,
      });
    } else {
      let object = objects;
      const result = await searchClient.update({
        id: object.id,
        index,
        body: {
          doc: cleanObject(object),
        },
      });
    }
  } catch (e) {
    Logging.error(e);
  }
};

export const updateUser = async (users) => {
  updateObject(users, cleanUser, usersIndex);
};

export const updateSlate = async (slates) => {
  updateObject(slates, cleanSlate, slatesIndex);
};

export const updateFile = async (files) => {
  updateObject(files, cleanFile, filesIndex);
};

const deleteObject = async (objects, index) => {
  try {
    if (Array.isArray(objects)) {
      let body = [];
      for (let object of objects) {
        body.push({ delete: { _index: index, _id: object.id } });
      }
      const result = await searchClient.bulk({
        body,
      });
    } else {
      let object = objects;
      let result = await searchClient.delete({
        id: object.id,
        index,
      });
    }
  } catch (e) {
    Logging.error(e);
  }
};

export const deleteUser = async (users) => {
  deleteObject(users, usersIndex);
};

export const deleteSlate = async (slates) => {
  deleteObject(slates, slatesIndex);
};

export const deleteFile = async (files) => {
  deleteObject(files, filesIndex);
};
