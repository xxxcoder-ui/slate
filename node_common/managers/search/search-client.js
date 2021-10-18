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

export default {
  searchClient,
  usersIndex: `${Environment.POSTGRES_DATABASE}_users`,
  slatesIndex: `${Environment.POSTGRES_DATABASE}_slates`,
  filesIndex: `${Environment.POSTGRES_DATABASE}_files`,
};
