import {
  searchClient,
  usersIndex,
  slatesIndex,
  filesIndex,
} from "~/node_common/managers/search/search-client";

export const createUserIndex = async () => {
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
    let result = await searchClient.indices.create({
      index: usersIndex,
      body: properties,
    });
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

export const createSlateIndex = async () => {
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
    let result = await searchClient.indices.create({
      index: slatesIndex,
      body: properties,
    });
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

export const createFileIndex = async () => {
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
    let result = await searchClient.indices.create({
      index: filesIndex,
      body: properties,
    });
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

export const deleteUserIndex = async () => {
  try {
    let result = await searchClient.indices.delete({ index: "users" });
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

export const deleteSlateIndex = async () => {
  try {
    let result = await searchClient.indices.delete({ index: "slates" });
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

export const deleteFileIndex = async () => {
  try {
    let result = await searchClient.indices.delete({ index: "files" });
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

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
//make it so it can find foggy.jpeg with just foggy. Either treat periods as spaces, or be able to search incomplete queries (wild card search). maybe using tokenizer?

//how to make this work with checking a value INSIDE the tags object? do we need to change the shape of the tags object?
//add auto suggest
//did boost work?
//sort search results by whether it's your result or another user's

//test out slates and files add and search
//make sure searching with spaces in a hyphenated slate name works
//make sure filtering by tag works for files
//test out delete
//detail all the filtering types and make convenience functions for them
