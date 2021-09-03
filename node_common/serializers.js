//NOTE(martina): when you add any new variable to the user, file, or slate objects, add it in these structures
//add it to sanitize___ if it should be sent to the front end
//add it to clean____ if it should be saved to the database

//NOTE(martina): these functions are to remove sensitive information before sending the data to the front end
//only variables listed here will be sent to the front end

export const sanitizeUser = (entity) => {
  return {
    id: entity.id,
    username: entity.username,
    slates: entity.slates, //NOTE(martina): this is not in the database. It is added after
    library: entity.library, //NOTE(martina): this is not in the database. It is added after
    name: entity.name,
    body: entity.body,
    photo: entity.photo,
    followerCount: entity.followerCount,
    slateCount: entity.slateCount,
  };
};

export const sanitizeSlate = (entity) => {
  return {
    id: entity.id,
    slatename: entity.slatename,
    name: entity.name,
    ownerId: entity.ownerId,
    isPublic: entity.isPublic,
    objects: entity.objects,
    owner: entity.owner,
    user: entity.user, //NOTE(martina): this is not in the database. It is added after
    body: entity.body,
    preview: entity.preview,
    fileCount: entity.fileCount,
    subscriberCount: entity.subscriberCount,
  };
};

export const sanitizeFile = (entity) => {
  return {
    id: entity.id,
    cid: entity.cid,
    ownerId: entity.ownerId,
    isPublic: entity.isPublic,
    filename: entity.filename,
    name: entity.name,
    createdAt: entity.createdAt,
    body: entity.body,
    size: entity.size,
    type: entity.type,
    blurhash: entity.blurhash,
    source: entity.source,
    author: entity.author,
    coverImage: entity.coverImage,
    linkName: entity.linkName,
    linkBody: entity.linkBody,
    linkSource: entity.linkSource,
    linkAuthor: entity.linkAuthor,
    linkDomain: entity.linkDomain,
    linkImage: entity.linkImage,
    linkFavicon: entity.linkFavicon,
    linkHtml: entity.linkHtml,
    linkIFrameAllowed: entity.linkIFrameAllowed,
    tags: entity.tags,
    data: {
      unity: entity.data?.unity, //NOTE(martina): newly added
    },
    downloadCount: entity.downloadCount,
    saveCount: entity.saveCount,
    isLink: entity.isLink,
    url: entity.url,
  };
};

//NOTE(martina): list of the properties of the tables that should be returned by db queries
export const slateProperties = [
  "slates.id",
  "slates.slatename",
  "slates.name",
  "slates.body",
  "slates.ownerId",
  "slates.isPublic",
  "slates.subscriberCount",
  "slates.fileCount",
];

export const userProperties = [
  "users.id",
  "users.username",
  "users.name",
  "users.body",
  "users.slateCount",
  "users.followerCount",
];

export const fileProperties = [
  "files.id",
  "files.ownerId",
  "files.cid",
  "files.isPublic",
  "files.filename",
  "files.name",
  "files.body",
  "files.data",
  "files.createdAt",
  "files.downloadCount",
  "files.saveCount",
  "files.isLink",
  "files.url",
];
