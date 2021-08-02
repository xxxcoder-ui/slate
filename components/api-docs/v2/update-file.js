import * as React from "react";
import * as System from "~/components/system";

import CodeBlock from "~/components/system/CodeBlock";

const EXAMPLE_CODE_JS = (key, slateId) => {
  return `const COLLECTION_ID = "${slateId}" 

const collectionResponseData = getCollectionById(COLLECTION_ID);

const collection = collectionResponseData.collection;
const file = collection.objects[0];
file.data.name = "New filename";

const response = await fetch('https://slate.host/api/v2/update-file', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: '${key}', // API key
  },
  body: JSON.stringify({ data: file })
});
const json = await response.json();`;
};

const EXAMPLE_CODE_PY = (key, slateId) =>
  `import requests

headers = {
    "content-type": "application/json",
    "Authorization": "${key}", # API key
}

json = { "id": "${slateId}" } # collection ID

get_collection = requests.post(
    "https://slate.host/api/v2/get-collection", headers=headers, json=json
)

get_collection_response = get_collection.json()

collection = get_collection_response["collection"]
file = collection["objects"][0];
file["data"]["name"] = "New filename"

postJson = { "data": file }

url = "https://slate.host/api/v2/update-file"

r = requests.post(url, headers=headers, json=postJson)`;

export default class APIDocsUpdateFile extends React.Component {
  render() {
    let language = this.props.language;
    let key = this.props.APIKey;
    let slateId = this.props.slateId;

    let code = {
      javascript: EXAMPLE_CODE_JS(key, slateId),
      python: EXAMPLE_CODE_PY(key, slateId),
    };
    return (
      <div css={this.props.cssValue} style={this.props.style}>
        <System.DescriptionGroup
          style={{ maxWidth: 640 }}
          label="Update file"
          description="This API endpoint allows you to modify a file by saving the collection object in the response from get-collection, modifying it, and sending it back"
        />
        <CodeBlock
          children={code}
          style={{ maxWidth: "820px" }}
          language={language}
          title="Update file"
          multiLang="true"
          onLanguageChange={this.props.onLanguageChange}
        />
      </div>
    );
  }
}
