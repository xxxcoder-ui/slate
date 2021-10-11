import * as Environment from "~/node_common/environment";

import { Client } from "@elastic/elasticsearch";

const client = new Client({
  cloud: {
    id: Environment.ELASTIC_SEARCH_CLOUD_ID,
  },
  auth: {
    apiKey: {
      id: Environment.ELASTIC_SEARCH_API_KEY_ID,
      api_key: Environment.ELASTIC_SEARCH_API_KEY,
    },
  },
});

const createUserIndex = async () => {
  let properties = {
    mappings: {
      properties: {
        id: {
          type: "keyword",
          index: false,
        },
        username: {
          type: "text",
        },
        name: {
          type: "text",
        },
        body: {
          type: "text",
        },
        followerCount: {
          type: "integer",
          index: false,
        },
        slateCount: {
          type: "integer",
          index: false,
        },
        photo: {
          type: "keyword",
          index: false,
        },
      },
    },
  };
  try {
    let result = await client.indices.create({
      index: "users",
      body: properties,
    });
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

const createSlateIndex = async () => {
  let properties = {
    mappings: {
      properties: {
        id: {
          type: "keyword",
          index: false,
        },
        slatename: {
          type: "text",
        },
        name: {
          type: "text",
        },
        body: {
          type: "text",
        },
        preview: {
          type: "keyword",
          index: false,
        },
        ownerId: {
          type: "keyword",
        },
        isPublic: {
          type: "boolean",
        },
        subscriberCount: {
          type: "integer",
          index: false,
        },
        fileCount: {
          type: "integer",
          index: false,
        },
      },
    },
  };
  try {
    let result = await client.indices.create({
      index: "slates",
      body: properties,
    });
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

const createFileIndex = async () => {
  let properties = {
    mappings: {
      properties: {
        id: {
          type: "keyword",
          index: false,
        },
        cid: {
          type: "keyword",
          index: false,
        },
        ownerId: {
          type: "keyword",
        },
        filename: {
          type: "text",
          index: false,
        },
        name: {
          type: "text",
        },
        size: {
          type: "integer",
          index: false,
        },
        blurhash: {
          type: "keyword",
          index: false,
        },
        coverImage: {
          type: "object",
          enabled: false,
        },
        body: {
          type: "text",
        },
        author: {
          type: "text",
        },
        source: {
          type: "text",
        },
        type: {
          type: "keyword",
          index: false,
        },
        isPublic: {
          type: "boolean",
        },
        downloadCount: {
          type: "integer",
          index: false,
        },
        saveCount: {
          type: "integer",
          index: false,
        },
        data: {
          type: "object",
          enabled: false,
        },
        url: {
          type: "keyword",
          index: false,
        },
        isLink: {
          type: "boolean",
        },
        linkName: {
          type: "text",
        },
        linkBody: {
          type: "text",
        },
        linkAuthor: {
          type: "text",
        },
        linkSource: {
          type: "text",
        },
        linkDomain: {
          type: "text",
        },
        linkImage: {
          type: "keyword",
          index: false,
        },
        linkFavicon: {
          type: "keyword",
          index: false,
        },
        linkHtml: {
          type: "text",
          index: false,
        },
        linkIFrameAllowed: {
          type: "boolean",
          index: false,
        },
        tags: {
          type: "object",
          properties: {
            id: { type: "keyword" },
            slatename: { type: "text" },
            name: { type: "text" },
          },
        },
        // tagIds: {
        //   type: "keyword",
        // },
        // fileCategory: {
        //   type: "keyword",
        // },
      },
    },
  };
  try {
    let result = await client.indices.create({
      index: "files",
      body: properties,
    });
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

const deleteIndex = async (index) => {
  try {
    let result = await client.indices.delete({ index });
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

const indexUser = async ({ id, username, name, body, photo, followerCount, slateCount }) => {
  try {
    const result = await client.index({
      id,
      index: "users",
      body: { id, username, name, body, photo, followerCount, slateCount },
    });
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

const indexSlate = async ({
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
    const result = await client.index({
      id,
      index: "slates",
      body: { id, slatename, name, body, preview, ownerId, isPublic, subscriberCount, fileCount },
    });
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

const indexFile = async ({
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
    const result = await client.index({
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

const deleteUser = async ({ id }) => {
  try {
    let result = await client.delete({
      id,
      index: "users",
    });
  } catch (e) {
    console.log(e);
  }
};

const deleteSlate = async ({ id }) => {
  try {
    let result = await client.delete({
      id,
      index: "slates",
    });
  } catch (e) {
    console.log(e);
  }
};

const deleteFile = async ({ id }) => {
  try {
    let result = await client.delete({
      id,
      index: "files",
    });
  } catch (e) {
    console.log(e);
  }
};

export const searchAll = async ({ query }) => {
  await client.msearch({
    index: ["users", "slates", "files"],
    body: {},
  });
};

export const searchUser = async ({ query, filter }) => {
  try {
    const result = await client.search({
      index: "users",
      body: {
        query: {
          bool: {
            must: {
              multi_match: {
                query,
                fuzziness: "AUTO",
                type: "best_fields",
                fields: ["username", "name", "body"],
                tie_breaker: 0.3,
              },
            },
            filter,
          },
        },
      },
    });
    console.log(result);

    if (result.statusCode === 200) {
      console.log(result?.body?.hits?.hits);
      const hits = result?.body?.hits?.hits;
      return hits.map((hit) => hit._source);
    }
  } catch (e) {
    console.log(e);
  }
};

//filter by: ownerId, isPublic
//ownerId: when you are limiting your scope to just your files, ownerId should be your Id
//isPublic: when searching globally, isPublic should be set to true for things that are not your ownerId
export const searchSlate = async ({ query, filter }) => {
  try {
    const result = await client.search({
      index: "slates",
      body: {
        query: {
          bool: {
            must: {
              multi_match: {
                query,
                fuzziness: "AUTO",
                type: "best_fields",
                fields: ["slatename", "name", "body"],
                tie_breaker: 0.3,
              },
            },
            // filter: [{ term: { ownerId: "xxx", isPublic: true } }],
          },
        },
      },
    });
    console.log(result);

    if (result.statusCode === 200) {
      console.log(result?.body?.hits?.hits);
      const hits = result?.body?.hits?.hits;
      return hits.map((hit) => hit._source);
    }
  } catch (e) {
    console.log(e);
  }
};

//filter by: ownerId, isPublic, isLink, tags
//ownerId: when you are limiting your scope to just your files, ownerId should be your Id
//isPublic: when searching globally, isPublic should be set to true for things that are not your ownerId
//isLink: when searching only links or only files, set isLink accordingly
//tags: when searching within a certain slate, set tags accordingly (figure out how to do AND and OR for this type of filtering)
export const searchFile = async ({ query, filter }) => {
  // {
  //   "query": {
  //     "bool": {
  //       "must": [
  //         { "match": { "tags.id": "tag-id-here" }},
  //         { "match": { "tags.id":  "Smith" }}
  //       ]
  //     }
  //   }
  // }
  try {
    const result = await client.search({
      index: "files",
      body: {
        query: {
          bool: {
            must: {
              multi_match: {
                query,
                fuzziness: "AUTO",
                type: "best_fields",
                fields: [
                  "name",
                  "body",
                  "author",
                  "source",
                  "linkName",
                  "linkBody",
                  "linkAuthor",
                  "linkSource",
                  "linkDomain",
                ],
                tie_breaker: 0.3,
              },
            },
            // filter: [{ term: { "tags.name": "drinks" } }],
            // filter: [{ term: { "tags.slatename": "martuna" } }],
            filter: [{ term: { "tags.id": "0824a3cb-e839-4246-8ff4-d919919e1487" } }], //'0824a3cb-e839-4246-8ff4-d919919e1487'
          },
        },
      },
    });
    console.log(result);

    if (result.statusCode === 200) {
      const hits = result?.body?.hits?.hits;
      console.log(hits);

      let files = hits.map((hit) => hit._source);
      console.log(files);
      let tags = files.map((file) => file.tags);
      console.log(tags);
      return files;
    }
  } catch (e) {
    console.log(e);
  }
};

export const search;

async function run() {
  // deleteIndex("files");
  //
  // createUserIndex();
  // indexUser({
  //   id: "5172dd8b-6b11-40d3-8c9f-b4cbaa0eb8e7",
  //   username: "martina",
  //   name: "Martina Long",
  //   body:
  //     "My name is Martina. Working at @slate aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  //   photo:
  //     "https://slate.textile.io/ipfs/bafybeid7ykqgrsgmqsknpmxs25k6zbt4n5yoq72auboyyhgbmaf647wbku",
  //   followerCount: 2,
  //   slateCount: 41,
  // });
  // searchUser({ query: "martina" });
  //
  // createSlateIndex();
  // indexSlate({
  //   id: "0824a3cb-e839-4246-8ff4-d919919e1487",
  //   slatename: "bird-drinks",
  //   ownerId: "5172dd8b-6b11-40d3-8c9f-b4cbaa0eb8e7",
  //   isPublic: true,
  //   subscriberCount: 1,
  //   fileCount: 14,
  //   body: "drinks in cool bird cups",
  //   name: "bird drinks",
  //   preview: null,
  // });
  // searchSlate({ query: "bird" });
  //
  // createFileIndex();
  // indexFile({
  //   id: "10071abd-95c5-415e-8a12-aa17e7f560cf",
  //   ownerId: "f9cc7b00-ce59-4b49-abd1-c7ef7253e258",
  //   cid: "bafybeihr3eepugleul7tyw7niwpralwrnfhpxlnafies7cuufhssnkvsqe",
  //   isPublic: true,
  //   filename: "foggy.jpeg",
  //   downloadCount: 0,
  //   saveCount: 0,
  //   url: null,
  //   isLink: false,
  //   name: "foggy.jpeg",
  //   size: 485757,
  //   type: "image/jpeg",
  //   blurhash: "UJD,Gx~WIpWVIpR.R+RjSjNHITWBR,oes:s:",
  //   tags: [
  //     { id: "d82fbc78-88de-4015-adec-a7ea832fc922", name: "martuna", slatename: "martuna" },
  //     { id: "0824a3cb-e839-4246-8ff4-d919919e1487", name: "bird drinks", slatename: "bird-drinks" },
  //   ],
  // });
  searchFile({ query: "foggy.jpeg" });
}

run();

//make it synonym search
//make searchall work across the different types
//pagination

//use index = _all or empty string to perform the operation on all indices
//specify from and size to paginate (from = 0, size = 10 by default)

//make sure that for the non index fields, you aren't able to search by them
//make sure that for slatename type hyphenated things, you're able to search for them as titles with sapces. treat hyphens like spaces

//should we do filetype filtering and isLink / isNotLink on the front end? If so we don't have to index them here on the backend

//if you index again and leave something out, it'll then remove that. it basically overwrites the existing one
//what about update? does that ignore things that are left out? what if you try to update something that doesn't exist?

//         { "range": { "publish_date": { "gte": "2015-01-01", "lte": ... }}}
//make it so it can find foggy.jpeg with just foggy. Either treat periods as spaces, or be able to search incomplete queries (wild card search)

//how to make this work with checking a value INSIDE the tags object? do we need to change the shape of the tags object?
//add auto suggest
//how to do boost?
//sort search results by whether it's your result or another user's

//test out slates and files add and search
//make sure searching with spaces in a hyphenated slate name works
//make sure filtering by tag works for files
//test out delete
//detail all the filtering types and make convenience functions for them
