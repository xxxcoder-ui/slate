import * as Environment from "~/node_common/environment";

import { Client } from "@elastic/elasticsearch";

const searchClient = new Client({
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

const usersIndex = `${Environment.POSTGRES_DATABASE}_users`;

const slatesIndex = `${Environment.POSTGRES_DATABASE}_slates`;

const filesIndex = `${Environment.POSTGRES_DATABASE}_files`;

export { searchClient, usersIndex, slatesIndex, filesIndex };
