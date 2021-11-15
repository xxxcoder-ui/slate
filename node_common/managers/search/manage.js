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
        coverImage: {
          type: "object",
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
  // let props = {
  //   settings: {
  //     number_of_shards: 1,
  //     number_of_replicas: 0,
  //     index: {
  //       analysis: {
  //         char_filter: {
  //           my_pattern: {
  //             type: "pattern_replace",
  //             pattern: "a",
  //             replacement: "u",
  //           },
  //         },
  //         analyser: {
  //           my_analyser: {
  //             type: "custom",
  //             tokenizer: "whitespace",
  //             char_filter: ["my_pattern"],
  //           },
  //         },
  //       },
  //     },
  //   },
  //   mappings: {
  //     my_type: {
  //       _source: {
  //         enabled: true,
  //       },
  //     },
  //   },
  //   properties: {
  //     test: {
  //       type: "string",
  //       store: true,
  //       index: "analysed",
  //       analyser: "my_analyser",
  //       index_options: "positions",
  //     },
  //   },
  // };

  let properties = {
    settings: {
      analysis: {
        char_filter: {
          clean_punctuation_char_filter: {
            type: "pattern_replace",
            pattern: "[._-]+",
            replacement: " ",
          },
        },
        analyzer: {
          clean_punctuation_analyzer: {
            tokenizer: "whitespace",
            char_filter: ["clean_punctuation_char_filter"],
          },
        },
      },
    },
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
          analyzer: "clean_punctuation_analyzer",
        },
        name: {
          type: "text",
          analyzer: "clean_punctuation_analyzer",
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
    let result = await searchClient.indices.delete({ index: usersIndex });
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

export const deleteSlateIndex = async () => {
  try {
    let result = await searchClient.indices.delete({ index: slatesIndex });
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

export const deleteFileIndex = async () => {
  try {
    let result = await searchClient.indices.delete({ index: filesIndex });
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};
