import { Client } from "@elastic/elasticsearch";

import * as Environment from "common/environment";

const client = new Client({
  cloud: {
    id: Environment.ELASTIC_SEARCH_ID,
  },
  auth: {
    apiKey: Environment.ELASTIC_SEARCH_API_KEY,
  },
});

export const searchInSlate = ({ query, slateId }) => {
    search({ query, filters: { }})
}

export const search = ({ query, filters }) => {
    const result = await client.search({ index: Environment.ELASTIC_SEARCH_INDEX, body: {
        query: {
            match: {
                hello: "world"
            }
        }
    }})
    const { body, statusCode, headers, warnings, meta } = result;
    console.log(result)
};