import {
  searchClient,
  usersIndex,
  slatesIndex,
  filesIndex,
} from "~/node_common/managers/search/search-client";

import * as Logging from "~/common/logging";

//NOTE(martina): types specifies which object types to search through. Leaving it null or empty will search ALL object types
//               E.g. ["USER", "SLATE", "FILE"]
//NOTE(martina): grouped = true will separate results by object type rather than mixing them togther.
//               E.g. { users: [user1, user2, ...], slates: [slate1, slate2, ...], files: [file1, file2, ...]}
export const searchMultiple = async ({
  query,
  ownerId,
  userId,
  grouped = false,
  types,
  globalSearch = false,
}) => {
  let body = [];
  let keys = [];

  let ownerQuery;
  if (userId) {
    ownerQuery = {
      bool: {
        must: [{ term: { ownerId: userId } }, { term: { isPublic: true } }],
      },
    };
  } else {
    ownerQuery = {
      bool: {
        should: [],
      },
    };
    if (ownerId) {
      ownerQuery.bool.should.push({ term: { ownerId } });
    }
    if (globalSearch) {
      ownerQuery.bool.should.push({ term: { isPublic: true } });
    }
  }

  if (!types?.length || types.includes("USER")) {
    keys.push("users");

    const usersMust = {
      multi_match: {
        query,
        fuzziness: "AUTO",
        type: "best_fields",
        fields: ["username^2", "name^2", "body"],
        tie_breaker: 0.3,
      },
    };

    body.push({ index: usersIndex });
    body.push({
      query: {
        bool: {
          must: usersMust,
        },
      },
    });
  }

  if (!types?.length || types.includes("SLATE")) {
    keys.push("slates");

    const slatesMust = [
      {
        multi_match: {
          query,
          fuzziness: "AUTO",
          type: "best_fields",
          fields: ["slatename^2", "name", "body"],
          tie_breaker: 0.3,
        },
      },
      ownerQuery,
    ];

    body.push({ index: slatesIndex });
    body.push({
      query: {
        bool: {
          must: slatesMust,
        },
      },
    });
  }

  if (!types?.length || types.includes("FILE")) {
    keys.push("files");

    const filesMust = [
      {
        multi_match: {
          query,
          fuzziness: "AUTO",
          type: "best_fields",
          fields: [
            "filename^2",
            "name^2",
            "body",
            "linkName^2",
            "linkBody",
            "linkAuthor",
            "linkSource",
            "linkDomain",
          ],
          tie_breaker: 0.3,
        },
      },
      ownerQuery,
    ];

    body.push({ index: filesIndex });
    body.push({
      query: {
        bool: {
          must: filesMust,
        },
      },
    });
  }

  if (!body.length) return [];

  try {
    let result = await searchClient.msearch({
      body,
    });
    if (result.statusCode !== 200) return;
    let responses = result?.body?.responses;
    if (!responses) return;
    let returned = responses.map((res) => res.hits.hits);

    if (grouped) {
      let cleaned = {};
      for (let i = 0; i < returned.length; i++) {
        const group = returned[i];
        cleaned[keys[i]] = group.map((result) => result._source);
      }
      return cleaned;
    } else {
      let cleaned = [];
      for (let group of returned) {
        cleaned.push(...group);
      }
      cleaned.sort((a, b) => b._score - a._score).map((result) => result._source);
      return cleaned;
    }
  } catch (e) {
    Logging.error(e);
  }
};

export const searchUser = async ({ query }) => {
  try {
    const must = [
      {
        multi_match: {
          query,
          fuzziness: "AUTO",
          type: "best_fields",
          fields: ["username^2", "name^2", "body"],
          tie_breaker: 0.3,
        },
      },
    ];

    const result = await searchClient.search({
      index: usersIndex,
      body: {
        query: {
          bool: {
            must,
          },
        },
      },
    });

    if (result.statusCode !== 200) return;
    const hits = result?.body?.hits?.hits;

    let users = hits.map((hit) => hit._source);
    return users;
  } catch (e) {
    console.log(e);
  }
};

export const searchSlate = async ({ query, ownerId, userId, globalSearch = false }) => {
  try {
    const must = [
      {
        multi_match: {
          query,
          fuzziness: "AUTO",
          type: "best_fields",
          fields: ["slatename^2", "name", "body"],
          tie_breaker: 0.3,
        },
      },
    ];

    let ownerQuery;
    if (userId) {
      ownerQuery = {
        bool: {
          must: [{ term: { ownerId: userId } }, { term: { isPublic: true } }],
        },
      };
    } else {
      ownerQuery = {
        bool: {
          should: [],
        },
      };
      if (ownerId) {
        ownerQuery.bool.should.push({ term: { ownerId } });
      }
      if (globalSearch) {
        ownerQuery.bool.should.push({ term: { isPublic: true } });
      }
    }
    must.push(ownerQuery);

    const result = await searchClient.search({
      index: slatesIndex,
      body: {
        query: {
          bool: {
            must,
          },
        },
      },
    });

    if (result.statusCode !== 200) return;
    const hits = result?.body?.hits?.hits;

    let slates = hits.map((hit) => hit._source);
    return slates;
  } catch (e) {
    console.log(e);
  }
};

export const searchFile = async ({ query, ownerId, userId, globalSearch = false, tagIds = [] }) => {
  try {
    const must = [
      {
        multi_match: {
          query,
          fuzziness: "AUTO",
          type: "best_fields",
          fields: [
            "filename^2",
            "name^2",
            "body",
            "linkName^2",
            "linkBody",
            "linkAuthor",
            "linkSource",
            "linkDomain",
          ],
          tie_breaker: 0.3,
        },
      },
    ];

    if (tagIds.length) {
      let should = tagIds.map((tagId) => {
        return { term: { "tags.id": tagId } };
      });
      let tagQuery = {
        bool: {
          should,
        },
      };
      must.push(tagQuery);
    }

    let ownerQuery;
    if (userId) {
      ownerQuery = {
        bool: {
          must: [{ term: { ownerId: userId } }, { term: { isPublic: true } }],
        },
      };
    } else {
      ownerQuery = {
        bool: {
          should: [],
        },
      };
      if (ownerId) {
        ownerQuery.bool.should.push({ term: { ownerId } });
      }
      if (globalSearch) {
        ownerQuery.bool.should.push({ term: { isPublic: true } });
      }
    }
    must.push(ownerQuery);

    const result = await searchClient.search({
      index: filesIndex,
      body: {
        query: {
          bool: {
            must,
          },
        },
      },
    });

    if (result.statusCode !== 200) return;
    const hits = result?.body?.hits?.hits;

    let files = hits.map((hit) => hit._source);
    return files;
  } catch (e) {
    console.log(e);
  }
};

export const getUser = async ({ id }) => {
  const { body } = await searchClient.get({ index: usersIndex, id });
  return body;
};

export const getSlate = async ({ id }) => {
  const { body } = await searchClient.get({ index: slatesIndex, id });
  return body;
};

export const getFile = async ({ id }) => {
  const { body } = await searchClient.get({ index: filesIndex, id });
  return body;
};
